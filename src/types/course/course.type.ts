import { TagType } from "../generated-zod/schemas/models/Tag.schema";

export { };
declare global {
    /**
     * Represents the full course object returned from the API for user-facing pages.
     * Used by CardCourse, CourseFilter (for count display), and CoursePage.
     */
    interface CourseForUser {
        id: string;
        title: string;
        slug: string;
        thumbnail: string;
        courseType: string;
        level: string;
        price: number;
        discount: number;
        studentCount: number;
        reviewCount: number;
        averageRating: number;
        instructor: {
            name: string;
            avatar: string;
        };
        tags: TagType[];
    }
    interface filtersCount {
        level?: {
            [key: string]: number;
        };
        courseType?: {
            [key: string]: number;
        };
        rating?: {
            [key: string]: number;
        }
    }

    /**
     * Filter values emitted by CourseFilter and consumed by the API query.
    * Contains filter-specific fields and optional sorting overrides.
     */
    interface CourseFilterValues {
        search?: string;
        level?: string[];
        courseType?: string[];
        tag?: number[];
        rating?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }

    /**
     * Full query params sent to the courses/user API endpoint.
     * Combines pagination (from FindAllQueryParams) with filter values.
     */
    interface CourseUserQueryParams extends FindAllQueryParams, CourseFilterValues { }
}