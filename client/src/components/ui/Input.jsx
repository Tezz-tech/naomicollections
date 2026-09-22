import { forwardRef, useId } from 'react';
import clsx from 'clsx';

const Input = forwardRef(function Input(
  { label, error, hint, icon, className, containerClassName, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'h-11 w-full rounded-sharp border bg-white px-3.5 text-sm text-black placeholder:text-grey/70',
            'transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold',
            icon && 'pl-10',
            error ? 'border-status-error' : 'border-grey-light',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-status-error">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-grey">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
