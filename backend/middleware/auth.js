const jwt = require('jsonwebtoken');
const { AdminUser, ActivityLog } = require('../models');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Invalid or expired token' 
            });
        }

        try {
            // Verify user still exists and is active
            const dbUser = await AdminUser.findOne({ _id: user.id, is_active: true });

            if (!dbUser) {
                return res.status(403).json({
                    error: 'User not found or inactive'
                });
            }

            req.user = dbUser;
            next();
        } catch (error) {
            console.error('Database error during auth:', error);
            return res.status(500).json({
                error: 'Authentication error'
            });
        }
    });
};

const logActivity = (action, tableName, recordId = null, oldValues = null, newValues = null) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function(data) {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                let responseRecordId = recordId;
                let responseData = null;

                try {
                    responseData = typeof data === 'string' ? JSON.parse(data) : data;
                    responseRecordId = responseRecordId || responseData?.data?.id || responseData?.data?._id || req.params.id || null;
                } catch (error) {
                    responseRecordId = responseRecordId || req.params.id || null;
                }

                const responseSummary = responseData?.data ? {
                    id: responseData.data.id || responseData.data._id,
                    title: responseData.data.title,
                    name: responseData.data.name,
                    role: responseData.data.role,
                    status: responseData.data.status
                } : null;

                const logData = {
                    user_id: req.user.id,
                    action: action,
                    table_name: tableName,
                    record_id: responseRecordId,
                    old_values: oldValues ? JSON.stringify(oldValues) : null,
                    new_values: newValues ? JSON.stringify(newValues) : (responseSummary ? JSON.stringify(responseSummary) : null),
                    ip_address: req.ip || req.connection.remoteAddress,
                    user_agent: req.get('User-Agent')
                };

                ActivityLog.create({
                    user_id: logData.user_id,
                    action: logData.action,
                    table_name: logData.table_name,
                    record_id: logData.record_id,
                    old_values: logData.old_values,
                    new_values: logData.new_values,
                    ip_address: logData.ip_address,
                    user_agent: logData.user_agent
                })
                    .catch((error) => {
                        console.error('Error logging activity:', error);
                    })
                    .finally(() => {
                        originalSend.call(this, data);
                    });

                return this;
            }

            originalSend.call(this, data);
            return this;
        };
        next();
    };
};

module.exports = {
    authenticateToken,
    logActivity
};
