/**
 * StockSense AI - Server-Side Environment Configuration
 * 
 * Centralized loader for Node.js / Express backend environment variables
 */

import dotenv from 'dotenv';

// Load variables from .env file into process.env
dotenv.config();

export const config = {
  /**
   * JWT Secret key used for signing and verifying JSON Web Tokens
   */
  JWT_SECRET: process.env.JWT_SECRET || 'stocksense_super_secret_jwt_key_2026_xai_prod',

  /**
   * Python FastAPI Machine Learning / TreeSHAP service URL
   */
  FASTAPI_BACKEND_URL: process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000',

  /**
   * MongoDB Atlas connection string
   */
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stockSenseAI',

  /**
   * Express Server Port
   */
  PORT: parseInt(process.env.PORT || '5000', 10),

  /**
   * Current Node Environment
   */
  NODE_ENV: process.env.NODE_ENV || 'development',

  /**
   * Token Expiration Duration
   */
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

// Security check in production
if (config.NODE_ENV === 'production' && config.JWT_SECRET === 'stocksense_super_secret_jwt_key_2026_xai_prod') {
  console.warn('⚠️ [SECURITY WARNING]: Running in production with default JWT_SECRET. Please set a unique JWT_SECRET in your environment.');
}

export default config;
