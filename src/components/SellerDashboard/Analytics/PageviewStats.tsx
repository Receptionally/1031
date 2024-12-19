import React from 'react';
import { LineChart, Eye, TrendingUp } from 'lucide-react';
import { usePageviewStats } from '../hooks/usePageviewStats';
import { formatDistanceToNow } from '../../../utils/format';

interface PageviewStatsProps {
  sellerId: string;
}

export function PageviewStats({ sellerId }: PageviewStatsProps) {
  const { stats, loading, error } = usePageviewStats(sellerId);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Page Analytics</h2>
        <LineChart className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.total_views}
              </p>
            </div>
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.unique_visitors}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Last View</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {stats.last_view ? formatDistanceToNow(stats.last_view) : 'Never'}
              </p>
            </div>
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}