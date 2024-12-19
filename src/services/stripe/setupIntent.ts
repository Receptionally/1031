import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

export async function createSetupIntent(sellerId: string): Promise<string> {
  try {
    // First check if seller exists and needs setup
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', sellerId)
      .maybeSingle();

    if (sellerError) throw sellerError;
    if (!seller) throw new Error('Seller not found');

    // Check if seller already has an active setup intent
    if (seller.setup_intent_status === 'requires_confirmation' || 
        seller.setup_intent_status === 'succeeded') {
      throw new Error('Payment setup already in progress');
    }

    // Create setup intent with Stripe
    const response = await fetch('/.netlify/functions/create-seller-setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create setup intent');
    }

    const { clientSecret } = await response.json();

    // Update seller's setup intent status
    const { error: updateError } = await supabase
      .from('sellers')
      .upsert({
        id: sellerId,
        setup_intent_status: 'requires_payment_method',
        setup_intent_id: clientSecret.split('_secret_')[0]
      }, { onConflict: 'id' });

    if (updateError) {
      logger.error('Error updating seller setup status:', updateError);
      throw updateError;
    }

    return clientSecret;
  } catch (err) {
    logger.error('Error creating setup intent:', err);
    throw err;
  }
}