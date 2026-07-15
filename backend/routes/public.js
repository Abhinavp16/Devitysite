const express = require('express');
const { ClubMemory, Event, TeamMember, GuestSpeaker, SpeakerReview, mapMemory, mapEvent, mapTeamMember, mapSpeaker, mapSpeakerReview } = require('../models');

const router = express.Router();

router.get('/memories', async (req, res) => {
    try {
        const memories = await ClubMemory.find().sort({ event_date: -1, created_at: -1 });
        res.json({ success: true, data: memories.map(mapMemory) });
    } catch (error) {
        console.error('Public memories error:', error);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ event_date: 1, created_at: -1 });
        res.json({ success: true, data: events.map((event) => mapEvent(event)) });
    } catch (error) {
        console.error('Public events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

router.get('/team', async (req, res) => {
    try {
        const unorderedCount = await TeamMember.countDocuments({ $or: [{ display_order: { $exists: false } }, { display_order: 0 }] });
        if (unorderedCount > 0) {
            const allMembers = await TeamMember.find().sort({ created_at: 1, _id: 1 });
            await Promise.all(allMembers.map((member, index) => {
                member.display_order = index + 1;
                return member.save();
            }));
        }
        const members = await TeamMember.find({ is_active: true }).sort({ display_order: 1, created_at: 1, _id: 1 });
        res.json({ success: true, data: members.map(mapTeamMember) });
    } catch (error) {
        console.error('Public team error:', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
});

router.get('/speakers', async (req, res) => {
    try {
        const speakers = await GuestSpeaker.find({ is_available: true }).sort({ name: 1 });
        res.json({ success: true, data: speakers.map(mapSpeaker) });
    } catch (error) {
        console.error('Public speakers error:', error);
        res.status(500).json({ error: 'Failed to fetch speakers' });
    }
});

router.get('/reviews', async (req, res) => {
    try {
        const reviews = await SpeakerReview.find({ is_active: true }).sort({ legacyId: 1, created_at: 1 });
        res.json({ success: true, data: reviews.map(mapSpeakerReview) });
    } catch (error) {
        console.error('Public reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch speaker reviews' });
    }
});

module.exports = router;
