import { TagType } from "../generated-zod/schemas/models/Tag.schema";

export { };
declare global {
    /**
     * Represents the full course object returned from the API for user-facing pages.
     * Used by CardCourse, CourseFilter (for count display), and CoursePage.
     */
    interface CourseReviewForUser {
        items: [
            {
                id: number;
                content: string;
                rating: number;
                likes: number;
                dislikes: number;
                createdAt: Date;
                updatedAt: Date;
                user: {
                    id: string;
                    name: string;
                    avatar: string;
                };
                myInteraction: 'LIKE' | 'DISLIKE' | null
            }
        ],
        totalItems: number,
        totalPages: number,
        page: number,
        limit: number,
        sortOrder: "asc",
        search: "",
        averageRating: number,
        reviewCount: number,
        ratingDistribution: {
            "1": number,
            "2": number,
            "3": number,
            "4": number,
            "5": number
        },
        hasReviewed: boolean;
    }
    interface filtersCount {
        rating?: {
            [key: string]: number;
        }
    }

    /**
     * Filter values emitted by CourseFilter and consumed by the API query.
    * Contains filter-specific fields and optional sorting overrides.
     */
    interface CourseReviewFilterValues {
        page?: number;
        limit?: number;
        search?: string;
        rating?: number;
        sortOrder?: 'asc' | 'desc';
    }

    /**
     * Full query params sent to the courses/user API endpoint.
     * Combines pagination (from FindAllQueryParams) with filter values.
     */
    interface CourseUserReviewQueryParams extends CourseReviewFilterValues { }
}