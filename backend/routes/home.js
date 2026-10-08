const express = require('express');
const Joi = require('joi');
const { SiteContent, MediaAsset, HOME_PHOTO_SLOTS, mapHomeContent } = require('../models');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_VIDEO_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request cap

// File signatures, so a mislabeled upload can't be served under an image/video content type
const MAGIC_BYTES = {
    'image/jpeg': (buf) => buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
    'image/png': (buf) => buf.slice(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])),
    'image/webp': (buf) => buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP',
    'video/mp4': (buf) => buf.slice(4, 8).toString('ascii') === 'ftyp',
    'video/webm': (buf) => buf.slice(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
};

const updateSchema = Joi.object({
    headline: Joi.string().trim().max(120).allow('', null),
    headline_highlight: Joi.string().trim().max(80).allow('', null),
    subtitle: Joi.string().trim().max(300).allow('', null),
    photo_alts: Joi.array().items(Joi.string().trim().max(150).allow('')).length(HOME_PHOTO_SLOTS),
    speaker_companies: Joi.array().items(Joi.string().trim().min(1).max(40)).max(20)
}).min(1);

const getOrCreateHome = async () => {
    const doc = await SiteContent.findOneAndUpdate(
        { key: 'home' },
        { $setOnInsert: { key: 'home' } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    while (doc.photos.length < HOME_PHOTO_SLOTS) doc.photos.push({ media: null, alt: '' });
    return doc;
};

const parseSlot = (req, res) => {
    const slot = Number(req.params.slot);
    if (!Number.isInteger(slot) || slot < 0 || slot >= HOME_PHOTO_SLOTS) {
        res.status(400).json({ error: `Photo slot must be 0-${HOME_PHOTO_SLOTS - 1}` });
        return null;
    }
    return slot;
};

// Validates a raw upload body; returns { error, status } or { contentType, data }
const readUpload = (req, allowedTypes) => {
    const contentType = (req.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
    if (!allowedTypes.includes(contentType)) {
        return { status: 415, error: `File type must be one of: ${allowedTypes.join(', ')}` };
    }
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return { status: 400, error: 'Upload is empty' };
    }
    if (!MAGIC_BYTES[contentType](req.body)) {
        return { status: 415, error: 'File contents do not match its type' };
    }
    return { contentType, data: req.body };
};

const saveAsset = (upload, userId) => MediaAsset.create({
    data: upload.data,
    content_type: upload.contentType,
    size: upload.data.length,
    created_by: userId
});

const deleteAsset = async (id) => {
    if (id) await MediaAsset.deleteOne({ _id: id });
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const doc = await SiteContent.findOne({ key: 'home' });
        res.json({ success: true, data: mapHomeContent(doc || new SiteContent({ key: 'home' })) });
    } catch (error) {
        console.error('Get home content error:', error);
        res.status(500).json({ error: 'Failed to fetch home page content' });
    }
});

// Text fields, photo descriptions and company names. Empty text resets that field to the default.
router.put('/', authenticateToken, logActivity('UPDATE', 'site_content'), async (req, res) => {
    try {
        const { error, value } = updateSchema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });

        const doc = await getOrCreateHome();
        ['headline', 'headline_highlight', 'subtitle'].forEach((field) => {
            if (value[field] !== undefined) doc[field] = value[field] || null;
        });
        if (value.photo_alts) value.photo_alts.forEach((alt, index) => { doc.photos[index].alt = alt; });
        if (value.speaker_companies) doc.speaker_companies = value.speaker_companies;
        doc.updated_by = req.user._id;
        await doc.save();

        res.json({ success: true, message: 'Home page updated', data: mapHomeContent(doc) });
    } catch (error) {
        console.error('Update home content error:', error);
        res.status(500).json({ error: 'Failed to update home page content' });
    }
});

router.put('/photos/:slot', authenticateToken, logActivity('UPDATE', 'site_content'),
    express.raw({ type: IMAGE_TYPES, limit: MAX_IMAGE_BYTES }), async (req, res) => {
        try {
            const slot = parseSlot(req, res);
            if (slot === null) return;
            const upload = readUpload(req, IMAGE_TYPES);
            if (upload.error) return res.status(upload.status).json({ error: upload.error });

            const asset = await saveAsset(upload, req.user._id);
            const doc = await getOrCreateHome();
            const previous = doc.photos[slot].media;
            doc.photos[slot].media = asset._id;
            doc.updated_by = req.user._id;
            await doc.save();
            await deleteAsset(previous);

            res.json({ success: true, message: 'Photo updated', data: mapHomeContent(doc) });
        } catch (error) {
            console.error('Upload home photo error:', error);
            res.status(500).json({ error: 'Failed to upload photo' });
        }
    });

router.delete('/photos/:slot', authenticateToken, logActivity('UPDATE', 'site_content'), async (req, res) => {
    try {
        const slot = parseSlot(req, res);
        if (slot === null) return;

        const doc = await getOrCreateHome();
        const previous = doc.photos[slot].media;
        doc.photos[slot].media = null;
        doc.updated_by = req.user._id;
        await doc.save();
        await deleteAsset(previous);

        res.json({ success: true, message: 'Photo reset to default', data: mapHomeContent(doc) });
    } catch (error) {
        console.error('Reset home photo error:', error);
        res.status(500).json({ error: 'Failed to reset photo' });
    }
});

router.put('/video', authenticateToken, logActivity('UPDATE', 'site_content'),
    express.raw({ type: VIDEO_TYPES, limit: MAX_VIDEO_BYTES }), async (req, res) => {
        try {
            const upload = readUpload(req, VIDEO_TYPES);
            if (upload.error) return res.status(upload.status).json({ error: upload.error });

            const asset = await saveAsset(upload, req.user._id);
            const doc = await getOrCreateHome();
            const previous = doc.video;
            doc.video = asset._id;
            doc.updated_by = req.user._id;
            await doc.save();
            await deleteAsset(previous);

            res.json({ success: true, message: 'Video updated', data: mapHomeContent(doc) });
        } catch (error) {
            console.error('Upload home video error:', error);
            res.status(500).json({ error: 'Failed to upload video' });
        }
    });

router.delete('/video', authenticateToken, logActivity('UPDATE', 'site_content'), async (req, res) => {
    try {
        const doc = await getOrCreateHome();
        const previous = doc.video;
        doc.video = null;
        doc.updated_by = req.user._id;
        await doc.save();
        await deleteAsset(previous);

        res.json({ success: true, message: 'Video reset to default', data: mapHomeContent(doc) });
    } catch (error) {
        console.error('Reset home video error:', error);
        res.status(500).json({ error: 'Failed to reset video' });
    }
});

module.exports = router;
