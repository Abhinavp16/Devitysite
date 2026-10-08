const express = require('express');
const Joi = require('joi');
const { Event, GuestSpeaker, legacyOrObjectIdQuery, mapEvent, mapSpeaker, startOfTodayUTC } = require('../models');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

const VALID_SPEAKER_ROLES = ['speaker', 'keynote', 'moderator', 'panelist'];

const eventSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(2000).required(),
    event_date: Joi.date().iso().required(),
    event_time: Joi.string().min(1).max(100).required(),
    location: Joi.string().min(1).max(255).required(),
    event_type: Joi.string().valid('Workshop', 'Bootcamp', 'Seminar', 'Competition', 'Hackathon').required(),
    status: Joi.string().valid('upcoming', 'completed', 'cancelled').default('upcoming'),
    max_participants: Joi.number().integer().min(1).allow('', null).optional(),
    registration_link: Joi.string().uri().allow('').optional(),
    display_order: Joi.number().integer().min(0).optional()
});

const updateEventSchema = Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().min(1).max(2000).optional(),
    event_date: Joi.date().iso().optional(),
    event_time: Joi.string().min(1).max(100).optional(),
    location: Joi.string().min(1).max(255).optional(),
    event_type: Joi.string().valid('Workshop', 'Bootcamp', 'Seminar', 'Competition', 'Hackathon').optional(),
    status: Joi.string().valid('upcoming', 'completed', 'cancelled').optional(),
    max_participants: Joi.number().integer().min(1).allow('', null).optional(),
    registration_link: Joi.string().uri().allow('').optional(),
    display_order: Joi.number().integer().min(0).optional()
});

const normalizeEventDisplayOrder = async () => {
    const events = await Event.find().sort({ display_order: 1, event_date: 1, created_at: -1, _id: 1 });
    const updates = events.flatMap((event, index) => {
        const display_order = index + 1;
        return event.display_order === display_order
            ? []
            : [{ updateOne: { filter: { _id: event._id }, update: { $set: { display_order } } } }];
    });

    if (updates.length > 0) await Event.bulkWrite(updates);
    return events;
};

const getEventSpeakerDocs = async (event) => {
    const assignments = event.speakers || [];
    if (assignments.length === 0) return [];
    const objectIds = assignments.filter((item) => item.speaker).map((item) => item.speaker);
    const legacyIds = assignments.filter((item) => item.legacySpeakerId).map((item) => item.legacySpeakerId);
    const speakers = await GuestSpeaker.find({ $or: [{ _id: { $in: objectIds } }, { legacyId: { $in: legacyIds } }] });

    return assignments.map((assignment) => {
        const speaker = speakers.find(
            (item) => String(item._id) === String(assignment.speaker) || item.legacyId === assignment.legacySpeakerId
        );
        return speaker ? { ...mapSpeaker(speaker), speaker_role: assignment.role } : null;
    }).filter(Boolean);
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '', event_type = '', start_date = '', end_date = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const conditions = [];

        if (search) {
            conditions.push({ $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ] });
        }
        // Status filters use the effective status: an "upcoming" event whose date has passed counts as completed
        const today = startOfTodayUTC();
        if (status === 'upcoming') conditions.push({ status: 'upcoming', event_date: { $gte: today } });
        else if (status === 'completed') conditions.push({ $or: [{ status: 'completed' }, { status: 'upcoming', event_date: { $lt: today } }] });
        else if (status) conditions.push({ status });
        if (event_type) conditions.push({ event_type });
        if (start_date) conditions.push({ event_date: { $gte: new Date(start_date) } });
        if (end_date) conditions.push({ event_date: { $lte: new Date(end_date) } });
        const filter = conditions.length ? { $and: conditions } : {};

        const [events, total] = await Promise.all([
            Event.find(filter).populate('created_by', 'username legacyId')
                .sort({ display_order: 1, event_date: 1, created_at: -1 }).skip(skip).limit(Number(limit)),
            Event.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: events.map((event) => mapEvent(event)),
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const event = await Event.findOne(legacyOrObjectIdQuery(req.params.id)).populate('created_by', 'username legacyId');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        const speakers = await getEventSpeakerDocs(event);
        res.json({ success: true, data: mapEvent(event, speakers) });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

router.post('/', authenticateToken, logActivity('CREATE', 'events'), async (req, res) => {
    try {
        const { error, value } = eventSchema.validate(req.body);
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });

        let display_order = value.display_order;
        if (display_order === undefined) {
            const lastEvent = await Event.findOne().sort({ display_order: -1, created_at: -1 });
            display_order = lastEvent ? (lastEvent.display_order ?? 0) + 1 : 1;
        }

        const event = await Event.create({
            ...value,
            max_participants: value.max_participants || null,
            registration_link: value.registration_link || null,
            display_order,
            created_by: req.user._id,
            legacyCreatedBy: req.user.legacyId
        });
        await event.populate('created_by', 'username legacyId');

        res.status(201).json({ success: true, message: 'Event created successfully', data: mapEvent(event) });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

router.put('/:id', authenticateToken, logActivity('UPDATE', 'events'), async (req, res) => {
    try {
        const { error, value } = updateEventSchema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });
        if (Object.keys(value).length === 0) return res.status(400).json({ error: 'No valid fields to update' });

        // Normalize empty strings to null for optional URL/number fields
        if (value.registration_link === '') value.registration_link = null;
        if (value.max_participants === '') value.max_participants = null;

        const event = await Event.findOneAndUpdate(
            legacyOrObjectIdQuery(req.params.id),
            { $set: value },
            { returnDocument: 'after' }
        ).populate('created_by', 'username legacyId');
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Resolve speakers so the PUT response is consistent with GET /:id
        const speakers = await getEventSpeakerDocs(event);
        res.json({ success: true, message: 'Event updated successfully', data: mapEvent(event, speakers) });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

router.delete('/:id', authenticateToken, logActivity('DELETE', 'events'), async (req, res) => {
    try {
        const event = await Event.findOneAndDelete(legacyOrObjectIdQuery(req.params.id));
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

router.post('/:id/speakers', authenticateToken, logActivity('CREATE', 'event_speakers'), async (req, res) => {
    try {
        const { id } = req.params;
        const { speaker_id, role = 'speaker' } = req.body;
        if (!speaker_id) return res.status(400).json({ error: 'Speaker ID is required' });

        // Validate role against schema enum
        if (!VALID_SPEAKER_ROLES.includes(role)) {
            return res.status(400).json({ error: `role must be one of: ${VALID_SPEAKER_ROLES.join(', ')}` });
        }

        const event = await Event.findOne(legacyOrObjectIdQuery(id));
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const speaker = await GuestSpeaker.findOne(legacyOrObjectIdQuery(speaker_id));
        if (!speaker) return res.status(404).json({ error: 'Speaker not found' });

        const exists = (event.speakers || []).some(
            (item) => String(item.speaker) === String(speaker._id) || item.legacySpeakerId === speaker.legacyId
        );
        if (exists) return res.status(409).json({ error: 'Speaker is already assigned to this event' });

        event.speakers.push({ speaker: speaker._id, legacySpeakerId: speaker.legacyId, role });
        await event.save();
        res.status(201).json({ success: true, message: 'Speaker added to event successfully' });
    } catch (error) {
        console.error('Add speaker to event error:', error);
        res.status(500).json({ error: 'Failed to add speaker to event' });
    }
});

router.delete('/:id/speakers/:speaker_id', authenticateToken, logActivity('DELETE', 'event_speakers'), async (req, res) => {
    try {
        const event = await Event.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const before = event.speakers.length;
        event.speakers = event.speakers.filter(
            (item) => String(item.speaker) !== String(req.params.speaker_id) &&
                      String(item.legacySpeakerId) !== String(req.params.speaker_id)
        );
        if (event.speakers.length === before) return res.status(404).json({ error: 'Speaker assignment not found' });

        await event.save();
        res.json({ success: true, message: 'Speaker removed from event successfully' });
    } catch (error) {
        console.error('Remove speaker from event error:', error);
        res.status(500).json({ error: 'Failed to remove speaker from event' });
    }
});

router.patch('/:id/reorder', authenticateToken, logActivity('UPDATE', 'events'), async (req, res) => {
    try {
        const { direction } = req.body;
        if (!['up', 'down'].includes(direction)) {
            return res.status(400).json({ error: 'direction must be "up" or "down"' });
        }

        const event = await Event.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Legacy records may share the default order of zero. Repair to a dense,
        // deterministic sequence before selecting the immediately adjacent card.
        const events = await normalizeEventDisplayOrder();
        const currentIndex = events.findIndex((item) => String(item._id) === String(event._id));
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const target = events[targetIndex];

        if (!target) return res.json({ success: true, moved: false, message: 'Already at boundary', data: mapEvent(event) });

        const currentOrder = currentIndex + 1;
        const targetOrder = targetIndex + 1;
        await Event.bulkWrite([
            { updateOne: { filter: { _id: event._id }, update: { $set: { display_order: targetOrder } } } },
            { updateOne: { filter: { _id: target._id }, update: { $set: { display_order: currentOrder } } } }
        ]);

        event.display_order = targetOrder;
        await event.populate('created_by', 'username legacyId');
        res.json({ success: true, moved: true, message: 'Event reordered successfully', data: mapEvent(event) });
    } catch (error) {
        console.error('Reorder event error:', error);
        res.status(500).json({ error: 'Failed to reorder event' });
    }
});

module.exports = router;
