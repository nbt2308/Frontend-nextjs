import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FolderGit2, ExternalLink, Check, CheckCircle, StepForward, Info, LinkIcon, Tags, BarChart, CreditCard } from "lucide-react";
import { ModerationCourse } from "../../moderation.types";
import { DescriptionList } from "@/components/shared/DescriptionList";
import { CourseTypeSchema } from "@/types/generated-zod/schemas";

export default function TabInfo({
    course,
    price,
    hasDiscount,
    discount,
    discountPercent
}: {
    course: ModerationCourse;
    price: number;
    hasDiscount: boolean;
    discount: number;
    discountPercent: number;
}) {
    const CourseType = CourseTypeSchema.enum;
    return (
        <TabsContent
            value="info"
            className="flex-1 overflow-y-auto p-6 m-0 space-y-6 focus-visible:outline-none"
        >
            <div className="w-full h-56 sm:h-72 md:h-[360px] rounded-2xl overflow-hidden border border-border shadow-sm relative group bg-muted/50 flex items-center justify-center">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <BookOpen className="h-12 w-12 opacity-50" />
                        <span className="text-sm font-medium">Chưa có ảnh bìa</span>
                    </div>
                )}

                {/* Badge nổi trên ảnh cho loại khóa học (Miễn phí/Trả phí) */}
                <div className="absolute top-4 right-4">
                    {course.courseType === CourseType.FREE ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-md px-3 py-1 text-xs font-bold uppercase tracking-wider">
                            Miễn phí
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-md px-3 py-1 text-xs font-bold uppercase tracking-wider border-border">
                            Trả phí
                        </Badge>
                    )}
                </div>
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Info (Left Col) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-muted/20 border border-border/50 rounded-xl p-5 space-y-4">

                        {/* Slug */}
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                <LinkIcon className="w-3.5 h-3.5" />
                                Đường dẫn định danh (Slug)
                            </div>
                            <div className="font-mono text-sm p-2.5 rounded-lg bg-background border border-border text-foreground truncate">
                                /{course.slug}
                            </div>
                        </div>

                        {/* Tags */}
                        {course.tags && course.tags.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                    <Tags className="w-3.5 h-3.5" />
                                    Tags từ khóa
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {course.tags.map((t) => (
                                        <Badge key={t.id} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-xs font-medium">
                                            #{t.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing & Level (Right Col) */}
                <div className="space-y-4">
                    <div className="bg-muted/30 border border-border/60 rounded-xl p-5 shadow-sm space-y-5 h-full">

                        {/* Cấp độ */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <BarChart className="w-3.5 h-3.5" />
                                Cấp độ yêu cầu
                            </div>
                            <div>
                                <Badge variant="outline" className="text-sm px-3 py-1 bg-background">
                                    {course.level}
                                </Badge>
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <CreditCard className="w-3.5 h-3.5" />
                                Giá
                            </div>
                            <div className="text-foreground">
                                {course.courseType === "FREE" ? (
                                    <div className="text-xl font-bold text-emerald-600">0đ (Miễn phí)</div>
                                ) : (
                                    <div className="flex flex-col">
                                        {hasDiscount && (

                                            <div className="flex items-center gap-1">
                                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400   ">
                                                    -{discountPercent}%
                                                </span>
                                                <span className="text-2xl font-black text-primary tracking-tight">
                                                    {discount.toLocaleString("vi-VN")}đ
                                                </span>
                                            </div>
                                        )}
                                        {hasDiscount && (
                                            <span className="text-muted-foreground font-medium line-through text-sm mt-0.5 flex items-center gap-2">
                                                Giá gốc: {price.toLocaleString("vi-VN")}đ
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator />

            {/* Description sections */}
            <div className="space-y-8">

                {/* Giới thiệu */}
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                        <Info className="w-4 h-4 text-primary" />
                        Phần giới thiệu (Introduction)
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed p-5 rounded-xl bg-muted/20 border border-border/40">
                        {course.courseDescription?.introduction || (
                            <span className="italic opacity-70">(Chưa có nội dung giới thiệu)</span>
                        )}
                    </p>
                </div>

                {/* Objectives & Requirements - 2 Columns on large screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Learning Outcomes */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            Mục tiêu (Outcomes)
                        </h4>
                        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed p-5 rounded-xl bg-muted/20 border border-border/40 h-full">
                            <DescriptionList
                                value={course.courseDescription?.learningOutcomes}
                                icon={CheckCircle}
                            />
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                            <StepForward className="w-4 h-4 text-amber-500" />
                            Yêu cầu (Requirements)
                        </h4>
                        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed p-5 rounded-xl bg-muted/20 border border-border/40 h-full">
                            <DescriptionList
                                value={course.courseDescription?.requirements}
                                icon={StepForward}
                            />
                        </div>
                    </div>
                </div>

                {/* External Resource Links */}
                {course.courseDescription?.resources && (
                    <div className="space-y-3 pt-2">
                        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                            <FolderGit2 className="w-4 h-4 text-blue-500" />
                            Tài nguyên (Resources)
                        </h4>
                        <div className="p-4 rounded-xl border border-border/60 bg-background flex items-center">
                            <a
                                href={course.courseDescription.resources}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline font-mono break-all"
                            >
                                <ExternalLink className="h-4 w-4 shrink-0" />
                                {course.courseDescription.resources}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </TabsContent>
    );
}
