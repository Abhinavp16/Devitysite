const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = path.join(__dirname, '..', 'database', 'devityclub.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
const statements = schema.split(';').filter(stmt => stmt.trim());

async function initializeDatabase() {
    try {
        // Execute schema statements
        for (const statement of statements) {
            if (statement.trim()) {
                await new Promise((resolve, reject) => {
                    db.run(statement, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
        }

        console.log('Database schema created successfully.');

        // Create default admin user
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'DevityClub@2024', 12);
        
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT OR REPLACE INTO admin_users (email, username, password_hash) VALUES (?, ?, ?)`,
                [
                    process.env.ADMIN_EMAIL || 'admin@devityclub.com',
                    process.env.ADMIN_USERNAME || 'admin',
                    adminPassword
                ],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log('Default admin user created.');

        // Insert sample data
        await insertSampleData();

        console.log('Database initialization completed successfully!');
        
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        db.close();
    }
}

async function insertSampleData() {
    // Sample club memories
    const memories = [
        {
            title: "Hackathon 2024",
            description: "Annual coding competition with amazing projects",
            image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500",
            event_date: "2024-03-15"
        },
        {
            title: "Tech Workshop Series",
            description: "Weekly workshops on latest technologies",
            image_url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500",
            event_date: "2024-03-10"
        },
        {
            title: "Industry Expert Session",
            description: "Guest lecture by industry professionals",
            image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500",
            event_date: "2024-03-05"
        }
    ];

    for (const memory of memories) {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO club_memories (title, description, image_url, event_date, created_by) VALUES (?, ?, ?, ?, 1)`,
                [memory.title, memory.description, memory.image_url, memory.event_date],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    // Sample events
    const events = [
        {
            title: "AI & Machine Learning Workshop",
            description: "Hands-on workshop covering AI and ML fundamentals with practical projects",
            event_date: "2024-04-15",
            event_time: "2:00 PM - 5:00 PM",
            location: "Tech Hub, Room 101",
            event_type: "Workshop",
            status: "upcoming"
        },
        {
            title: "Web Development Bootcamp",
            description: "Full-day intensive bootcamp on modern web development technologies",
            event_date: "2024-04-22",
            event_time: "10:00 AM - 4:00 PM",
            location: "Innovation Center",
            event_type: "Bootcamp",
            status: "upcoming"
        }
    ];

    for (const event of events) {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO events (title, description, event_date, event_time, location, event_type, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
                [event.title, event.description, event.event_date, event.event_time, event.location, event.event_type, event.status],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    // Sample team members
    const teamMembers = [
        {
            name: "Mr. Aarekh Verma",
            role: "President",
            bio: "Full-stack developer with 3+ years experience leading technical initiatives",
            team_type: "core",
            github_url: "https://github.com/aarekh",
            linkedin_url: "https://linkedin.com/in/aarekh"
        },
        {
            name: "Ms. Naina Sethia",
            role: "Vice President",
            bio: "Creative designer passionate about user experience and interface design",
            team_type: "core",
            github_url: "https://github.com/nainasethia",
            linkedin_url: "https://linkedin.com/in/nainasethia"
        }
    ];

    for (const member of teamMembers) {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO team_members (name, role, bio, team_type, github_url, linkedin_url, created_by) VALUES (?, ?, ?, ?, ?, ?, 1)`,
                [member.name, member.role, member.bio, member.team_type, member.github_url, member.linkedin_url],
                function(err) {
                    if (err) reject(err);
                    else {
                        // Add skills for team members
                        const skills = member.name.includes('Aarekh') ? 
                            ['JavaScript', 'Python', 'React', 'Node.js'] : 
                            ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'];
                        
                        skills.forEach(skill => {
                            db.run(
                                `INSERT INTO team_member_skills (team_member_id, skill_name) VALUES (?, ?)`,
                                [this.lastID, skill]
                            );
                        });
                        resolve();
                    }
                }
            );
        });
    }

    // Sample speakers
    const speakers = [
        {
            name: "Mr. Vikash Shrivastava",
            title: "Senior Engineer Manager",
            company: "Dell Technologies",
            bio: "Technology leader with expertise in cloud computing and enterprise solutions"
        },
        {
            name: "Mr. Rohit Agarwal",
            title: "Senior Data Engineering Lead",
            company: "Optum (A United Health Group Company)",
            bio: "Data engineering expert specializing in big data and analytics platforms"
        }
    ];

    for (const speaker of speakers) {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO guest_speakers (name, title, company, bio, created_by) VALUES (?, ?, ?, ?, 1)`,
                [speaker.name, speaker.title, speaker.company, speaker.bio],
                function(err) {
                    if (err) reject(err);
                    else {
                        // Add expertise areas
                        const expertise = speaker.name.includes('Vikash') ? 
                            ['Cloud Computing', 'Enterprise Architecture', 'DevOps'] : 
                            ['Data Engineering', 'Big Data', 'Analytics', 'Machine Learning'];
                        
                        expertise.forEach(area => {
                            db.run(
                                `INSERT INTO speaker_expertise (speaker_id, expertise_area, years_experience) VALUES (?, ?, ?)`,
                                [this.lastID, area, Math.floor(Math.random() * 10) + 5]
                            );
                        });
                        resolve();
                    }
                }
            );
        });
    }

    console.log('Sample data inserted successfully.');
}

// Run initialization
initializeDatabase();