const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const speakerSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    title: Joi.string().min(1).max(255).required(),
    company: Joi.string().min(1).max(255).required(),
    bio: Joi.string().max(2000).allow('').optional(),
    image_url: Joi.string().uri().allow('').optional(),
    email: Joi.string().email().allow('').optional(),
    phone: Joi.string().max(20).allow('').optional(),
    linkedin_url: Joi.string().uri().allow('').optional(),
    twitter_url: Joi.string().uri().allow('').optional(),
    website_url: Joi.string().uri().allow('').optional(),
    speaking_topics: Joi.array().items(Joi.string().min(1).max(200)).optional(),
    expertise: Joi.array().items(Joi.object({
        area: Joi.string().min(1).max(100).required(),
        years_experience: Joi.number().integer().min(0).max(50).default(0)
    })).optional()
});

const updateSpeakerSchema = Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    title: Joi.string().min(1).max(255).optional(),
    company: Joi.string().min(1).max(255).optional(),
    bio: Joi.string().max(2000).allow('').optional(),
    image_url: Joi.string().uri().allow('').optional(),
    email: Joi.string().email().allow('').optional(),
    phone: Joi.string().max(20).allow('').optional(),
    linkedin_url: Joi.string().uri().allow('').optional(),
    twitter_url: Joi.string().uri().allow('').optional(),
    website_url: Joi.string().uri().allow('').optional(),
    speaking_topics: Joi.array().items(Joi.string().min(1).max(200)).optional(),
    is_available: Joi.boolean().optional(),
    expertise: Joi.array().items(Joi.object({
        area: Joi.string().min(1).max(100).required(),
        years_experience: Joi.number().integer().min(0).max(50).default(0)
    })).optional()
});

// Get all speakers
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            search = '', 
            is_available = 'true',
            expertise_area = ''
        } = req.query;
        
        const offset = (page - 1) * limit;

        let query = `
            SELECT gs.*, u.username as created_by_username,
                   GROUP_CONCAT(DISTINCT se.expertise_area) as expertise_areas,
                   COUNT(DISTINCT es.event_id) as events_count
            FROM guest_speakers gs 
            LEFT JOIN admin_users u ON gs.created_by = u.id
            LEFT JOIN speaker_expertise se ON gs.id = se.speaker_id
            LEFT JOIN event_speakers es ON gs.id = es.speaker_id
        `;
        let params = [];
        let conditions = [];

        // Add search conditions
        if (search) {
            conditions.push('(gs.name LIKE ? OR gs.title LIKE ? OR gs.company LIKE ? OR gs.bio LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (is_available !== 'all') {
            conditions.push('gs.is_available = ?');
            params.push(is_available === 'true' ? 1 : 0);
        }

        if (expertise_area) {
            conditions.push('se.expertise_area LIKE ?');
            params.push(`%${expertise_area}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` GROUP BY gs.id ORDER BY gs.name ASC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const speakers = await db.all(query, params);

        // Process data for each speaker
        for (const speaker of speakers) {
            speaker.expertise_areas = speaker.expertise_areas ? speaker.expertise_areas.split(',') : [];
            speaker.speaking_topics = speaker.speaking_topics ? JSON.parse(speaker.speaking_topics) : [];
        }

        // Get total count
        let countQuery = 'SELECT COUNT(DISTINCT gs.id) as total FROM guest_speakers gs';
        let countParams = [];

        if (expertise_area) {
            countQuery += ' LEFT JOIN speaker_expertise se ON gs.id = se.speaker_id';
        }

        if (conditions.length > 0) {
            countQuery += ' WHERE ' + conditions.join(' AND ');
            countParams = params.slice(0, -2); // Remove limit and offset
        }

        const { total } = await db.get(countQuery, countParams);

        res.json({
            success: true,
            data: speakers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get speakers error:', error);
        res.status(500).json({
            error: 'Failed to fetch speakers'
        });
    }
});

// Get single speaker
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const speaker = await db.get(`
            SELECT gs.*, u.username as created_by_username 
            FROM guest_speakers gs 
            LEFT JOIN admin_users u ON gs.created_by = u.id 
            WHERE gs.id = ?
        `, [id]);

        if (!speaker) {
            return res.status(404).json({
                error: 'Speaker not found'
            });
        }

        // Get speaker expertise
        const expertise = await db.all(
            'SELECT expertise_area, years_experience FROM speaker_expertise WHERE speaker_id = ?',
            [id]
        );

        // Get speaker events
        const events = await db.all(`
            SELECT e.id, e.title, e.event_date, e.status, es.role
            FROM event_speakers es
            JOIN events e ON es.event_id = e.id
            WHERE es.speaker_id = ?
            ORDER BY e.event_date DESC
        `, [id]);

        speaker.expertise = expertise;
        speaker.events = events;
        speaker.speaking_topics = speaker.speaking_topics ? JSON.parse(speaker.speaking_topics) : [];

        res.json({
            success: true,
            data: speaker
        });

    } catch (error) {
        console.error('Get speaker error:', error);
        res.status(500).json({
            error: 'Failed to fetch speaker'
        });
    }
});

// Create new speaker
router.post('/', authenticateToken, logActivity('CREATE', 'guest_speakers'), async (req, res) => {
    try {
        // Validate input
        const { error, value } = speakerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        const { expertise, speaking_topics, ...speakerData } = value;

        await db.beginTransaction();

        try {
            // Insert speaker
            const result = await db.run(`
                INSERT INTO guest_speakers (
                    name, title, company, bio, image_url, email, phone,
                    linkedin_url, twitter_url, website_url, speaking_topics, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                speakerData.name, speakerData.title, speakerData.company,
                speakerData.bio || null, speakerData.image_url || null,
                speakerData.email || null, speakerData.phone || null,
                speakerData.linkedin_url || null, speakerData.twitter_url || null,
                speakerData.website_url || null, 
                speaking_topics ? JSON.stringify(speaking_topics) : null,
                req.user.id
            ]);

            const speakerId = result.id;

            // Insert expertise if provided
            if (expertise && expertise.length > 0) {
                for (const exp of expertise) {
                    await db.run(
                        'INSERT INTO speaker_expertise (speaker_id, expertise_area, years_experience) VALUES (?, ?, ?)',
                        [speakerId, exp.area, exp.years_experience || 0]
                    );
                }
            }

            await db.commit();

            // Get the created speaker with expertise
            const speaker = await db.get(`
                SELECT gs.*, u.username as created_by_username,
                       GROUP_CONCAT(se.expertise_area) as expertise_areas
                FROM guest_speakers gs 
                LEFT JOIN admin_users u ON gs.created_by = u.id
                LEFT JOIN speaker_expertise se ON gs.id = se.speaker_id
                WHERE gs.id = ?
                GROUP BY gs.id
            `, [speakerId]);

            speaker.expertise_areas = speaker.expertise_areas ? speaker.expertise_areas.split(',') : [];
            speaker.speaking_topics = speaker.speaking_topics ? JSON.parse(speaker.speaking_topics) : [];

            res.status(201).json({
                success: true,
                message: 'Speaker created successfully',
                data: speaker
            });

        } catch (error) {
            await db.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Create speaker error:', error);
        res.status(500).json({
            error: 'Failed to create speaker'
        });
    }
});

// Update speaker
router.put('/:id', authenticateToken, logActivity('UPDATE', 'guest_speakers'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if speaker exists
        const existingSpeaker = await db.get('SELECT * FROM guest_speakers WHERE id = ?', [id]);
        if (!existingSpeaker) {
            return res.status(404).json({
                error: 'Speaker not found'
            });
        }

        // Validate input
        const { error, value } = updateSpeakerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        const { expertise, speaking_topics, ...speakerData } = value;

        await db.beginTransaction();

        try {
            // Update speaker data if provided
            if (Object.keys(speakerData).length > 0) {
                const updates = [];
                const params = [];

                Object.keys(speakerData).forEach(key => {
                    if (speakerData[key] !== undefined) {
                        if (key === 'speaking_topics') {
                            updates.push(`${key} = ?`);
                            params.push(JSON.stringify(speakerData[key]));
                        } else {
                            updates.push(`${key} = ?`);
                            params.push(speakerData[key]);
                        }
                    }
                });

                if (updates.length > 0) {
                    updates.push('updated_at = CURRENT_TIMESTAMP');
                    params.push(id);

                    await db.run(`
                        UPDATE guest_speakers 
                        SET ${updates.join(', ')} 
                        WHERE id = ?
                    `, params);
                }
            }

            // Update speaking topics if provided
            if (speaking_topics !== undefined) {
                await db.run(
                    'UPDATE guest_speakers SET speaking_topics = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [JSON.stringify(speaking_topics), id]
                );
            }

            // Update expertise if provided
            if (expertise !== undefined) {
                // Delete existing expertise
                await db.run('DELETE FROM speaker_expertise WHERE speaker_id = ?', [id]);

                // Insert new expertise
                if (expertise.length > 0) {
                    for (const exp of expertise) {
                        await db.run(
                            'INSERT INTO speaker_expertise (speaker_id, expertise_area, years_experience) VALUES (?, ?, ?)',
                            [id, exp.area, exp.years_experience || 0]
                        );
                    }
                }
            }

            await db.commit();

            // Get updated speaker
            const speaker = await db.get(`
                SELECT gs.*, u.username as created_by_username,
                       GROUP_CONCAT(se.expertise_area) as expertise_areas
                FROM guest_speakers gs 
                LEFT JOIN admin_users u ON gs.created_by = u.id
                LEFT JOIN speaker_expertise se ON gs.id = se.speaker_id
                WHERE gs.id = ?
                GROUP BY gs.id
            `, [id]);

            speaker.expertise_areas = speaker.expertise_areas ? speaker.expertise_areas.split(',') : [];
            speaker.speaking_topics = speaker.speaking_topics ? JSON.parse(speaker.speaking_topics) : [];

            res.json({
                success: true,
                message: 'Speaker updated successfully',
                data: speaker
            });

        } catch (error) {
            await db.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Update speaker error:', error);
        res.status(500).json({
            error: 'Failed to update speaker'
        });
    }
});

// Delete speaker
router.delete('/:id', authenticateToken, logActivity('DELETE', 'guest_speakers'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if speaker exists
        const existingSpeaker = await db.get('SELECT * FROM guest_speakers WHERE id = ?', [id]);
        if (!existingSpeaker) {
            return res.status(404).json({
                error: 'Speaker not found'
            });
        }

        // Check if speaker is assigned to any events
        const eventCount = await db.get(
            'SELECT COUNT(*) as count FROM event_speakers WHERE speaker_id = ?',
            [id]
        );

        if (eventCount.count > 0) {
            return res.status(409).json({
                error: 'Cannot delete speaker who is assigned to events. Remove from events first.'
            });
        }

        // Delete speaker (cascade will handle expertise)
        await db.run('DELETE FROM guest_speakers WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Speaker deleted successfully'
        });

    } catch (error) {
        console.error('Delete speaker error:', error);
        res.status(500).json({
            error: 'Failed to delete speaker'
        });
    }
});

// Toggle speaker availability
router.patch('/:id/toggle-availability', authenticateToken, logActivity('UPDATE', 'guest_speakers'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if speaker exists
        const existingSpeaker = await db.get('SELECT is_available FROM guest_speakers WHERE id = ?', [id]);
        if (!existingSpeaker) {
            return res.status(404).json({
                error: 'Speaker not found'
            });
        }

        const newStatus = existingSpeaker.is_available ? 0 : 1;

        await db.run(
            'UPDATE guest_speakers SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [newStatus, id]
        );

        res.json({
            success: true,
            message: `Speaker ${newStatus ? 'marked as available' : 'marked as unavailable'}`,
            is_available: Boolean(newStatus)
        });

    } catch (error) {
        console.error('Toggle speaker availability error:', error);
        res.status(500).json({
            error: 'Failed to toggle speaker availability'
        });
    }
});

module.exports = router;