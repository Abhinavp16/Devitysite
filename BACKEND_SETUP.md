# 🚀 DevityClub Backend Setup - Quick Start

## ✅ **COMPLETE BACKEND SYSTEM READY!**

A full REST API with SQLite database has been created with complete CRUD functionality.

## 🏃‍♂️ **Quick Start (3 Steps)**

### **1. Install Backend Dependencies**
```bash
cd devitysite/server
npm install
```

### **2. Initialize Database**
```bash
npm run init-db
```
This creates the SQLite database with sample data and admin user.

### **3. Start Backend Server**
```bash
npm run dev
```
Backend runs on: `http://localhost:5000`

## 🔐 **Default Admin Credentials**
- **Email:** admin@devityclub.com
- **Username:** admin  
- **Password:** DevityClub@2024

## 📡 **API Endpoints Ready**

### **Authentication**
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user

### **Dashboard**
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/export` - Export all data

### **Club Memories**
- `GET /api/memories` - Get all memories
- `POST /api/memories` - Create memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### **Events**
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### **Team Members**
- `GET /api/team` - Get team members
- `POST /api/team` - Create member
- `PUT /api/team/:id` - Update member
- `DELETE /api/team/:id` - Delete member

### **Speakers**
- `GET /api/speakers` - Get speakers
- `POST /api/speakers` - Create speaker
- `PUT /api/speakers/:id` - Update speaker
- `DELETE /api/speakers/:id` - Delete speaker

## 🧪 **Test the API**

### **1. Health Check**
```bash
curl http://localhost:5000/api/health
```

### **2. Login Test**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@devityclub.com",
    "username": "admin", 
    "password": "DevityClub@2024"
  }'
```

### **3. Get Data (use token from login)**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/memories
```

## 📊 **Database Schema**
- **admin_users** - Authentication
- **club_memories** - Photo memories
- **events** - Event management
- **team_members** + **team_member_skills** - Team profiles
- **guest_speakers** + **speaker_expertise** - Speaker management
- **activity_logs** - Audit trail

## 🛡️ **Security Features**
- JWT authentication with 24h expiry
- Password hashing with bcrypt
- Rate limiting (100 req/15min)
- Input validation with Joi
- SQL injection protection
- CORS configuration
- Complete activity logging

## 🎯 **Ready for Frontend Integration!**

The backend is now running and ready to connect with the admin dashboard. The Club Memories tab in the frontend already shows full integration - other tabs can follow the same pattern.

**Backend Status: ✅ FULLY OPERATIONAL**