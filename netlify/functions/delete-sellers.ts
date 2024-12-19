import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../../src/config/env';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(ENV.supabase.url, ENV.supabase.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get all seller IDs
    const { data: sellers, error: sellersError } = await supabase
      .from('sellers')
      .select('id');

    if (sellersError) throw sellersError;
    const sellerIds = sellers?.map(seller => seller.id) || [];

    // Delete connected accounts
    const { error: accountsError } = await supabase
      .from('connected_accounts')
      .delete()
      .in('seller_id', sellerIds);

    if (accountsError) throw accountsError;

    // Delete orders
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .in('seller_id', sellerIds);

    if (ordersError) throw ordersError;

    // Delete sellers
    const { error: sellersDeleteError } = await supabase
      .from('sellers')
      .delete()
      .in('id', sellerIds);

    if (sellersDeleteError) throw sellersDeleteError;

    // Delete auth users
    for (const id of sellerIds) {
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) {
        console.error(`Failed to delete auth user ${id}:`, authError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error deleting sellers:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to delete sellers' 
      }),
    };
  }
};