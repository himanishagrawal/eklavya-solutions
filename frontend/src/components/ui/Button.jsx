import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-ink-muted font-medium hover:text-ink hover:bg-surface transition-colors duration-200',
};

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  icon: Icon,
  className = '',
  type = 'button',
  as: Component = 'button',
  ...rest
}) {
  // PHASE 2: polymorphic support so Button can render as <Link> (or
  // any component) when it needs to navigate, e.g. <Button as={Link}
  // to="/app/onboarding">. Plain <button> usage (the vast majority)
  // is completely unchanged.
  const isNativeButton = Component === 'button';

  return (
    <Component
      {...(isNativeButton ? { type } : {})}
      className={`${VARIANTS[variant]} ${className}`}
      disabled={isNativeButton ? isLoading || rest.disabled : undefined}
      aria-disabled={!isNativeButton && (isLoading || rest.disabled) ? true : undefined}
      {...rest}
    >
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : Icon ? <Icon size={18} /> : null}
      {children}
    </Component>
  );
}
