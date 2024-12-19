import React, { useState } from 'react';
import { Header } from '../components/Header';
import { AdminStats } from '../components/Admin/AdminStats';
import { SellersList } from '../components/Admin/SellersList';
import { SellerUpdates } from '../components/Admin/SellerUpdates';
import { RecentSearches } from '../components/Admin/RecentSearches';
import { AdminFilters } from '../components/Admin/AdminFilters';
import { AdminSearch } from '../components/Admin/AdminSearch';
import { StateRulesList } from '../components/Admin/StateRules/StateRulesList';
import { StripeAccountsList } from '../components/Admin/StripeAccounts/StripeAccountsList';
import { OrdersList } from '../components/Admin/Orders/OrdersList';
import { CityGenerator } from '../components/Admin/CityGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

export function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <AdminSearch onSearch={setSearchQuery} />
          </div>

          <Tabs defaultValue="sellers" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sellers">Main</TabsTrigger>
              <TabsTrigger value="stripe">Stripe Accounts</TabsTrigger>
              <TabsTrigger value="state-rules">State Rules</TabsTrigger>
              <TabsTrigger value="city-pages">City Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="sellers">
              <div className="space-y-8">
                <AdminStats />
                <RecentSearches />
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Pending Updates
                  </h2>
                  <SellerUpdates />
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Orders
                  </h2>
                  <OrdersList />
                </div>
                <div>
                  <AdminFilters 
                    currentFilter={statusFilter} 
                    onFilterChange={setStatusFilter} 
                  />
                  <div className="bg-white shadow rounded-lg p-6">
                    <SellersList 
                      statusFilter={statusFilter}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stripe">
              <StripeAccountsList />
            </TabsContent>

            <TabsContent value="state-rules">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  State Transportation Rules
                </h2>
                <StateRulesList />
              </div>
            </TabsContent>

            <TabsContent value="city-pages">
              <CityGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}