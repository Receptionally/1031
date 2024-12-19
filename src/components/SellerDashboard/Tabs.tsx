import React from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`
            whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'dashboard'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          <div className="flex items-center">
            <LayoutDashboard className="h-5 w-5 mr-2" />
            Dashboard
          </div>
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className={`
            whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'settings'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Settings
          </div>
        </button>
      </nav>
    </div>
  );
}