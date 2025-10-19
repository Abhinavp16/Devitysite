const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Invalid or expired token' 
            });
        }

        // Verify user still exists and is active
        db.get(
            'SELECT id, email, username, is_active FROM admin_users WHERE id = ? AND is_active = 1',
            [user.id],
            (err, dbUser) => {
                if (err) {
                    console.error('Database error during auth:', err);
                    return res.status(500).json({ 
                        error: 'Authentication error' 
                    });
                }

                if (!dbUser) {
                    return res.status(403).json({ 
                        error: 'User not found or inactive' 
                    });
                }

                req.user = dbUser;
                next();
            }
        );
    });
};

const logActivity = (action, tableName, recordId = null, oldValues = null, newValues = null) => {
    return (req, res, next) => {
        // Log the activity after the request is processed
        const originalSend = res.send;
        res.send = function(data) {
            // Only log if the request was successful
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const logData = {
                    user_id: req.user.id,
                    action: action,
                    table_name: tableName,
                    record_id: recordId,
                    old_values: oldValues ? JSON.stringify(oldValues) : null,
                    new_values: newValues ? JSON.stringify(newValues) : null,
                    ip_address: req.ip || req.connection.remoteAddress,
                    user_agent: req.get('User-Agent')
                };

                db.run(
                    `INSERT INTO activity_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [logData.user_id, logData.action, logData.table_name, logData.record_id, 
                     logData.old_values, logData.new_values, logData.ip_address, logData.user_agent],
                    (err) => {
                        if (err) {
                            console.error('Error logging activity:', err);
                        }
                    }
                );
            }
            originalSend.call(this, data);
        };
        next();
    };
};

module.exports = {
    authenticateToken,
    logActivity
};