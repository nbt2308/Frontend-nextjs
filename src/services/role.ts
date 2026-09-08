import { IBulkDeleteRole, IChangeRoleStatus, ICreateRole, IUpdateRole } from '@/schemas/role.schema';
import axiosClient from './axiosClient';

export const RoleService = {
    getAllRolesPaginate: async (queryParams: FindAllQueryParams) => {
        try {
            const response = await axiosClient.get(`/roles`, { params: queryParams });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    getAllRoles: async () => {
        try {
            const response = await axiosClient.get(`/roles/all`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    createRole: async (data: ICreateRole) => {
        try {
            const response = await axiosClient.post(`/roles`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    updateRole: async (id: number, data: IUpdateRole) => {
        try {
            const response = await axiosClient.patch(`/roles/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    changeStatus: async (data: IChangeRoleStatus) => {
        try {
            const response = await axiosClient.post(`/roles/change-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    bulkDeleteRole: async (data: IBulkDeleteRole) => {
        try {
            const response = await axiosClient.post(`/roles/bulk-delete`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    deleteRole: async (roleId: number) => {
        try {
            const response = await axiosClient.delete(`/roles/${roleId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
}
