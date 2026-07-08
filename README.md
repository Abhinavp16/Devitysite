# DevityClub Website

A modern, responsive website for DevityClub - a tech community focused on empowering the next generation of tech innovators.

## Features

- **Responsive Design**: Fully responsive design that works on all devices
- **Modern UI**: Clean and modern interface built with React and Tailwind CSS
- **Interactive Components**: Engaging user interface with smooth animations
- **Contact Form**: Functional contact form for community inquiries
- **Speaker Showcase**: Dedicated section for guest speakers and industry experts
- **Event Management**: Display of upcoming and past events
- **Team Section**: Meet the team behind DevityClub

## Tech Stack

- **Frontend**: React 19.1.1
- **Styling**: Tailwind CSS 4.1.13
- **Build Tool**: Create React App
- **Icons**: Heroicons (via SVG)

## Project Layout

```
devitysite/
├── frontend/   # React website for Vercel
└── backend/    # Express API for Render/Railway/Fly/etc.
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devitysite
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Start the frontend development server:
```bash
npm start
```

4. Install backend dependencies in another terminal:
```bash
cd backend
npm install
```

5. Start the backend API:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) to view the frontend.

## Available Scripts

- `cd frontend && npm start` - Runs the React app in development mode
- `cd frontend && npm test` - Launches the frontend test runner
- `cd frontend && npm run build` - Builds the frontend for production
- `cd backend && npm start` - Runs the Express API
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
devitysite/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vercel.json
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── package.json
│   └── server.js
└── README.md
```

## Components

### Header
- Navigation menu with smooth scrolling
- Responsive mobile menu
- Admin login button

### Hero
- Eye-catching hero section with call-to-action buttons
- Animated tech-themed graphics
- Responsive layout

### About
- Club mission and vision
- Feature highlights with icons
- Statistics showcase

### Events
- Upcoming and past events display
- Event registration functionality
- Event details with date, time, and location

### Team
- Team member profiles
- Social media links
- Skills and expertise display

### Speakers
- Guest speaker profiles
- Company affiliations
- Upcoming talks information

### Contact
- Contact form with validation
- Contact information display
- Social media links
- Office hours

### Footer
- Newsletter subscription
- Quick links and resources
- Social media integration
- Copyright information

## Customization

### Colors
The website uses a blue-based color scheme. To customize colors, update the Tailwind configuration in `frontend/tailwind.config.js`.

### Content
Update the content in each component file to match your club's information:
- Club name and branding
- Team member information
- Event details
- Contact information

### Styling
Additional custom styles can be added to `frontend/src/App.css` or by extending Tailwind classes.

## Deployment

To deploy the frontend on Vercel:

1. Set Vercel's root directory to `frontend`.
2. Use build command `npm run build`.
3. Use output directory `build`.
4. Add `REACT_APP_API_URL=https://your-backend-url/api` in Vercel environment variables.

Deploy the backend separately on a Node hosting provider such as Render, Railway, or Fly.io:

1. Set the service root directory to `backend`.
2. Use start command `npm start`.
3. Add required environment variables like `MONGODB_URI` and `JWT_SECRET`.

To build the frontend locally:

1. Build the project:
```bash
cd frontend
npm run build
```

2. Deploy the `frontend/build` folder to your hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please contact the DevityClub team at hello@devityclub.dev
