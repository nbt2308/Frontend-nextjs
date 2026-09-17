import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    interactive?: boolean;
    hoverRating?: number;
    onHover?: (rating: number) => void;
    onClick?: (rating: number) => void;
    className?: string;
    starClassName?: string;
}

export function StarRating({
    rating,
    maxStars = 5,
    interactive = false,
    hoverRating = 0,
    onHover,
    onClick,
    className = "flex text-foreground",
    starClassName = "w-4 h-4",
}: StarRatingProps) {
    return (
        <div className={className}>
            {Array.from({ length: maxStars }).map((_, i) => (
                <Star
                    key={i}
                    className={`${starClassName} ${interactive ? 'cursor-pointer transition-colors' : ''} ${
                        i < (interactive ? (hoverRating || rating) : Math.round(rating))
                            ? 'fill-yellow-400 text-yellow-400'
                            : interactive ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-300'
                    }`}
                    onMouseEnter={() => interactive && onHover && onHover(i + 1)}
                    onMouseLeave={() => interactive && onHover && onHover(0)}
                    onClick={() => interactive && onClick && onClick(i + 1)}
                />
            ))}
        </div>
    );
}
