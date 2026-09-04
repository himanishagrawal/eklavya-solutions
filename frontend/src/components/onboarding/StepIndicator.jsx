import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// PHASE 2: "Step X of N" progress indicator for the onboarding wizard.
export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{
                    backgroundColor: isComplete || isActive ? '#3AA9FF' : '#182131',
                    borderColor: isComplete || isActive ? '#3AA9FF' : '#22304A',
                  }}
                  transition={{ duration: 0.25 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold text-base"
                >
                  {isComplete ? <Check size={14} className="text-base" /> : (
                    <span className={isActive ? 'text-base' : 'text-ink-faint'}>{stepNum}</span>
                  )}
                </motion.div>
                <span className={`hidden text-xs font-medium sm:block ${isActive ? 'text-ink' : 'text-ink-faint'}`}>
                  {label}
                </span>
              </div>
              {stepNum < steps.length && (
                <div className="mx-2 h-px flex-1 bg-surface-border">
                  <motion.div
                    initial={false}
                    animate={{ width: isComplete ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="h-px bg-accent"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs font-medium uppercase tracking-wide text-ink-faint sm:hidden">
        Step {currentStep} of {steps.length}
      </p>
    </div>
  );
}
