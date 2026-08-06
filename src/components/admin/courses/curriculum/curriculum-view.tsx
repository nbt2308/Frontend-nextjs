"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, GripVertical, FileVideo, Edit2, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetAddSection } from "./sheet-add-section";

import { SheetEditSection } from "./sheet-edit-section";
import { useDeleteSection, useSections } from "@/hooks/useSection";
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal";
import { Badge } from "@/components/ui/badge";
import { SheetAddLesson } from "./sheet-add-lesson";
import { formatDuration } from "@/lib/utils";
import { useDeleteLesson } from "@/hooks/useLession";
import { SheetEditLesson } from "./sheet-edit-lesson";

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
    const [editingLesson, setEditingLesson] = useState<{ id: number; title: string, sectionId: number, videoUrl: string, isPreview: boolean, content: string, order: number } | null>(null);
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


    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between sm:flex-row flex-col sm:gap-0 gap-4">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/courses")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Quản lý chương trình học</h1>
                        <span className="text-muted-foreground">Khoá học: {courseId}</span>
                    </div>
                </div>
                <Button onClick={() => setIsAddSectionOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Thêm Chương mới</Button>
                <SheetAddSection courseId={courseId} open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen} />
            </div>

            <div className="rounded-lg border shadow-sm p-6">
                <Accordion type="multiple" className="w-full space-y-4">
                    {sections && sections.length > 0 ? sections?.map((section: any) => {
                        let totalDurationOfSection = 0;
                        section.lessons.forEach((lesson: any) => {
                            totalDurationOfSection += lesson.duration;
                        });
                        return (
                            <AccordionItem key={section.id} value={section.id} className="border rounded-md px-4">
                                <div className="flex items-center justify-between w-full group/section hover:bg-muted/40 rounded-lg px-2 transition-colors">
                                    <GripVertical className="h-4 w-4 text-muted-foreground mr-2 shrink-0 cursor-grab active:cursor-grabbing" />

                                    <AccordionTrigger className="hover:no-underline py-3 flex-1 min-w-0 pr-3">
                                        <div className="flex items-center justify-between w-full min-w-0 gap-4 mr-2">
                                            <span className="font-semibold text-sm truncate text-left">
                                                {section.title}
                                            </span>

                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal shrink-0">
                                                <span>{section.lessons.length ?? 0} bài giảng</span>
                                                <span>•</span>
                                                <span>{formatDuration(totalDurationOfSection)}</span>
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
                                <AccordionContent className="pt-4 pb-4">
                                    <div className="space-y-3">
                                        {section?.lessons?.length > 0 ? (
                                            section?.lessons?.map((lesson: any) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing" />
                                                        <FileVideo className="h-4 w-4 text-primary shrink-0" />
                                                        <span className="font-medium text-sm truncate">{lesson.title}</span>
                                                        {lesson.isPreview && (
                                                            <Badge variant="outline" className="shrink-0 gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 text-[11px] px-1.5 py-0">
                                                                <Eye className="h-3 w-3" />
                                                                Xem trước
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        {lesson.duration && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDuration(lesson.duration)}
                                                            </span>
                                                        )}

                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                                                Chưa có bài học nào trong chương này
                                            </div>
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setAddLesson({ sectionId: section.id });
                                                setIsAddLessonOpen(true);
                                            }}
                                            className="w-full border-dashed border-2 hover:border-solid hover:bg-accent/60 transition-all gap-2"
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
                        <div className="text-center italic text-muted-foreground py-2">Chưa có chương nào</div>}
                </Accordion>

            </div>

            <SheetEditSection
                open={isEditSectionOpen}
                onOpenChange={setIsEditSectionOpen}
                section={editingSection}
            />
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
            <SheetAddLesson sectionId={addLesson?.sectionId as number} open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen} />
            <SheetEditLesson
                open={isEditLessonOpen}
                onOpenChange={setIsEditLessonOpen}
                lesson={editingLesson} />
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
