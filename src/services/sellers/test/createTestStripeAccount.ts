import { supabase } from '../../../config/supabase';
import { logger } from '../../utils/logger';
import type { Seller } from '../../../types/seller';

const TEST_STRIPE_DATA = {
  stripe_account_id: 'acct_test123',
  access_token: 'sk_test_123',
} as const;

export async function createTestStripeAccount(seller: Seller) {
  try {
    // Check if seller already has a Stripe account
    const { data: existingAccount } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('seller_id', seller.id)
      .single();

    if (existingAccount) {
      logger.info('Test Stripe account already exists:', {
        sellerId: seller.id,
        stripeAccountId: existingAccount.stripe_account_id
      });
      return existingAccount;
    }

    // Create test Stripe account
    const { data: account, error: accountError } = await supabase
      .from('connected_accounts')
      .insert([{
        seller_id: seller.id,
        ...TEST_STRIPE_DATA
      }])
      .select()
      .single();

    if (accountError || !account) {
      logger.error('Failed to create test Stripe account:', accountError);
      throw new Error('Failed to create test Stripe account');
    }

    logger.info('Test Stripe account created:', {
      sellerId: seller.id,
      stripeAccountId: account.stripe_account_id
    });

    return account;
  } catch (err) {
    logger.error('Error in createTestStripeAccount:', err);
    throw new Error('Failed to create test Stripe account');
  }
}