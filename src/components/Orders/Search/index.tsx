import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface OrderSearchProps {
  onSearch: (query: string) => void;
}

export function OrderSearch({ onSearch }: OrderSearchProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search orders..."
        onChange={(e) => onSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-base sm:text-sm"
      />
    </div>
  );
}