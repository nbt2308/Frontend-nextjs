import { IUpdateCourseReview } from "@/schemas/courseReview.schema";
import axiosClient from "./axiosClient";


export const CourseReviewService = {

    getReviews: async (slug: string, queryParams: CourseUserReviewQueryParams) => {
        try {
            const response = await axiosClient.get(`/courses/${slug}/reviews`, {
                params: queryParams,
                paramsSerializer: { indexes: null },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    updateReview: async (slug:string,reviewId:number, data: IUpdateCourseReview) => {
        try {
            const response = await axiosClient.patch(`/courses/${slug}/reviews/${reviewId}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    deleteReview: async (slug:string, reviewId:string) => {
        try {
            const response = await axiosClient.delete(`/courses/${slug}/reviews/${reviewId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    createReview: async (slug:string, data: IUpdateCourseReview) => {
        try {
            const response = await axiosClient.post(`/courses/${slug}/reviews`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
}