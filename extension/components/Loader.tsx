import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '32px',
  };
  
  const borderMap = {
    sm: '2px',
    md: '3px',
    lg: '4px',
  };
  
  const style = {
    width: sizeMap[size],
    height: sizeMap[size],
    borderWidth: borderMap[size],
  };
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`loader ${className}`} style={style}></div>
    </div>
  );
};

export default Loader;