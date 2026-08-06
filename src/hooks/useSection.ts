import { ICreateSection, IUpdateSection } from "@/schemas/section.schema";
import { SectionService } from "@/services/section";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSections(courseId: string) {
    const queryInfo = useQuery({
        queryKey: ['sections', courseId],
        queryFn: async () => {
            const result = await SectionService.getAllSections(courseId);
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useCreateSection() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (sectionData: ICreateSection) => {
            const result = await SectionService.createSection(sectionData);
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
            toast.success("Tạo chương mới thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}


export function useUpdateSection() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async ({ sectionId, sectionData }: { sectionId: number, sectionData: IUpdateSection }) => {
            const result = await SectionService.updateSection(sectionId, sectionData);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
            toast.success("Cập nhật chương của khoá học thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useDeleteSection() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (sectionId: number) => {
            const result = await SectionService.deleteSection(sectionId);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
            toast.success("Xoá chương của khoá học thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}
