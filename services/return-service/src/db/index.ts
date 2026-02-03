import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import logger from '../middleware/logger.js';

let db: any = null;

export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root123456',
      database: process.env.DB_NAME || 'return_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    db = drizzle(connection, { schema, mode: 'default' });
    logger.info('Database connected successfully');
    return db;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export default getDatabase;
