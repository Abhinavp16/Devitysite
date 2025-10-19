const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Get counts for all main entities
        const [
            memoriesCount,
            eventsCount,
            upcomingEventsCount,
            teamMembersCount,
            activeTeamMembersCount,
            speakersCount,
            availableSpeakersCount
        ] = await Promise.all([
            db.get('SELECT COUNT(*) as count FROM club_memories'),
            db.get('SELECT COUNT(*) as count FROM events'),
            db.get('SELECT COUNT(*) as count FROM events WHERE status = "upcoming"'),
            db.get('SELECT COUNT(*) as count FROM team_members'),
            db.get('SELECT COUNT(*) as count FROM team_members WHERE is_active = 1'),
            db.get('SELECT COUNT(*) as count FROM guest_speakers'),
            db.get('SELECT COUNT(*) as count FROM guest_speakers WHERE is_available = 1')
        ]);

        // Get recent activities (last 10 activities)
        const recentActivities = await db.all(`
            SELECT al.*, au.username 
            FROM activity_logs al
            JOIN admin_users au ON al.user_id = au.id
            ORDER BY al.created_at DESC
            LIMIT 10
        `);

        // Get upcoming events (next 5)
        const upcomingEvents = await db.all(`
            SELECT id, title, event_date, event_time, location, event_type
            FROM events 
            WHERE status = 'upcoming' AND event_date >= date('now')
            ORDER BY event_date ASC
            LIMIT 5
        `);

        // Get recent memories (last 5)
        const recentMemories = await db.all(`
            SELECT id, title, event_date, image_url
            FROM club_memories
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Get team composition
        const teamComposition = await db.all(`
            SELECT team_type, COUNT(*) as count
            FROM team_members
            WHERE is_active = 1
            GROUP BY team_type
        `);

        // Get event type distribution
        const eventTypeDistribution = await db.all(`
            SELECT event_type, COUNT(*) as count
            FROM events
            GROUP BY event_type
            ORDER BY count DESC
        `);

        // Get monthly event trends (last 12 months)
        const monthlyEventTrends = await db.all(`
            SELECT 
                strftime('%Y-%m', event_date) as month,
                COUNT(*) as count
            FROM events
            WHERE event_date >= date('now', '-12 months')
            GROUP BY strftime('%Y-%m', event_date)
            ORDER BY month ASC
        `);

        res.json({
            success: true,
            data: {
                statistics: {
                    club_memories: memoriesCount.count,
                    total_events: eventsCount.count,
                    upcoming_events: upcomingEventsCount.count,
                    total_team_members: teamMembersCount.count,
                    active_team_members: activeTeamMembersCount.count,
                    total_speakers: speakersCount.count,
                    available_speakers: availableSpeakersCount.count
                },
                recent_activities: recentActivities.map(activity => ({
                    id: activity.id,
                    action: activity.action,
                    table_name: activity.table_name,
                    username: activity.username,
                    created_at: activity.created_at
                })),
                upcoming_events: upcomingEvents,
                recent_memories: recentMemories,
                team_composition: teamComposition,
                event_type_distribution: eventTypeDistribution,
                monthly_event_trends: monthlyEventTrends
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard statistics'
        });
    }
});

// Get activity logs with pagination
router.get('/activities', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, action = '', table_name = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT al.*, au.username 
            FROM activity_logs al
            JOIN admin_users au ON al.user_id = au.id
        `;
        let params = [];
        let conditions = [];

        if (action) {
            conditions.push('al.action = ?');
            params.push(action);
        }

        if (table_name) {
            conditions.push('al.table_name = ?');
            params.push(table_name);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const activities = await db.all(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM activity_logs al';
        let countParams = [];

        if (conditions.length > 0) {
            countQuery += ' WHERE ' + conditions.join(' AND ');
            countParams = params.slice(0, -2); // Remove limit and offset
        }

        const { total } = await db.get(countQuery, countParams);

        res.json({
            success: true,
            data: activities,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({
            error: 'Failed to fetch activities'
        });
    }
});

// Export all data
router.get('/export', authenticateToken, async (req, res) => {
    try {
        const [memories, events, teamMembers, speakers] = await Promise.all([
            db.all('SELECT * FROM club_memories ORDER BY event_date DESC'),
            db.all('SELECT * FROM events ORDER BY event_date DESC'),
            db.all(`
                SELECT tm.*, GROUP_CONCAT(tms.skill_name) as skills
                FROM team_members tm
                LEFT JOIN team_member_skills tms ON tm.id = tms.team_member_id
                GROUP BY tm.id
                ORDER BY tm.team_type, tm.name
            `),
            db.all(`
                SELECT gs.*, GROUP_CONCAT(se.expertise_area) as expertise_areas
                FROM guest_speakers gs
                LEFT JOIN speaker_expertise se ON gs.id = se.speaker_id
                GROUP BY gs.id
                ORDER BY gs.name
            `)
        ]);

        // Process team members skills
        teamMembers.forEach(member => {
            member.skills = member.skills ? member.skills.split(',') : [];
        });

        // Process speakers expertise
        speakers.forEach(speaker => {
            speaker.expertise_areas = speaker.expertise_areas ? speaker.expertise_areas.split(',') : [];
            speaker.speaking_topics = speaker.speaking_topics ? JSON.parse(speaker.speaking_topics) : [];
        });

        const exportData = {
            export_date: new Date().toISOString(),
            exported_by: req.user.username,
            data: {
                club_memories: memories,
                events: events,
                team_members: teamMembers,
                guest_speakers: speakers
            }
        };

        res.json({
            success: true,
            data: exportData
        });

    } catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({
            error: 'Failed to export data'
        });
    }
});

// System health check
router.get('/health', authenticateToken, async (req, res) => {
    try {
        // Check database connectivity
        const dbCheck = await db.get('SELECT 1 as test');
        
        // Get database file size (approximate)
        const dbStats = await db.get(`
            SELECT 
                COUNT(*) as total_tables
            FROM sqlite_master 
            WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
        `);

        res.json({
            success: true,
            data: {
                database: {
                    connected: !!dbCheck,
                    tables: dbStats.total_tables
                },
                server: {
                    uptime: process.uptime(),
                    memory_usage: process.memoryUsage(),
                    node_version: process.version,
                    environment: process.env.NODE_ENV || 'development'
                }
            }
        });

    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            error: 'Health check failed',
            details: error.message
        });
    }
});

module.exports = router;