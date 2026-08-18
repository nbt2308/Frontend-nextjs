import axiosClient from "./axiosClient";


export const HomeService = {

    getHome: async () => {
        try {
            const response = await axiosClient.get(`/home`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}