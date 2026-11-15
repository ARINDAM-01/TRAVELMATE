import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      type = 'text',
      placeholder,
      className = '',
      icon: Icon,
      rightElement,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-white/40 pointer-events-none">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`
              w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30
              focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/40
              transition-all duration-200
              ${Icon ? 'pl-10' : ''}
              ${rightElement ? 'pr-11' : ''}
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center">{rightElement}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40 mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
