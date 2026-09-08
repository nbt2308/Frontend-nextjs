import { useQuery } from "@tanstack/react-query";
import { PermissionService } from "@/services/permission";

export function useAllPermissions() {
    return useQuery({
        queryKey: ['permissions', 'all'],
        queryFn: async () => {
            const result = await PermissionService.getAllPermissions();
            return result;
        },
        staleTime: 1000 * 60 * 10, // Cache 10 phút vì permissions ít thay đổi
    })
}

export function usePermissionsGrouped() {
    return useQuery({
        queryKey: ['permissions', 'grouped'],
        queryFn: async () => {
            const result = await PermissionService.getAllPermissionsGrouped();
            return result;
        },
        staleTime: 1000 * 60 * 10,
    })
}
