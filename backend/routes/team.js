const express = require('express');
const Joi = require('joi');
const { TeamMember, legacyOrObjectIdQuery, mapTeamMember } = require('../models');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

const teamMemberSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    role: Joi.string().min(1).max(255).required(),
    bio: Joi.string().max(1000).allow('').optional(),
    image_url: Joi.string().max(15000000).allow('', null).optional(),
    team_type: Joi.string().valid('leadership', 'core').default('core'),
    email: Joi.string().email().allow('', null).optional(),
    phone: Joi.string().max(20).allow('').optional(),
    github_url: Joi.string().max(500).allow('', null).optional(),
    linkedin_url: Joi.string().max(500).allow('', null).optional(),
    twitter_url: Joi.string().max(500).allow('', null).optional(),
    join_date: Joi.date().iso().allow('', null).optional(),
    is_active: Joi.boolean().optional(),
    skills: Joi.array().items(Joi.string().min(1).max(100)).optional()
});

const updateTeamMemberSchema = teamMemberSchema.fork(['name', 'role'], (schema) => schema.optional()).append({
    join_date: Joi.date().iso().allow('', null).optional()
});

const normalizeSkills = (skills = []) => skills.map((skill) => typeof skill === 'string' ? { skill_name: skill } : skill);

const normalizeTeamPayload = (payload) => {
    const normalized = { ...payload };
    if (normalized.join_date === '') normalized.join_date = null;
    ['email', 'phone', 'github_url', 'linkedin_url', 'twitter_url', 'image_url', 'bio'].forEach((field) => {
        if (normalized[field] === '') normalized[field] = null;
    });
    return normalized;
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', team_type = '', is_active = 'true' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } }
            ];
        }
        if (team_type) filter.team_type = team_type;
        if (is_active !== 'all') filter.is_active = is_active === 'true';

        const [members, total] = await Promise.all([
            TeamMember.find(filter).populate('created_by', 'username legacyId').sort({ team_type: 1, name: 1 }).skip(skip).limit(Number(limit)),
            TeamMember.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: members.map(mapTeamMember),
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const member = await TeamMember.findOne(legacyOrObjectIdQuery(req.params.id)).populate('created_by', 'username legacyId');
        if (!member) return res.status(404).json({ error: 'Team member not found' });
        res.json({ success: true, data: mapTeamMember(member) });
    } catch (error) {
        console.error('Get team member error:', error);
        res.status(500).json({ error: 'Failed to fetch team member' });
    }
});

router.post('/', authenticateToken, logActivity('CREATE', 'team_members'), async (req, res) => {
    try {
        const { error, value } = teamMemberSchema.validate(req.body);
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });
        const { skills, ...memberData } = normalizeTeamPayload(value);

        const member = await TeamMember.create({
            ...memberData,
            skills: normalizeSkills(skills),
            created_by: req.user._id,
            legacyCreatedBy: req.user.legacyId
        });
        await member.populate('created_by', 'username legacyId');

        res.status(201).json({ success: true, message: 'Team member created successfully', data: mapTeamMember(member) });
    } catch (error) {
        console.error('Create team member error:', error);
        res.status(500).json({ error: 'Failed to create team member' });
    }
});

router.put('/:id', authenticateToken, logActivity('UPDATE', 'team_members'), async (req, res) => {
    try {
        const { error, value } = updateTeamMemberSchema.validate(req.body);
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });
        const normalizedValue = normalizeTeamPayload(value);
        if (normalizedValue.skills !== undefined) normalizedValue.skills = normalizeSkills(normalizedValue.skills);

        const member = await TeamMember.findOneAndUpdate(legacyOrObjectIdQuery(req.params.id), { $set: normalizedValue }, { returnDocument: 'after' })
            .populate('created_by', 'username legacyId');
        if (!member) return res.status(404).json({ error: 'Team member not found' });

        res.json({ success: true, message: 'Team member updated successfully', data: mapTeamMember(member) });
    } catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({ error: 'Failed to update team member' });
    }
});

router.delete('/:id', authenticateToken, logActivity('DELETE', 'team_members'), async (req, res) => {
    try {
        const member = await TeamMember.findOneAndDelete(legacyOrObjectIdQuery(req.params.id));
        if (!member) return res.status(404).json({ error: 'Team member not found' });
        res.json({ success: true, message: 'Team member deleted successfully' });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({ error: 'Failed to delete team member' });
    }
});

router.patch('/:id/toggle-status', authenticateToken, logActivity('UPDATE', 'team_members'), async (req, res) => {
    try {
        const member = await TeamMember.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!member) return res.status(404).json({ error: 'Team member not found' });
        member.is_active = !member.is_active;
        await member.save();
        res.json({ success: true, message: `Team member ${member.is_active ? 'activated' : 'deactivated'} successfully`, is_active: member.is_active });
    } catch (error) {
        console.error('Toggle member status error:', error);
        res.status(500).json({ error: 'Failed to toggle member status' });
    }
});

module.exports = router;
