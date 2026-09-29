import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
    CircleCheck, 
    Lock, 
    FileVideo, 
    Eye, 
    BookOpen, 
    Clock, 
    Link as LinkIcon, 
    Tag, 
    Calendar, 
    StepForward, 
    Check, 
    User, 
    ShieldCheck, 
    Grid2x2, 
    Image as ImageIcon,
    Sparkles,
    Layers,
    DollarSign,
    Award,
    CircleCheckBig
} from "lucide-react";
import { useSections } from "@/hooks/useSection";
import { formatDate, formatLessonDuration, formatSectionDuration } from "@/lib/utils";
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { CourseResponse } from "./courses";
import { DescriptionList } from "@/components/shared/DescriptionList";
import { CourseStatusBadge } from "@/components/shared/courseStatus";

interface ModalViewCourseProps {
    open: boolean;
    closeDialog: () => void;
    course: CourseResponse;
}

export default function ModalViewCourse({ open, closeDialog, course }: ModalViewCourseProps) {
    const CourseType = CourseTypeSchema.enum;
    const Level = LevelSchema.enum;

    // Fetch sections/curriculum only when course exists
    const { data: sections, isPending } = useSections(course?.id || "");

    if (!course) return null;

    // Price and Discount calculation
    const originalPrice = Number(course?.price || 0);
    const salePrice = Number(course?.discount || 0);
    const hasDiscount = course?.courseType === CourseType.PAID && salePrice > 0 && salePrice < originalPrice;
    const discountPercent = Math.round(
        ((originalPrice - salePrice) / originalPrice) * 100
    );

    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            {}
            <DialogContent showCloseButton={false} className="sm:max-w-3xl max-h-[92vh] p-0 gap-0 overflow-hidden flex flex-col border-border/80 shadow-2xl">
                
                {/* 1. HERO THUMBNAIL COVER BANNER (TOP EDGE-TO-EDGE) */}
                <div className="relative w-full h-48 sm:h-56 bg-zinc-900 shrink-0 overflow-hidden group">
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.currentTarget.style.display = "none");
                            }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                            <BookOpen className="h-16 w-16 text-primary/40" />
                        </div>
                    )}

                    {/* Gradient Overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    {/* Badges on Thumbnail Overlay (Top Left & Right) */}
                    <div className="absolute top-3 left-4 right-4 flex items-center justify-between gap-2 z-10">
                        <div className="flex items-center gap-2">
                            {course.category && (
                                <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md border-none font-medium px-2.5 py-1 text-xs">
                                    <Grid2x2 className="h-3 w-3 mr-1" />
                                    {course.category.name}
                                </Badge>
                            )}
                            <Badge variant="outline" className="bg-background/80 backdrop-blur-md font-mono text-[11px] text-foreground border-border/60">
                                ID: {course.id}
                            </Badge>
                        </div>

                        {/* Course Status Badge */}
                        <CourseStatusBadge status={course.status}></CourseStatusBadge>
                    </div>

                    {/* Price Tag Overlay on Bottom Right of Cover */}
                    <div className="absolute bottom-3 right-4 z-10">
                        {course.courseType === CourseType.FREE ? (
                            <Badge className="bg-emerald-600 text-white font-bold px-3 py-1 text-xs uppercase shadow-lg">
                                Miễn phí (FREE)
                            </Badge>
                        ) : hasDiscount ? (
                            <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg border shadow-lg">
                                <span className="line-through text-muted-foreground text-xs font-medium">
                                    {originalPrice.toLocaleString("vi-VN")}đ
                                </span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                                    {salePrice.toLocaleString("vi-VN")}đ
                                </span>
                                <Badge variant="destructive" className="text-[10px] px-1 py-0 font-bold">
                                    -{discountPercent}%
                                </Badge>
                            </div>
                        ) : (
                            <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs shadow-lg">
                                {originalPrice.toLocaleString("vi-VN")} đ
                            </Badge>
                        )}
                    </div>
                </div>

                {/* 2. COURSE TITLE & QUICK METRICS HEADER */}
                {}
                <DialogHeader className="px-6 pt-2 pb-3 bg-background border-b shrink-0 text-left">
                    <div className="space-y-1.5">
                        <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug tracking-tight">
                            {course.title}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                            {course.instructor && (
                                <span className="flex items-center gap-1.5 font-medium text-foreground">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={course.instructor.avatar || undefined} alt={course.instructor.name} />
                                        <AvatarFallback className="text-[10px]">
                                            {course.instructor.name?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {course.instructor.name}
                                </span>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Award className="h-3.5 w-3.5 text-primary" />
                                Cấp độ: <strong className="text-foreground">{course.level}</strong>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Ngày tạo: {formatDate(course.createdAt)}
                            </span>
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* 3. MAIN TAB NAVIGATION & CONTENT AREA */}
                {}
                <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col">
                    <div className="px-6 bg-muted/30 border-b">
                        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto my-2">
                            <TabsTrigger value="info" className="text-xs sm:text-sm font-semibold">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Thông tin chung
                            </TabsTrigger>
                            <TabsTrigger value="curriculum" className="text-xs sm:text-sm font-semibold">
                                <Layers className="h-4 w-4 mr-2" />
                                Nội dung khóa học
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB 1: THÔNG TIN CHUNG */}
                    <TabsContent value="info" className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                        
                        {/* Instructor Details Card */}
                        {course.instructor && (
                            <div className="flex items-center justify-between p-3.5 bg-card border rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                                        <AvatarImage src={course.instructor.avatar || undefined} alt={course.instructor.name} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 font-bold text-primary text-sm">
                                            {course.instructor.name?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" /> Giảng viên hướng dẫn
                                        </div>
                                        <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                            {course.instructor.name}
                                            <ShieldCheck className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
                                        </div>
                                        {course.instructor.email && (
                                            <div className="text-xs text-muted-foreground">
                                                {course.instructor.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {course.instructor.createdAt && (
                                    <Badge variant="secondary" className="text-[11px] font-normal hidden sm:inline-flex">
                                        Thành viên từ: {formatDate(course.instructor.createdAt)}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-card p-3 border rounded-xl space-y-1 shadow-sm">
                                <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Loại khóa học
                                </div>
                                <div className="font-bold text-xs sm:text-sm text-foreground">
                                    {course.courseType === CourseType.FREE ? "Miễn phí" : "Trả phí"}
                                </div>
                            </div>
                            <div className="bg-card p-3 border rounded-xl space-y-1 shadow-sm">
                                <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                    <Award className="h-3.5 w-3.5 text-blue-500" /> Cấp độ
                                </div>
                                <div className="font-bold text-xs sm:text-sm text-foreground">
                                    {course.level}
                                </div>
                            </div>
                            <div className="bg-card p-3 border rounded-xl space-y-1 shadow-sm">
                                <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                    <CircleCheck className="h-3.5 w-3.5 text-emerald-500" /> Trạng thái
                                </div>
                                <div className="font-bold text-xs sm:text-sm text-foreground">
                                    <CourseStatusBadge status={course.status}></CourseStatusBadge>
                                </div>
                            </div>
                            <div className="bg-card p-3 border rounded-xl space-y-1 shadow-sm">
                                <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                    <Grid2x2 className="h-3.5 w-3.5 text-amber-500" /> Danh mục
                                </div>
                                <div className="font-bold text-xs sm:text-sm text-foreground truncate">
                                    {course.category?.name || "Chưa phân loại"}
                                </div>
                            </div>
                        </div>

                        {/* Accordion Course Description Sections */}
                        {}
                        <Accordion type="multiple" className="w-full space-y-2.5">
                            <AccordionItem value="intro" className="border rounded-xl px-4 bg-card shadow-sm">
                                <AccordionTrigger className="font-bold text-sm hover:no-underline py-3">
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Giới thiệu khóa học
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground pt-1 pb-4 leading-relaxed">
                                    {course.courseDescription?.introduction || "Chưa có thông tin giới thiệu."}
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="outcomes" className="border rounded-xl px-4 bg-card shadow-sm">
                                <AccordionTrigger className="font-bold text-sm hover:no-underline py-3">
                                    <span className="flex items-center gap-2">
                                        <CircleCheckBig className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        Bạn sẽ học được gì?
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground pt-1 pb-4">
                                    <DescriptionList
                                        value={course.courseDescription?.learningOutcomes}
                                        icon={Check}
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="requirements" className="border rounded-xl px-4 bg-card shadow-sm">
                                <AccordionTrigger className="font-bold text-sm hover:no-underline py-3">
                                    <span className="flex items-center gap-2">
                                        <StepForward className="h-4 w-4 text-blue-500" />
                                        Yêu cầu trước khi học
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground pt-1 pb-4">
                                    <DescriptionList
                                        value={course.courseDescription?.requirements}
                                        icon={StepForward} 
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="resources" className="border rounded-xl px-4 bg-card shadow-sm">
                                <AccordionTrigger className="font-bold text-sm hover:no-underline py-3">
                                    <span className="flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4 text-indigo-500" />
                                        Tài nguyên đi kèm
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground pt-1 pb-4">
                                    {course.courseDescription?.resources ? (
                                        <a
                                            href={course.courseDescription.resources}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
                                        >
                                            <LinkIcon className="h-3.5 w-3.5" /> Mở liên kết tài nguyên
                                        </a>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">
                                            Không có link tài nguyên đi kèm.
                                        </p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Metadata Footer Table */}
                        <div className="divide-y divide-border border rounded-xl px-4 py-1 bg-card shadow-sm text-xs">
                            <div className="flex items-center justify-between py-2.5">
                                <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                                    <LinkIcon className="h-3.5 w-3.5" /> Đường dẫn (Slug)
                                </span>
                                <span className="font-mono font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                                    {course.slug}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Tag className="h-3.5 w-3.5" /> Thẻ (Tags)
                                </span>
                                <div className="flex flex-wrap justify-end gap-1.5 max-w-[280px]">
                                    {course?.tags && course.tags.length > 0 ? (
                                        course.tags.map((tag: any) => (
                                            <Badge key={tag.id} variant="secondary" className="text-[10px] font-medium">
                                                #{tag.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground italic">Chưa có tag</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" /> Cập nhật lần cuối
                                </span>
                                <span className="font-medium text-foreground">{formatDate(course.updatedAt)}</span>
                            </div>
                        </div>

                    </TabsContent>

                    {/* TAB 2: NỘI DUNG KHÓA HỌC (CURRICULUM) */}
                    {}
                    <TabsContent value="curriculum" className="flex-1 overflow-y-auto px-6 py-4">
                        {isPending ? (
                            <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                                <Clock className="h-6 w-6 animate-spin text-primary" />
                                Đang tải chương trình học...
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Curriculum Overview Stats Header */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-card p-3 rounded-xl border flex flex-col items-center justify-center shadow-sm">
                                        <div className="text-2xl font-black text-primary">{sections?.length || 0}</div>
                                        <div className="text-[11px] uppercase text-muted-foreground font-bold tracking-wider mt-0.5">
                                            Chương học
                                        </div>
                                    </div>
                                    <div className="bg-card p-3 rounded-xl border flex flex-col items-center justify-center shadow-sm">
                                        <div className="text-2xl font-black text-primary">
                                            {sections?.reduce((acc: number, section: any) => acc + (section.lessons?.length || 0), 0) || 0}
                                        </div>
                                        <div className="text-[11px] uppercase text-muted-foreground font-bold tracking-wider mt-0.5">
                                            Bài giảng
                                        </div>
                                    </div>
                                </div>

                                {/* Sections Accordion */}
                                <Accordion type="multiple" className="w-full space-y-3">
                                    {sections && sections.length > 0 ? (
                                        sections.map((section: any) => {
                                            let totalDuration = 0;
                                            section.lessons?.forEach((lesson: any) => {
                                                totalDuration += lesson.duration || 0;
                                            });

                                            return (
                                                <AccordionItem 
                                                    key={section.id} 
                                                    value={section.id.toString()} 
                                                    className="border rounded-xl px-4 bg-card shadow-sm"
                                                >
                                                    <AccordionTrigger className="hover:no-underline py-3">
                                                        <div className="flex items-center justify-between w-full min-w-0 gap-4 mr-2">
                                                            <span className="font-bold text-sm truncate text-left text-foreground">
                                                                {section.title}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal shrink-0">
                                                                <Badge variant="secondary" className="text-[10px] font-semibold">
                                                                    {section.lessons?.length || 0} bài
                                                                </Badge>
                                                                <span>•</span>
                                                                <span>{formatSectionDuration(totalDuration)}</span>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>

                                                    <AccordionContent className="pt-2 pb-4">
                                                        <div className="space-y-2">
                                                            {section.lessons?.length > 0 ? (
                                                                section.lessons.map((lesson: any) => (
                                                                    <div
                                                                        key={lesson.id}
                                                                        className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
                                                                    >
                                                                        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                                                                            <FileVideo className="h-4 w-4 text-primary shrink-0" />
                                                                            <span className="font-medium text-xs sm:text-sm text-foreground truncate">
                                                                                {lesson.title}
                                                                            </span>
                                                                            {lesson.isPreview && (
                                                                                <Badge 
                                                                                    variant="outline" 
                                                                                    className="shrink-0 gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0 font-semibold"
                                                                                >
                                                                                    <Eye className="h-3 w-3" />
                                                                                    Xem trước
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        {lesson.duration && (
                                                                            <span className="text-xs text-muted-foreground font-mono shrink-0">
                                                                                {formatLessonDuration(lesson.duration)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="py-3 text-center text-xs text-muted-foreground italic">
                                                                    Chưa có bài học nào trong chương này.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            );
                                        })
                                    ) : (
                                        <div className="py-10 text-center text-sm text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                                            Khóa học hiện chưa cập nhật chương trình học.
                                        </div>
                                    )}
                                </Accordion>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* 4. MODAL FOOTER */}
                {}
                <DialogFooter className="px-6 py-6 bg-muted/20 shrink-0 flex items-center">
                    <div className="text-xs text-muted-foreground font-medium hidden sm:block">
                         ID Khóa học: <span className="font-mono text-foreground">{course.id}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={closeDialog} className="px-5 font-semibold">
                        Đóng
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}