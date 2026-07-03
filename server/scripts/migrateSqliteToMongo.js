const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectMongoDB = require('../config/mongodb');
const { AdminUser, ClubMemory, Event, TeamMember, GuestSpeaker, ActivityLog } = require('../models');

const dbPath = path.join(__dirname, '..', 'database', 'devityclub.db');
const sqlite = new sqlite3.Database(dbPath);

const all = (query, params = []) => new Promise((resolve, reject) => {
    sqlite.all(query, params, (error, rows) => error ? reject(error) : resolve(rows));
});

const parseMaybeJson = (value, fallback) => {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const toDate = (value) => value ? new Date(value) : undefined;

async function migrate() {
    await connectMongoDB();

    const [
        adminUsers,
        memories,
        events,
        teamMembers,
        teamSkills,
        speakers,
        speakerExpertise,
        eventSpeakers,
        activityLogs
    ] = await Promise.all([
        all('SELECT * FROM admin_users'),
        all('SELECT * FROM club_memories'),
        all('SELECT * FROM events'),
        all('SELECT * FROM team_members'),
        all('SELECT * FROM team_member_skills'),
        all('SELECT * FROM guest_speakers'),
        all('SELECT * FROM speaker_expertise'),
        all('SELECT * FROM event_speakers'),
        all('SELECT * FROM activity_logs')
    ]);

    await Promise.all([
        AdminUser.deleteMany({}),
        ClubMemory.deleteMany({}),
        Event.deleteMany({}),
        TeamMember.deleteMany({}),
        GuestSpeaker.deleteMany({}),
        ActivityLog.deleteMany({})
    ]);

    const adminIdMap = new Map();
    for (const user of adminUsers) {
        const doc = await AdminUser.create({
            legacyId: user.id,
            email: user.email,
            username: user.username,
            password_hash: user.password_hash,
            last_login: toDate(user.last_login),
            is_active: Boolean(user.is_active),
            created_at: toDate(user.created_at),
            updated_at: toDate(user.updated_at)
        });
        adminIdMap.set(user.id, doc._id);
    }

    for (const memory of memories) {
        await ClubMemory.create({
            legacyId: memory.id,
            title: memory.title,
            description: memory.description,
            image_url: memory.image_url,
            event_date: toDate(memory.event_date),
            created_by: adminIdMap.get(memory.created_by),
            legacyCreatedBy: memory.created_by,
            created_at: toDate(memory.created_at),
            updated_at: toDate(memory.updated_at)
        });
    }

    const speakerIdMap = new Map();
    for (const speaker of speakers) {
        const expertise = speakerExpertise
            .filter((item) => item.speaker_id === speaker.id)
            .map((item) => ({ area: item.expertise_area, years_experience: item.years_experience || 0 }));

        const doc = await GuestSpeaker.create({
            legacyId: speaker.id,
            name: speaker.name,
            title: speaker.title,
            company: speaker.company,
            bio: speaker.bio,
            image_url: speaker.image_url,
            email: speaker.email,
            phone: speaker.phone,
            linkedin_url: speaker.linkedin_url,
            twitter_url: speaker.twitter_url,
            website_url: speaker.website_url,
            speaking_topics: parseMaybeJson(speaker.speaking_topics, []),
            expertise,
            is_available: Boolean(speaker.is_available),
            created_by: adminIdMap.get(speaker.created_by),
            legacyCreatedBy: speaker.created_by,
            created_at: toDate(speaker.created_at),
            updated_at: toDate(speaker.updated_at)
        });
        speakerIdMap.set(speaker.id, doc._id);
    }

    for (const event of events) {
        const assignments = eventSpeakers
            .filter((item) => item.event_id === event.id)
            .map((item) => ({
                speaker: speakerIdMap.get(item.speaker_id),
                legacySpeakerId: item.speaker_id,
                role: item.role || 'speaker',
                created_at: toDate(item.created_at) || new Date()
            }));

        await Event.create({
            legacyId: event.id,
            title: event.title,
            description: event.description,
            event_date: toDate(event.event_date),
            event_time: event.event_time,
            location: event.location,
            event_type: event.event_type,
            status: event.status,
            max_participants: event.max_participants,
            registration_link: event.registration_link,
            speakers: assignments,
            created_by: adminIdMap.get(event.created_by),
            legacyCreatedBy: event.created_by,
            created_at: toDate(event.created_at),
            updated_at: toDate(event.updated_at)
        });
    }

    for (const member of teamMembers) {
        const skills = teamSkills
            .filter((item) => item.team_member_id === member.id)
            .map((item) => ({ skill_name: item.skill_name, proficiency_level: item.proficiency_level || 'intermediate' }));

        await TeamMember.create({
            legacyId: member.id,
            name: member.name,
            role: member.role,
            bio: member.bio,
            image_url: member.image_url,
            team_type: member.team_type,
            email: member.email,
            phone: member.phone,
            github_url: member.github_url,
            linkedin_url: member.linkedin_url,
            twitter_url: member.twitter_url,
            is_active: Boolean(member.is_active),
            join_date: toDate(member.join_date),
            skills,
            created_by: adminIdMap.get(member.created_by),
            legacyCreatedBy: member.created_by,
            created_at: toDate(member.created_at),
            updated_at: toDate(member.updated_at)
        });
    }

    for (const log of activityLogs) {
        await ActivityLog.create({
            legacyId: log.id,
            user_id: adminIdMap.get(log.user_id),
            legacyUserId: log.user_id,
            action: log.action,
            table_name: log.table_name,
            record_id: log.record_id ? String(log.record_id) : undefined,
            old_values: parseMaybeJson(log.old_values, log.old_values || undefined),
            new_values: parseMaybeJson(log.new_values, log.new_values || undefined),
            ip_address: log.ip_address,
            user_agent: log.user_agent,
            created_at: toDate(log.created_at)
        });
    }

    const counts = {
        adminUsers: await AdminUser.countDocuments(),
        clubMemories: await ClubMemory.countDocuments(),
        events: await Event.countDocuments(),
        teamMembers: await TeamMember.countDocuments(),
        guestSpeakers: await GuestSpeaker.countDocuments(),
        activityLogs: await ActivityLog.countDocuments()
    };

    console.log('MongoDB migration completed. Counts:', counts);
}

migrate()
    .catch((error) => {
        console.error('MongoDB migration failed:', error);
        process.exitCode = 1;
    })
    .finally(() => {
        sqlite.close();
        mongoose.connection.close();
    });
