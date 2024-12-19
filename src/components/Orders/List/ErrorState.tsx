import React from 'react';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="bg-red-50 p-4 rounded-md">
      <p className="text-sm text-red-700">{error}</p>
    </div>
  );
}