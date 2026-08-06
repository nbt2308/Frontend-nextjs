import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { ICreateSection, CreateSectionSchema } from "@/schemas/section.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useCreateSection } from "@/hooks/useSection";

export const SheetAddSection = ({ courseId, open, onOpenChange }: { courseId: string, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const form = useForm<ICreateSection>({
        resolver: zodResolver(CreateSectionSchema),
        defaultValues: {
            title: "",
            order: 0,
            courseId: courseId,
        },
    });
    const { mutate, isPending } = useCreateSection()
    const handleSubmit = (data: ICreateSection) => {
        mutate(data, {
            onSuccess: () => {
                form.reset()
                onOpenChange(false)
            }
        })
    }
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* <SheetTrigger asChild>
                <Button><Plus className="h-4 w-4" /> Thêm Section</Button>
            </SheetTrigger> */}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Thêm Chương mới</SheetTitle>
                    <SheetDescription>
                        Vui lòng điền thông tin chương của khoá học
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
                                "Lưu Section"
                            )}
                        </Button>

                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}