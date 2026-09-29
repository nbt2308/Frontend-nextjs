"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, FileVideo, Edit2, Trash2, Eye, BookOpen, Clock, Layers, FileText, Play, Download, Loader2, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SheetAddSection } from "./sheet-add-section";
import { SheetEditSection } from "./sheet-edit-section";
import { useDeleteSection, useSections } from "@/hooks/useSection";
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal";
import { Badge } from "@/components/ui/badge";
import { SheetAddLesson } from "./sheet-add-lesson";
import { formatLessonDuration } from "@/lib/utils";
import { useDeleteLesson } from "@/hooks/useLession";
import { SheetEditLesson } from "./sheet-edit-lesson";
import { SectionType } from "@/types/generated-zod/schemas/models/Section.schema";
import { LessonType } from "@/types/generated-zod/schemas/models/Lesson.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LessonService } from "@/services/lesson";
import { toast } from "sonner";
import KpiCard from "@/components/shared/SummaryCard";

type ResourceType = {
    id: number;
    name: string;
    mimeType: string;
    size: number | null;
};

export type LessonWithResources = LessonType & {
    resources?: ResourceType[];
};

export type SectionTypeResponse = Omit<SectionType, "lessons"> & {
    lessons: LessonWithResources[];
};

export default function CurriculumView({ courseId }: { courseId: string }) {
    const router = useRouter();

    const { data: sections, isPending, isError, error, refetch } = useSections(courseId);
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

    //edit section
    const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<{ id: number; title: string, order: number, courseId: string } | null>(null);

    //add lesson
    const [addLesson, setAddLesson] = useState<{ sectionId: number } | null>(null);
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);

    //edit lesson
    const [editingLesson, setEditingLesson] = useState<LessonWithResources | null>(null);
    const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);

    //delete section
    const [deleteSection, setDeleteSection] = useState<{ id: number; title: string, courseId: string } | null>(null);
    const [showDeleteSectionAlert, setShowDeleteSectionAlert] = useState(false)
    const { mutateAsync: deleteSectionMutation, isPending: isDeletePending } = useDeleteSection()
    const deleteSectionHandler = () => {
        if (!deleteSection) return;
        deleteSectionMutation(deleteSection.id, {
            onSuccess: () => {
                setShowDeleteSectionAlert(false);
                setDeleteSection(null);
            }
        });
    }

    //delete lesson
    const [deletingLesson, setDeletingLesson] = useState<{ id: number; title: string, sectionId: number } | null>(null);
    const [showDeleteLessonAlert, setShowDeleteLessonAlert] = useState(false);
    const { mutateAsync: deleteLessonMutation, isPending: isDeleteLessonPending } = useDeleteLesson()
    const deleteLessonHandler = () => {
        if (!deletingLesson) return;
        deleteLessonMutation(deletingLesson.id, {
            onSuccess: () => {
                setShowDeleteLessonAlert(false);
                setDeletingLesson(null);
            }
        });
    }

    //video preview modal
    const [videoPreviewLesson, setVideoPreviewLesson] = useState<LessonWithResources | null>(null);
    const [showVideoPreview, setShowVideoPreview] = useState(false);

    //download resource
    const [downloadingResourceId, setDownloadingResourceId] = useState<number | null>(null);

    const handleDownloadResource = async (lessonId: number, resource: ResourceType) => {
        try {
            setDownloadingResourceId(resource.id);
            const result = await LessonService.downloadResource(lessonId, resource.id);
            // Open signed URL in new tab to trigger download
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

    // Summary stats
    const stats = useMemo(() => {
        if (!sections || sections.length === 0) {
            return { totalSections: 0, totalLessons: 0, totalDuration: 0, totalResources: 0 };
        }
        let totalLessons = 0;
        let totalDuration = 0;
        let totalResources = 0;
        sections.forEach((section: SectionTypeResponse) => {
            totalLessons += section.lessons?.length || 0;
            section.lessons?.forEach((lesson: LessonWithResources) => {
                totalDuration += lesson.duration || 0;
                totalResources += lesson.resources?.length || 0;
            });
        });
        return { totalSections: sections.length, totalLessons, totalDuration, totalResources };
    }, [sections]);

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return "N/A";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between sm:flex-row flex-col sm:gap-0 gap-4">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/courses")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Quản lý chương trình học</h1>
                        <span className="text-muted-foreground text-sm">Khoá học: {courseId}</span>
                    </div>
                </div>
                <Button onClick={() => setIsAddSectionOpen(true)} className="w-full sm:w-auto gap-2">
                    <Plus className="h-4 w-4" /> Thêm Chương mới
                </Button>
                {isAddSectionOpen && (
                    <SheetAddSection
                        courseId={courseId}
                        open={isAddSectionOpen}
                        onOpenChange={(open) => {
                            setIsAddSectionOpen(open);
                        }} />
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {isPending ? (
                    <>
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                    </>
                ) : (
                    <>
                        <KpiCard
                            label="Tổng số chương"
                            value={stats.totalSections.toString()}
                            icon={BookOpen}
                            iconColor="text-blue-500"
                            glowColor="bg-blue-500/15 border-blue-500/30"
                            valueColor="text-blue-500"
                            hoverBorderColor="hover:border-blue-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        />
                        <KpiCard
                            label="Tổng số bài học"
                            value={stats.totalLessons.toString()}
                            icon={BookOpen}
                            iconColor="text-emerald-500"
                            glowColor="bg-emerald-500/10 border-emerald-500/30"
                            valueColor="text-emerald-500"
                            hoverBorderColor="hover:border-emerald-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Tổng thời lượng"
                            value={formatLessonDuration(stats.totalDuration)}
                            icon={BookOpen}
                            iconColor="text-amber-500"
                            glowColor="bg-amber-500/10 border-amber-500/30"
                            valueColor="text-amber-500"
                            hoverBorderColor="hover:border-amber-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                        />
                        <KpiCard
                            label="Tổng tài liệu"
                            value={stats.totalResources.toString()}
                            icon={BookOpen}
                            iconColor="text-violet-500"
                            glowColor="bg-violet-500/10 border-violet-500/30"
                            valueColor="text-violet-500"
                            hoverBorderColor="hover:border-violet-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                        />
                    </>
                )}
            </div>

            {/* Sections Accordion */}
            <div className="rounded-xl border shadow-sm">
                <Accordion type="multiple" className="w-full">
                    {sections && sections.length > 0 ? sections?.map((section: SectionTypeResponse, sectionIndex: number) => {
                        let totalDurationOfSection = 0;
                        section.lessons.forEach((lesson: LessonWithResources) => {
                            totalDurationOfSection += lesson.duration || 0;
                        });
                        return (
                            <AccordionItem key={section.id} value={String(section.id)} className="border-b last:border-b-0">
                                <div className="flex items-center justify-between w-full group/section hover:bg-muted/30 px-5 transition-colors">
                                    <AccordionTrigger className="hover:no-underline py-4 flex-1 min-w-0 pr-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full min-w-0 gap-2 sm:gap-4 mr-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0">
                                                    {sectionIndex + 1}
                                                </div>
                                                <span className="font-semibold text-sm sm:truncate text-left leading-tight">
                                                    {section.title}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal shrink-0 ml-10 sm:ml-0">
                                                <Badge variant="secondary" className="font-normal gap-1 text-xs">
                                                    <BookOpen className="h-3 w-3" />
                                                    {section.lessons.length ?? 0}
                                                </Badge>
                                                <Badge variant="secondary" className="font-normal gap-1 text-xs">
                                                    <Clock className="h-3 w-3" />
                                                    {formatLessonDuration(totalDurationOfSection)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    <div className="flex items-center space-x-1 opacity-0 group-hover/section:opacity-100 transition-opacity shrink-0 ml-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setEditingSection(section);
                                                setIsEditSectionOpen(true);
                                            }}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDeleteSection(section);
                                                setShowDeleteSectionAlert(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <AccordionContent className="px-5 pt-2 pb-5">
                                    <div className="space-y-2">
                                        {section?.lessons?.length > 0 ? (
                                            section?.lessons?.map((lesson: LessonWithResources, lessonIndex: number) => (
                                                <div
                                                    key={lesson.id}
                                                    className="rounded-lg border bg-card overflow-hidden group"
                                                >
                                                    {/* Lesson Header Row */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-3 sm:gap-0">
                                                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-0 sm:mr-3">
                                                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-muted-foreground text-xs font-medium shrink-0">
                                                                {lessonIndex + 1}
                                                            </div>
                                                            <FileVideo className="h-4 w-4 text-primary shrink-0" />
                                                            <span className="font-medium text-sm sm:truncate leading-tight">{lesson.title}</span>
                                                            {lesson.isPreview && (
                                                                <Badge variant="outline" className="shrink-0 gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 text-[11px] px-1.5 py-0">
                                                                    <Eye className="h-3 w-3 hidden sm:inline-block" />
                                                                    Xem trước
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2 shrink-0 ml-9 sm:ml-0 justify-between sm:justify-end">
                                                            {lesson.duration && (
                                                                <Badge variant="outline" className="font-normal text-xs gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {formatLessonDuration(lesson.duration)}
                                                                </Badge>
                                                            )}

                                                            {/* Video preview button or status */}
                                                            {['PENDING', 'UPLOADING', 'PROCESSING', 'FAILED'].includes(lesson.videoStatus) && (
                                                                <Badge variant="secondary" className="font-normal text-[10px] uppercase bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-200">
                                                                    {lesson.videoStatus === 'PENDING' ? 'Chờ xử lý' :
                                                                        lesson.videoStatus === 'UPLOADING' ? 'Đang tải lên' :
                                                                            lesson.videoStatus === 'PROCESSING' ? 'Đang xử lý' : 'Thất bại'}
                                                                </Badge>
                                                            )}
                                                            {lesson.videoStatus === 'READY' && lesson.videoId && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                                    onClick={() => {
                                                                        setVideoPreviewLesson(lesson);
                                                                        setShowVideoPreview(true);
                                                                    }}
                                                                    title="Xem video"
                                                                >
                                                                    <Play className="h-3.5 w-3.5" />
                                                                </Button>
                                                            )}

                                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setEditingLesson(lesson);
                                                                        setIsEditLessonOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setDeletingLesson(lesson);
                                                                        setShowDeleteLessonAlert(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
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
                                            ))
                                        ) : (
                                            <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                                                <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                                Chưa có bài học nào trong chương này
                                            </div>
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setAddLesson({ sectionId: section.id });
                                                setIsAddLessonOpen(true);
                                            }}
                                            className="w-full border-dashed border-2 hover:border-solid hover:bg-accent/60 transition-all gap-2 mt-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Thêm bài mới</span>
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })
                        :
                        <div className="text-center py-12 text-muted-foreground">
                            <Layers className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                            <p className="font-medium">Chưa có chương nào</p>
                            <p className="text-sm mt-1">Bấm &quot;Thêm Chương mới&quot; để bắt đầu xây dựng nội dung</p>
                        </div>
                    }
                </Accordion>
            </div>

            {/* Video Preview Modal */}
            <Dialog open={showVideoPreview} onOpenChange={setShowVideoPreview}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle className="truncate pr-8">{videoPreviewLesson?.title}</DialogTitle>
                        <DialogDescription>Xem trước video bài giảng</DialogDescription>
                    </DialogHeader>
                    <div className="px-4 pb-4">
                        {videoPreviewLesson?.videoId ? (
                            <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoPreviewLesson.videoId}`}
                                    title={videoPreviewLesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">Video chưa sẵn sàng</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* edit section */}
            {
                isEditSectionOpen && editingSection && (
                    <SheetEditSection
                        open={isEditSectionOpen}
                        onOpenChange={(open) => {
                            setIsEditSectionOpen(open);
                            if (!open) setEditingSection(null);
                        }}
                        section={editingSection}
                    />
                )
            }

            {/* delete section */}
            <ConfirmModal
                isOpen={showDeleteSectionAlert}
                onClose={() => setShowDeleteSectionAlert(false)}
                onConfirm={deleteSectionHandler}
                title="Xóa chương?"
                isLoading={isDeletePending}
                description={
                    <>
                        Bạn có chắc chắn muốn xóa chương
                        <strong className="text-foreground">{" " + deleteSection?.title + " "}</strong> không?
                    </>
                }
                confirmText="Xóa vĩnh viễn"
            />

            {/* add lesson */}
            {
                isAddLessonOpen && addLesson && (
                    <SheetAddLesson
                        sectionId={addLesson?.sectionId as number}
                        open={isAddLessonOpen}
                        onOpenChange={setIsAddLessonOpen} />
                )
            }
            {/* edit lesson */}
            {
                isEditLessonOpen && editingLesson && (
                    <SheetEditLesson
                        open={isEditLessonOpen}
                        onOpenChange={(open) => {
                            setIsEditLessonOpen(open);
                            if (!open) setEditingLesson(null);
                        }}
                        lesson={editingLesson} />
                )}

            {/* delete lesson */}
            <ConfirmModal
                isOpen={showDeleteLessonAlert}
                onClose={() => setShowDeleteLessonAlert(false)}
                onConfirm={deleteLessonHandler}
                title="Xóa bài học?"
                isLoading={isDeleteLessonPending}
                description={
                    <>
                        Bạn có chắc chắn muốn xóa bài học
                        <strong className="text-foreground">{" " + deletingLesson?.title + " "}</strong> không?
                    </>
                }
                confirmText="Xóa vĩnh viễn"
            />
        </div>
    );
}
