"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Clock,
    FileVideo,
    AlertCircle,
    Info,
} from "lucide-react";
import { formatLessonDuration } from "@/lib/utils";

export interface PreviewLessonData {
    id: number;
    title: string;
    videoStatus: string;
    videoId?: string | null;
    isPreview?: boolean;
    duration?: number | null;
    resources?: any[];
}

interface ModalVideoPreviewProps {
    open: boolean;
    onClose: () => void;
    lesson: PreviewLessonData | null;
    courseTitle?: string;
    sectionTitle?: string;
}

export default function ModalVideoPreview({
    open,
    onClose,
    lesson,
    courseTitle,
    sectionTitle,
}: ModalVideoPreviewProps) {
    if (!lesson) return null;

    const isReady = lesson.videoStatus === "READY";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[92vh] p-0 gap-0 overflow-hidden flex flex-col border-border/80 shadow-2xl bg-card text-card-foreground">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30 shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1 pr-6">
                            <div className="flex items-center gap-2 flex-wrap">
                                {lesson.isPreview && (
                                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Xem trước (Preview)
                                    </Badge>
                                )}
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                        isReady
                                            ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                            : "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                    }`}
                                >
                                    Trạng thái: {lesson.videoStatus}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatLessonDuration(lesson.duration)}
                                </span>
                            </div>
                            <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight line-clamp-1">
                                {lesson.title}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
                                {courseTitle && `${courseTitle} • `}
                                {sectionTitle}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Video Screen / Player Container */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
                    {isReady ? (
                        lesson.videoId ? (
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?autoplay=1&modestbranding=1`}
                                title={lesson.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 text-white/80 p-8 text-center">
                                <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                                    <FileVideo className="h-10 w-10 text-primary" />
                                </div>
                                <p className="font-medium text-sm">Video trình chiếu mẫu đang tải...</p>
                                <p className="text-xs text-white/60 max-w-sm">
                                    Hệ thống đã nhận diện Video ID bài học hợp lệ và sẵn sàng phát trên CDN.
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 text-amber-400 p-8 text-center">
                            <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <AlertCircle className="h-10 w-10 text-amber-500" />
                            </div>
                            <p className="font-semibold text-base text-foreground">
                                Video chưa sẵn sàng để phát
                            </p>
                            <p className="text-xs text-muted-foreground max-w-md">
                                Video của bài học này đang ở trạng thái <b>{lesson.videoStatus}</b>. Giảng viên cần hoàn tất việc tải lên và chờ hệ thống encode trước khi khóa học được phê duyệt.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer / Meta info */}
                <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Info className="h-3.5 w-3.5 text-primary" />
                            <span>Thông số kỹ thuật video:</span>
                        </div>
                        <span>Thời lượng: <b>{formatLessonDuration(lesson.duration)}</b></span>
                        <span>•</span>
                        <span>Mã bài học: <code>#{lesson.id}</code></span>
                        {lesson.videoId && (
                            <>
                                <span>•</span>
                                <span>Mã Video ID: <code>{lesson.videoId}</code></span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        {lesson.resources && lesson.resources.length > 0 && (
                            <Badge variant="secondary" className="text-xs font-normal">
                                {lesson.resources.length} tài liệu đính kèm
                            </Badge>
                        )}
                        <Button variant="outline" size="sm" onClick={onClose} className="h-8">
                            Đóng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
