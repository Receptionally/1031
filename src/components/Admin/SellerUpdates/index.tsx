import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { logger } from '../../../services/utils/logger';

interface SellerUpdate {
  id: string;
  seller_id: string;
  updates: Record<string, any>;
  status: string;
  created_at: string;
  seller_name: string;
  seller_email: string;
}

export function SellerUpdates() {
  const [updates, setUpdates] = useState<SellerUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpdates();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('seller_updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'seller_updates' 
      }, () => {
        fetchUpdates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchUpdates() {
    try {
      const { data, error: fetchError } = await supabase
        .from('seller_updates')
        .select(`
          *,
          sellers (
            name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setUpdates(data.map(update => ({
        ...update,
        seller_name: update.sellers.name,
        seller_email: update.sellers.email
      })));
    } catch (err) {
      logger.error('Error fetching seller updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (updateId: string) => {
    try {
      const { error: approveError } = await supabase
        .rpc('approve_seller_update', { update_id: updateId });

      if (approveError) throw approveError;
      await fetchUpdates();
    } catch (err) {
      logger.error('Error approving update:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve update');
    }
  };

  const handleReject = async (updateId: string) => {
    try {
      const { error: rejectError } = await supabase
        .from('seller_updates')
        .update({ status: 'rejected' })
        .eq('id', updateId);

      if (rejectError) throw rejectError;
      await fetchUpdates();
    } catch (err) {
      logger.error('Error rejecting update:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject update');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Pending Updates</h3>
        <p className="mt-1 text-sm text-gray-500">
          All seller updates have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Pending Seller Updates
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              The following sellers have requested changes to their profiles.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-lg font-medium text-gray-900">
                    {update.seller_name}
                  </h4>
                  <p className="text-sm text-gray-500">{update.seller_email}</p>
                  <p className="text-sm text-gray-500">
                    Requested: {new Date(update.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(update.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(update.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Approve
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Requested Changes:</h5>
                <div className="bg-gray-50 rounded-md p-3">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(update.updates, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}