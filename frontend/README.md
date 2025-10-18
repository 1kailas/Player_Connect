# Sports Ranking Platform - React Frontend

A modern, responsive React frontend for the Sports Ranking Platform.

## Features

- 🔐 User Authentication (Login/Register)
- 🏆 Event Management
- ⚽ Live Match Tracking
- 📊 Rankings & Leaderboards
- 👥 Team Management
- 📰 News & Updates
- 🔔 Real-time Notifications
- 📱 Fully Responsive Design

## Tech Stack

- **React 18** with Hooks
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **WebSocket** for real-time updates

## Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8080

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will open at http://localhost:3000

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Events/
│   │   ├── Matches/
│   │   ├── Rankings/
│   │   ├── Teams/
│   │   ├── News/
│   │   └── Layout/
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── services/
│   │   └── api.js
│   ├── pages/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080/ws
```

## Features Detail

### Authentication
- Login with username/email
- User registration
- JWT token management
- Protected routes

### Events
- Browse all events
- Filter by sport type
- Register for events
- View event details
- Live events tracking

### Matches
- Live match scores
- Upcoming matches
- Match history
- Real-time updates via WebSocket

### Rankings
- Global rankings
- Sport-specific rankings
- Player/Team rankings
- Ranking history

### Teams
- Create and manage teams
- Team profiles
- Member management
- Team statistics

### News
- Latest news articles
- Featured articles
- Category filtering
- Article details

## API Integration

All API calls go through the `services/api.js` file which handles:
- Authentication headers
- Error handling
- Request/Response interceptors
- Token refresh

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
