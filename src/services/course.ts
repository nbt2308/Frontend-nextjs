import { ConflictAccountError, CustomAuthError, InActiveAccountError, InvalidParameters } from "@/types/errors";
import axiosClient from './axiosClient';
import { IBulkDelete, IBulkStatus, IChangeStatus, ICreateCourse, IUpdateCourse } from "@/schemas/course.schema";



export const CourseService = {

    getAllCoursesWithPagination: async (queryParams: FindAllQueryParams) => {
        try {
            const response = await axiosClient.get(`/courses`, { params: queryParams });
            return response.data.courses;

        } catch (error: any) {

            throw new Error(error.message)
        }
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

    // updateUser: async (data: IUpdateUser) => {
    //     try {
    //         const response = await axiosClient.patch(`/users`, data);
    //         return response.data;
    //     } catch (error: any) {
    //         throw new Error(error.message)
    //     }
    // },

    bulkUpdateStatus: async (data: IBulkStatus) => {
        try {
            const response = await axiosClient.post(`/courses/bulk-update-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
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
    deleteCourse: async (id: string) => {
        try {
            const response = await axiosClient.delete(`/courses/soft/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

}