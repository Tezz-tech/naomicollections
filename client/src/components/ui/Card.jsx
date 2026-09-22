import clsx from 'clsx';

export default function Card({ children, className, hover = false, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={clsx(
        'rounded-subtle border border-grey-light bg-white shadow-subtle',
        hover && 'transition-all duration-300 ease-luxury hover:-translate-y-1 hover:shadow-lift',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
