const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const eventSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(2000).required(),
    event_date: Joi.date().iso().required(),
    event_time: Joi.string().min(1).max(100).required(),
    location: Joi.string().min(1).max(255).required(),
    event_type: Joi.string().valid('Workshop', 'Bootcamp', 'Seminar', 'Competition', 'Hackathon').required(),
    status: Joi.string().valid('upcoming', 'completed', 'cancelled').default('upcoming'),
    max_participants: Joi.number().integer().min(1).optional(),
    registration_link: Joi.string().uri().optional()
});

const updateEventSchema = Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().min(1).max(2000).optional(),
    event_date: Joi.date().iso().optional(),
    event_time: Joi.string().min(1).max(100).optional(),
    location: Joi.string().min(1).max(255).optional(),
    event_type: Joi.string().valid('Workshop', 'Bootcamp', 'Seminar', 'Competition', 'Hackathon').optional(),
    status: Joi.string().valid('upcoming', 'completed', 'cancelled').optional(),
    max_participants: Joi.number().integer().min(1).allow(null).optional(),
    registration_link: Joi.string().uri().allow('').optional()
});

// Get all events
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            status = '', 
            event_type = '',
            start_date = '',
            end_date = ''
        } = req.query;
        
        const offset = (page - 1) * limit;

        let query = `
            SELECT e.*, u.username as created_by_username,
                   COUNT(es.speaker_id) as speaker_count
            FROM events e 
            LEFT JOIN admin_users u ON e.created_by = u.id
            LEFT JOIN event_speakers es ON e.id = es.event_id
        `;
        let params = [];
        let conditions = [];

        // Add search conditions
        if (search) {
            conditions.push('(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (status) {
            conditions.push('e.status = ?');
            params.push(status);
        }

        if (event_type) {
            conditions.push('e.event_type = ?');
            params.push(event_type);
        }

        if (start_date) {
            conditions.push('e.event_date >= ?');
            params.push(start_date);
        }

        if (end_date) {
            conditions.push('e.event_date <= ?');
            params.push(end_date);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` GROUP BY e.id ORDER BY e.event_date ASC, e.created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const events = await db.all(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM events e';
        let countParams = [];

        if (conditions.length > 0) {
            countQuery += ' WHERE ' + conditions.join(' AND ');
            countParams = params.slice(0, -2); // Remove limit and offset
        }

        const { total } = await db.get(countQuery, countParams);

        res.json({
            success: true,
            data: events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            error: 'Failed to fetch events'
        });
    }
});

// Get single event with speakers
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const event = await db.get(`
            SELECT e.*, u.username as created_by_username 
            FROM events e 
            LEFT JOIN admin_users u ON e.created_by = u.id 
            WHERE e.id = ?
        `, [id]);

        if (!event) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        // Get event speakers
        const speakers = await db.all(`
            SELECT gs.*, es.role as speaker_role
            FROM event_speakers es
            JOIN guest_speakers gs ON es.speaker_id = gs.id
            WHERE es.event_id = ?
            ORDER BY es.role, gs.name
        `, [id]);

        event.speakers = speakers;

        res.json({
            success: true,
            data: event
        });

    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            error: 'Failed to fetch event'
        });
    }
});

// Create new event
router.post('/', authenticateToken, logActivity('CREATE', 'events'), async (req, res) => {
    try {
        // Validate input
        const { error, value } = eventSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        const { 
            title, description, event_date, event_time, location, 
            event_type, status, max_participants, registration_link 
        } = value;

        const result = await db.run(`
            INSERT INTO events (
                title, description, event_date, event_time, location, 
                event_type, status, max_participants, registration_link, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title, description, event_date, event_time, location, 
            event_type, status || 'upcoming', max_participants || null, 
            registration_link || null, req.user.id
        ]);

        // Get the created event
        const event = await db.get(`
            SELECT e.*, u.username as created_by_username 
            FROM events e 
            LEFT JOIN admin_users u ON e.created_by = u.id 
            WHERE e.id = ?
        `, [result.id]);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });

    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            error: 'Failed to create event'
        });
    }
});

// Update event
router.put('/:id', authenticateToken, logActivity('UPDATE', 'events'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists
        const existingEvent = await db.get('SELECT * FROM events WHERE id = ?', [id]);
        if (!existingEvent) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        // Validate input
        const { error, value } = updateEventSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        // Build update query dynamically
        const updates = [];
        const params = [];

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updates.push(`${key} = ?`);
                params.push(value[key]);
            }
        });

        if (updates.length === 0) {
            return res.status(400).json({
                error: 'No valid fields to update'
            });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        await db.run(`
            UPDATE events 
            SET ${updates.join(', ')} 
            WHERE id = ?
        `, params);

        // Get updated event
        const event = await db.get(`
            SELECT e.*, u.username as created_by_username 
            FROM events e 
            LEFT JOIN admin_users u ON e.created_by = u.id 
            WHERE e.id = ?
        `, [id]);

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });

    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            error: 'Failed to update event'
        });
    }
});

// Delete event
router.delete('/:id', authenticateToken, logActivity('DELETE', 'events'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists
        const existingEvent = await db.get('SELECT * FROM events WHERE id = ?', [id]);
        if (!existingEvent) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        // Delete event (cascade will handle event_speakers)
        await db.run('DELETE FROM events WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            error: 'Failed to delete event'
        });
    }
});

// Add speaker to event
router.post('/:id/speakers', authenticateToken, logActivity('CREATE', 'event_speakers'), async (req, res) => {
    try {
        const { id } = req.params;
        const { speaker_id, role = 'speaker' } = req.body;

        // Validate inputs
        if (!speaker_id) {
            return res.status(400).json({
                error: 'Speaker ID is required'
            });
        }

        // Check if event exists
        const event = await db.get('SELECT id FROM events WHERE id = ?', [id]);
        if (!event) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        // Check if speaker exists
        const speaker = await db.get('SELECT id FROM guest_speakers WHERE id = ?', [speaker_id]);
        if (!speaker) {
            return res.status(404).json({
                error: 'Speaker not found'
            });
        }

        // Check if speaker is already assigned to this event
        const existing = await db.get(
            'SELECT id FROM event_speakers WHERE event_id = ? AND speaker_id = ?',
            [id, speaker_id]
        );

        if (existing) {
            return res.status(409).json({
                error: 'Speaker is already assigned to this event'
            });
        }

        // Add speaker to event
        await db.run(
            'INSERT INTO event_speakers (event_id, speaker_id, role) VALUES (?, ?, ?)',
            [id, speaker_id, role]
        );

        res.status(201).json({
            success: true,
            message: 'Speaker added to event successfully'
        });

    } catch (error) {
        console.error('Add speaker to event error:', error);
        res.status(500).json({
            error: 'Failed to add speaker to event'
        });
    }
});

// Remove speaker from event
router.delete('/:id/speakers/:speaker_id', authenticateToken, logActivity('DELETE', 'event_speakers'), async (req, res) => {
    try {
        const { id, speaker_id } = req.params;

        const result = await db.run(
            'DELETE FROM event_speakers WHERE event_id = ? AND speaker_id = ?',
            [id, speaker_id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Speaker assignment not found'
            });
        }

        res.json({
            success: true,
            message: 'Speaker removed from event successfully'
        });

    } catch (error) {
        console.error('Remove speaker from event error:', error);
        res.status(500).json({
            error: 'Failed to remove speaker from event'
        });
    }
});

module.exports = router;