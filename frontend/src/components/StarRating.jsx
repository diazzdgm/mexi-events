import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating, onRate, readonly = false, size = 20, count = 0 }) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (value) => {
        if (!readonly) setHoverRating(value);
    };

    const handleMouseLeave = () => {
        if (!readonly) setHoverRating(0);
    };

    const handleClick = (value) => {
        if (!readonly && onRate) {
            onRate(value);
        }
    };

    const renderStar = (index) => {
        const value = index + 1;
        const currentRating = hoverRating || rating || 0;
        
        // Interaction Logic
        const isInteractive = !readonly;
        const starProps = {
            size,
            className: `transition-all duration-200 ${isInteractive ? 'cursor-pointer' : ''}`,
            onMouseEnter: () => handleMouseEnter(value),
            onClick: () => handleClick(value)
        };

        // Render Logic
        if (currentRating >= value) {
            // Full Star
            return (
                <Star 
                    key={index} 
                    {...starProps}
                    className={`${starProps.className} text-yellow-400 fill-yellow-400 hover:scale-110`}
                />
            );
        } else if (currentRating >= value - 0.5 && readonly) {
            // Half Star (only in readonly mode usually, unless we support half-star input)
            return (
                <div key={index} className="relative inline-block" {...starProps}>
                    <Star 
                        size={size} 
                        className="text-slate-700" 
                    />
                    <StarHalf 
                        size={size} 
                        className="absolute top-0 left-0 text-yellow-400 fill-yellow-400" 
                    />
                </div>
            );
        } else {
            // Empty Star
            return (
                <Star 
                    key={index} 
                    {...starProps}
                    className={`${starProps.className} text-slate-600 hover:text-yellow-200`}
                />
            );
        }
    };

    return (
        <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
            {[...Array(5)].map((_, i) => renderStar(i))}
            {count > 0 && (
                <span className="text-xs text-gray-400 ml-1 font-mono">({count})</span>
            )}
        </div>
    );
}
