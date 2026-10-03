import { ModerationListCourse } from "../moderation.types";
import { BookOpen, Gem, Gift, CheckCircle2, XCircle, FolderKanban, Eye, Check, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { CourseTypeSchema } from "@/types/generated-zod/schemas";
import { CourseStatusBadge } from "@/components/shared/courseStatus";

interface Props {
    courses: ModerationListCourse[];
    handleOpenReview: (course: ModerationListCourse) => void;
}

export default function GridCardView({ courses, handleOpenReview }: Props) {
    const CourseType = CourseTypeSchema.enum;

    return (
        <div className="space-y-4">
            {courses.length === 0 ? (
                <div className="p-12 text-center border rounded-2xl border-dashed border-border bg-card/40 flex flex-col items-center justify-center gap-3">
                    <div className="p-4 rounded-full bg-muted text-muted-foreground">
                        <FolderKanban className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">Không có khóa học nào trong mục này</p>
                        <p className="text-xs text-muted-foreground">
                            Không tìm thấy khóa học nào phù hợp với trạng thái đang chọn.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {courses.map((course) => {

                        const allLessons = course.sections.flatMap((s) => s.lessons);
                        const totalDuration = allLessons.reduce((acc, l) => acc + (l.duration || 0), 0);
                        const originalPrice = Number(course.price) || 0
                        const salePrice = Number(course.discount) || 0
                        const hasDiscount = course.courseType === CourseTypeSchema.enum.PAID && salePrice > 0 && salePrice < originalPrice
                        const formatter = new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })
                        const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                        return (
                            <div
                                key={course.id}
                                className="group relative rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden shadow-xs"
                            >
                                {/* Thumbnail Banner */}
                                <div className="relative w-full h-44 bg-zinc-900 shrink-0 overflow-hidden">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                                        </div>
                                    )}

                                    {/* Status overlay */}
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                        <CourseStatusBadge status={course.status} />
                                        <Badge variant="secondary" className="backdrop-blur-md bg-black/60 text-white text-[11px]">
                                            {course.category?.name}
                                        </Badge>
                                    </div>


                                </div>

                                {/* Card Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <h3
                                            onClick={() => handleOpenReview(course)}
                                            className="text-base font-bold text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center gap-2.5">
                                            <Avatar className="h-7 w-7 border border-border">
                                                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                                                <AvatarFallback className="text-[10px]">
                                                    {getInitials(course.instructor.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="text-xs font-semibold text-foreground truncate">
                                                    {course.instructor.name}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground truncate">
                                                    {course.instructor.email}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                                            <div className="p-1.5 rounded-lg bg-muted/40">
                                                <span className="block text-[10px] text-muted-foreground">Chương</span>
                                                <span className="text-xs font-bold text-foreground">
                                                    {course.sections.length}
                                                </span>
                                            </div>
                                            <div className="p-1.5 rounded-lg bg-muted/40">
                                                <span className="block text-[10px] text-muted-foreground">Bài học</span>
                                                <span className="text-xs font-bold text-foreground">
                                                    {allLessons.length}
                                                </span>
                                            </div>
                                            <div className="p-1.5 rounded-lg bg-muted/40">
                                                <span className="block text-[10px] text-muted-foreground">Thời lượng</span>
                                                <span className="text-xs font-bold text-foreground">
                                                    {Math.floor(totalDuration / 60)}p
                                                </span>
                                            </div>
                                        </div>

                                        {course.rejectReason && (
                                            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
                                                <div className="font-semibold flex items-center gap-1 mb-0.5">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    Lý do từ chối:
                                                </div>
                                                <p className="line-clamp-2 text-[11px]">{course.rejectReason}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                                        <div className="text-xs">
                                            <span className="text-muted-foreground block text-[10px]">Giá:</span>
                                            <span className="font-bold text-foreground">
                                                {
                                                    hasDiscount ? (

                                                        <>
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                                                                        -{discountPercent}%
                                                                    </span>
                                                                    <span className="font-semibold text-foreground">
                                                                        {formatter.format(salePrice)}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs text-muted-foreground line-through">
                                                                    {formatter.format(originalPrice)}
                                                                </span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="font-semibold text-foreground">
                                                                {formatter.format(originalPrice)}
                                                            </span>
                                                        </>
                                                    )
                                                }
                                            </span>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={() => handleOpenReview(course)}
                                            className="h-8 text-xs font-semibold px-3 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            Review chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}