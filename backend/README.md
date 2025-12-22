# SolveHub Backend API

A robust Node.js + Express.js REST API for the SolveHub community platform.

## 🚀 Features

- **RESTful API** - Clean and intuitive API design
- **MongoDB + Prisma** - Type-safe database access
- **JWT Authentication** - Secure user authentication
- **OAuth Support** - Google, Microsoft, GitHub login
- **Input Validation** - Express-validator for request validation
- **Error Handling** - Centralized error handling with custom error classes
- **Security** - Helmet.js for security headers
- **Compression** - Response compression for better performance
- **Logging** - Custom logger with colored output
- **CORS** - Configured for cross-origin requests

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── index.js      # Centralized config
│   ├── controllers/      # Route controllers
│   │   ├── auth.controller.js
│   │   ├── question.controller.js
│   │   ├── answer.controller.js
│   │   ├── user.controller.js
│   │   ├── tag.controller.js
│   │   ├── vote.controller.js
│   │   ├── comment.controller.js
│   │   └── settings.controller.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── validate.js   # Validation middleware
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   ├── oauth.routes.js
│   │   ├── question.routes.js
│   │   ├── answer.routes.js
│   │   ├── user.routes.js
│   │   ├── tag.routes.js
│   │   ├── vote.routes.js
│   │   ├── comment.routes.js
│   │   ├── notification.routes.js
│   │   └── settings.routes.js
│   ├── services/         # Business logic
│   │   └── notification.service.js
│   ├── utils/            # Utility functions
│   │   ├── ApiError.js   # Custom error class
│   │   ├── ApiResponse.js # Standardized responses
│   │   ├── asyncHandler.js
│   │   └── logger.js     # Custom logger
│   ├── lib/              # External libraries
│   │   └── prisma.js     # Prisma client
│   └── server.js         # Express app setup
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Database seeding
├── .env                  # Environment variables
├── .env.example          # Example environment variables
└── package.json

```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="your-mongodb-connection-string"
   JWT_SECRET="your-secret-key"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed the database (optional):**
   ```bash
   npm run prisma:seed
   ```

## 🚀 Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

### Test the API:
```bash
npm test
```

The server will start on `http://localhost:3001`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/oauth/google` - Google OAuth
- `POST /api/auth/oauth/microsoft` - Microsoft OAuth
- `POST /api/auth/oauth/github` - GitHub OAuth

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/stats` - Get user statistics
- `PUT /api/users/:id` - Update user (auth required)
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/:id/saved` - Get saved questions (auth required)

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/trending` - Get trending questions
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create question (auth required)
- `PUT /api/questions/:id` - Update question (auth required)
- `DELETE /api/questions/:id` - Delete question (auth required)
- `POST /api/questions/:id/save` - Save question (auth required)
- `DELETE /api/questions/:id/save` - Unsave question (auth required)

### Answers
- `GET /api/answers/question/:questionId` - Get answers for question
- `POST /api/answers` - Create answer (auth required)
- `PUT /api/answers/:id` - Update answer (auth required)
- `DELETE /api/answers/:id` - Delete answer (auth required)
- `POST /api/answers/:id/accept` - Accept answer (auth required)

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags
- `GET /api/tags/:id/questions` - Get questions by tag

### Votes
- `POST /api/votes` - Vote on question/answer (auth required)

### Comments
- `POST /api/comments` - Create comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

### Notifications
- `GET /api/notifications` - Get user notifications (auth required)
- `PUT /api/notifications/:id/read` - Mark notification as read (auth required)

### Settings
- `GET /api/settings` - Get user settings (auth required)
- `PUT /api/settings` - Update user settings (auth required)

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": []
}
```

## 🧪 Testing

Test the API using the provided test script:

```bash
node test-api.js
```

Or use tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment (development/production) | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:8080 |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth client ID | Optional |
| `MICROSOFT_CLIENT_SECRET` | Microsoft OAuth client secret | Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Optional |

## 🛡️ Security Features

- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Configured to allow only specific origins
- **JWT** - Secure token-based authentication
- **Input Validation** - All inputs are validated
- **Error Handling** - Sensitive information is not exposed in production
- **Rate Limiting** - (Can be added with express-rate-limit)

## 📊 Database Schema

The application uses MongoDB with Prisma ORM. Key models:

- **User** - User accounts and profiles
- **Question** - Community questions
- **Answer** - Answers to questions
- **Tag** - Question tags/categories
- **Vote** - Upvotes/downvotes
- **Comment** - Comments on questions/answers
- **Badge** - User achievements
- **SavedQuestion** - Bookmarked questions

## 🚀 Deployment

### Vercel (Serverless)
The app is configured for Vercel deployment. The `vercel.json` file is already set up.

### Traditional Hosting
For traditional hosting (VPS, AWS EC2, etc.):

1. Set `NODE_ENV=production`
2. Run `npm start`
3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name solvehub-api
   ```

## 📈 Performance Tips

- Use MongoDB indexes for frequently queried fields
- Enable compression (already configured)
- Use caching for frequently accessed data (Redis recommended)
- Implement rate limiting for public endpoints
- Use CDN for static assets

## 🐛 Debugging

Enable debug logs by setting:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.
