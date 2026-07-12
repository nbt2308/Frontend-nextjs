import { ConflictAccountError, CustomAuthError, InActiveAccountError, InvalidEmailPasswordError, InvalidParameters } from "@/types/errors";
import { UserQueryParams } from '@/hooks/useUser';
import axiosClient from './axiosClient';

export const UserService = {

    getAllUsers: async (queryParams: UserQueryParams) => {
        try {
            const response = await axiosClient.get(`/users`, { params: queryParams });
            return response.data.users;

        } catch (error: any) {

            throw new Error(error.message)
        }
    }
}