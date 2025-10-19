const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const teamMemberSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    role: Joi.string().min(1).max(255).required(),
    bio: Joi.string().max(1000).allow('').optional(),
    image_url: Joi.string().uri().allow('').optional(),
    team_type: Joi.string().valid('leadership', 'core').default('core'),
    email: Joi.string().email().allow('').optional(),
    phone: Joi.string().max(20).allow('').optional(),
    github_url: Joi.string().uri().allow('').optional(),
    linkedin_url: Joi.string().uri().allow('').optional(),
    twitter_url: Joi.string().uri().allow('').optional(),
    join_date: Joi.date().iso().optional(),
    skills: Joi.array().items(Joi.string().min(1).max(100)).optional()
});

const updateTeamMemberSchema = Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    role: Joi.string().min(1).max(255).optional(),
    bio: Joi.string().max(1000).allow('').optional(),
    image_url: Joi.string().uri().allow('').optional(),
    team_type: Joi.string().valid('leadership', 'core').optional(),
    email: Joi.string().email().allow('').optional(),
    phone: Joi.string().max(20).allow('').optional(),
    github_url: Joi.string().uri().allow('').optional(),
    linkedin_url: Joi.string().uri().allow('').optional(),
    twitter_url: Joi.string().uri().allow('').optional(),
    join_date: Joi.date().iso().allow(null).optional(),
    is_active: Joi.boolean().optional(),
    skills: Joi.array().items(Joi.string().min(1).max(100)).optional()
});

// Get all team members
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            search = '', 
            team_type = '',
            is_active = 'true'
        } = req.query;
        
        const offset = (page - 1) * limit;

        let query = `
            SELECT tm.*, u.username as created_by_username,
                   GROUP_CONCAT(tms.skill_name) as skills
            FROM team_members tm 
            LEFT JOIN admin_users u ON tm.created_by = u.id
            LEFT JOIN team_member_skills tms ON tm.id = tms.team_member_id
        `;
        let params = [];
        let conditions = [];

        // Add search conditions
        if (search) {
            conditions.push('(tm.name LIKE ? OR tm.role LIKE ? OR tm.bio LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (team_type) {
            conditions.push('tm.team_type = ?');
            params.push(team_type);
        }

        if (is_active !== 'all') {
            conditions.push('tm.is_active = ?');
            params.push(is_active === 'true' ? 1 : 0);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` GROUP BY tm.id ORDER BY 
                   CASE tm.team_type 
                       WHEN 'leadership' THEN 1 
                       WHEN 'core' THEN 2 
                       ELSE 3 
                   END, tm.name ASC 
                   LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const teamMembers = await db.all(query, params);

        // Process skills for each member
        teamMembers.forEach(member => {
            member.skills = member.skills ? member.skills.split(',') : [];
        });

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM team_members tm';
        let countParams = [];

        if (conditions.length > 0) {
            countQuery += ' WHERE ' + conditions.join(' AND ');
            countParams = params.slice(0, -2); // Remove limit and offset
        }

        const { total } = await db.get(countQuery, countParams);

        res.json({
            success: true,
            data: teamMembers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({
            error: 'Failed to fetch team members'
        });
    }
});

// Get single team member
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const member = await db.get(`
            SELECT tm.*, u.username as created_by_username 
            FROM team_members tm 
            LEFT JOIN admin_users u ON tm.created_by = u.id 
            WHERE tm.id = ?
        `, [id]);

        if (!member) {
            return res.status(404).json({
                error: 'Team member not found'
            });
        }

        // Get member skills
        const skills = await db.all(
            'SELECT skill_name, proficiency_level FROM team_member_skills WHERE team_member_id = ?',
            [id]
        );

        member.skills = skills;

        res.json({
            success: true,
            data: member
        });

    } catch (error) {
        console.error('Get team member error:', error);
        res.status(500).json({
            error: 'Failed to fetch team member'
        });
    }
});

// Create new team member
router.post('/', authenticateToken, logActivity('CREATE', 'team_members'), async (req, res) => {
    try {
        // Validate input
        const { error, value } = teamMemberSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        const { skills, ...memberData } = value;

        await db.beginTransaction();

        try {
            // Insert team member
            const result = await db.run(`
                INSERT INTO team_members (
                    name, role, bio, image_url, team_type, email, phone,
                    github_url, linkedin_url, twitter_url, join_date, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                memberData.name, memberData.role, memberData.bio || null,
                memberData.image_url || null, memberData.team_type || 'core',
                memberData.email || null, memberData.phone || null,
                memberData.github_url || null, memberData.linkedin_url || null,
                memberData.twitter_url || null, memberData.join_date || null,
                req.user.id
            ]);

            const memberId = result.id;

            // Insert skills if provided
            if (skills && skills.length > 0) {
                for (const skill of skills) {
                    await db.run(
                        'INSERT INTO team_member_skills (team_member_id, skill_name) VALUES (?, ?)',
                        [memberId, skill]
                    );
                }
            }

            await db.commit();

            // Get the created member with skills
            const member = await db.get(`
                SELECT tm.*, u.username as created_by_username,
                       GROUP_CONCAT(tms.skill_name) as skills
                FROM team_members tm 
                LEFT JOIN admin_users u ON tm.created_by = u.id
                LEFT JOIN team_member_skills tms ON tm.id = tms.team_member_id
                WHERE tm.id = ?
                GROUP BY tm.id
            `, [memberId]);

            member.skills = member.skills ? member.skills.split(',') : [];

            res.status(201).json({
                success: true,
                message: 'Team member created successfully',
                data: member
            });

        } catch (error) {
            await db.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Create team member error:', error);
        res.status(500).json({
            error: 'Failed to create team member'
        });
    }
});

// Update team member
router.put('/:id', authenticateToken, logActivity('UPDATE', 'team_members'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if member exists
        const existingMember = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
        if (!existingMember) {
            return res.status(404).json({
                error: 'Team member not found'
            });
        }

        // Validate input
        const { error, value } = updateTeamMemberSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        const { skills, ...memberData } = value;

        await db.beginTransaction();

        try {
            // Update member data if provided
            if (Object.keys(memberData).length > 0) {
                const updates = [];
                const params = [];

                Object.keys(memberData).forEach(key => {
                    if (memberData[key] !== undefined) {
                        updates.push(`${key} = ?`);
                        params.push(memberData[key]);
                    }
                });

                if (updates.length > 0) {
                    updates.push('updated_at = CURRENT_TIMESTAMP');
                    params.push(id);

                    await db.run(`
                        UPDATE team_members 
                        SET ${updates.join(', ')} 
                        WHERE id = ?
                    `, params);
                }
            }

            // Update skills if provided
            if (skills !== undefined) {
                // Delete existing skills
                await db.run('DELETE FROM team_member_skills WHERE team_member_id = ?', [id]);

                // Insert new skills
                if (skills.length > 0) {
                    for (const skill of skills) {
                        await db.run(
                            'INSERT INTO team_member_skills (team_member_id, skill_name) VALUES (?, ?)',
                            [id, skill]
                        );
                    }
                }
            }

            await db.commit();

            // Get updated member
            const member = await db.get(`
                SELECT tm.*, u.username as created_by_username,
                       GROUP_CONCAT(tms.skill_name) as skills
                FROM team_members tm 
                LEFT JOIN admin_users u ON tm.created_by = u.id
                LEFT JOIN team_member_skills tms ON tm.id = tms.team_member_id
                WHERE tm.id = ?
                GROUP BY tm.id
            `, [id]);

            member.skills = member.skills ? member.skills.split(',') : [];

            res.json({
                success: true,
                message: 'Team member updated successfully',
                data: member
            });

        } catch (error) {
            await db.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({
            error: 'Failed to update team member'
        });
    }
});

// Delete team member
router.delete('/:id', authenticateToken, logActivity('DELETE', 'team_members'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if member exists
        const existingMember = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
        if (!existingMember) {
            return res.status(404).json({
                error: 'Team member not found'
            });
        }

        // Delete member (cascade will handle skills)
        await db.run('DELETE FROM team_members WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Team member deleted successfully'
        });

    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({
            error: 'Failed to delete team member'
        });
    }
});

// Toggle member active status
router.patch('/:id/toggle-status', authenticateToken, logActivity('UPDATE', 'team_members'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if member exists
        const existingMember = await db.get('SELECT is_active FROM team_members WHERE id = ?', [id]);
        if (!existingMember) {
            return res.status(404).json({
                error: 'Team member not found'
            });
        }

        const newStatus = existingMember.is_active ? 0 : 1;

        await db.run(
            'UPDATE team_members SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [newStatus, id]
        );

        res.json({
            success: true,
            message: `Team member ${newStatus ? 'activated' : 'deactivated'} successfully`,
            is_active: Boolean(newStatus)
        });

    } catch (error) {
        console.error('Toggle member status error:', error);
        res.status(500).json({
            error: 'Failed to toggle member status'
        });
    }
});

module.exports = router;