import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ICreateLesson, IUpdateLesson } from "@/schemas/lession.schema";
import { LessonService } from "@/services/lesson";

export function useCreateLesson() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (lessonData: ICreateLesson) => {
            const result = await LessonService.createLesson(lessonData);
            if (lessonData.resources && lessonData.resources.length > 0) {
                await LessonService.uploadResources(result.id, lessonData.resources);
            }
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
            if (lessonData.resources && lessonData.resources.length > 0) {
                await LessonService.uploadResources(lessonId, lessonData.resources);
            }
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

export function usePreviewLesson(slug: string, lessonId: number) {
    return useQuery({
        queryKey: ['sections', lessonId],
        queryFn: async () => {
            const result = await LessonService.getPreviewLesson(slug, lessonId);
            return result;
        },
        enabled: !!lessonId,
        staleTime: 1000 * 60 * 5,
    });
}