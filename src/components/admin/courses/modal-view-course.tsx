import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Lock, FileVideo, Eye } from "lucide-react";
import { useSections } from "@/hooks/useSection";
import { formatDuration } from "@/lib/utils";

interface ModalViewCourseProps {
    open: boolean;
    closeDialog: () => void;
    course: any;
}

export default function ModalViewCourse({ open, closeDialog, course }: ModalViewCourseProps) {
    // Only fetch sections if course exists and modal is open
    const { data: sections, isPending } = useSections(course?.id || "");

    if (!course) return null;

    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chi tiết khoá học</DialogTitle>
                </DialogHeader>
                <Separator />
                
                <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                        <TabsTrigger value="curriculum">Nội dung khoá học</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
                        <div className="flex items-center gap-4 py-2">
                            <Avatar className="h-16 w-16 rounded-md">
                                <AvatarImage src={course.thumbnail} alt={course.title} className="object-cover" />
                                <AvatarFallback className="rounded-md">{course.title?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="leading-tight">
                                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                                    {course.title}
                                </h3>
                                <span className="text-xs font-mono text-zinc-400">ID: {course.id}</span>
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800/50 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-[10px] uppercase text-zinc-500 font-semibold mb-1">Loại khoá học</div>
                                <Badge variant="outline" className="font-medium">
                                    {course.courseType === "FREE" ? "Miễn phí" : "Trả phí"}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-zinc-500 font-semibold mb-1">Cấp độ</div>
                                <Badge variant="secondary" className="font-medium">
                                    {course.level}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-zinc-500 font-semibold mb-1">Trạng thái</div>
                                <Badge className={
                                    course.status ?
                                        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                        :
                                        "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-800"
                                } variant="outline">
                                    {course.status ? (
                                        <CircleCheck className="mr-1.5 h-3 w-3" />
                                    ) : (
                                        <Lock className="mr-1.5 h-3 w-3" />
                                    )}
                                    {course.status ? "Hoạt động" : "Đã ẩn"}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-zinc-500 font-semibold mb-1">Giá</div>
                                <div className="font-medium text-sm">
                                    {course.courseType === "FREE" ? "Miễn phí" : `${Number(course.price).toLocaleString('vi-VN')} đ`}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex flex-row justify-between items-center py-2 border-b border-dashed">
                                <span className="text-sm font-medium text-muted-foreground">Đường dẫn (Slug):</span>
                                <span className="text-sm">{course.slug}</span>
                            </div>
                            <div className="flex flex-col gap-1 py-2 border-b border-dashed">
                                <span className="text-sm font-medium text-muted-foreground">Mô tả:</span>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                    {course.description || "Chưa có mô tả"}
                                </p>
                            </div>
                            <div className="flex flex-row justify-between items-center py-2 border-b border-dashed">
                                <span className="text-sm font-medium text-muted-foreground">Ngày tạo:</span>
                                <span className="text-sm">{new Date(course.createdAt).toLocaleString('vi-VN')}</span>
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