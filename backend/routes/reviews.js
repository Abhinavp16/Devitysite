const express = require('express');
const Joi = require('joi');
const { SpeakerReview, legacyOrObjectIdQuery, mapSpeakerReview } = require('../models');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

const reviewSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    role: Joi.string().min(1).max(255).required(),
    review: Joi.string().min(1).max(2000).required(),
    highlight: Joi.string().max(100).allow('', null).optional(),
    image_url: Joi.string().max(15000000).allow('', null).optional(),
    is_active: Joi.boolean().optional()
});

const updateReviewSchema = reviewSchema.fork(['name', 'role', 'review'], (schema) => schema.optional());

const normalizeReviewPayload = (payload) => {
    const normalized = { ...payload };
    if (normalized.highlight === '') normalized.highlight = null;
    if (normalized.image_url === '') normalized.image_url = null;
    return normalized;
};

// GET /api/reviews — paginated list with optional search and is_active filter
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', is_active = 'all' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { review: { $regex: search, $options: 'i' } },
                { highlight: { $regex: search, $options: 'i' } }
            ];
        }
        if (is_active !== 'all') filter.is_active = is_active === 'true';

        const [reviews, total] = await Promise.all([
            SpeakerReview.find(filter).sort({ display_order: 1, created_at: 1, _id: 1 }).skip(skip).limit(Number(limit)),
            SpeakerReview.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: reviews.map(mapSpeakerReview),
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// GET /api/reviews/:id — single review
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const review = await SpeakerReview.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json({ success: true, data: mapSpeakerReview(review) });
    } catch (error) {
        console.error('Get review error:', error);
        res.status(500).json({ error: 'Failed to fetch review' });
    }
});

// POST /api/reviews — create
router.post('/', authenticateToken, logActivity('CREATE', 'speaker_reviews'), async (req, res) => {
    try {
        const { error, value } = reviewSchema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });

        // New reviews go to the end of the list (same order as the public site)
        const last = await SpeakerReview.findOne().sort({ display_order: -1, created_at: -1 });
        const review = await SpeakerReview.create({
            ...normalizeReviewPayload(value),
            display_order: last ? (last.display_order || 0) + 1 : 1
        });
        res.status(201).json({ success: true, message: 'Review created successfully', data: mapSpeakerReview(review) });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// PUT /api/reviews/:id — full update
router.put('/:id', authenticateToken, logActivity('UPDATE', 'speaker_reviews'), async (req, res) => {
    try {
        const { error, value } = updateReviewSchema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Invalid input', details: error.details[0].message });
        if (Object.keys(value).length === 0) return res.status(400).json({ error: 'No valid fields to update' });

        const review = await SpeakerReview.findOneAndUpdate(
            legacyOrObjectIdQuery(req.params.id),
            { $set: normalizeReviewPayload(value) },
            { returnDocument: 'after' }
        );
        if (!review) return res.status(404).json({ error: 'Review not found' });

        res.json({ success: true, message: 'Review updated successfully', data: mapSpeakerReview(review) });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

// DELETE /api/reviews/:id — delete
router.delete('/:id', authenticateToken, logActivity('DELETE', 'speaker_reviews'), async (req, res) => {
    try {
        const review = await SpeakerReview.findOneAndDelete(legacyOrObjectIdQuery(req.params.id));
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

// Dense, deterministic order (legacy reviews may all share display_order 0)
const normalizeReviewOrder = async () => {
    const reviews = await SpeakerReview.find().sort({ display_order: 1, created_at: 1, _id: 1 });
    const updates = reviews.flatMap((review, index) => (
        review.display_order === index + 1
            ? []
            : [{ updateOne: { filter: { _id: review._id }, update: { $set: { display_order: index + 1 } } } }]
    ));
    if (updates.length > 0) await SpeakerReview.bulkWrite(updates);
    return reviews;
};

// PATCH /api/reviews/:id/reorder — move up/down one place
router.patch('/:id/reorder', authenticateToken, logActivity('UPDATE', 'speaker_reviews'), async (req, res) => {
    try {
        const { direction } = req.body;
        if (!['up', 'down'].includes(direction)) return res.status(400).json({ error: 'direction must be "up" or "down"' });

        const review = await SpeakerReview.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!review) return res.status(404).json({ error: 'Review not found' });

        const reviews = await normalizeReviewOrder();
        const currentIndex = reviews.findIndex((item) => String(item._id) === String(review._id));
        const target = reviews[direction === 'up' ? currentIndex - 1 : currentIndex + 1];
        if (!target) return res.json({ success: true, moved: false, message: 'Already at the ' + (direction === 'up' ? 'top' : 'bottom') });

        const targetIndex = reviews.indexOf(target);
        await SpeakerReview.bulkWrite([
            { updateOne: { filter: { _id: review._id }, update: { $set: { display_order: targetIndex + 1 } } } },
            { updateOne: { filter: { _id: target._id }, update: { $set: { display_order: currentIndex + 1 } } } }
        ]);
        res.json({ success: true, moved: true, message: 'Review moved' });
    } catch (error) {
        console.error('Reorder review error:', error);
        res.status(500).json({ error: 'Failed to reorder review' });
    }
});

// PATCH /api/reviews/:id/toggle-status — toggle is_active
router.patch('/:id/toggle-status', authenticateToken, logActivity('UPDATE', 'speaker_reviews'), async (req, res) => {
    try {
        const review = await SpeakerReview.findOne(legacyOrObjectIdQuery(req.params.id));
        if (!review) return res.status(404).json({ error: 'Review not found' });
        review.is_active = !review.is_active;
        await review.save();
        res.json({
            success: true,
            message: `Review ${review.is_active ? 'activated' : 'deactivated'} successfully`,
            data: mapSpeakerReview(review)
        });
    } catch (error) {
        console.error('Toggle review status error:', error);
        res.status(500).json({ error: 'Failed to toggle review status' });
    }
});

module.exports = router;
