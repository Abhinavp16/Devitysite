const express = require('express');
const { ClubMemory, Event, TeamMember, GuestSpeaker, ActivityLog, mapMemory, mapEvent, mapTeamMember, mapSpeaker } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const now = new Date();
        const [
            memoriesCount,
            eventsCount,
            upcomingEventsCount,
            teamMembersCount,
            activeTeamMembersCount,
            speakersCount,
            availableSpeakersCount,
            recentActivities,
            upcomingEvents,
            recentMemories,
            teamComposition,
            eventTypeDistribution,
            monthlyEventTrends
        ] = await Promise.all([
            ClubMemory.countDocuments(),
            Event.countDocuments(),
            Event.countDocuments({ status: 'upcoming' }),
            TeamMember.countDocuments(),
            TeamMember.countDocuments({ is_active: true }),
            GuestSpeaker.countDocuments(),
            GuestSpeaker.countDocuments({ is_available: true }),
            ActivityLog.find().populate('user_id', 'username legacyId').sort({ created_at: -1 }).limit(10),
            Event.find({ status: 'upcoming', event_date: { $gte: now } }).sort({ event_date: 1 }).limit(5),
            ClubMemory.find().sort({ created_at: -1 }).limit(5),
            TeamMember.aggregate([{ $match: { is_active: true } }, { $group: { _id: '$team_type', count: { $sum: 1 } } }]),
            Event.aggregate([{ $group: { _id: '$event_type', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
            Event.aggregate([
                { $match: { event_date: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()) } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$event_date' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                statistics: {
                    club_memories: memoriesCount,
                    total_events: eventsCount,
                    upcoming_events: upcomingEventsCount,
                    total_team_members: teamMembersCount,
                    active_team_members: activeTeamMembersCount,
                    total_speakers: speakersCount,
                    available_speakers: availableSpeakersCount
                },
                recent_activities: recentActivities.map((activity) => ({
                    id: String(activity.legacyId || activity._id),
                    action: activity.action,
                    table_name: activity.table_name,
                    username: activity.user_id ? activity.user_id.username : undefined,
                    created_at: activity.created_at
                })),
                upcoming_events: upcomingEvents.map((event) => mapEvent(event)),
                recent_memories: recentMemories.map(mapMemory),
                team_composition: teamComposition.map((item) => ({ team_type: item._id, count: item.count })),
                event_type_distribution: eventTypeDistribution.map((item) => ({ event_type: item._id, count: item.count })),
                monthly_event_trends: monthlyEventTrends.map((item) => ({ month: item._id, count: item.count }))
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

router.get('/activities', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, action = '', table_name = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const filter = {};
        if (action) filter.action = action;
        if (table_name) filter.table_name = table_name;

        const [activities, total] = await Promise.all([
            ActivityLog.find(filter).populate('user_id', 'username legacyId').sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
            ActivityLog.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: activities.map((activity) => ({
                id: String(activity.legacyId || activity._id),
                user_id: activity.user_id ? String(activity.user_id.legacyId || activity.user_id._id) : activity.legacyUserId,
                action: activity.action,
                table_name: activity.table_name,
                record_id: activity.record_id,
                username: activity.user_id ? activity.user_id.username : undefined,
                created_at: activity.created_at
            })),
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

router.get('/export', authenticateToken, async (req, res) => {
    try {
        const [memories, events, teamMembers, speakers] = await Promise.all([
            ClubMemory.find().sort({ event_date: -1 }),
            Event.find().sort({ event_date: -1 }),
            TeamMember.find().sort({ team_type: 1, name: 1 }),
            GuestSpeaker.find().sort({ name: 1 })
        ]);

        res.json({
            success: true,
            data: {
                export_date: new Date().toISOString(),
                exported_by: req.user.username,
                data: {
                    club_memories: memories.map(mapMemory),
                    events: events.map((event) => mapEvent(event)),
                    team_members: teamMembers.map(mapTeamMember),
                    guest_speakers: speakers.map(mapSpeaker)
                }
            }
        });
    } catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({ error: 'Failed to export data' });
    }
});

router.get('/health', authenticateToken, async (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
