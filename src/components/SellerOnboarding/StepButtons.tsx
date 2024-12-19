import React from 'react';

interface StepButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled?: boolean;
  loading?: boolean;
}

export function StepButtons({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
  loading = false,
}: StepButtonsProps) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
      {currentStep > 0 && (
        <button
          type="button"
          onClick={onPrevious}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Previous
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || loading}
        className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </div>
        ) : currentStep === totalSteps - 1 ? (
          'Complete'
        ) : (
          'Next'
        )}
      </button>
    </div>
  );
}