import React from 'react';

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export function Step({ title, children }: StepProps) {
  return <div data-title={title}>{children}</div>;
}

export function Steps({ children }: { children: React.ReactNode }) {
  const steps = React.Children.toArray(children).filter(
    (c): c is React.ReactElement<StepProps> =>
      React.isValidElement(c) && (c.props as StepProps).title !== undefined
  );

  return (
    <div className="not-prose my-6">
      {steps.map((step, i) => {
        const { title, children: content } = step.props as StepProps;
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex gap-4">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-mono text-[11px] font-[500] shadow-card-1">
                {i + 1}
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-[#ebebeb] dark:bg-[#252525] mt-1" />
              )}
            </div>
            {/* Content */}
            <div className={`pb-7 min-w-0 flex-1 ${isLast ? 'pb-0' : ''}`}>
              <p className="text-[14px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white mb-1 leading-6">
                {title}
              </p>
              <div className="text-[14px] text-[#4d4d4d] dark:text-[#a1a1a1] leading-6">
                {content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
