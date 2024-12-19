import React from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';
import { useRecentSearches } from './useRecentSearches';
import { formatDistanceToNow } from '../../../utils/format';

export function RecentSearches() {
  const { searches, loading, error } = useRecentSearches();

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Recent Searches</h2>
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-6">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No searches yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Recent address searches will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{search.address}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDistanceToNow(search.created_at)}</span>
                  {search.search_type === 'autocomplete' && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                      Autocomplete
                    </span>
                  )}
                </div>
                {search.latitude && search.longitude && (
                  <p className="mt-1 text-xs text-gray-500">
                    {search.latitude.toFixed(4)}, {search.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}