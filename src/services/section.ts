import { ICreateSection, IUpdateSection } from "@/schemas/section.schema";
import axiosClient from "./axiosClient";



export const SectionService = {
    getAllSections: async (courseId: string) => {
        try {
            const response = await axiosClient.get(`/sections?courseId=${courseId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    createSection: async (sectionData: ICreateSection) => {
        try {
            const response = await axiosClient.post(`/sections`, sectionData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    updateSection: async (sectionId: number, sectionData: IUpdateSection) => {
        try {
            const response = await axiosClient.patch(`/sections/${sectionId}`, sectionData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    deleteSection: async (sectionId: number) => {
        try {
            const response = await axiosClient.delete(`/sections/${sectionId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}