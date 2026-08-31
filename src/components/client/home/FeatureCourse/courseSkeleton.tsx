export function CourseSkeleton() {
    return (
        <div className="border border-border/60 bg-card p-4 rounded-lg animate-pulse">
            <div>
                {/* Image Skeleton */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 border border-border/40 bg-muted" />

                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-4 w-16 bg-muted rounded" />
                    ))}
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded" />
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-32 bg-muted rounded" />
            </div>
        </div>
    );
}

export function CourseSkeletonLoader({ course }: { course: number }) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: course }, (_, i) => (
                <CourseSkeleton key={i} />
            ))}
        </div>
    );
}
