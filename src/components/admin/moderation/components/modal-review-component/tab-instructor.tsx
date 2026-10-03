import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Award, ShieldCheck } from "lucide-react";
import { ModerationCourse } from "../../moderation.types";
import { formatDate, getInitials } from "@/lib/utils";

export default function TabInstructor({
    course
}: {
    course: ModerationCourse;
}) {
    return (
        <TabsContent
            value="instructor"
            className="flex-1 overflow-y-auto p-6 m-0 space-y-6 focus-visible:outline-none"
        >
            <div className="p-5 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <Avatar className="h-20 w-20 border-2 border-primary/20 shrink-0">
                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                    <AvatarFallback className="text-base font-semibold">
                        {getInitials(course.instructor.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-foreground">
                            {course.instructor.name}
                        </h3>
                        {course.instructor.isActive && (
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                        )}
                        {course.instructor.status && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                                Đang hoạt động
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                        Giảng viên tại NevaGiveUp
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{course.instructor.email}</span>
                    </div>
                </div>
            </div>

            {/* Instructor Stats Grid */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground">Thống kê giảng viên</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
                        <div className="text-base sm:text-lg font-bold text-primary">
                            {course.instructor.stats.totalCourses}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Khóa học đã tạo</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
                        <div className="text-base sm:text-lg font-bold text-foreground">
                            {course.instructor.stats.totalStudents.toLocaleString("vi-VN")}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Tổng học viên</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
                        <div className="text-base sm:text-lg font-bold text-amber-500 flex items-center justify-center gap-1">
                            <Award className="h-4 w-4" />
                            {course.instructor.stats.instructorRating}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Đánh giá TB</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
                        <div className="text-xs font-semibold text-foreground mt-1">
                            {formatDate(course.instructor.createdAt)}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Ngày gia nhập</div>
                    </div>
                </div>
            </div>

            {/* Instructor Bio */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground">Tiểu sử & Giới thiệu</h4>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed p-4 rounded-lg bg-muted/30 border border-border/60">
                    {course.instructor.bio || "Chưa có thông tin tiểu sử chi tiết."}
                </p>
            </div>
        </TabsContent>
    );
}
