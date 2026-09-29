import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoryService } from "@/services/category";
import { IBulkDelete, IBulkStatus, IChangeStatus, ICreateCategory, IUpdateCategory } from "@/schemas/category.schema";

export function useAllCategories() {
    const queryInfo = useQuery({
        queryKey: ['categories', 'all'],
        queryFn: async () => {
            const result = await CategoryService.getAllCategories();
            return result;
        },
        staleTime: 1000 * 60 * 5,
    })
    return queryInfo;
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (data: ICreateCategory) => {
            const result = await CategoryService.createCategory(data);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['categories'],
                refetchType: 'active'
            });
            toast.success("Thêm danh mục thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useEditCategory() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async ({ id, categoryData }: { id: number, categoryData: IUpdateCategory }) => {
            const result = await CategoryService.updateCategory(id, categoryData);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['categories'],
                refetchType: 'active'
            });
            toast.success("Cập nhật danh mục thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useChangeCategoryStatus() {
    const queryClient = useQueryClient();
    const handleChangeStatus = useMutation({
        mutationFn: async (data: IChangeStatus) => {
            const result = await CategoryService.changeStatus(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success(`Đổi trạng thái danh mục ${result?.name} thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
    return handleChangeStatus;
}

export function useBulkUpdateCategoryStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IBulkStatus) => {
            const result = await CategoryService.bulkUpdateStatus(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success(`Đổi trạng thái ${result?.count} danh mục thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}

export function useBulkDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IBulkDelete) => {
            const result = await CategoryService.bulkDeleteCategory(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success(`Xoá ${result?.count} danh mục thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (categoryId: number) => {
            const result = await CategoryService.deleteCategory(categoryId);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("Xoá danh mục thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}