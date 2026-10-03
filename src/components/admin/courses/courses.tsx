"use client"

import { DataTable, DataTableSelectedActionConfig } from "../../ui/data-table";
import { getColumns } from "./columns";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableError } from "@/components/shared/data-table-error";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator";
import { House, Download, UserPlus, ShieldUser, UserStar, UserCog, Lock, ShieldCheck, Trash2, CircleCheck, ShieldX, Users, UserPen, Book, Gift, Gem, Sprout, Zap, Rocket, Flame, BookPlus, BookOpen, Tag, FileEdit, Clock, XCircle, CheckCircle2, EyeOff, Grid2x2, Send } from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTableSelectedToolbar } from "@/components/shared/data-table-selection-toolbar";
import { toast } from "sonner";
import { useAllCourses, useBulkDelete,  useDeleteCourse ,useSubmitCourseForReview} from "@/hooks/useCourse";
import ModalCreateCourse from "./modal-create-course";
import ModalUpdateCourse from "./modal-update-course";
import ModalViewCourse from "./modal-view-course";
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal";
import { useAllTags } from "@/hooks/useTag";
import { useAllInstructors } from "@/hooks/useUser";
import { CourseStatusSchema, CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { TagType } from "@/types/generated-zod/schemas/models/Tag.schema";
import { CourseType as ICourseType } from "@/types/generated-zod/schemas/models/Course.schema"
import { useAllCategories } from "@/hooks/useCategory";
import { CategoryType } from "@/types/generated-zod/schemas/models/Category.schema";
import { CategoryResponse } from "../categories/categories";
import { UserType } from "@/types/generated-zod/schemas/models/User.schema";
export type CourseResponse = Omit<ICourseType, "tags" | "courseDescription" | "category" | "instructor"> & {
    tags: TagType[];
    courseDescription: {
        introduction: string;
        learningOutcomes: string;
        requirements: string | null;
        resources: string | null;
    } | null;
    category: CategoryType;
    instructor: UserType;
};

export default function Course() {

    const CourseType = CourseTypeSchema.enum;
    const Level = LevelSchema.enum;
    const courseStatus = CourseStatusSchema.enum;
    const { data: courses, isPending, isError, error, refetch } = useAllCourses();
    const { mutate: bulkDelete } = useBulkDelete();
    const { data: tags, isLoading: isLoadingTags } = useAllTags();
    const { data: instructors, isLoading: isLoadingInstructors } = useAllInstructors();
    const { data: categories } = useAllCategories();
    const { mutate: deleteCourse, isPending: isDeletePending } = useDeleteCourse();

    // State quản lý Modal
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    // Callbacks truyền cho DataTable
    const handleEdit = (course: CourseResponse) => {
        setSelectedCourse(course);
        setIsEditOpen(true);
    };

    const handleView = (course: CourseResponse) => {
        setSelectedCourse(course);
        setIsViewOpen(true);
    };

    const handleDelete = (course: CourseResponse) => {
        setSelectedCourse(course);
        setIsDeleteOpen(true);
    };

    const confirmDelete = (reason: string = "") => {
        if (selectedCourse) {
            deleteCourse({ id: selectedCourse.id, deletedReason: reason }, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedCourse(null);
                    refetch();
                }
            });
        }
    };



    const tableColumns = useMemo(() => getColumns(handleEdit, handleView, handleDelete), []);

    const tagOptions = tags ? tags.map((tag: TagType) => {
        const count = courses?.filter((course: CourseResponse) =>
            course.tags.some((courseTag: TagType) => courseTag.name === tag.name)
        ).length ?? 0;



        return {
            label: tag.name,
            value: tag.name,
            icon: Tag,
            count: count
        }
    }) : [];

    const categoryOptions = useMemo(() => {
        if (!categories?.categories) return [];

        return categories.categories.flatMap((category: CategoryResponse) => {
            // Root có con
            if (category.children?.length > 0) {
                return category.children.map((child) => {
                    const count =
                        courses?.filter(
                            (course: CourseResponse) =>
                                course.category?.id === child.id
                        ).length ?? 0;

                    return {
                        label: child.name,
                        value: String(child.id), //vì bên columns.tsx expect value là string
                        icon: Grid2x2,
                        count,
                    };
                });
            }
            

            // Root không có con -> chính nó là category có thể chọn
            const count =
                courses?.filter(
                    (course: CourseResponse) =>
                        course.category?.id === category.id
                ).length ?? 0;

            return [
                {
                    label: category.name,
                    value: String(category.id),
                    icon: Grid2x2,
                    count,
                },
            ];
        });
    }, [categories, courses]);



    const courseFilters = [
        {
            columnId: "courseType",
            title: "Loại khoá học",
            options: [
                {
                    label: "Miễn phí",
                    value: CourseType.FREE,
                    icon: Gift,
                    count: courses?.filter((course: any) => course.courseType === CourseType.FREE).length
                },
                {
                    label: "Trả phí",
                    value: CourseType.PAID,
                    icon: Gem,
                    count: courses?.filter((course: any) => course.courseType === CourseType.PAID).length
                }
            ],
        },
        {
            columnId: "level",
            title: "Cấp độ",
            options: [
                {
                    label: "Cơ bản",
                    value: Level.BEGINNER,
                    icon: Sprout,
                    count: courses?.filter((course: any) => course.level === Level.BEGINNER).length
                },
                {
                    label: "Trung cấp",
                    value: Level.INTERMEDIATE,
                    icon: Flame,
                    count: courses?.filter((course: any) => course.level === Level.INTERMEDIATE).length
                },
                {
                    label: "Nâng cao",
                    value: Level.ADVANCED,
                    icon: Rocket,
                    count: courses?.filter((course: any) => course.level === Level.ADVANCED).length
                },
            ],
        },
        {
            columnId: "status",
            title: "Trạng thái",
            options: [
                {
                    label: "Bản nháp",
                    value: courseStatus.DRAFT,
                    icon: FileEdit,
                    count: courses?.filter((course: any) => course.status === courseStatus.DRAFT).length
                },
                {
                    label: "Chờ duyệt",
                    value: courseStatus.PENDING,
                    icon: Clock,
                    count: courses?.filter((course: any) => course.status === courseStatus.PENDING).length
                },
                {
                    label: "Đã xuất bản",
                    value: courseStatus.PUBLISHED,
                    icon: CheckCircle2,
                    count: courses?.filter((course: any) => course.status === courseStatus.PUBLISHED).length
                },
                {
                    label: "Đã từ chối",
                    value: courseStatus.REJECTED,
                    icon: XCircle,
                    count: courses?.filter((course: any) => course.status === courseStatus.REJECTED).length
                },
                {
                    label: "Chưa xuất bản",
                    value: courseStatus.UNPUBLISHED,
                    icon: EyeOff,
                    count: courses?.filter((course: any) => course.status === courseStatus.UNPUBLISHED).length
                },
            ],
        },
        {
            columnId: "tags",
            title: "Tags",
            options: tagOptions,
        },
        {
            columnId: "category",
            title: "Danh mục",
            options: categoryOptions,
        },
    ]

    const courseActions = [
        {
            label: "Xuất Excel",
            icon: Download,
            variant: "outline" as const,
            onClick: () => true,
        },
        {
            label: "Thêm khoá học",
            icon: BookPlus,
            onClick: () => setOpenCreateModal(true),
            isPrimary: true,
        },
    ]



    if (isError) {
        return (
            <div className="p-6">
                <DataTableError error={error} refetch={refetch} />
            </div>
        )
    }
    return (

        <div>
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/"><House className="h-4 w-4" /></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Admin Panel</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Quản lý khóa học</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator className="mt-2 mb-4" />
            <div className="space-y-4 mb-6">
                <div>
                    <span className="text-2xl font-bold">Quản lý khoá học</span>
                    <p className="text-muted-foreground text-sm">Quản lý thông tin các khoá học trong hệ thống.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 mb-6 gap-4 justify-between">
                {isPending ? (
                    <>
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                    </>
                ) : (
                    <>
                        <KpiCard
                            label="Tổng số khoá học"
                            value={courses?.length.toString()}
                            icon={BookOpen}
                            iconColor="text-blue-500"
                            glowColor="bg-blue-500/15 border-blue-500/30"
                            valueColor="text-blue-500"
                            hoverBorderColor="hover:border-blue-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học miễn phí (Free)"
                            value={courses?.filter((course: any) => course.courseType === CourseType.FREE).length.toString()}
                            icon={Gift}
                            iconColor="text-green-500"
                            glowColor="bg-green-500/15 border-green-500/30"
                            valueColor="text-green-500"
                            hoverBorderColor="hover:border-green-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học trả phí (Paid)"
                            value={courses?.filter((course: any) => course.courseType === CourseType.PAID).length.toString()}
                            icon={Gem}
                            iconColor="text-red-500"
                            glowColor="bg-red-500/15 border-red-500/30"
                            valueColor="text-red-500"
                            hoverBorderColor="hover:border-red-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học cơ bản (Beginner)"
                            value={courses?.filter((course: any) => course.level === Level.BEGINNER).length.toString()}
                            icon={Sprout}
                            iconColor="text-sky-500"
                            glowColor="bg-sky-500/15 border-sky-500/30"
                            valueColor="text-sky-500"
                            hoverBorderColor="hover:border-sky-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(96,165,250,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học trung cấp (Intermediate)"
                            value={courses?.filter((course: any) => course.level === Level.INTERMEDIATE).length.toString()}
                            icon={Zap}
                            iconColor="text-violet-500"
                            glowColor="bg-violet-500/15 border-violet-500/30"
                            valueColor="text-violet-500"
                            hoverBorderColor="hover:border-violet-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học nâng cao (Advanced)"
                            value={courses?.filter((course: any) => course.level === Level.ADVANCED).length.toString()}
                            icon={Rocket}
                            iconColor="text-amber-500"
                            glowColor="bg-amber-500/15 border-amber-500/30"
                            valueColor="text-amber-500"
                            hoverBorderColor="hover:border-amber-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                        />
                    </>
                )}
            </div>
            <div>
                <DataTable
                    columns={tableColumns}
                    data={courses || []}
                    isPending={isPending}>
                    {(table) => (
                        <div className="space-y-4">

                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    placeholder: "Tìm kiếm khoá học theo tên, slug...",
                                }}
                                filters={courseFilters}
                                actions={courseActions}
                            />
                        </div>
                    )}
                </DataTable>
            </div>
            {/* Modal Create Course */}
            <ModalCreateCourse
                open={openCreateModal}
                closeDialog={() => setOpenCreateModal(false)}
                instructors={instructors || []}
                tags={tags || []}
                categories={categories?.categories || []}
            />

            {/* Các Modal tập trung cho DataTable */}
            {selectedCourse && (
                <>
                    {isEditOpen && (
                        <ModalUpdateCourse
                            open={isEditOpen}
                            closeDialog={() => { setIsEditOpen(false); setSelectedCourse(null); }}
                            course={selectedCourse}
                            tags={tags || []}
                            categories={categories?.categories || []}
                        />
                    )}
                    {isViewOpen && (
                        <ModalViewCourse
                            open={isViewOpen}
                            closeDialog={() => { setIsViewOpen(false); setSelectedCourse(null); }}
                            course={selectedCourse}
                        />
                    )}
                    <ConfirmModal
                        isOpen={isDeleteOpen}
                        Icon = {Trash2}
                        type = {"delete"}
                        onClose={() => { setIsDeleteOpen(false); setSelectedCourse(null); }}
                        onConfirm={confirmDelete}
                        title="Xóa khoá học?"
                        isLoading={isDeletePending}
                        description={
                            <>
                                Bạn có chắc chắn muốn xóa khóa học{" "}
                                <strong className="text-foreground">{selectedCourse?.title}</strong> không?
                            </>
                        }
                        confirmText="Xóa vĩnh viễn"

                        // delete reason
                        hasReason={true}
                        isReasonRequired={true}
                        reasonLabel="Lý do xóa"
                        reasonPlaceholder="Nhập lý do xóa khóa học..."
                        useTextarea={true}
                    />

                    
                </>
            )}
        </div>
    );
}