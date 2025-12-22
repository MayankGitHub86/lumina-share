const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  allowedOrigins: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  
  // OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
  microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  
  // Rate limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // limit each IP to 100 requests per windowMs
  
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  if (config.nodeEnv === 'production') {
    process.exit(1);
  }
}

module.exports = config;
