import { IUpdateCourseReview } from "@/schemas/courseReview.schema";
import { CourseReviewService } from "@/services/courseReview";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCourseReviewsForUser(slug: string, params: CourseUserReviewQueryParams = {}) {
    const defaultParams: CourseUserReviewQueryParams = {
        page: 1,
        limit: 12,
        sortOrder: 'desc',
        search: '',
        rating: undefined,
    };

    const queryParams = {
        ...defaultParams,
        ...params,
    };

    return useQuery({
        queryKey: ['course-reviews', queryParams],
        queryFn: async () => {
            const result = await CourseReviewService.getReviews(slug, queryParams);
            return result;
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateCourseReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({slug,reviewId, data}: { slug: string;reviewId:number, data: IUpdateCourseReview }) => {
            return CourseReviewService.updateReview(slug,reviewId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-reviews'] });
            toast.success("Cập nhật đánh giá thành công");
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
}

export function useDeleteCourseReview(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({slug, id}: { slug: string; id: string }) => {
            return CourseReviewService.deleteReview(slug, id);  
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-reviews'] });
            toast.success("Xóa đánh giá thành công");
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
}

export function useCreateCourseReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({slug, data}: { slug: string; data: IUpdateCourseReview }) => {
            return CourseReviewService.createReview(slug, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-reviews'] });
            toast.success("Thêm đánh giá thành công");
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
}