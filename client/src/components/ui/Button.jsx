import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const variants = {
  primary:
    'bg-black text-white border border-black hover:bg-white hover:text-black disabled:hover:bg-black disabled:hover:text-white',
  secondary:
    'bg-white text-black border border-black hover:bg-black hover:text-white',
  gold: 'bg-gold text-black border border-gold hover:bg-gold-dark hover:border-gold-dark',
  ghost: 'bg-transparent text-black border border-transparent hover:border-black',
  outline: 'bg-transparent text-black border border-grey-light hover:border-black',
  danger: 'bg-status-error text-white border border-status-error hover:opacity-90',
};

const sizes = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-sm',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    className,
    type = 'button',
    as: Tag = 'button',
    ...props
  },
  ref
) {
  const tagProps = Tag === 'button' ? { type, disabled: disabled || loading } : {};

  return (
    <Tag
      ref={ref}
      {...tagProps}
      className={clsx(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sharp font-sans font-medium uppercase tracking-widest2 text-[11px] sm:text-xs',
        'transition-all duration-300 ease-luxury disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Tag>
  );
});

export default Button;
