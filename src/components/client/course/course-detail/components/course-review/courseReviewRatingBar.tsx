import { Star } from "lucide-react";

export default function CourseReviewRatingBar({ reviews }: { reviews: CourseReviewForUser }) {
    return (
        <div className="p-6 border border-border rounded-xl bg-muted/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 text-center md:text-left space-y-1">
                <div className="text-5xl font-black text-foreground tracking-tight">{reviews?.averageRating}</div>
                <div className="flex justify-center md:justify-start text-foreground">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(reviews?.averageRating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                        />
                    ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium block">Đánh giá trung bình ({reviews?.reviewCount})</span>
            </div>

            <div className="md:col-span-8 space-y-2">
                {[
                    { stars: 5, count: reviews?.ratingDistribution[5] },
                    { stars: 4, count: reviews?.ratingDistribution[4] },
                    { stars: 3, count: reviews?.ratingDistribution[3] },
                    { stars: 2, count: reviews?.ratingDistribution[2] },
                    { stars: 1, count: reviews?.ratingDistribution[1] },
                ].map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-3 text-xs">
                        <span className="w-12 text-muted-foreground font-medium">{bar.stars} sao</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground" style={{ width: `${bar.count}` }}></div>
                        </div>
                        <span className="w-9 overflow-hidden text-right text-muted-foreground ">({bar.count})</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
