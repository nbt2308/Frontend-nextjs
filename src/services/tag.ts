import { IBulkDelete, IBulkStatus, IChangeStatus, ICreateTag, IUpdateTag } from '@/schemas/tag.schema';
import axiosClient from './axiosClient';

export const TagService = {

    getAllTagsWithPagination: async (queryParams: FindAllQueryParams) => {
        try {
            const response = await axiosClient.get(`/tags`, { params: queryParams });
            return response.data.tags;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    getAllTags: async () => {
        try {
            const response = await axiosClient.get(`/tags/all`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    getAllTagsForUser: async () => {
        try {
            const response = await axiosClient.get(`/tags/tags-for-user`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    createTag: async (data: ICreateTag) => {
        try {
            const response = await axiosClient.post(`/tags`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    updateTag: async (id: number, data: IUpdateTag) => {
        try {
            const response = await axiosClient.patch(`/tags/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    changeStatus: async (data: IChangeStatus) => {
        try {
            const response = await axiosClient.post(`/tags/change-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    bulkUpdateStatus: async (data: IBulkStatus) => {
        try {
            const response = await axiosClient.post(`/tags/bulk-status`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    bulkDeleteTag: async (data: IBulkDelete) => {
        try {
            const response = await axiosClient.delete(`/tags/bulk-delete`, { data });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    deleteTag: async (tagId: number) => {
        try {
            const response = await axiosClient.delete(`/tags/${tagId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
}