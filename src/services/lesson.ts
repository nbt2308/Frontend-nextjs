import { ICreateLesson, IUpdateLesson } from "@/schemas/lession.schema";
import axiosClient from "../lib/axiosClient";


export const LessonService = {
    createLesson: async (lessonData: ICreateLesson) => {
        try {
            const formData = new FormData();
            formData.append("title", lessonData.title);
            if (lessonData.content) formData.append("content", lessonData.content);
            formData.append("order", String(lessonData.order));
            formData.append("isPreview", String(lessonData.isPreview));
            formData.append("sectionId", String(lessonData.sectionId));
            
            if (lessonData.video instanceof File) {
                formData.append("video", lessonData.video);
            } else if (lessonData.video instanceof FileList && lessonData.video.length > 0) {
                formData.append("video", lessonData.video[0]);
            }

            const response = await axiosClient.post(`/lessons`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    updateLesson: async (lessonId: number, lessonData: IUpdateLesson) => {
        try {
            const formData = new FormData();
            if (lessonData.title !== undefined) formData.append("title", lessonData.title);
            if (lessonData.content !== undefined) formData.append("content", lessonData.content);
            if (lessonData.order !== undefined) formData.append("order", String(lessonData.order));
            if (lessonData.isPreview !== undefined) formData.append("isPreview", String(lessonData.isPreview));
            if (lessonData.sectionId !== undefined) formData.append("sectionId", String(lessonData.sectionId));
            
            if (lessonData.video instanceof File) {
                formData.append("video", lessonData.video);
            } else if (lessonData.video instanceof FileList && lessonData.video.length > 0) {
                formData.append("video", lessonData.video[0]);
            }

            const response = await axiosClient.patch(`/lessons/${lessonId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    uploadResources: async (lessonId: number, files: FileList | File[]) => {
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append("files", file);
            });
            const response = await axiosClient.post(`/lessons/${lessonId}/resources`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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
    },
    getPreviewLesson:async (slug:string, lessonId:number)=>{
        try {
            const response = await axiosClient.get(`/courses/${slug}/preview/${lessonId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    downloadResource: async (lessonId: number, resourceId: number) => {
        try {
            const response = await axiosClient.get(`/lessons/${lessonId}/resources/${resourceId}/download`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}