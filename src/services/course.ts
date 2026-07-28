import { ConflictAccountError, CustomAuthError, InActiveAccountError, InvalidParameters } from "@/types/errors";
import axiosClient from './axiosClient';
import { IBulkDelete, IBulkStatus, IChangeStatus, IUpdateUser } from "@/schemas/user.schema";
import { ICreateCourse } from "@/schemas/course.schema";

export const CourseService = {

    getAllCoursesWithPagination: async (queryParams: FindAllQueryParams) => {
        try {
            const response = await axiosClient.get(`/courses`, { params: queryParams });
            return response.data.courses;

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

    updateUser: async (data: IUpdateUser) => {
        try {
            const response = await axiosClient.patch(`/users`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    bulkUpdateStatus: async (data: IBulkStatus) => {
        try {
            const response = await axiosClient.post(`/users/bulk-update-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    bulkDeleteUser: async (data: IBulkDelete) => {
        try {
            const response = await axiosClient.post(`/users/bulk-delete`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    changeStatus: async (data: IChangeStatus) => {
        try {
            const response = await axiosClient.post(`/users/change-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

}