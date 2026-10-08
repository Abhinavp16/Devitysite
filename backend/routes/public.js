const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { ClubMemory, Event, TeamMember, GuestSpeaker, SpeakerReview, SiteContent, MediaAsset, mapMemory, mapEvent, mapTeamMember, mapSpeaker, mapSpeakerReview, mapHomeContent } = require('../models');

const router = express.Router();

// Dedicated public rate limiter — sized for many visitors behind one campus NAT IP
// (each homepage load makes 5 requests)
const publicLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: Number(process.env.PUBLIC_RATE_LIMIT_MAX || 600),
    message: { error: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false
});
router.use(publicLimiter);

const PUBLIC_LIMIT = 100; // hard cap per collection

// Admin-only fields that must never reach anonymous visitors
const PRIVATE_FIELDS = ['email', 'phone', 'created_by', 'created_by_username'];

const withoutPrivateFields = (mapper) => (doc) => {
    const data = mapper(doc);
    PRIVATE_FIELDS.forEach((field) => delete data[field]);
    return data;
};

router.get('/memories', async (req, res) => {
    try {
        const memories = await ClubMemory.find()
            .sort({ event_date: -1, created_at: -1 })
            .limit(PUBLIC_LIMIT);
        res.json({ success: true, data: memories.map(withoutPrivateFields(mapMemory)) });
    } catch (error) {
        console.error('Public memories error:', error);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

// Exclude cancelled events from public view
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({ status: { $ne: 'cancelled' } })
            .sort({ display_order: 1, event_date: 1, created_at: -1 })
            .limit(PUBLIC_LIMIT);
        res.json({ success: true, data: events.map(withoutPrivateFields((event) => mapEvent(event))) });
    } catch (error) {
        console.error('Public events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Pure read — no DB mutations
router.get('/team', async (req, res) => {
    try {
        const members = await TeamMember.find({ is_active: true })
            .sort({ display_order: 1, created_at: 1, _id: 1 })
            .limit(PUBLIC_LIMIT);
        res.json({ success: true, data: members.map(withoutPrivateFields(mapTeamMember)) });
    } catch (error) {
        console.error('Public team error:', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
});

router.get('/speakers', async (req, res) => {
    try {
        const speakers = await GuestSpeaker.find({ is_available: true })
            .sort({ display_order: 1, name: 1 })
            .limit(PUBLIC_LIMIT);
        res.json({ success: true, data: speakers.map(withoutPrivateFields(mapSpeaker)) });
    } catch (error) {
        console.error('Public speakers error:', error);
        res.status(500).json({ error: 'Failed to fetch speakers' });
    }
});

router.get('/reviews', async (req, res) => {
    try {
        const reviews = await SpeakerReview.find({ is_active: true })
            .sort({ display_order: 1, created_at: 1, _id: 1 })
            .limit(PUBLIC_LIMIT);
        res.json({ success: true, data: reviews.map(mapSpeakerReview) });
    } catch (error) {
        console.error('Public reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch speaker reviews' });
    }
});

// Editable home section; `data: null` means nothing customised yet (site uses its defaults)
router.get('/home', async (req, res) => {
    try {
        const doc = await SiteContent.findOne({ key: 'home' });
        const data = doc ? mapHomeContent(doc) : null;
        if (data) delete data.updated_at;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Public home content error:', error);
        res.status(500).json({ error: 'Failed to fetch home page content' });
    }
});

// Uploaded files. Ids change whenever a file is replaced, so they can be cached forever.
router.get('/media/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'File not found' });
        const asset = await MediaAsset.findById(req.params.id).select('data content_type size');
        if (!asset) return res.status(404).json({ error: 'File not found' });

        res.set({
            'Content-Type': asset.content_type,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Accept-Ranges': 'bytes'
        });

        // Byte-range support — Safari won't play <video> without it
        const total = asset.data.length;
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.get('Range') || '');
        if (range && (range[1] || range[2])) {
            const start = range[1] ? Number(range[1]) : Math.max(0, total - Number(range[2]));
            const end = range[1] && range[2] ? Math.min(Number(range[2]), total - 1) : total - 1;
            if (start >= total || start > end) {
                return res.status(416).set('Content-Range', `bytes */${total}`).end();
            }
            res.status(206).set({ 'Content-Range': `bytes ${start}-${end}/${total}`, 'Content-Length': end - start + 1 });
            return res.end(asset.data.subarray(start, end + 1));
        }

        res.set('Content-Length', total);
        res.end(asset.data);
    } catch (error) {
        console.error('Public media error:', error);
        res.status(500).json({ error: 'Failed to fetch file' });
    }
});

module.exports = router;
