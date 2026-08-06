import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Controller, useForm } from "react-hook-form";
import { IUpdateSection, UpdateSectionSchema } from "@/schemas/section.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IUpdateLesson, UpdateLessonSchema } from "@/schemas/lession.schema";
import { useUpdateLesson } from "@/hooks/useLession";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
interface SheetEditLessonProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lesson: { id: number; title: string, sectionId: number, videoUrl: string, content: string, isPreview: boolean, order: number } | null;
}

export const SheetEditLesson = ({ open, onOpenChange, lesson }: SheetEditLessonProps) => {
    const form = useForm<IUpdateLesson>({
        resolver: zodResolver(UpdateLessonSchema),
        defaultValues: {
            title: "",
            videoUrl: "",
            content: "",
            isPreview: false,
            sectionId: undefined,
            order: 0,
        },
    });
    useEffect(() => {
        if (lesson) {
            form.reset({
                title: lesson.title,
                videoUrl: lesson.videoUrl,
                content: lesson.content,
                isPreview: lesson.isPreview,
                sectionId: lesson.sectionId,
                order: Number(lesson.order),
            });
        }
    }, [lesson]);


    const { mutate, isPending } = useUpdateLesson()
    const handleSubmit = (data: IUpdateLesson) => {
        if (!lesson) {
            toast.error("Không tìm thấy bài giảng")
            return;
        }
        mutate({ lessonId: lesson.id, lessonData: data }, {
            onSuccess: () => {
                form.reset()
                onOpenChange(false)
            }
        })
    }
    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Chỉnh sửa Bài giảng</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin Bài giảng
                    </SheetDescription>
                    <Separator className="mt-3" />
                </SheetHeader>
                <div className="mx-3">
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 ">
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="lesson-title">
                                        Tiêu đề  <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="lesson-title"
                                        placeholder="Bài 1: Giới thiệu..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="videoUrl"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="lesson-videoUrl">
                                        Video URL
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="lesson-videoUrl"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="content"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="lesson-content">
                                        Nội dung
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        id="lesson-content"
                                        placeholder="Nội dung bài giảng"
                                        autoComplete="off"
                                        rows={5}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="order"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="section-order">
                                        Thứ tự  <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        id="section-order"
                                        type="number"
                                        min={0}
                                        placeholder="1"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="isPreview"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            id="lesson-isPreview"
                                        />
                                        <FieldLabel htmlFor="lesson-isPreview">
                                            Cho phép xem trước
                                        </FieldLabel>
                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Lưu bài học"
                            )}
                        </Button>

                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
