require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production_min_32_chars',
  cookieSecret: process.env.COOKIE_SECRET || 'dev_cookie_secret',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  openweatherApiKey: process.env.OPENWEATHER_API_KEY,
  unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
};

if (config.isProduction && config.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production');
}

module.exports = config;
