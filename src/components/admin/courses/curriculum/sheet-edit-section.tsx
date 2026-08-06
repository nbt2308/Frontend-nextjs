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
import { useUpdateSection } from "@/hooks/useSection";
import { toast } from "sonner";
interface SheetEditSectionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    section: { id: number; title: string, order: number, courseId: string } | null;
}

export const SheetEditSection = ({ open, onOpenChange, section }: SheetEditSectionProps) => {
    const form = useForm<IUpdateSection>({
        resolver: zodResolver(UpdateSectionSchema),
        defaultValues: {
            title: "",
            order: 0,
            courseId: section?.courseId,
        },
    });
    useEffect(() => {
        if (section) {
            form.reset({
                title: section.title,
                order: Number(section.order),
                courseId: section.courseId,
            });
        }
    }, [section]);


    const { mutate, isPending } = useUpdateSection()
    const handleSubmit = (data: IUpdateSection) => {
        if (!section) {
            toast.error("Không tìm thấy section")
            return;
        }
        mutate({ sectionId: section.id, sectionData: data }, {
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
                    <SheetTitle>Chỉnh sửa Chương của khoá học</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin chương của khoá học
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
                                    <FieldLabel htmlFor="section-title">
                                        Tiêu đề  <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="section-title"
                                        placeholder="Phần 1: Giới thiệu khóa học"
                                        autoComplete="off"
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
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </Button>

                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
