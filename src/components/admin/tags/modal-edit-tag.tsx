import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICreateTag, CreateTagSchema, IUpdateTag, UpdateTagSchema } from "@/schemas/tag.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useEditTag } from "@/hooks/useTag";
import { TagType } from "@/types/generated-zod/schemas/models/Tag.schema";

export default function ModalEditTag({ tag, open, closeDialog }: { tag?: TagType, open: boolean, closeDialog: () => void }) {
    const form = useForm<IUpdateTag>({
        resolver: zodResolver(UpdateTagSchema),
        defaultValues: {
            name: "",
            description: "",
            status: true,
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                name: tag?.name,
                description: tag?.description,
                status: tag?.status,
            });
        }
    }, [open, form, tag]);
    const { mutate, isPending } = useEditTag();

    const handleSubmit = async (data: IUpdateTag) => {
        try {
            mutate({ id: Number(tag?.id), tagData: data }, {
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
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Cập Nhật Tag</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Thay đổi thông tin Tag <strong># {tag?.id || ""}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="grid grid-cols-1 gap-2">
                    <form id="update-tag-form" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="update-tag-name">
                                            Tên nhãn<span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                            value={field.value ?? ""}
                                            id="update-tag-name"
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
                                        <FieldLabel htmlFor="update-tag-description">
                                            Mô tả
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            id="update-tag-description"
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
                                        <FieldLabel htmlFor="update-tag-status">
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
                        <Button type="submit" form="update-tag-form" disabled={isPending} >
                            Lưu thay đổi
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
