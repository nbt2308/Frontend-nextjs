import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TagService } from "@/services/tag";
import { IBulkDelete, IBulkStatus, IChangeStatus, ICreateTag, IUpdateTag } from "@/schemas/tag.schema";

export function useTags(params: FindAllQueryParams) {
    const defaultParams: DefaultFindAllQueryParams = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    };
    const queryParams = { ...defaultParams, ...params };
    const queryInfo = useQuery({
        queryKey: ['tags', queryParams],
        queryFn: async () => {
            const result = await TagService.getAllTagsWithPagination(queryParams)
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useAllTags() {
    const queryInfo = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const result = await TagService.getAllTags();
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useAllTagsForUser() {
    const queryInfo = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const result = await TagService.getAllTagsForUser();
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useCreateTag() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (tagData: ICreateTag) => {
            const result = await TagService.createTag(tagData);
            return result;
        },
        onSuccess: (result) => {
            // queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({
                queryKey: ['tags'],
                refetchType: 'active'
            });
            toast.success("Thêm Tag thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useEditTag() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async ({ id, tagData }: { id: number, tagData: IUpdateTag }) => {
            const result = await TagService.updateTag(id, tagData);
            return result;
        },
        onSuccess: (result) => {
            // queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({
                queryKey: ['tags'],
                refetchType: 'active'
            });
            toast.success("Cập nhập Tag thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useChangeStatus() {
    const queryClient = useQueryClient();
    const handleChangeStatus = useMutation({
        mutationFn: async (data: IChangeStatus) => {
            const result = await TagService.changeStatus(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success(`Đổi trạng thái của Tag ${result?.name} thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
    return handleChangeStatus;
}
export function useBulkUpdateStatus() {
    return useMutation({
        mutationFn: async (data: IBulkStatus) => {
            const result = await TagService.bulkUpdateStatus(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success(`Đổi trạng thái ${result?.count} tag thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}
export function useBulkDelete() {
    return useMutation({
        mutationFn: async (data: IBulkDelete) => {
            const result = await TagService.bulkDeleteTag(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success(`Xoá ${result?.count} tag thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}

export function useDeleteTag() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (tagId: number) => {
            const result = await TagService.deleteTag(tagId);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success("Xoá Tag thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}