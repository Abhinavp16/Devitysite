const express = require('express');
const Joi = require('joi');
const { GuestSpeaker, Event, legacyOrObjectIdQuery, mapSpeaker, formatDate } = require('../models');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

const speakerSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    title: Joi.string().min(1).max(255).required(),
    company: Joi.string().min(1).max(255).required(),
    bio: Joi.string().max(2000).allow('').optional(),
    image_url: Joi.string().max(15000000).allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    phone: Joi.string().max(20).allow('').optional(),
    linkedin_url: Joi.string().max(500).allow('', null).optional(),
    twitter_url: Joi.string().max(500).allow('', null).optional(),
    website_url: Joi.string().max(500).allow('', null).optional(),
    is_available: Joi.boolean().optional(),
    display_order: Joi.number().integer().min(0).optional(),
    expertise: Joi.array().items(Joi.object({
        area: Joi.string().min(1).max(100).required(),
        years_experience: Joi.number().integer().min(0).max(50).default(0)
    })).optional()
});

const updateSpeakerSchema = speakerSchema.fork(['name', 'title', 'company'], (schema) => schema.optional());

const normalizeSpeakerPayload = (payload) => {
    const normalized = { ...payload };
    ['bio', 'image_url', 'email', 'phone', 'linkedin_url', 'twitter_url', 'website_url'].forEach((field) => {
        if (normalized[field] === '') normalized[field] = null;
    });
    return normalized;
};

const normalizeSpeakerDisplayOrder = async () => {
    const speakers = await GuestSpeaker.find().sort({ display_order: 1, name: 1, created_at: 1, _id: 1 });
    const updates = speakers.flatMap((speaker, index) => {
        const display_order = index + 1;
        return speaker.display_order === display_order
            ? []
            : [{ updateOne: { filter: { _id: speaker._id }, update: { $set: { display_order } } } }];
    });

    if (updates.length > 0) await GuestSpeaker.bulkWrite(updates);
    return speakers;
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', is_available = 'true', expertise_area = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } }
            ];
        }
        if (is_available !== 'all') filter.is_available = is_available === 'true';
        if (expertise_area) filter['expertise.area'] = { $regex: expertise_area, $options: 'i' };

        const [speakers, total] = await Promise.all([
            GuestSpeaker.find(filter).populate('created_by', 'username legacyId')
                .sort({ display_order: 1, name: 1 }).skip(skip).limit(Number(limit)),
            GuestSpeaker.countDocuments(filter)
        ]);

        // Deduplicated event count per speaker — group by event first, then count per speaker
        const speakerObjectIds = speakers.map((s) => s._id);
        const speakerLegacyIds = speakers.map((s) => s.legacyId).filter(Boolean);

        const eventCounts = await Event.aggregate([
            { $unwind: '$speakers' },
            {
                $match: {
                    $or: [
                        { 'speakers.speaker': { $in: speakerObjectIds } },
                        { 'speakers.legacySpeakerId': { $in: speakerLegacyIds } }
                    ]
                }
            },
            // Use the first non-null identifier as the canonical speaker key
            {
                $group: {
                    _id: {
                        $cond: [
                            { $ifNull: ['$speakers.speaker', false] },
                            { $toString: '$speakers.speaker' },
                            { $toString: '$speakers.legacySpeakerId' }
                        ]
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: speakers.map((speaker) => {
                const data = mapSpeaker(speaker);
                const objId = String(speaker._id);
                const legId = speaker.legacyId != null ? String(speaker.legacyId) : null;
                const entry = eventCounts.find(
                    (item) => item._id === objId || (legId && item._id === legId)
                );
                data.events_count = entry?.count || 0;
                return data;
            }),
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get speakers error:', error);
        res.status(500).json({ error: 'Failed to fetch speakers' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const speaker = await GuestSpeaker.findOne(legacyOrObjectIdQuery(req.params.id)).populate('created_by', 'username legacyId');
        if (!speaker) return res.status(404).json({ error: 'Speaker not found' });

        const events = await Event.find({
            $or: [{ 'speakers.speaker': speaker._id }, { 'speakers.legacySpeakerId': speaker.legacyId }]
        }).select('legacyId title event_date status speakers');

        const data = mapSpeaker(speaker);
        data.events = events.map((event) => {
            const assignment = event.speakers.find(
                (item) => String(item.speaker) === String(speaker._id) || item.legacySpeakerId === speaker.legacyId
            );
            return {
                id: String(event.legacyId || event._id),
                title: event.title,
                event_date: formatDate(event.event_date),
                status: event.status,
                role: assignment ? assignment.role : 'speaker'
            };
        });

        res.json({ success: true, data });
    } catch (error) {
        console.error('Get speaker error:', error);
        res.status(500).json({ error: 'Failed to fetch speaker' });
    }
});

router.post('/', authenticateToken, logActivity('CREATE', 'guest_speakers'), async (req, res) => {
    try {
        const { error, value } = speakerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });

        let display_order = value.display_order;
        if (display_order === undefined) {
            const lastSpeaker = await GuestSpeaker.findOne().sort({ display_order: -1, created_at: -1 });
            display_order = lastSpeaker ? (lastSpeaker.display_order ?? 0) + 1 : 1;
        }

        const speaker = await GuestSpeaker.create({
            ...normalizeSpeakerPayload(value),
            display_order,
            created_by: req.user._id,
            legacyCreatedBy: req.user.legacyId
        });
        await speaker.populate('created_by', 'username legacyId');

        res.status(201).json({ success: true, message: 'Speaker created successfully', data: mapSpeaker(speaker) });
    } catch (error) {
        console.error('Create speaker error:', error);
        res.status(500).json({ error: 'Failed to create speaker' });
    }
});

router.put('/:id', authenticateToken, logActivity('UPDATE', 'guest_speakers'), async (req, res) => {
    try {
        const { error, value } = updateSpeakerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });

        const normalized = normalizeSpeakerPayload(value);
        if (Object.keys(normalized).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const speaker = await GuestSpeaker.findOneAndUpdate(
            legacyOrObjectIdQuery(req.params.id),
            { $set: normalized },
            { returnDocument: 'after' }
        ).populate('created_by', 'username legacyId');
        if (!speaker) return res.status(404).json({ error: 'Speaker not found' });

        res.json({ success: true, message: 'Speaker updated successfully', data: mapSpeaker(speaker) });
    } catch (error) {
        console.error('Update speaker error:', error);
        res.status(500).json({ error: 'Failed to update speaker' });
    }
});

router.delete('/:id', authenticateToken, logActivity('DELETE', 'guest_speakers'), async (req, res) => {
    try {
        const speaker = await GuestSpeaker.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!speaker) return res.status(404).json({ error: 'Speaker not found' });

        const eventCount = await Event.countDocuments({
            $or: [{ 'speakers.speaker': speaker._id }, { 'speakers.legacySpeakerId': speaker.legacyId }]
        });
        if (eventCount > 0) {
            return res.status(409).json({ error: 'This speaker is linked to an event. Open Events → Edit → Speakers to remove them first.' });
        }

        await speaker.deleteOne();
        res.json({ success: true, message: 'Speaker deleted successfully' });
    } catch (error) {
        console.error('Delete speaker error:', error);
        res.status(500).json({ error: 'Failed to delete speaker' });
    }
});

router.patch('/:id/reorder', authenticateToken, logActivity('UPDATE', 'guest_speakers'), async (req, res) => {
    try {
        const { direction } = req.body;
        if (!['up', 'down'].includes(direction)) {
            return res.status(400).json({ error: 'direction must be "up" or "down"' });
        }

        const speaker = await GuestSpeaker.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!speaker) return res.status(404).json({ error: 'Speaker not found' });

        // Legacy records may share the default order of zero. Repair to a dense,
        // deterministic sequence before selecting the immediately adjacent card.
        const speakers = await normalizeSpeakerDisplayOrder();
        const currentIndex = speakers.findIndex((item) => String(item._id) === String(speaker._id));
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const target = speakers[targetIndex];

        if (!target) return res.json({ success: true, moved: false, message: 'Already at boundary', data: mapSpeaker(speaker) });

        const currentOrder = currentIndex + 1;
        const targetOrder = targetIndex + 1;
        await GuestSpeaker.bulkWrite([
            { updateOne: { filter: { _id: speaker._id }, update: { $set: { display_order: targetOrder } } } },
            { updateOne: { filter: { _id: target._id }, update: { $set: { display_order: currentOrder } } } }
        ]);

        speaker.display_order = targetOrder;
        await speaker.populate('created_by', 'username legacyId');
        res.json({ success: true, moved: true, message: 'Speaker reordered successfully', data: mapSpeaker(speaker) });
    } catch (error) {
        console.error('Reorder speaker error:', error);
        res.status(500).json({ error: 'Failed to reorder speaker' });
    }
});

router.patch('/:id/toggle-availability', authenticateToken, logActivity('UPDATE', 'guest_speakers'), async (req, res) => {
    try {
        const speaker = await GuestSpeaker.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!speaker) return res.status(404).json({ error: 'Speaker not found' });
        speaker.is_available = !speaker.is_available;
        await speaker.save();
        res.json({
            success: true,
            message: `Speaker ${speaker.is_available ? 'marked as available' : 'marked as unavailable'}`,
            is_available: speaker.is_available
        });
    } catch (error) {
        console.error('Toggle speaker availability error:', error);
        res.status(500).json({ error: 'Failed to toggle speaker availability' });
    }
});

module.exports = router;
