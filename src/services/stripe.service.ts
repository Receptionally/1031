import { supabase } from '../config/supabase';

export interface ConnectedAccount {
  stripe_account_id: string;
  access_token: string;
  connected_at: string;
  seller_id: string;
}

export async function exchangeStripeCode(code: string): Promise<{ stripe_user_id: string; access_token: string }> {
  try {
    const response = await fetch('/.netlify/functions/stripe-connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to exchange code');
    }

    if (!data.stripe_user_id || !data.access_token) {
      throw new Error('Invalid response from Stripe');
    }

    return {
      stripe_user_id: data.stripe_user_id,
      access_token: data.access_token,
    };
  } catch (error) {
    console.error('Error exchanging code:', error);
    throw error;
  }
}

export async function saveConnectedAccount(stripeAccountId: string, accessToken: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('Not authenticated');
    }

    // First, check if the account already exists
    const { data: existingAccount } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('stripe_account_id', stripeAccountId)
      .single();

    if (existingAccount) {
      // Update existing account
      const { error: updateError } = await supabase
        .from('connected_accounts')
        .update({
          access_token: accessToken,
          connected_at: new Date().toISOString(),
        })
        .eq('stripe_account_id', stripeAccountId);

      if (updateError) throw updateError;
    } else {
      // Insert new account
      const { error: insertError } = await supabase
        .from('connected_accounts')
        .insert([
          {
            seller_id: userData.user.id,
            stripe_account_id: stripeAccountId,
            access_token: accessToken,
            connected_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Error saving connected account:', error);
    throw error;
  }
}