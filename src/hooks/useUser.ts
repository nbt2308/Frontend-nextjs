import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user";
export interface UserQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string; // Dễ dàng thêm các trường mới sau này (ví dụ: tìm kiếm)
}
interface DefaultQueryParams {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export function useUsers(params: UserQueryParams) {
    const defaultParams: DefaultQueryParams = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    };
    const queryParams = { ...defaultParams, ...params };
    const queryInfo = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const result = await UserService.getAllUsers(queryParams)
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}