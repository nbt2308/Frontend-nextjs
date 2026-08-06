import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ICreateLesson, IUpdateLesson } from "@/schemas/lession.schema";
import { LessonService } from "@/services/lesson";

export function useCreateLesson() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (lessonData: ICreateLesson) => {
            const result = await LessonService.createLesson(lessonData);
            return result;
        },
        onSuccess: (result) => {
            // queryClient.invalidateQueries({ queryKey: ['sections'] });
            queryClient.invalidateQueries({
                queryKey: ['sections'],
                refetchType: 'active'
            });
            toast.success("Thêm bài giảng thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useUpdateLesson() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async ({ lessonId, lessonData }: { lessonId: number, lessonData: IUpdateLesson }) => {
            const result = await LessonService.updateLesson(lessonId, lessonData);
            return result;
        },
        onSuccess: (result) => {
            // queryClient.invalidateQueries({ queryKey: ['sections'] });
            queryClient.invalidateQueries({
                queryKey: ['sections'],
                refetchType: 'active'
            });
            toast.success("Cập nhật bài giảng thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useDeleteLesson() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (lessonId: number) => {
            const result = await LessonService.deleteLesson(lessonId);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
            toast.success("Xoá bài giảng thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}