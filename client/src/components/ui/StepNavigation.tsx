import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StepNavigationProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  disabled?: boolean;
  className?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
  disabled = false,
  className
}) => {
  const canGoPrevious = currentStep > 1;
  const canGoNext = completedSteps.includes(currentStep) && currentStep < 3;

  const handlePrevious = () => {
    if (canGoPrevious && !disabled) {
      onStepClick(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && !disabled) {
      onStepClick(currentStep + 1);
    }
  };

  return (
    <div className={cn('flex justify-between items-center', className)}>
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={!canGoPrevious || disabled}
        className={cn(
          'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          canGoPrevious && !disabled
            ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500'
            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      {/* Step indicators (clickable) */}
      <div className="hidden sm:flex space-x-2">
        {[1, 2, 3].map((step) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isAccessible = step <= Math.max(currentStep, ...completedSteps);

          return (
            <button
              key={step}
              onClick={() => isAccessible && !disabled && onStepClick(step)}
              disabled={!isAccessible || disabled}
              className={cn(
                'w-8 h-8 rounded-full text-xs font-medium transition-colors',
                isCurrent
                  ? 'bg-primary-600 text-white'
                  : isCompleted
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : isAccessible
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {step}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={!canGoNext || disabled}
        className={cn(
          'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          canGoNext && !disabled
            ? 'text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
        )}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};