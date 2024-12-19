import React from 'react';

export function LoadingState() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}