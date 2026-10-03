"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { ModerationCourse } from "./moderation.types";
import { IRejectCourse, RejectCourseSchema } from "@/schemas/course.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useRejectCourse } from "@/hooks/useCourse";

interface ModalRejectReasonProps {
    open: boolean;
    onClose: () => void;
    course: ModerationCourse | null;
    onConfirmReject: (courseId: string, reason: string) => void;
}

const COMMON_REASONS = [
    "Khóa học chưa đạt số lượng bài học tối thiểu (yêu cầu ít nhất 5 bài học).",
    "Tổng thời lượng video toàn khóa chưa đạt tiêu chuẩn 30 phút.",
    "Một số video bài học đang bị lỗi xử lý hoặc chưa sẵn sàng.",
    "Phần giới thiệu và mục tiêu học tập còn quá ngắn hoặc sơ sài.",
    "Ảnh bìa (Thumbnail) chất lượng kém hoặc chưa đúng tiêu chuẩn kích thước.",
    "Khóa học có chương rỗng chưa có bài học nào.",
    "Thiết lập giá bán và mức giảm giá chưa hợp lệ theo chính sách.",
];

export default function ModalRejectReason({
    open,
    onClose,
    course,
    onConfirmReject,
}: ModalRejectReasonProps) {
    const form = useForm<IRejectCourse>({
        resolver: zodResolver(RejectCourseSchema),
        defaultValues: {
            id: course?.id ?? "",
            reason_rejected: "",
            sendEmail: true
        },
    });
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

    useEffect(() => {
        if (course) {
            form.reset({
                id: course.id,
                reason_rejected: "",
                sendEmail: true
            });
            setSelectedPresets([]);
        }
    }, [course, form]);

    if (!course) return null;

    const handleTogglePreset = (preset: string) => {
        let updatedPresets: string[];
        if (selectedPresets.includes(preset)) {
            updatedPresets = selectedPresets.filter((p) => p !== preset);
        } else {
            updatedPresets = [...selectedPresets, preset];
        }
        setSelectedPresets(updatedPresets);

        // Update reason textarea automatically
        if (updatedPresets.length > 0) {
            const formatted = updatedPresets.map((p, idx) => `${idx + 1}. ${p}`).join("\n");
            form.setValue("reason_rejected", formatted, { shouldValidate: true });
        } else {
            form.setValue("reason_rejected", "", { shouldValidate: true });
        }
    };
    const {mutate:rejectCourse, isPending} = useRejectCourse();
    const onSubmit = async (data: IRejectCourse) => {
        rejectCourse(data,{ 
            onSuccess: () => {
                form.reset();
                onClose(); // Đóng modal reject
                onConfirmReject(data.id, data.reason_rejected); // Gọi hàm cha để đóng modal review và refetch
            }
        });
    };

    const isSubmitting = form.formState.isSubmitting;
    const reason = form.watch("reason_rejected");

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden border-border/80 shadow-2xl">
                {/* Header */}
                <DialogHeader className="px-6 py-5 border-b border-border bg-rose-500/5 dark:bg-rose-950/20">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 shrink-0">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-lg font-bold text-foreground">
                                Từ chối phê duyệt khóa học
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
                                Khóa học: <span className="font-semibold text-foreground">{course.title}</span> • Giảng viên: {course.instructor.name}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Prompt Box */}
                    <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <div>
                            Lý do này sẽ được gửi trực tiếp qua email và hiển thị trong bảng điều khiển của giảng viên để họ sửa đổi và nộp lại. Vui lòng phản hồi rõ ràng, mang tính xây dựng.
                        </div>
                    </div>

                    {/* Quick Preset Tags */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                            <span>Lý do phổ biến (Chọn nhanh):</span>
                            <span className="text-[11px] text-muted-foreground font-normal">
                                Đã chọn {selectedPresets.length} lý do
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {COMMON_REASONS.map((preset) => {
                                const isSelected = selectedPresets.includes(preset);
                                return (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => handleTogglePreset(preset)}
                                        className={`text-xs px-2.5 py-1.5 rounded-md border text-left transition-all ${isSelected
                                            ? "bg-rose-600 text-white border-rose-600 font-medium shadow-xs"
                                            : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
                                            }`}
                                    >
                                        {preset}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Textarea Detail */}
                    <Controller
                        name="reason_rejected"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="course-reason-rejected">
                                    Lý do từ chối <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    id="course-reason-rejected"
                                    placeholder="Nhập lý do từ chối khóa học..."
                                    className="min-h-[100px]"
                                    rows={3}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Notify checkbox */}
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-foreground">
                        <input
                            type="checkbox"
                            {...form.register("sendEmail")}
                            className="rounded border-border text-rose-600 focus:ring-rose-500 h-4 w-4"
                        />
                        <span>Gửi email thông báo tự động tới <b>{course.instructor.email}</b></span>
                    </label>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 border-t border-border bg-muted/20 flex sm:justify-between items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="mb-3"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                        className="text-xs h-9 mb-3 bg-rose-600 hover:bg-rose-700 text-white gap-2 font-medium"
                    >
                        <ShieldAlert className="h-4 w-4" />
                        {isPending ? "Đang xử lý..." : "Xác nhận từ chối khóa học"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
