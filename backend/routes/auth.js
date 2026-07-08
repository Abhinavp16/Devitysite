const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { AdminUser, ActivityLog, publicId } = require('../models');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

router.post('/login', async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details[0].message
            });
        }

        const { email, username, password } = value;
        const user = await AdminUser.findOne({ email: email.toLowerCase(), username, is_active: true });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const previousLastLogin = user.last_login;
        user.last_login = new Date();
        await user.save();

        const token = jwt.sign(
            { id: String(user._id), email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        await ActivityLog.create({
            user_id: user._id,
            legacyUserId: user.legacyId,
            action: 'LOGIN',
            table_name: 'admin_users',
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('User-Agent')
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: publicId(user),
                email: user.email,
                username: user.username,
                last_login: previousLastLogin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: publicId(req.user),
            email: req.user.email,
            username: req.user.username
        }
    });
});

router.post('/logout', authenticateToken, logActivity('LOGOUT', 'admin_users'), async (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, req.user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        req.user.password_hash = await bcrypt.hash(newPassword, 12);
        await req.user.save();

        await ActivityLog.create({
            user_id: req.user._id,
            legacyUserId: req.user.legacyId,
            action: 'UPDATE',
            table_name: 'admin_users',
            record_id: publicId(req.user)
        });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
