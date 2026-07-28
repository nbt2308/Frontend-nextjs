import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user";
import { toast } from "sonner";
import { IBulkDelete, IBulkStatus, IChangeStatus, IUpdateUser } from "@/schemas/user.schema";
import { CourseService } from "@/services/course";
import { ICreateCourse } from "@/schemas/course.schema";
import { TagService } from "@/services/tag";

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