const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', process.env.DB_PATH || './database/devityclub.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('📊 Connected to SQLite database:', dbPath);
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

const sqliteGet = db.get.bind(db);
const sqliteAll = db.all.bind(db);
const sqliteRun = db.run.bind(db);

// Database helper functions
const dbHelpers = {
    // Get single record
    get: (query, params = []) => {
        return new Promise((resolve, reject) => {
            sqliteGet(query, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get multiple records
    all: (query, params = []) => {
        return new Promise((resolve, reject) => {
            sqliteAll(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    // Run query (INSERT, UPDATE, DELETE)
    run: (query, params = []) => {
        return new Promise((resolve, reject) => {
            sqliteRun(query, params, function(err) {
                if (err) reject(err);
                else resolve({ 
                    id: this.lastID, 
                    changes: this.changes 
                });
            });
        });
    },

    // Begin transaction
    beginTransaction: () => {
        return new Promise((resolve, reject) => {
            sqliteRun('BEGIN TRANSACTION', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    // Commit transaction
    commit: () => {
        return new Promise((resolve, reject) => {
            sqliteRun('COMMIT', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    // Rollback transaction
    rollback: () => {
        return new Promise((resolve, reject) => {
            sqliteRun('ROLLBACK', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};

// Add helper methods to the db object
Object.assign(db, dbHelpers);

module.exports = db;
