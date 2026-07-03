const mongoose = require('mongoose');

const { Schema } = mongoose;

const baseOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

const adminUserSchema = new Schema({
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String, required: true },
    last_login: Date,
    is_active: { type: Boolean, default: true }
}, baseOptions);

const clubMemorySchema = new Schema({
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image_url: String,
    event_date: { type: Date, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    legacyCreatedBy: Number
}, baseOptions);

const eventSpeakerSchema = new Schema({
    speaker: { type: Schema.Types.ObjectId, ref: 'GuestSpeaker' },
    legacySpeakerId: Number,
    role: { type: String, enum: ['speaker', 'keynote', 'moderator', 'panelist'], default: 'speaker' },
    created_at: { type: Date, default: Date.now }
}, { _id: false });

const eventSchema = new Schema({
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    event_date: { type: Date, required: true },
    event_time: { type: String, required: true },
    location: { type: String, required: true },
    event_type: { type: String, enum: ['Workshop', 'Bootcamp', 'Seminar', 'Competition', 'Hackathon'], required: true },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
    max_participants: Number,
    registration_link: String,
    speakers: [eventSpeakerSchema],
    created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    legacyCreatedBy: Number
}, baseOptions);

const teamSkillSchema = new Schema({
    skill_name: { type: String, required: true },
    proficiency_level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' }
}, { _id: false });

const teamMemberSchema = new Schema({
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: String,
    image_url: String,
    team_type: { type: String, enum: ['leadership', 'core'], default: 'core' },
    email: String,
    phone: String,
    github_url: String,
    linkedin_url: String,
    twitter_url: String,
    is_active: { type: Boolean, default: true },
    join_date: Date,
    skills: [teamSkillSchema],
    created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    legacyCreatedBy: Number
}, baseOptions);

const speakerExpertiseSchema = new Schema({
    area: { type: String, required: true },
    years_experience: { type: Number, default: 0 }
}, { _id: false });

const guestSpeakerSchema = new Schema({
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    bio: String,
    image_url: String,
    email: String,
    phone: String,
    linkedin_url: String,
    twitter_url: String,
    website_url: String,
    speaking_topics: [String],
    expertise: [speakerExpertiseSchema],
    is_available: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    legacyCreatedBy: Number
}, baseOptions);

const speakerReviewSchema = new Schema({
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    review: { type: String, required: true },
    highlight: String,
    image_url: String,
    is_active: { type: Boolean, default: true }
}, baseOptions);

const activityLogSchema = new Schema({
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    legacyUserId: Number,
    action: { type: String, required: true },
    table_name: { type: String, required: true },
    record_id: String,
    old_values: Schema.Types.Mixed,
    new_values: Schema.Types.Mixed,
    ip_address: String,
    user_agent: String
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
const ClubMemory = mongoose.model('ClubMemory', clubMemorySchema);
const Event = mongoose.model('Event', eventSchema);
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
const GuestSpeaker = mongoose.model('GuestSpeaker', guestSpeakerSchema);
const SpeakerReview = mongoose.model('SpeakerReview', speakerReviewSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);

const legacyOrObjectIdQuery = (id) => {
    if (isObjectId(id)) return { _id: id };
    const legacyId = Number(id);
    return Number.isInteger(legacyId) ? { legacyId } : { _id: null };
};

const publicId = (doc) => String(doc.legacyId || doc._id);

const formatDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : null;

const createdByUsername = (doc) => doc.created_by && doc.created_by.username ? doc.created_by.username : undefined;

const mapMemory = (doc) => ({
    id: publicId(doc),
    title: doc.title,
    description: doc.description,
    image_url: doc.image_url || null,
    event_date: formatDate(doc.event_date),
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    created_by: doc.created_by ? publicId(doc.created_by) : doc.legacyCreatedBy,
    created_by_username: createdByUsername(doc)
});

const mapEvent = (doc, speakerDocs = []) => ({
    id: publicId(doc),
    title: doc.title,
    description: doc.description,
    event_date: formatDate(doc.event_date),
    event_time: doc.event_time,
    location: doc.location,
    event_type: doc.event_type,
    status: doc.status,
    max_participants: doc.max_participants || null,
    registration_link: doc.registration_link || null,
    speaker_count: doc.speakers ? doc.speakers.length : 0,
    speakers: speakerDocs,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    created_by: doc.created_by ? publicId(doc.created_by) : doc.legacyCreatedBy,
    created_by_username: createdByUsername(doc)
});

const mapTeamMember = (doc) => ({
    id: publicId(doc),
    name: doc.name,
    role: doc.role,
    bio: doc.bio || null,
    image_url: doc.image_url || null,
    team_type: doc.team_type,
    email: doc.email || null,
    phone: doc.phone || null,
    github_url: doc.github_url || null,
    linkedin_url: doc.linkedin_url || null,
    twitter_url: doc.twitter_url || null,
    is_active: Boolean(doc.is_active),
    join_date: formatDate(doc.join_date),
    skills: (doc.skills || []).map((skill) => skill.skill_name || skill),
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    created_by: doc.created_by ? publicId(doc.created_by) : doc.legacyCreatedBy,
    created_by_username: createdByUsername(doc)
});

const mapSpeaker = (doc) => ({
    id: publicId(doc),
    name: doc.name,
    title: doc.title,
    company: doc.company,
    bio: doc.bio || null,
    image_url: doc.image_url || null,
    email: doc.email || null,
    phone: doc.phone || null,
    linkedin_url: doc.linkedin_url || null,
    twitter_url: doc.twitter_url || null,
    website_url: doc.website_url || null,
    speaking_topics: doc.speaking_topics || [],
    expertise: doc.expertise || [],
    expertise_areas: (doc.expertise || []).map((item) => item.area),
    is_available: Boolean(doc.is_available),
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    created_by: doc.created_by ? publicId(doc.created_by) : doc.legacyCreatedBy,
    created_by_username: createdByUsername(doc)
});

const mapSpeakerReview = (doc) => ({
    id: publicId(doc),
    name: doc.name,
    role: doc.role,
    review: doc.review,
    highlight: doc.highlight || null,
    image_url: doc.image_url || null,
    is_active: Boolean(doc.is_active),
    created_at: doc.created_at,
    updated_at: doc.updated_at
});

module.exports = {
    AdminUser,
    ClubMemory,
    Event,
    TeamMember,
    GuestSpeaker,
    SpeakerReview,
    ActivityLog,
    legacyOrObjectIdQuery,
    publicId,
    mapMemory,
    mapEvent,
    mapTeamMember,
    mapSpeaker,
    mapSpeakerReview,
    formatDate
};
