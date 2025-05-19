import * as Joi from 'joi';

import { AppConfig, NodeEnv } from './config.app-config';

export const appConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(NodeEnv.local, NodeEnv.development, NodeEnv.production).required(),
  PORT: Joi.number().default(AppConfig.PORT),

  DATABASE_URL: Joi.string().uri().required(),

  CACHE_DATABASE_URL: Joi.string().uri().required(),
  CACHE_DEFAULT_TTL: Joi.number().required(),
});
