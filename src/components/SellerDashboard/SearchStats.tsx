import React from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { useSearchStats } from './hooks/useSearchStats';
import { formatDistanceToNow } from '../../utils/format';

interface SearchStatsProps {
  sellerId: string;
}

export function SearchStats({ sellerId }: SearchStatsProps) {
  const { stats, loading, error } = useSearchStats(sellerId);

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
        <h2 className="text-lg font-medium text-gray-900">Search Statistics</h2>
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Appearances</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.total_appearances}
              </p>
            </div>
            <Search className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Distance</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.avg_distance ? `${stats.avg_distance.toFixed(1)} mi` : 'N/A'}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Last Appearance</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {stats.last_appearance ? formatDistanceToNow(stats.last_appearance) : 'Never'}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}