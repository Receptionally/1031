import React from 'react';

interface FormActionsProps {
  onClose: () => void;
  loading: boolean;
  disabled: boolean;
}

export function FormActions({ onClose, loading, disabled }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
      >
        {loading ? 'Setting up...' : 'Set Up Payment'}
      </button>
    </div>
  );
}