import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import type { ConnectedAccount } from '../../types/stripe';

export async function saveConnectedAccount(stripeAccountId: string, accessToken: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('Not authenticated');
    }

    logger.info('Saving connected account:', { 
      sellerId: userData.user.id,
      stripeAccountId 
    });

    const { error: insertError } = await supabase
      .from('connected_accounts')
      .insert([{
        seller_id: userData.user.id,
        stripe_account_id: stripeAccountId,
        access_token: accessToken,
        connected_at: new Date().toISOString()
      }]);

    if (insertError) {
      logger.error('Error saving connected account:', insertError);
      throw insertError;
    }

    logger.info('Successfully saved connected account');
    return true;
  } catch (error) {
    logger.error('Error saving connected account:', error);
    throw error;
  }
}
export async function getConnectedAccount(sellerId: string): Promise<ConnectedAccount | null> {
  try {
    // Use proper URL encoding for the UUID
    const encodedSellerId = encodeURIComponent(sellerId);

    // Make request with proper headers
    const { data, error } = await supabase
      .from('connected_accounts')
      .select('stripe_account_id')
      .eq('seller_id', sellerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        logger.info('No connected account found for seller:', { sellerId });
        return null;
      }
      throw error;
    }

    logger.info('Found connected account:', { 
      sellerId,
      stripeAccountId: data.stripe_account_id 
    });

    return data;
  } catch (err) {
    logger.error('Error fetching connected account:', err);
    throw new Error('Failed to fetch connected account');
  }
}

// Alternative fetch implementation if needed
export async function getConnectedAccountWithFetch(sellerId: string): Promise<ConnectedAccount | null> {
  try {
    const response = await fetch(
      `${supabase.supabaseUrl}/rest/v1/connected_accounts?select=stripe_account_id&seller_id=eq.${encodeURIComponent(sellerId)}`,
      {
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      logger.info('No connected account found for seller:', { sellerId });
      return null;
    }

    logger.info('Found connected account:', {
      sellerId,
      stripeAccountId: data[0].stripe_account_id
    });

    return data[0];
  } catch (err) {
    logger.error('Error fetching connected account:', err);
    throw new Error('Failed to fetch connected account');
  }
}