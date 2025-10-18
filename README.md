# Sports Ranking Platform 🏆⚽🏀

A comprehensive, enterprise-grade sports management and ranking system built with Java 21, Spring Boot 3.4, and MongoDB Atlas.

## 🌟 Features

### Core Features
- **User Management**
  - Multi-role authentication (Admin, Organizer, Player, Coach, Referee, Viewer, Moderator, Venue Manager)
  - JWT-based authentication & authorization
  - User profiles with achievements and badges
  - Social media integration

- **AI-Powered Chatbot** 🤖
  - Groq API integration with Llama 3.3 70B model
  - Real-time user assistance and guidance
  - Platform feature explanations
  - 24/7 availability

- **Event & Tournament Management**
  - Create and manage sports events
  - Multiple sport types support (20+ sports)
  - Event registration system
  - Live event tracking
  - Tournament brackets and schedules

- **Real-time Match Management**
  - Live score updates
  - Match status tracking
  - Live streaming integration
  - Match statistics and summaries
  - WebSocket support for real-time updates

- **Ranking System**
  - Advanced ELO-based rating algorithm
  - Multiple ranking levels (Global, National, State, City)
  - Separate rankings for players and teams
  - Historical ranking tracking
  - Automated daily ranking updates

- **Team Management**
  - Team creation and management
  - Team rosters and member management
  - Team statistics and performance tracking
  - Team verification system

- **Player Profiles**
  - Sport-specific player profiles
  - Performance statistics
  - Achievement tracking
  - Rating and ranking history

- **News & Updates**
  - Sports news articles
  - Featured content
  - Category-based browsing
  - Search functionality
  - View count tracking

- **Venue Management**
  - Venue registration
  - Location-based search
  - Capacity management
  - Availability scheduling
  - Venue verification

- **Notification System**
  - Real-time notifications
  - Event updates
  - Match reminders
  - Ranking changes
  - Achievement unlocks

- **Comments & Engagement**
  - Comment on events, matches, and news
  - Reply system
  - Like/upvote functionality
  - Moderation tools

### Technical Features
- RESTful API with OpenAPI documentation
- JWT authentication
- Role-based access control
- WebSocket for real-time updates
- Caching with Caffeine
- Database indexing for performance
- Scheduled tasks for automated processes
- Email notifications
- File upload support

## 🛠️ Technology Stack

- **Java**: 21
- **Spring Boot**: 3.4.0
- **Database**: MongoDB Atlas
- **Security**: Spring Security + JWT
- **ORM**: Spring Data MongoDB
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Caching**: Caffeine
- **WebSocket**: Spring WebSocket
- **Build Tool**: Maven
- **Validation**: Jakarta Validation

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.9+
- MongoDB Atlas account (or local MongoDB)
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PBL
```

### 2. Configure Backend (Spring Boot)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster and get your connection string
3. Update `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/sports_ranking
server.port=8080
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

### 3. Configure Frontend (React)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Copy environment template:
```bash
cp .env.example .env
```

3. Update `frontend/.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080/ws
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

**Get Groq API Key**: Sign up at https://console.groq.com/ (Free tier available)

4. Install dependencies:
```bash
npm install
```

### 4. Build & Run Backend
```bash
# Navigate to project root
cd /home/kailas/Documents/Projects/Java/PBL

# Build
mvn clean package

# Run
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

**Default Admin Credentials:**
- Email: `admin@sports.com`
- Password: `admin123`

### 5. Run Frontend

In a new terminal:
```bash
cd frontend

# Development mode
npm start

# Production build
npm run build
```

Frontend will start on `http://localhost:3000`

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html

## 📊 Database Schema

The application creates the following main tables:
- `users` - User accounts
- `player_profiles` - Sport-specific player profiles
- `teams` - Sports teams
- `events` - Tournaments and events
- `matches` - Individual matches
- `venues` - Sports venues
- `rankings` - Historical rankings
- `news_articles` - News and updates
- `notifications` - User notifications
- `comments` - User comments
- `achievements` - Badges and achievements
- `user_achievements` - User earned achievements

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event (Organizer/Admin)
- `GET /api/events/{id}` - Get event details
- `PUT /api/events/{id}` - Update event
- `POST /api/events/{id}/register` - Register for event
- `GET /api/events/live` - Get live events
- `GET /api/events/upcoming` - Get upcoming events

### Matches
- `GET /api/matches` - List matches
- `POST /api/matches` - Create match
- `GET /api/matches/live` - Get live matches
- `POST /api/matches/{id}/start` - Start match
- `PATCH /api/matches/{id}/score` - Update score
- `POST /api/matches/{id}/complete` - Complete match

### Rankings
- `GET /api/rankings/{sportType}/{rankingType}` - Get rankings
- `GET /api/rankings/player/{id}/history` - Player ranking history
- `GET /api/rankings/team/{id}/history` - Team ranking history

### News
- `GET /api/news` - List articles
- `GET /api/news/latest` - Latest articles
- `GET /api/news/featured` - Featured articles
- `POST /api/news` - Create article (Moderator/Admin)
- `POST /api/news/{id}/publish` - Publish article

## 🔐 User Roles

1. **ADMIN** - Full system access
2. **ORGANIZER** - Can create and manage events
3. **PLAYER** - Can participate in events
4. **COACH** - Can manage teams
5. **REFEREE** - Can manage match scores
6. **VIEWER** - Can view content
7. **MODERATOR** - Can manage news and content
8. **VENUE_MANAGER** - Can manage venues

## 🎯 Supported Sports

The platform supports 20+ sports including:
- Football, Basketball, Cricket, Tennis
- Badminton, Volleyball, Table Tennis
- Chess, Hockey, Baseball, Rugby, Golf
- Swimming, Athletics, Boxing
- Martial Arts, eSports, Kabaddi
- Wrestling, Cycling, and more

## 🔄 Real-time Features

The application uses WebSocket for real-time updates:
- Live match scores
- Event status changes
- Notifications
- Live viewer counts

Connect to WebSocket at: `ws://localhost:8080/ws`

## 📈 Ranking Algorithm

The platform uses an ELO-based rating system:
- Initial rating: 1000
- K-factor: 32
- Updates after each match
- Separate rankings for different levels
- Daily automated recalculation

## 🗓️ Scheduled Tasks

- **Daily at 2 AM**: Recalculate all rankings
- Automatic notification cleanup
- Cache invalidation

## 🛡️ Security

- JWT token-based authentication
- Password encryption with BCrypt
- Role-based access control (RBAC)
- CORS configuration
- SQL injection prevention
- XSS protection

## 📧 Email Configuration

To enable email notifications, configure SMTP in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## 🎨 Frontend Integration

The API is designed to work with any frontend framework:
- React
- Angular
- Vue.js
- Mobile apps (iOS/Android)

CORS is configured to allow requests from:
- `http://localhost:3000` (React default)
- `http://localhost:4200` (Angular default)

## 📝 Environment Variables

Configure the following in your `.env` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=sports_platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080

# File Upload Configuration
FILE_UPLOAD_DIR=uploads
FILE_MAX_SIZE=10MB

# Email Configuration (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
```

## 🧪 Testing

Run tests:
```bash
mvn test
```

## 📦 Deployment

### Build Production JAR
```bash
mvn clean package -DskipTests
```

### Run Production Build
```bash
java -jar target/sports-ranking-platform-1.0.0.jar
```

### Docker Deployment
```dockerfile
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY target/*.jar app.jar
COPY .env .env
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 👥 Support

For support, email support@sportsplatform.com or create an issue in the repository.

## 🚧 Future Enhancements

- [ ] Mobile app (iOS/Android)
- [ ] Video streaming integration
- [ ] AI-powered match predictions
- [ ] Social features (following, feeds)
- [ ] Payment integration for event fees
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Integration with sports APIs
- [ ] Advanced statistics and visualizations

## 🎉 Acknowledgments

Built with ❤️ using Spring Boot and modern Java features.

---

**Happy Coding! 🚀**
