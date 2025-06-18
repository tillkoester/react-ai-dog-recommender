import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  className
}) => {
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Progress bar */}
      <div className="progress-bar mb-4">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isAccessible = step <= Math.max(currentStep, ...completedSteps);

          return (
            <div
              key={step}
              className={cn(
                'flex flex-col items-center space-y-2',
                !isAccessible && 'opacity-50'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  isCompleted
                    ? 'bg-green-100 text-green-800'
                    : isCurrent
                    ? 'bg-primary-100 text-primary-800 ring-2 ring-primary-200'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium text-center',
                  isCurrent
                    ? 'text-primary-600'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-500'
                )}
              >
                {step === 1 && 'Personal Foundation'}
                {step === 2 && 'Market Research'}
                {step === 3 && 'Final Results'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};