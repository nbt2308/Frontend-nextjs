import { IBulkDelete, IBulkStatus, IChangeStatus, ICreateCategory, IUpdateCategory } from '@/schemas/category.schema';
import axiosClient from '../lib/axiosClient';

export const CategoryService = {

    getAllCategories: async () => {
        try {
            const response = await axiosClient.get(`/categories`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    createCategory: async (data: ICreateCategory) => {
        try {
            const response = await axiosClient.post(`/categories`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    updateCategory: async (id: number, data: IUpdateCategory) => {
        try {
            const response = await axiosClient.patch(`/categories/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    changeStatus: async (data: IChangeStatus) => {
        try {
            const response = await axiosClient.post(`/categories/change-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    bulkUpdateStatus: async (data: IBulkStatus) => {
        try {
            const response = await axiosClient.post(`/categories/bulk-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    bulkDeleteCategory: async (data: IBulkDelete) => {
        try {
            const response = await axiosClient.delete(`/categories/bulk-delete`, { data });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    deleteCategory: async (categoryId: number) => {
        try {
            const response = await axiosClient.delete(`/categories/${categoryId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
}