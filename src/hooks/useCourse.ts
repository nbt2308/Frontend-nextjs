import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IBulkDelete, IBulkStatus, IChangeStatus, ICreateCourse, IUpdateCourse } from "@/schemas/course.schema";
import { CourseService } from "@/services/course";



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

export function useModerationKpis() {
    return useQuery({
        queryKey: ['courses', 'moderation', 'kpis'],
        queryFn: async () => {
            return await CourseService.getModerationKpis();
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useModerationList(params: { page: number; limit: number; status?: string }) {
    return useQuery({
        queryKey: ['courses', 'moderation', 'list', params],
        queryFn: async () => {
            return await CourseService.getModerationList(params);
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useModerationReview(id: string | undefined) {
    return useQuery({
        queryKey: ['courses', 'moderation', 'review', id],
        queryFn: async () => {
            if (!id) return null;
            return await CourseService.getModerationReview(id);
        },
        enabled: !!id,
        staleTime: 0, // don't cache review details too long, or at least force refetch on open
    });
}


export function useAllCourses() {
    const queryInfo = useQuery({
        queryKey: ['courses', 'all'],
        queryFn: async () => {
            const result = await CourseService.getAllCourses()
            return result;
        },
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    })
    return queryInfo;
}

export function useCourseBySlug(slug: string | undefined) {
    return useQuery({
        queryKey: ['courses', slug],
        queryFn: async () => {
            if (!slug) return null;
            const result = await CourseService.getCourseBySlug(slug);
            return result;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });
}

export function useRelatedCourses(slug: string | undefined) {
    return useQuery({
        queryKey: ['courses', slug, 'related'],
        queryFn: async () => {
            if (!slug) return null;
            const result = await CourseService.findRelatedCoursesBySlug(slug);
            return result;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCoursesForUser(params: CourseUserQueryParams = {}) {
    const defaultParams: CourseUserQueryParams = {
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        search: '',
        level: [],
        courseType: [],
        tag: [],
        rating: undefined,
    };

    const queryParams = {
        ...defaultParams,
        ...params,
    };

    return useQuery({
        queryKey: ['courses-user', queryParams],
        queryFn: async () => {
            const result = await CourseService.getAllCoursesForUser(queryParams);
            return {
                courses: result.courses as CourseForUser[],
                filtersCount: result.filtersCount as filtersCount,
            };
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useCreateCourse() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (courseData: ICreateCourse) => {
            const result = await CourseService.createCourse(courseData);
            return result;
        },
        onSuccess: (result) => {
            // queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({
                queryKey: ['courses'],
                refetchType: 'active'
            });
            toast.success("Thêm khoá học thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async ({ id, courseData }: { id: string; courseData: IUpdateCourse }) => {
            const result = await CourseService.updateCourse(id, courseData);
            return result;
        },
        onSuccess: (result) => {
            // queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({
                queryKey: ['courses'],
                refetchType: 'active'
            });
            toast.success("Cập nhật khoá học thành công");
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
            const result = await CourseService.changeStatus(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success(`Đổi trạng thái của khóa học ${result?.title} thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
    return handleChangeStatus;
}

// export function useBulkUpdateStatus() {
//     return useMutation({
//         mutationFn: async (data: IBulkStatus) => {
//             const result = await CourseService.bulkUpdateStatus(data);

//             if (result?.error) {
//                 throw new Error(result?.error);
//             }

//             return result;
//         },
//         onSuccess: (result) => {
//             toast.success(`Đổi trạng thái ${result?.count} khoá học thành công`);
//         },
//         onError: (error: any) => {
//             toast.error(`${error?.message}`);
//         }
//     })
// }
export function useBulkDelete() {
    return useMutation({
        mutationFn: async (data: IBulkDelete) => {
            const result = await CourseService.bulkDeleteCourse(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success(`Xoá ${result?.count} khoá học thành công`);
        },
        onError: (error: any) => {
            toast.error(`${error?.message}`);
        }
    })
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async ({ id, deletedReason }: { id: string; deletedReason: string }) => {
            const result = await CourseService.deleteCourse(id, deletedReason);
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success(`Xóa khóa học ${result?.title} thành công`);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useRejectCourse() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (data: { id: string; reason_rejected: string; sendEmail?: boolean }) => {
            const result = await CourseService.rejectCourse(data);
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success(`Từ chối khóa học ${result?.title} thành công`);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useSubmitCourseForReview() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (id: string) => {
            const result = await CourseService.submitCourseForReview(id);
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success(`Gửi yêu cầu duyệt khóa học ${result?.title} thành công`);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}

export function useApproveCourse() {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (id: string) => {
            const result = await CourseService.approveCourse(id);
            if (result?.error) {
                throw new Error(result?.error);
            }
            return result;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success(`Phê duyệt khóa học ${result?.title} thành công`);
        },
    });
    return mutationInfo;
}
