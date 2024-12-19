import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

const TEST_USER = {
  email: 'test.seller@example.com',
  password: 'test123',
  metadata: {
    role: 'seller',
    name: 'Test Seller',
    businessName: 'Test Firewood Co.',
    businessAddress: '123 Wood St, Portland, OR 97201',
    phone: '(555) 123-4567'
  }
};

export async function createTestUser() {
  try {
    // First check if user exists by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    // If sign in succeeds, user exists
    if (!signInError) {
      logger.info('Test user already exists, signed in successfully');
      return;
    }

    // If user doesn't exist, create them
    const { error: signUpError } = await supabase.auth.signUp({
      email: TEST_USER.email,
      password: TEST_USER.password,
      options: {
        data: TEST_USER.metadata
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    logger.info('✓ Created test user account');

    // Sign in with the new account
    const { error: finalSignInError } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (finalSignInError) {
      throw finalSignInError;
    }

    logger.info('✓ Signed in as test user');
  } catch (err) {
    logger.error('❌ Failed to create/sign in test user:', err);
    throw new Error('Failed to create test user account');
  }
}

export async function signInAsTestUser() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (error) throw error;
    logger.info('✓ Signed in as test user:', data.user?.id);
    return data.user;
  } catch (err) {
    logger.error('❌ Failed to sign in as test user:', err);
    throw err;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    logger.info('✓ Signed out successfully');
  } catch (err) {
    logger.error('❌ Failed to sign out:', err);
    throw err;
  }
}