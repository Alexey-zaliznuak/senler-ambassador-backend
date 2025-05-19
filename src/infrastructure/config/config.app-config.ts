import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

config();

export enum NodeEnv {
  local = 'local',
  development = 'development',
  production = 'production',
}

export const AppConfig = {
  NODE_ENV: process.env.NODE_ENV || NodeEnv.local,

  PORT: parseInt(process.env.PORT) || 3000,

  DATABASE_URL: process.env.DEV_SERVER_URL,

  CACHE_DATABASE_URL: process.env.CACHE_DATABASE_URL,
  CACHE_DEFAULT_TTL: parseInt(process.env.CACHE_DEFAULT_TTL) || 60,
  CACHE_SPECIFIC_TTL: {},

  CACHE_NULL_RESULT_TTL: parseInt(process.env.CACHE_NULL_RESULT_TTL) || 5,
};

export type AppConfigType = typeof AppConfig;
