import { ConflictAccountError, CustomAuthError, InActiveAccountError, InvalidParameters } from "@/types/errors";
import { UserQueryParams } from '@/hooks/useUser';
import axiosClient from './axiosClient';
import { IBulkDelete, IBulkStatus, IUpdateUser } from "@/schemas/user.schema";

export const UserService = {

    getAllUsers: async (queryParams: UserQueryParams) => {
        try {
            const response = await axiosClient.get(`/users`, { params: queryParams });
            return response.data.users;

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
    }
}