import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user";
import { toast } from "sonner";
import { IBulkDelete, IBulkStatus, IChangeStatus, IUpdateUser } from "@/schemas/user.schema";
import { CourseService } from "@/services/course";
import { ICreateCourse } from "@/schemas/course.schema";

export function useCourses(params: FindAllQueryParams) {
    const defaultParams: DefaultFindAllQueryParams = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    };
    const queryParams = { ...defaultParams, ...params };
    const queryInfo = useQuery({
        queryKey: ['courses', queryParams],
        queryFn: async () => {
            const result = await CourseService.getAllCoursesWithPagination(queryParams)
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useCreateCourse() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (courseData: ICreateCourse) => {
            const result = await CourseService.createCourse(courseData);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success("Tạo khóa học thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}