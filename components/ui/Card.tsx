import React from 'react';

export const Card = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow border border-gray-100 p-4 ${className}`}>{children}</div>
);