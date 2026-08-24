const jwt = require('jsonwebtoken');
const { AdminUser, ActivityLog } = require('../models');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        try {
            const dbUser = await AdminUser.findOne({ _id: user.id, is_active: true });

            if (!dbUser) {
                return res.status(403).json({ error: 'User not found or inactive' });
            }

            req.user = dbUser;
            next();
        } catch (error) {
            console.error('Database error during auth:', error);
            return res.status(500).json({ error: 'Authentication error' });
        }
    });
};

const logActivity = (action, tableName) => {
    return (req, res, next) => {
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                // Extract record ID from params; response body not parsed to avoid complexity
                const recordId = req.params?.id || null;

                ActivityLog.create({
                    user_id: req.user._id,
                    action,
                    table_name: tableName,
                    record_id: recordId,
                    old_values: null,
                    new_values: null,
                    ip_address: req.ip || req.socket?.remoteAddress,
                    user_agent: req.get('User-Agent')
                }).catch((error) => {
                    console.error('Error logging activity:', error);
                });
            }
        });
        next();
    };
};

module.exports = { authenticateToken, logActivity };
