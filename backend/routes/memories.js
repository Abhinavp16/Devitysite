const express = require('express');
const Joi = require('joi');
const { ClubMemory, legacyOrObjectIdQuery, mapMemory } = require('../models');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

const memorySchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(1000).required(),
    image_url: Joi.string().max(15000000).allow('', null).optional(),
    image_urls: Joi.array().items(Joi.string().max(15000000).allow('', null)).max(5).optional(),
    image_titles: Joi.array().items(Joi.string().max(100).allow('', null)).max(5).optional(),
    event_date: Joi.date().iso().required()
});

const updateMemorySchema = Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().min(1).max(1000).optional(),
    image_url: Joi.string().max(15000000).allow('', null).optional(),
    image_urls: Joi.array().items(Joi.string().max(15000000).allow('', null)).max(5).optional(),
    image_titles: Joi.array().items(Joi.string().max(100).allow('', null)).max(5).optional(),
    event_date: Joi.date().iso().optional()
});

const normalizeMemoryPayload = (payload) => {
    const normalized = { ...payload };
    if (normalized.image_urls) {
        normalized.image_urls = normalized.image_urls.map((image) => image || null).filter(Boolean).slice(0, 5);
        normalized.image_url = normalized.image_urls[0] || null;
    } else if (normalized.image_url === '') {
        normalized.image_url = null;
    }
    if (normalized.image_titles) {
        normalized.image_titles = normalized.image_titles.map((title) => title || '').slice(0, 5);
    }
    return normalized;
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const filter = search ? {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const [memories, total] = await Promise.all([
            ClubMemory.find(filter).populate('created_by', 'username legacyId').sort({ event_date: -1, created_at: -1 }).skip(skip).limit(Number(limit)),
            ClubMemory.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: memories.map(mapMemory),
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get memories error:', error);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const memory = await ClubMemory.findOne(legacyOrObjectIdQuery(req.params.id)).populate('created_by', 'username legacyId');
        if (!memory) return res.status(404).json({ error: 'Memory not found' });
        res.json({ success: true, data: mapMemory(memory) });
    } catch (error) {
        console.error('Get memory error:', error);
        res.status(500).json({ error: 'Failed to fetch memory' });
    }
});

router.post('/', authenticateToken, logActivity('CREATE', 'club_memories'), async (req, res) => {
    try {
        const { error, value } = memorySchema.validate(req.body);
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });

        const normalizedValue = normalizeMemoryPayload(value);
        const memory = await ClubMemory.create({
            ...normalizedValue,
            image_url: normalizedValue.image_url || null,
            created_by: req.user._id,
            legacyCreatedBy: req.user.legacyId
        });
        await memory.populate('created_by', 'username legacyId');

        res.status(201).json({ success: true, message: 'Memory created successfully', data: mapMemory(memory) });
    } catch (error) {
        console.error('Create memory error:', error);
        res.status(500).json({ error: 'Failed to create memory' });
    }
});

router.put('/:id', authenticateToken, logActivity('UPDATE', 'club_memories'), async (req, res) => {
    try {
        const { error, value } = updateMemorySchema.validate(req.body);
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });
        if (Object.keys(value).length === 0) return res.status(400).json({ error: 'No valid fields to update' });

        const memory = await ClubMemory.findOneAndUpdate(
            legacyOrObjectIdQuery(req.params.id),
            { $set: normalizeMemoryPayload(value) },
            { returnDocument: 'after' }
        ).populate('created_by', 'username legacyId');
        if (!memory) return res.status(404).json({ error: 'Memory not found' });

        res.json({ success: true, message: 'Memory updated successfully', data: mapMemory(memory) });
    } catch (error) {
        console.error('Update memory error:', error);
        res.status(500).json({ error: 'Failed to update memory' });
    }
});

router.delete('/:id', authenticateToken, logActivity('DELETE', 'club_memories'), async (req, res) => {
    try {
        const memory = await ClubMemory.findOneAndDelete(legacyOrObjectIdQuery(req.params.id));
        if (!memory) return res.status(404).json({ error: 'Memory not found' });
        res.json({ success: true, message: 'Memory deleted successfully' });
    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Failed to delete memory' });
    }
});

router.delete('/', authenticateToken, logActivity('DELETE', 'club_memories'), async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'Invalid or empty IDs array' });
        const queries = ids.map(legacyOrObjectIdQuery);
        const result = await ClubMemory.deleteMany({ $or: queries });
        res.json({ success: true, message: `${result.deletedCount} memories deleted successfully`, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Bulk delete memories error:', error);
        res.status(500).json({ error: 'Failed to delete memories' });
    }
});

module.exports = router;
