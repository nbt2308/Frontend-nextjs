import axiosClient from '../lib/axiosClient';

export const PermissionService = {
    getAllPermissions: async () => {
        try {
            const response = await axiosClient.get(`/permissions/all`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    getAllPermissionsGrouped: async () => {
        try {
            const response = await axiosClient.get(`/permissions/grouped`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
}
