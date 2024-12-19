import React from 'react';

interface AdminFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function AdminFilters({ currentFilter, onFilterChange }: AdminFiltersProps) {
  const filters = [
    { value: 'all', label: 'All Sellers' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${currentFilter === filter.value
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            {filter.label}
          </button>
        ))}
      </nav>
    </div>
  );
}