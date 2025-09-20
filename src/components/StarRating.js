import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  onRatingChange = () => {}, 
  readonly = false,
  size = 'medium',
  showCount = true,
  totalRatings = 0
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeClasses = {
    small: 'h-4 w-4 sm:h-5 sm:w-5',
    medium: 'h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8',
    large: 'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10'
  };

  const handleStarClick = async (starRating) => {
    if (readonly || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      await onRatingChange(starRating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      // Add error haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starRating) => {
    if (!readonly && !isSubmitting) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly && !isSubmitting) {
      setHoveredRating(0);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div 
        className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 star-rating-mobile" 
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= displayRating;
          const isHovered = starRating <= hoveredRating;
          
          return (
            <button
              key={index}
              className={`
                rating-transition
                ${readonly 
                  ? 'cursor-default' 
                  : isSubmitting 
                    ? 'cursor-wait opacity-50' 
                    : 'cursor-pointer hover:scale-110 active:scale-95 touch-manipulation'
                }
                ${isHovered ? 'text-yellow-400' : isFilled ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-sm
                p-2 sm:p-1 -m-2 sm:-m-1
                min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0
                flex items-center justify-center
              `}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
              disabled={readonly || isSubmitting}
              type="button"
              aria-label={`Rate ${starRating} star${starRating !== 1 ? 's' : ''}`}
            >
              {isFilled ? (
                <StarIconSolid className={`${sizeClasses[size]} drop-shadow-sm`} />
              ) : (
                <StarIcon className={`${sizeClasses[size]}`} />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
          <span className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
            {rating > 0 ? rating.toFixed(1) : '0.0'}
          </span>
          {showCount && (
            <span className="text-muted-foreground text-xs sm:text-sm font-medium px-2 py-1 bg-muted/50 rounded-full">
              {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
            </span>
          )}
        </div>
        
        {hoveredRating > 0 && !readonly && (
          <div className="text-xs sm:text-sm text-muted-foreground animate-fade-in font-medium">
            <span className="hidden sm:inline">Click to rate</span>
            <span className="sm:hidden">Tap to rate</span> {hoveredRating} star{hoveredRating !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default StarRating;