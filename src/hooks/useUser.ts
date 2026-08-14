import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user";
import { toast } from "sonner";
import { IBulkDelete, IBulkStatus, IChangeStatus, IUpdateUser } from "@/schemas/user.schema";


export function useUsers(params: FindAllQueryParams) {
    const defaultParams: DefaultFindAllQueryParams = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    };
    const queryParams = { ...defaultParams, ...params };
    const queryInfo = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const result = await UserService.getAllUsersWithPagination(queryParams)
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useAllInstructors() {
    const queryInfo = useQuery({
        queryKey: ['instructors'],
        queryFn: async () => {
            const result = await UserService.getAllInstructors();
            return result;
        },
        staleTime: 1000 * 60 * 5,
    })
    return queryInfo;
}

// export function useCreateUser() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (newUserData: any) => {
//             return UserService.createUser(newUserData);
//         },
//     onSuccess: () => {
//       // Báo cho TanStack Query biết danh sách 'users' đã cũ, cần fetch lại dữ liệu mới
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// }

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: IUpdateUser }) => {
            const result = await UserService.updateUser(id, data)
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("Cập nhật người dùng thành công");
        },
        onError: (error: any) => {
            toast.error(error?.message);
        }
    })
}
export function useBulkUpdateStatus() {
    return useMutation({
        mutationFn: async (data: IBulkStatus) => {
            const result = await UserService.bulkUpdateStatus(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success(`Đổi trạng thái ${result?.count} người dùng thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}
export function useBulkDelete() {
    return useMutation({
        mutationFn: async (data: IBulkDelete) => {
            const result = await UserService.bulkDeleteUser(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success(`Xoá ${result?.count} người dùng thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}

export function useChangeStatus() {
    const queryClient = useQueryClient();
    const handleChangeStatus = useMutation({
        mutationFn: async (data: IChangeStatus) => {
            const result = await UserService.changeStatus(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(`Đổi trạng thái của tài khoản ${result?.email} thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
    return handleChangeStatus;
}

export function useSoftDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const result = await UserService.softDelete(id);
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("Xoá người dùng thành công");
        },
        onError: (error: any) => {
            toast.error(error?.message);
        }
    })
}

