import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  max = 5, 
  size = 16,
  className = "" 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < Math.round(rating) 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};