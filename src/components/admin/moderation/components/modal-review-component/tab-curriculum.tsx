import { TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, FileVideo, Play, PlayCircle, Download, Loader2, Paperclip, FileText, NotebookText } from "lucide-react";
import { ModerationCourse, ModerationLesson } from "../../moderation.types";
import { formatFileSize, formatLessonDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LessonService } from "@/services/lesson";
import { toast } from "sonner";
import ModalContentPreview from "@/components/shared/modal-content-preview";

export default function TabCurriculum({
    course,
    summary,
    formatSectionDuration,
    setSelectedLessonForPreview,
    setPreviewModalOpen
}: {
    course: ModerationCourse,
    summary: any,
    formatSectionDuration: (seconds: number) => string,
    setSelectedLessonForPreview: (lesson: ModerationLesson) => void,
    setPreviewModalOpen: (open: boolean) => void
}) {
    const [downloadingResourceId, setDownloadingResourceId] = useState<number | null>(null);
    const [contentPreviewLesson, setContentPreviewLesson] = useState<ModerationLesson | null>(null);

    const handleOpenLessonPreview = (lesson: ModerationLesson) => {
        setSelectedLessonForPreview(lesson);
        setPreviewModalOpen(true);
    };

    const handleDownloadResource = async (lessonId: number, resource: any) => {
        try {
            setDownloadingResourceId(resource.id);
            const result = await LessonService.downloadResource(lessonId, resource.id);
            const link = document.createElement("a");
            link.href = result.url;
            link.download = result.name || resource.name;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) {
            toast.error(error.message || "Lỗi khi tải tài liệu");
        } finally {
            setDownloadingResourceId(null);
        }
    };

   
    return (
        < TabsContent
            value="curriculum"
            className="flex-1 overflow-y-auto p-6 m-0 space-y-4 focus-visible:outline-none"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">
                        Cấu trúc khóa học
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Kiểm tra nội dung các bài giảng, thời lượng và xem thử video bài giảng.
                    </p>
                </div>
                <Badge variant="outline" className="text-xs">
                    {summary.totalPreviewLessons} bài cho phép xem trước
                </Badge>
            </div>

            {
                course.sections.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg border-dashed border-border text-muted-foreground text-xs">
                        Khóa học này chưa được tạo chương mục bài giảng nào.
                    </div>
                ) : (
                    <Accordion
                        type="multiple"
                        defaultValue={course.sections.map((s) => `section-${s.id}`)}
                        className="space-y-3"
                    >
                        {course.sections.map((section, sIndex) => (
                            <AccordionItem
                                key={section.id}
                                value={`section-${section.id}`}
                                className="border border-border rounded-lg px-4 bg-card shadow-xs overflow-hidden"
                            >
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <div className="flex items-center justify-between w-full pr-3 text-left">
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-semibold text-primary">
                                                Chương {sIndex + 1}
                                            </div>
                                            <div className="text-sm font-medium text-foreground">
                                                {section.title}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                                            <span>{section.lessons?.length || 0} bài</span>
                                            <span>•</span>
                                            <span>
                                                {formatSectionDuration(
                                                    section.lessons?.reduce(
                                                        (acc, l) => acc + (l.duration || 0),
                                                        0
                                                    ) || 0
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="pt-1 pb-3 space-y-2 border-t border-border/60">
                                    {(!section.lessons || section.lessons.length === 0) ? (
                                        <div className="p-3 text-xs text-rose-500 font-medium bg-rose-500/10 rounded-md flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            Chương này chưa có bài học nào!
                                        </div>
                                    ) : (
                                        section.lessons.map((lesson) => {
                                            const isReady = lesson.videoStatus === "READY";
                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className="flex flex-col rounded-md border border-border/40 overflow-hidden bg-card"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 hover:bg-muted/50 transition-colors gap-2">
                                                        <div className="flex items-start gap-2.5 min-w-0">
                                                            <div className="p-1.5 rounded-md bg-muted text-muted-foreground shrink-0 mt-0.5">
                                                                <FileVideo className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-xs font-medium text-foreground line-clamp-1">
                                                                        {lesson.title}
                                                                    </span>

                                                                    {/* Preview Badge if isPreview === true */}
                                                                    {lesson.isPreview && (
                                                                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                                                            <PlayCircle className="h-2.5 w-2.5" />
                                                                            Xem trước
                                                                        </Badge>
                                                                    )}

                                                                    {/* Video Status Badge */}
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`text-[10px] px-1.5 py-0 h-4 ${isReady
                                                                            ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                                                            : lesson.videoStatus === "FAILED"
                                                                                ? "border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10"
                                                                                : "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                                                            }`}
                                                                    >
                                                                        {lesson.videoStatus}
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {formatLessonDuration(lesson.duration)}
                                                                    </span>
                                                                    {lesson.resources && lesson.resources.length > 0 && (
                                                                        <span>
                                                                            • {lesson.resources.length} tài liệu kèm theo
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action button: Preview content & Preview video */}
                                                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 mt-2 sm:mt-0">
                                                            {lesson.content && lesson.content.length > 0 && (
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setContentPreviewLesson(lesson)}
                                                                    className="h-7 text-xs px-2.5 gap-1.5 hover:border-primary hover:text-primary"
                                                                >
                                                                    <NotebookText className="h-3 w-3" />
                                                                    Nội dung
                                                                </Button>
                                                            )}
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleOpenLessonPreview(lesson)}
                                                                className="h-7 text-xs px-2.5 gap-1.5 hover:border-primary hover:text-primary"
                                                            >
                                                                <Play className="h-3 w-3 fill-current" />
                                                                Preview video
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Resources Row */}
                                                    {lesson.resources && lesson.resources.length > 0 && (
                                                        <div className="border-t bg-muted/20 px-3 py-2">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
                                                                {lesson.resources.map((resource) => (
                                                                    <button
                                                                        key={resource.id}
                                                                        onClick={() => handleDownloadResource(lesson.id, resource)}
                                                                        disabled={downloadingResourceId === resource.id}
                                                                        className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 cursor-pointer"
                                                                        title={`Tải ${resource.name} (${formatFileSize(resource.size)})`}
                                                                    >
                                                                        {downloadingResourceId === resource.id ? (
                                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                                        ) : (
                                                                            <Download className="h-3 w-3" />
                                                                        )}
                                                                        <span className="truncate max-w-[150px]">{resource.name}</span>
                                                                        <span className="text-muted-foreground">({formatFileSize(resource.size)})</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )
            }

            {/* Content Preview Modal */}
            <ModalContentPreview
                open={!!contentPreviewLesson}
                onClose={() => setContentPreviewLesson(null)}
                title={contentPreviewLesson?.title}
                content={contentPreviewLesson?.content}
            />
        </TabsContent >
    )
}