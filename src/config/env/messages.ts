export const ENV_MESSAGES = {
  VALIDATION: {
    SUCCESS: '✓ Environment variables validated successfully',
    FAILURE: '❌ Invalid environment variables',
  },
  ERRORS: {
    MISSING_REQUIRED: 'Required environment variables are missing or invalid',
    CHECK_CONSOLE: 'Check the console for details',
  },
  DEV_HELP: {
    HEADER: 'Environment variables validation failed. Please check your .env file.',
    REQUIRED: 'Required variables:',
    OPTIONAL: 'Optional variables:',
  },
} as const;