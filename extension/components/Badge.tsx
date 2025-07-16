import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClass = 'badge';
  const variantClass = variant !== 'default' ? `badge-${variant}` : '';
  
  const badgeClass = [
    baseClass,
    variantClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
};

export default Badge;