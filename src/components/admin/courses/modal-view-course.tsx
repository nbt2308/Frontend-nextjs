import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Lock, FileVideo, Eye, BookOpen, Menu, FileText, Clock, Link, Tag, Calendar } from "lucide-react";
import { useSections } from "@/hooks/useSection";
import { formatDate, formatDuration } from "@/lib/utils";
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { CourseType as ICourseType } from "@/types/generated-zod/schemas/models/Course.schema"

interface ModalViewCourseProps {
    open: boolean;
    closeDialog: () => void;
    course: ICourseType;
}

export default function ModalViewCourse({ open, closeDialog, course }: ModalViewCourseProps) {
    const CourseType = CourseTypeSchema.enum;
    const Level = LevelSchema.enum;
    // Only fetch sections if course exists and modal is open
    const { data: sections, isPending } = useSections(course?.id || "");

    if (!course) return null;

    //format price
    const originalPrice = Number(course?.price || 0);
    const salePrice = Number(course?.discount || 0);
    const hasDiscount = course?.courseType === CourseType.PAID && salePrice > 0 && salePrice < originalPrice
    const discountPercent = Math.round(
        ((originalPrice - salePrice) / originalPrice) * 100
    )
    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Chi Tiết Khoá Học</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                #{course.id}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />

                <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                        <TabsTrigger value="curriculum">Nội dung khoá học</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                            {/* Vòng tròn Avatar */}
                            <Avatar className="h-10 w-10 rounded-full">
                                <AvatarImage src={course.thumbnail || undefined} alt={course.title} />
                                <AvatarFallback className="rounded-full">{course.title?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="leading-tight flex gap-2 flex-col">
                                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center ml-1">
                                    <span>{course.title}</span>
                                </div>
                                <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-background shrink-0">
                                    ID: {course.id}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                                    Loại khoá học
                                </div>
                                <Badge variant="outline" className="font-medium">
                                    {course.courseType === CourseType.FREE ? "Miễn phí" : "Trả phí"}
                                </Badge>
                            </div>
                            <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">Cấp độ</div>
                                <Badge variant="secondary" className="font-medium">
                                    {course.level}
                                </Badge>
                            </div>
                            <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">Trạng thái</div>
                                <Badge className={
                                    course.status ?
                                        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                        :
                                        "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-800"
                                } variant="outline">
                                    {course.status ? (
                                        <CircleCheck className="h-3 w-3" />
                                    ) : (
                                        <Lock className="h-3 w-3" />
                                    )}
                                    {course.status ? "Hoạt động" : "Đã ẩn"}
                                </Badge>
                            </div>
                            <div className="bg-card p-3 rounded border rounded-lg space-y-1.5">
                                <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">Giá</div>
                                <div className="font-medium text-sm">
                                    {course.courseType === CourseType.FREE ? "Miễn phí" : hasDiscount ? (
                                        <div className="flex items-center gap-2">
                                            <span className="line-through text-muted-foreground text-xs">
                                                {originalPrice.toLocaleString("vi-VN")} đ
                                            </span>
                                            <span className="text-emerald-600 font-bold text-sm">
                                                {salePrice.toLocaleString("vi-VN")} đ
                                            </span>
                                            <Badge variant="destructive" className="text-xs">
                                                -{discountPercent}%
                                            </Badge>
                                        </div>
                                    ) : (
                                        `${originalPrice.toLocaleString("vi-VN")} đ`
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-lg border bg-card space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5" />
                                Mô tả khóa học
                            </span>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {course.description ? course.description : <span className="italic text-muted-foreground">Chưa có mô tả cho khóa học này.</span>}
                            </p>
                        </div>
                        <div className="divide-y divide-border border rounded-lg px-3.5 py-1 bg-card">
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Link className="h-3.5 w-3.5" /> Đường dẫn (Slug)</span>
                                <span className="text-xs font-medium">{course.slug}</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tag:</span>
                                <div className="flex gap-2 font-medium">
                                    {course?.tags.map((tag: any) => (
                                        <Badge key={tag.id} variant={"secondary"} className="text-xs">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Ngày tạo</span>
                                <span className="text-xs font-medium">{formatDate(course.createdAt)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Cập nhật lần cuối
                                </span>
                                <span className="text-xs font-medium">{formatDate(course.updatedAt)}</span>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="curriculum" className="flex-1 overflow-y-auto pr-2 mt-4">
                        {isPending ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">Đang tải nội dung...</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center justify-center">
                                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{sections?.length || 0}</div>
                                        <div className="text-[10px] uppercase text-zinc-500 font-semibold mt-1">Tổng chương</div>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center justify-center">
                                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                            {sections?.reduce((acc: number, section: any) => acc + (section.lessons?.length || 0), 0) || 0}
                                        </div>
                                        <div className="text-[10px] uppercase text-zinc-500 font-semibold mt-1">Tổng bài giảng</div>
                                    </div>
                                </div>
                                <Accordion type="multiple" className="w-full space-y-3">
                                    {sections && sections.length > 0 ? sections.map((section: any) => {
                                        let totalDuration = 0;
                                        section.lessons?.forEach((lesson: any) => {
                                            totalDuration += lesson.duration || 0;
                                        });

                                        return (
                                            <AccordionItem key={section.id} value={section.id.toString()} className="border rounded-md px-4 bg-zinc-50/50 dark:bg-zinc-900/20">
                                                <AccordionTrigger className="hover:no-underline py-3">
                                                    <div className="flex items-center justify-between w-full min-w-0 gap-4 mr-2">
                                                        <span className="font-semibold text-sm truncate text-left">
                                                            {section.title}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal shrink-0">
                                                            <span>{section.lessons?.length || 0} bài</span>
                                                            <span>•</span>
                                                            <span>{formatDuration(totalDuration)}</span>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>

                                                <AccordionContent className="pt-2 pb-4">
                                                    <div className="space-y-2">
                                                        {section.lessons?.length > 0 ? (
                                                            section.lessons.map((lesson: any) => (
                                                                <div
                                                                    key={lesson.id}
                                                                    className="flex items-center justify-between p-2.5 rounded-md border bg-background"
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                                                                        <FileVideo className="h-4 w-4 text-blue-500 shrink-0" />
                                                                        <span className="font-medium text-sm truncate">{lesson.title}</span>
                                                                        {lesson.isPreview && (
                                                                            <Badge variant="outline" className="shrink-0 gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 text-[10px] px-1.5 py-0">
                                                                                <Eye className="h-3 w-3" />
                                                                                Xem trước
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {lesson.duration && (
                                                                        <span className="text-xs text-muted-foreground shrink-0">
                                                                            {formatDuration(lesson.duration)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-4 text-center text-xs text-muted-foreground italic">
                                                                Chưa có bài học
                                                            </div>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    }) : (
                                        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                                            Khoá học chưa có chương trình học
                                        </div>
                                    )}
                                </Accordion>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Button variant="outline" onClick={closeDialog}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}