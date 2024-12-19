import React from 'react';

interface FormErrorProps {
  error: string | null;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="text-sm text-red-700">{error}</div>
    </div>
  );
}