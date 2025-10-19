const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const memorySchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(1000).required(),
    image_url: Joi.string().uri().allow('').optional(),
    event_date: Joi.date().iso().required()
});

const updateMemorySchema = Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().min(1).max(1000).optional(),
    image_url: Joi.string().uri().allow('').optional(),
    event_date: Joi.date().iso().optional()
});

// Get all memories
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT m.*, u.username as created_by_username 
            FROM club_memories m 
            LEFT JOIN admin_users u ON m.created_by = u.id
        `;
        let params = [];

        if (search) {
            query += ` WHERE m.title LIKE ? OR m.description LIKE ?`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY m.event_date DESC, m.created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const memories = await db.all(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM club_memories';
        let countParams = [];

        if (search) {
            countQuery += ' WHERE title LIKE ? OR description LIKE ?';
            countParams.push(`%${search}%`, `%${search}%`);
        }

        const { total } = await db.get(countQuery, countParams);

        res.json({
            success: true,
            data: memories,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get memories error:', error);
        res.status(500).json({
            error: 'Failed to fetch memories'
        });
    }
});

// Get single memory
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const memory = await db.get(`
            SELECT m.*, u.username as created_by_username 
            FROM club_memories m 
            LEFT JOIN admin_users u ON m.created_by = u.id 
            WHERE m.id = ?
        `, [id]);

        if (!memory) {
            return res.status(404).json({
                error: 'Memory not found'
            });
        }

        res.json({
            success: true,
            data: memory
        });

    } catch (error) {
        console.error('Get memory error:', error);
        res.status(500).json({
            error: 'Failed to fetch memory'
        });
    }
});

// Create new memory
router.post('/', authenticateToken, logActivity('CREATE', 'club_memories'), async (req, res) => {
    try {
        // Validate input
        const { error, value } = memorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        const { title, description, image_url, event_date } = value;

        const result = await db.run(`
            INSERT INTO club_memories (title, description, image_url, event_date, created_by) 
            VALUES (?, ?, ?, ?, ?)
        `, [title, description, image_url || null, event_date, req.user.id]);

        // Get the created memory
        const memory = await db.get(`
            SELECT m.*, u.username as created_by_username 
            FROM club_memories m 
            LEFT JOIN admin_users u ON m.created_by = u.id 
            WHERE m.id = ?
        `, [result.id]);

        res.status(201).json({
            success: true,
            message: 'Memory created successfully',
            data: memory
        });

    } catch (error) {
        console.error('Create memory error:', error);
        res.status(500).json({
            error: 'Failed to create memory'
        });
    }
});

// Update memory
router.put('/:id', authenticateToken, logActivity('UPDATE', 'club_memories'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if memory exists
        const existingMemory = await db.get('SELECT * FROM club_memories WHERE id = ?', [id]);
        if (!existingMemory) {
            return res.status(404).json({
                error: 'Memory not found'
            });
        }

        // Validate input
        const { error, value } = updateMemorySchema.validate(req.body);
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
            UPDATE club_memories 
            SET ${updates.join(', ')} 
            WHERE id = ?
        `, params);

        // Get updated memory
        const memory = await db.get(`
            SELECT m.*, u.username as created_by_username 
            FROM club_memories m 
            LEFT JOIN admin_users u ON m.created_by = u.id 
            WHERE m.id = ?
        `, [id]);

        res.json({
            success: true,
            message: 'Memory updated successfully',
            data: memory
        });

    } catch (error) {
        console.error('Update memory error:', error);
        res.status(500).json({
            error: 'Failed to update memory'
        });
    }
});

// Delete memory
router.delete('/:id', authenticateToken, logActivity('DELETE', 'club_memories'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if memory exists
        const existingMemory = await db.get('SELECT * FROM club_memories WHERE id = ?', [id]);
        if (!existingMemory) {
            return res.status(404).json({
                error: 'Memory not found'
            });
        }

        await db.run('DELETE FROM club_memories WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Memory deleted successfully'
        });

    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({
            error: 'Failed to delete memory'
        });
    }
});

// Bulk delete memories
router.delete('/', authenticateToken, logActivity('DELETE', 'club_memories'), async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                error: 'Invalid or empty IDs array'
            });
        }

        const placeholders = ids.map(() => '?').join(',');
        const result = await db.run(`DELETE FROM club_memories WHERE id IN (${placeholders})`, ids);

        res.json({
            success: true,
            message: `${result.changes} memories deleted successfully`,
            deleted_count: result.changes
        });

    } catch (error) {
        console.error('Bulk delete memories error:', error);
        res.status(500).json({
            error: 'Failed to delete memories'
        });
    }
});

module.exports = router;