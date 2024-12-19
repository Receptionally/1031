import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AdminSearchProps {
  onSearch: (query: string) => void;
}

export function AdminSearch({ onSearch }: AdminSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 md:mt-0">
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Search sellers..."
        />
      </div>
    </form>
  );
}