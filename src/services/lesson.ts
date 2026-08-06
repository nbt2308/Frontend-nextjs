import { ICreateLesson, IUpdateLesson } from "@/schemas/lession.schema";
import axiosClient from "./axiosClient";


export const LessonService = {
    createLesson: async (lessonData: ICreateLesson) => {
        try {
            const response = await axiosClient.post(`/lessons`, lessonData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    updateLesson: async (lessonId: number, lessonData: IUpdateLesson) => {
        try {
            const response = await axiosClient.patch(`/lessons/${lessonId}`, lessonData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    deleteLesson: async (lessonId: number) => {
        try {
            const response = await axiosClient.delete(`/lessons/${lessonId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}