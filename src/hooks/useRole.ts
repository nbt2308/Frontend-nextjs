import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RoleService } from "@/services/role";
import { IBulkDeleteRole, IChangeRoleStatus, ICreateRoleOutput, IUpdateRole } from "@/schemas/role.schema";

export function useRoles(params: FindAllQueryParams) {
    const defaultParams: DefaultFindAllQueryParams = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    };
    const queryParams = { ...defaultParams, ...params };
    const queryInfo = useQuery({
        queryKey: ['roles', queryParams],
        queryFn: async () => {
            const result = await RoleService.getAllRolesPaginate(queryParams)
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useAllRoles() {
    return useQuery({
        queryKey: ['roles', 'all'],
        queryFn: async () => {
            const result = await RoleService.getAllRoles();
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
}

export function useCreateRole() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (roleData: ICreateRoleOutput) => {
            const result = await RoleService.createRole(roleData);
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({
                queryKey: ['roles'],
                refetchType: 'active'
            });
            toast.success("Thêm Vai trò thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useEditRole() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async ({ id, roleData }: { id: number, roleData: IUpdateRole }) => {
            const result = await RoleService.updateRole(id, roleData);
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({
                queryKey: ['roles'],
                refetchType: 'active'
            });
            toast.success("Cập nhập Vai trò thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useChangeRoleStatus() {
    const queryClient = useQueryClient();
    const handleChangeStatus = useMutation({
        mutationFn: async (data: IChangeRoleStatus) => {
            const result = await RoleService.changeStatus(data);
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast.success(`Đổi trạng thái của Vai trò ${result?.name} thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
    return handleChangeStatus;
}

export function useBulkDeleteRole() {
    return useMutation({
        mutationFn: async (data: IBulkDeleteRole) => {
            const result = await RoleService.bulkDeleteRole(data);
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: (result) => {
            toast.success(`Xoá ${result?.count} vai trò thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}

export function useDeleteRole() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (roleId: number) => {
            const result = await RoleService.deleteRole(roleId);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast.success("Xoá Vai trò thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}
