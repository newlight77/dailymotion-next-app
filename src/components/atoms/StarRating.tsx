import React from 'react';
import { FaStar } from 'react-icons/fa6';

interface StarRatingProps {
  value?: number;
  max?: number;
  size?: number;
  readOnly?: boolean;
  className?: string;
  onChange?: (value: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  max = 5,
  size = 18,
  readOnly = true,
  className,
  onChange,
}) => {
  const rounded = Math.round(value);

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const highlighted = starValue <= rounded;
        const icon = (
          <FaStar
            size={size}
            className={`${highlighted ? 'text-tertiary' : ''} text-primary/30 hover:text-gold transition-colors`}
          />
        );

        if (readOnly) {
          return (
            <span key={starValue} aria-hidden="true">
              {icon}
            </span>
          );
        }

        return (
          <div
            key={starValue}
            aria-label={`rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            onClick={() => onChange?.(starValue)}
            className="hover:scale-120 transition-transform hover:cursor-pointer"
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
