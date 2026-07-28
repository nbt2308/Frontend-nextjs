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
    }
}