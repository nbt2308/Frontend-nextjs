import { ConflictAccountError, CustomAuthError, InActiveAccountError, InvalidParameters } from "@/types/errors";
import axiosClient from './axiosClient';
import { IBulkDelete, IBulkStatus, IChangeStatus, IUpdateUser } from "@/schemas/user.schema";

export const UserService = {

    getAllUsersWithPagination: async (queryParams: FindAllQueryParams) => {
        try {
            const response = await axiosClient.get(`/users`, { params: queryParams });
            return response.data.users;

        } catch (error: any) {

            throw new Error(error.message)
        }
    },

    getAllInstructors: async () => {
        try {
            const response = await axiosClient.get(`/users/instructor`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    // createUser: async (userData: CreateUserDto) => {
    //     try {
    //         const response = await axiosClient.post(`/users`, userData);
    //         return response.data;
    //     } catch (error: any) {
    //         throw new Error(error.message)
    //     }
    // }

    updateUser: async (id: string, data: IUpdateUser) => {
        try {
            const response = await axiosClient.patch(`/users/${id}`, data);
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
    softDelete: async (id: string) => {
        try {
            const response = await axiosClient.delete(`/users/soft/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

}