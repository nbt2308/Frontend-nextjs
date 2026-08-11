import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICreateTag, CreateTagSchema } from "@/schemas/tag.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Tag } from "lucide-react";
import React from "react";
import { useCreateTag } from "@/hooks/useTag";

export default function ModalCreateTag({ open, closeDialog }: { open: boolean, closeDialog: () => void }) {
    const form = useForm<ICreateTag>({
        resolver: zodResolver(CreateTagSchema),
        defaultValues: {
            name: '',
            description: '',
            status: true,
        },
    })

    const { mutate, isPending } = useCreateTag();

    const handleSubmit = async (data: ICreateTag) => {
        try {
            mutate(data, {
                onSuccess: () => {
                    closeDialog();
                    form.reset();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) closeDialog(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Thêm Mới Tag</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Thêm Tag mới cho hệ thống
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="grid grid-cols-1 gap-2">
                    <form id="create-tag-form" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="create-tag-name">
                                            Tên nhãn<span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                            value={field.value ?? ""}
                                            id="create-tag-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Vui lòng nhập tên nhãn"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="create-tag-description">
                                            Mô tả
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            id="create-tag-description"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Vui lòng nhập mô tả"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="status"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="create-tag-status">
                                            Trạng thái<span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Select
                                            aria-invalid={fieldState.invalid}
                                            value={field.value?.toString()}
                                            onValueChange={(value) => field.onChange(value === "true")}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value={"true"}>Hoạt động</SelectItem>
                                                <SelectItem value={"false"}>Khoá</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </div>

                <DialogFooter>
                    {isPending ?
                        <>
                            <Skeleton className="flex items-center justify-center gap-2 rounded-lg border border-transparent">
                                <Loader2 className="animate-spin h-4 w-4" />
                                Đang xử lý...
                            </Skeleton>
                        </>
                        :
                        <Button type="submit" form="create-tag-form" disabled={isPending} >
                            Tạo mới
                        </Button>
                    }
                    <Button variant="outline" type="button" onClick={() => {
                        form.reset();
                        closeDialog();
                    }}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
