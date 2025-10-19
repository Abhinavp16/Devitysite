# DevityClub Backend API

A complete REST API backend for the DevityClub admin dashboard with SQLite database, authentication, and full CRUD operations.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Tables Created:
- **admin_users** - Admin authentication
- **club_memories** - Photo memories management
- **events** - Events with full details
- **team_members** - Team member profiles
- **team_member_skills** - Skills for team members
- **guest_speakers** - Speaker profiles
- **speaker_expertise** - Speaker expertise areas
- **event_speakers** - Event-speaker relationships
- **activity_logs** - Audit trail

## 🔐 Authentication

### Default Admin Credentials:
- **Email**: admin@devityclub.com
- **Username**: admin
- **Password**: DevityClub@2024

### JWT Token Authentication:
- Login to get JWT token
- Include in requests: `Authorization: Bearer <token>`
- Token expires in 24 hours

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login          - Admin login
GET  /api/auth/verify         - Verify token
POST /api/auth/logout         - Logout
POST /api/auth/change-password - Change password
```

### Dashboard
```
GET /api/dashboard/stats      - Dashboard statistics
GET /api/dashboard/activities - Activity logs
GET /api/dashboard/export     - Export all data
GET /api/dashboard/health     - System health
```

### Club Memories
```
GET    /api/memories          - Get all memories
GET    /api/memories/:id      - Get single memory
POST   /api/memories          - Create memory
PUT    /api/memories/:id      - Update memory
DELETE /api/memories/:id      - Delete memory
DELETE /api/memories          - Bulk delete memories
```

### Events
```
GET    /api/events            - Get all events
GET    /api/events/:id        - Get single event
POST   /api/events            - Create event
PUT    /api/events/:id        - Update event
DELETE /api/events/:id        - Delete event
POST   /api/events/:id/speakers - Add speaker to event
DELETE /api/events/:id/speakers/:speaker_id - Remove speaker
```

### Team Members
```
GET    /api/team              - Get all team members
GET    /api/team/:id          - Get single member
POST   /api/team              - Create team member
PUT    /api/team/:id          - Update team member
DELETE /api/team/:id          - Delete team member
PATCH  /api/team/:id/toggle-status - Toggle active status
```

### Guest Speakers
```
GET    /api/speakers          - Get all speakers
GET    /api/speakers/:id      - Get single speaker
POST   /api/speakers          - Create speaker
PUT    /api/speakers/:id      - Update speaker
DELETE /api/speakers/:id      - Delete speaker
PATCH  /api/speakers/:id/toggle-availability - Toggle availability
```

## 📝 Request Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@devityclub.com",
    "username": "admin",
    "password": "DevityClub@2024"
  }'
```

### Create Memory
```bash
curl -X POST http://localhost:5000/api/memories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Tech Workshop 2024",
    "description": "Amazing workshop on latest technologies",
    "image_url": "https://example.com/image.jpg",
    "event_date": "2024-04-15"
  }'
```

### Create Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "AI Workshop",
    "description": "Hands-on AI workshop",
    "event_date": "2024-04-20",
    "event_time": "2:00 PM - 5:00 PM",
    "location": "Tech Hub",
    "event_type": "Workshop",
    "status": "upcoming"
  }'
```

## 🔧 Configuration

### Environment Variables (.env):
```
PORT=5000
NODE_ENV=development
DB_PATH=./database/devityclub.db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@devityclub.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
```

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with 12 rounds
- **Rate Limiting** - 100 requests per 15 minutes
- **Input Validation** - Joi schema validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Controlled cross-origin access
- **Helmet Security** - Security headers
- **Activity Logging** - Complete audit trail

## 📊 Database Features

- **Foreign Key Constraints** - Data integrity
- **Indexes** - Optimized queries
- **Transactions** - ACID compliance
- **Cascade Deletes** - Automatic cleanup
- **Audit Trail** - All changes logged

## 🔄 Data Relationships

```
admin_users (1) ──→ (∞) club_memories
admin_users (1) ──→ (∞) events
admin_users (1) ──→ (∞) team_members
admin_users (1) ──→ (∞) guest_speakers
admin_users (1) ──→ (∞) activity_logs

team_members (1) ──→ (∞) team_member_skills
guest_speakers (1) ──→ (∞) speaker_expertise
events (∞) ←──→ (∞) guest_speakers (via event_speakers)
```

## 📈 Performance

- **SQLite Database** - Fast, serverless
- **Connection Pooling** - Efficient DB usage
- **Indexed Queries** - Optimized performance
- **Pagination** - Large dataset handling
- **Caching Headers** - Client-side caching

## 🧪 Testing

### Test API Health:
```bash
curl http://localhost:5000/api/health
```

### Test Authentication:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@devityclub.com","username":"admin","password":"DevityClub@2024"}'

# Verify token
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer <token>"
```

## 🚀 Production Deployment

1. **Environment Setup**:
   ```bash
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   ```

2. **Database Backup**:
   ```bash
   cp database/devityclub.db database/backup-$(date +%Y%m%d).db
   ```

3. **Process Management**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name devityclub-api
   ```

## 📋 Sample Data

The database is initialized with sample data:
- 3 club memories
- 2 upcoming events  
- 2 team members with skills
- 2 guest speakers with expertise
- 1 admin user

## 🔍 Monitoring

- **Activity Logs** - All CRUD operations logged
- **Health Endpoint** - System status monitoring
- **Error Logging** - Comprehensive error tracking
- **Performance Metrics** - Request timing and memory usage

## 🎯 Ready for Production!

The backend is fully functional with:
- ✅ Complete CRUD operations
- ✅ Secure authentication
- ✅ Data validation
- ✅ Error handling
- ✅ Activity logging
- ✅ Performance optimization
- ✅ Security best practices