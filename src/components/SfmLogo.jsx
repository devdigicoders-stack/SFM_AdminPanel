import React from 'react';
import logoImg from '../assets/logo.jpg';

export default function SfmLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'h-9',
    sm: 'h-11',
    md: 'h-16',
    lg: 'h-24'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src={logoImg}
        alt="Spartans Facility Management"
        className={`${selectedSize} w-auto max-w-full object-contain mix-blend-multiply`}
      />
    </div>
  );
}
