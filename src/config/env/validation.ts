import { envSchema } from './schema';
import { logger } from '../../services/utils/logger';

export function validateEnv(env: Record<string, any>) {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.format();
    logger.error('❌ Invalid environment variables:', errors);
    return { success: false, error: errors };
  }

  logger.info('✓ Environment variables validated successfully');
  return { success: true, data: result.data };
}