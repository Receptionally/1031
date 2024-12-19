import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingStepsProps {
  currentStep: number;
  steps: string[];
}

export function OnboardingSteps({ currentStep, steps }: OnboardingStepsProps) {
  return (
    <nav aria-label="Progress" className="mb-8 px-4">
      <ol className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <li key={step} className="relative flex flex-col items-center flex-1">
            <div className="flex items-center justify-center w-full">
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  index < currentStep
                    ? 'bg-orange-600'
                    : index === currentStep
                    ? 'border-2 border-orange-600 bg-white'
                    : 'border-2 border-gray-300 bg-white'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      index === currentStep ? 'bg-orange-600' : 'bg-transparent'
                    }`}
                  />
                )}
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-4 left-0 h-[2px] w-full -z-10 ${
                  index < currentStep ? 'bg-orange-600' : 'bg-gray-300'
                }`}
                style={{
                  left: '50%',
                  width: '100%',
                  transform: 'translateX(0)'
                }}
              />
            )}
            <span className="mt-2 text-xs sm:text-sm font-medium text-gray-500 text-center">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}