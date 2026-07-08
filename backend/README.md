# DevityClub Backend API

Express + MongoDB API for the DevityClub website and admin dashboard.

## Quick Start

```bash
cd backend
npm install
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The API runs on `http://localhost:5001` locally unless `PORT` is set.

## Environment Variables

Create `backend/.env` locally or set these in your hosting provider:

```bash
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@devityclub.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
PORT=5001
```

Do not commit `.env` files.

## Scripts

- `npm start` - Run the API server
- `npm run dev` - Run the API server with nodemon
- `npm run migrate:mongo` - Migrate legacy SQLite data to MongoDB
- `npm run seed:website` - Seed website content into MongoDB

## Main Endpoints

- `POST /api/auth/login`
- `GET /api/auth/verify`
- `GET /api/dashboard/stats`
- `GET /api/public/team`
- `GET /api/public/speakers`
- `GET /api/public/events`
- `GET /api/public/memories`
- `GET /api/public/reviews`
- `GET/POST/PUT/DELETE /api/team`
- `GET/POST/PUT/DELETE /api/speakers`
- `GET/POST/PUT/DELETE /api/events`
- `GET/POST/PUT/DELETE /api/memories`

## Hosting

Host this folder separately from the frontend on a Node.js provider such as Render, Railway, or Fly.io.

Use:

- Root directory: `backend`
- Build command: `npm install` if required by the provider
- Start command: `npm start`
