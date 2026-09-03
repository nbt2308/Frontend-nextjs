import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { ICreateSection, CreateSectionSchema } from "@/schemas/section.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useCreateSection } from "@/hooks/useSection";
import { CreateLessonSchema, ICreateLesson } from "@/schemas/lession.schema";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateLesson } from "@/hooks/useLession";

interface sheetAddLessonProps {
    sectionId: number,
    open: boolean,
    onOpenChange: (open: boolean) => void
}
export const SheetAddLesson = ({ sectionId, open, onOpenChange }: sheetAddLessonProps) => {

    const form = useForm<ICreateLesson>({
        resolver: zodResolver(CreateLessonSchema),
        defaultValues: {
            title: "",
            order: 0,
            videoUrl: "",
            content: "",
            isPreview: false,
            sectionId: sectionId,
        },
    });

    useEffect(() => {
        if (sectionId) {
            form.setValue("sectionId", sectionId);
        }
    }, [sectionId, form]);
    const { mutate, isPending } = useCreateLesson()
    const handleSubmit = (data: ICreateLesson) => {
        mutate(data, {
            onSuccess: () => {
                form.reset()
                onOpenChange(false)
            }
        })
    }
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Thêm Bài giảng mới</SheetTitle>
                    <SheetDescription>
                        Vui lòng điền thông tin bài giảng
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