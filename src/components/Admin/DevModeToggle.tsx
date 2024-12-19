import React from 'react';
import { Terminal } from 'lucide-react';
import { useAppSettings } from '../../hooks/useAppSettings';

export function DevModeToggle() {
  const { settings, loading, error, updateDevMode } = useAppSettings();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
    );
  }

  if (error || !settings) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700 text-sm">Failed to load dev mode settings</p>
      </div>
    );
  }

  const handleToggle = async () => {
    try {
      await updateDevMode(!settings.dev_mode);
    } catch (err) {
      console.error('Failed to toggle dev mode:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Terminal className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Development Mode</h3>
            <p className="text-sm text-gray-500">
              Enable to bypass address search and use test data
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${settings.dev_mode ? 'bg-blue-600' : 'bg-gray-200'}
          `}
          aria-pressed={settings.dev_mode}
        >
          <span className="sr-only">Toggle dev mode</span>
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${settings.dev_mode ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  );
}