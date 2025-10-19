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

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
devitysite/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Events.js
│   │   ├── Team.js
│   │   ├── Speakers.js
│   │   ├── Contact.js
│   │   └── Footer.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
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
The website uses a blue-based color scheme. To customize colors, update the Tailwind configuration in `tailwind.config.js`.

### Content
Update the content in each component file to match your club's information:
- Club name and branding
- Team member information
- Event details
- Contact information

### Styling
Additional custom styles can be added to `src/App.css` or by extending Tailwind classes.

## Deployment

To deploy the website:

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service (Netlify, Vercel, GitHub Pages, etc.)

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