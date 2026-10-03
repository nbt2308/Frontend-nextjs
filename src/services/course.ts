import { ConflictAccountError, CustomAuthError, InActiveAccountError, InvalidParameters } from "@/types/errors";
import axiosClient from '../lib/axiosClient';
import { IBulkDelete, IBulkStatus, IChangeStatus, ICreateCourse, IUpdateCourse } from "@/schemas/course.schema";
import axiosServer from "@/lib/axiosServer";



export const CourseService = {

    getModerationKpis: async () => {
        try {
            const response = await axiosClient.get(`/courses/moderation/kpis`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    getModerationList: async (params: { page: number; limit: number; status?: string }) => {
        try {
            const response = await axiosClient.get(`/courses/moderation/list`, { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    getModerationReview: async (id: string) => {
        try {
            const response = await axiosClient.get(`/courses/moderation/${id}/review`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    getAllCoursesWithPagination: async (queryParams: FindAllQueryParams) => {
        try {
            const response = await axiosClient.get(`/courses`, { params: queryParams });
            return response.data.courses;

        } catch (error: any) {

            throw new Error(error.message)
        }
    },

    getAllCourses: async () => {
        try {
            const response = await axiosClient.get(`/courses/all`,);
            return response.data;

        } catch (error: any) {

            throw new Error(error.message)
        }
    },
    getCourseBySlug: async (slug: string) => {
        try {
            const response = await axiosClient.get(`/courses/${slug}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    getCourseBySlugServer: async (slug: string) => {
        const res = await axiosServer.get(`/courses/${slug}`);
        return res.data;
    },
    getAllCoursesForUser: async (queryParams: CourseUserQueryParams) => {
        try {
            const response = await axiosClient.get(`/courses/courses-for-user`, {
                params: queryParams,
                paramsSerializer: { indexes: null },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    findRelatedCoursesBySlug: async (slug: string) => {
        try {
            const response = await axiosClient.get(`/courses/${slug}/related-courses`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    createCourse: async (courseData: ICreateCourse) => {
        try {
            const response = await axiosClient.post(`/courses`, courseData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    updateCourse: async (id: string, courseData: IUpdateCourse) => {
        try {
            const response = await axiosClient.patch(`/courses/${id}`, courseData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    rejectCourse: async (data: { id: string; reason_rejected: string; sendEmail?: boolean }) => {
        try {
            const response = await axiosClient.post(`/courses/reject`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    submitCourseForReview: async (id: string) => {
        try {
            const response = await axiosClient.post(`/courses/submit`, { id });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    approveCourse: async (id: string) => {
        try {
            const response = await axiosClient.post(`/courses/approve`, { id });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    // bulkUpdateStatus: async (data: IBulkStatus) => {
    //     try {
    //         const response = await axiosClient.post(`/courses/bulk-update-status`, data);
    //         return response.data;
    //     } catch (error: any) {
    //         throw new Error(error.message)
    //     }
    // },
    bulkDeleteCourse: async (data: IBulkDelete) => {
        try {
            const response = await axiosClient.post(`/courses/bulk-delete`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    changeStatus: async (data: IChangeStatus) => {
        try {
            const response = await axiosClient.post(`/courses/change-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    deleteCourse: async (id: string, deletedReason: string) => {
        try {
            const response = await axiosClient.delete(`/courses/soft/${id}`, { data: { deletedReason } });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

}