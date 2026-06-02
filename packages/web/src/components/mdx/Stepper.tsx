import React, { createContext, useContext, useState } from 'react';
import { Check } from 'lucide-react';

interface StepperContextValue {
  completed: Set<number>;
  toggle: (index: number) => void;
  total: number;
}

const StepperContext = createContext<StepperContextValue>({
  completed: new Set(),
  toggle: () => {},
  total: 0,
});

interface StepperStepProps {
  title: string;
  children: React.ReactNode;
}

export function StepperStep({ title, children }: StepperStepProps) {
  return <div data-title={title}>{children}</div>;
}

interface StepperProps {
  children: React.ReactNode;
}

export function Stepper({ children }: StepperProps) {
  const steps = React.Children.toArray(children).filter(
    (c): c is React.ReactElement<StepperStepProps> =>
      React.isValidElement(c) && (c.props as StepperStepProps).title !== undefined,
  );

  const [completed, setCompleted] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        // uncheck this step and all following
        for (let i = index; i < steps.length; i++) next.delete(i);
      } else {
        // check this step and all previous
        for (let i = 0; i <= index; i++) next.add(i);
      }
      return next;
    });
  }

  return (
    <StepperContext.Provider value={{ completed, toggle, total: steps.length }}>
      <div className="not-prose my-6">
        {steps.map((step, i) => (
          <StepItem
            key={i}
            index={i}
            title={(step.props as StepperStepProps).title}
            isLast={i === steps.length - 1}
          >
            {(step.props as StepperStepProps).children}
          </StepItem>
        ))}
      </div>
    </StepperContext.Provider>
  );
}

function StepItem({
  index,
  title,
  children,
  isLast,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
  isLast: boolean;
}) {
  const { completed, toggle } = useContext(StepperContext);
  const isDone = completed.has(index);

  return (
    <div className="flex gap-4">
      {/* Indicator column */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => toggle(index)}
          aria-label={isDone ? `Mark step ${index + 1} incomplete` : `Mark step ${index + 1} complete`}
          className={`group flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 ${
            isDone
              ? 'border-[#171717] bg-[#171717] dark:border-white dark:bg-white'
              : 'border-[#d0d0d0] bg-transparent hover:border-[#999] dark:border-[#444] dark:hover:border-[#777]'
          }`}
        >
          {isDone ? (
            <Check className="size-3 text-white dark:text-[#171717]" strokeWidth={3} />
          ) : (
            <span className="font-mono text-[11px] text-[#999] dark:text-[#555]">{index + 1}</span>
          )}
        </button>
        {!isLast && (
          <div
            className={`mt-1 w-0.5 flex-1 rounded-full transition-colors duration-300 ${
              isDone ? 'bg-[#171717] dark:bg-white' : 'bg-[#ebebeb] dark:bg-[#252525]'
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className={`min-w-0 flex-1 pb-7 ${isLast ? 'pb-0' : ''}`}>
        <button
          onClick={() => toggle(index)}
          className="group mb-1 flex w-full items-center gap-2 text-left focus-visible:outline-none"
        >
          <span
            className={`text-[14px] font-semibold leading-6 tracking-[-0.02em] transition-colors ${
              isDone
                ? 'text-[#999] line-through dark:text-[#555]'
                : 'text-[#171717] dark:text-white'
            }`}
          >
            {title}
          </span>
          {!isDone && (
            <span className="text-[11px] text-[#c0c0c0] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#555]">
              Mark complete
            </span>
          )}
        </button>
        <div
          className={`text-[14px] leading-6 transition-colors ${
            isDone ? 'text-[#bbb] dark:text-[#444]' : 'text-[#4d4d4d] dark:text-[#a1a1a1]'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
