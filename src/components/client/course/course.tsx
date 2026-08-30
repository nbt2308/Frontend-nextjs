"use client";

import { useState } from "react";
import CourseFilter from "./courseFilter";
import CardCourse from "@/components/shared/cardCourse";
import { CourseSkeletonLoader } from "../home/FeatureCourse/courseSkeleton";
import { useCoursesForUser } from "@/hooks/useCourse";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function CoursePage() {
    const [filters, setFilters] = useState<CourseFilterValues>({});
    const sortValue = `${filters.sortBy ?? "createdAt"}-${filters.sortOrder ?? "desc"}`;

    const { data, isPending: isDataPending } = useCoursesForUser(filters);
    const filteredCourses = data?.courses ?? [];
    const filterCount = data?.filtersCount ?? {
        level: {},
        courseType: {},
        rating: {}
    };

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split("-") as [string, "asc" | "desc"];
        setFilters((currentFilters) => ({ ...currentFilters, sortBy, sortOrder }));
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-10 pb-24">
            <div className="container mx-auto px-6 mb-12">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase mb-4">
                        Tất cả khóa học
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Khám phá kho tàng kiến thức với hàng trăm khóa học chất lượng cao từ các giảng viên hàng đầu.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <SidebarProvider className="flex-col items-stretch gap-6 min-h-0 h-auto">
                    <div className="flex flex-wrap items-center justify-between p-4 md:p-6 border rounded-lg bg-muted/50 border-muted/50 gap-4 w-full">
                        <div className="flex items-center gap-3">
                            {/* Nút Đóng/Mở Sidebar */}
                            <SidebarTrigger className="md:hidden" />

                            <div>
                                {isDataPending ? (
                                    <Skeleton className="h-9 w-48 rounded-md" />
                                ) : (
                                    <Field className="flex flex-row items-center gap-2">
                                        <FieldLabel className="text-sm font-semibold text-foreground whitespace-nowrap">
                                            Sắp xếp:
                                        </FieldLabel>
                                        <Select value={sortValue} onValueChange={handleSortChange}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Chọn cách sắp xếp" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                                                <SelectItem value="studentCount-desc">Phổ biến nhất</SelectItem>
                                                <SelectItem value="title-asc">Tên A-Z</SelectItem>
                                                <SelectItem value="title-desc">Tên Z-A</SelectItem>
                                                <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                                                <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                                                <SelectItem value="discount-desc">Giảm giá cao nhất</SelectItem>
                                                <SelectItem value="discount-asc">Giảm giá thấp nhất</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            </div>
                        </div>
                        <div className=" sm:flex hidden  items-center text-md text-muted-foreground">
                            {isDataPending ? (
                                <Skeleton className="h-5 w-40 rounded-md" />
                            ) : (
                                <span className="font-bold text-foreground">
                                    📗 Hiển thị {filteredCourses.length} khóa học
                                </span>
                            )}
                        </div>

                    </div>


                    <div className="flex items-start gap-6 w-full">
                        {/* Component Filter Sidebar */}
                        <CourseFilter
                            courses={filteredCourses}
                            coursesPending={isDataPending}
                            filtersCount={filterCount}
                            onFilterChange={(nextFilters) =>
                                setFilters((currentFilters) => ({ ...currentFilters, ...nextFilters }))
                            }
                        />

                        {/* Nội dung chính chứa danh sách khóa học */}
                        <SidebarInset className="flex-1 bg-transparent p-0 min-w-0">
                            <div>
                                {isDataPending ? (
                                    <CourseSkeletonLoader course={6} />
                                ) : filteredCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredCourses.map((course: CourseForUser) => (
                                            <CardCourse key={course.id} course={course} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-card">
                                        <div className="text-6xl mb-4">📚</div>
                                        <h3 className="text-2xl font-bold mb-2">Không tìm thấy khóa học</h3>
                                        <p className="text-muted-foreground">Hãy thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
                                    </div>
                                )}
                            </div>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </div>
    );
}