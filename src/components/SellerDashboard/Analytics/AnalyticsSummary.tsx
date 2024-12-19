import React from 'react';
import { TrendingUp, Users, Search, Package } from 'lucide-react';
import { useAnalyticsSummary } from '../hooks/useAnalyticsSummary';

interface AnalyticsSummaryProps {
  sellerId: string;
}

export function AnalyticsSummary({ sellerId }: AnalyticsSummaryProps) {
  const { summary, loading, error } = useAnalyticsSummary(sellerId);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <TrendingUp className="h-5 w-5" />
          <p className="text-sm">Unable to load analytics</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Orders',
      value: summary.total_orders,
      subtext: summary.subscription_status === 'none' ? 
        `${Math.max(0, 4 - summary.total_orders)} orders until subscription required` :
        `Subscription ${summary.subscription_status}`,
      icon: Package,
      alert: summary.total_orders >= 3 && summary.subscription_status === 'none'
    },
    {
      name: 'Search Appearances', 
      value: summary.total_appearances,
      subtext: `${summary.appearances_last_7_days} this week`,
      icon: Search
    },
    {
      name: 'Page Views',
      value: summary.total_views,
      subtext: `${summary.views_last_7_days} this week`,
      icon: TrendingUp
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className={`bg-gray-50 p-4 rounded-lg ${
                stat.alert ? 'border-2 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`mt-1 text-xs ${
                    stat.alert ? 'text-yellow-600 font-medium' : 'text-gray-500'
                  }`}>
                    {stat.subtext}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${
                  stat.alert ? 'text-yellow-400' : 'text-gray-400'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}