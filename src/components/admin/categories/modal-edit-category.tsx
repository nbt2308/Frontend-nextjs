import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUpdateCategory, UpdateCategorySchema } from "@/schemas/category.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Loader2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useEditCategory, useAllCategories } from "@/hooks/useCategory";
import { CategoryType } from "@/types/generated-zod/schemas/models/Category.schema";

export default function ModalEditCategory({ category, open, closeDialog }: { category?: CategoryType, open: boolean, closeDialog: () => void }) {
    const { data: categories } = useAllCategories();
    
    const form = useForm<IUpdateCategory>({
        resolver: zodResolver(UpdateCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            status: true,
            parentId: null,
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                name: category?.name,
                description: category?.description,
                status: category?.status,
                parentId: category?.parentId || null,
            });
        }
    }, [open, form, category]);

    const { mutate, isPending } = useEditCategory();

    const handleSubmit = async (data: IUpdateCategory) => {
        try {
            mutate({ id: Number(category?.id), categoryData: data }, {
                onSuccess: () => {
                    closeDialog();
                    form.reset();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Helper to get depth level of a category
    const getCategoryLevel = (id: number): number => {
        if (!categories?.categories) return 0;
        const findCat = (cats: any[], searchId: number): any => {
            for (const c of cats) {
                if (c.id === searchId) return c;
                if (c.children) {
                    const found = findCat(c.children, searchId);
                    if (found) return found;
                }
            }
            return null;
        }
        
        const cat = findCat(categories.categories, id);
        if (!cat || cat.parentId === null) return 0;
        
        const parent = findCat(categories.categories, cat.parentId);
        if (!parent || parent.parentId === null) return 1;
        
        return 2;
    }

    const flatCategories = useMemo(() => {
        if (!categories?.categories) return [];
        const flat: any[] = [];
        const flatten = (cats: any[]) => {
            cats.forEach(c => {
                flat.push(c);
                if (c.children) flatten(c.children);
            });
        }
        flatten(categories.categories);
        return flat;
    }, [categories]);

    // Check if candidate is descendant of current editing node to prevent loops
    const isDescendant = (candidateId: number, rootId: number) => {
        if (!rootId) return false;
        let current = flatCategories.find(c => c.id === candidateId);
        while (current && current.parentId !== null) {
            if (current.parentId === rootId) return true;
            current = flatCategories.find(c => c.id === current.parentId);
        }
        return false;
    };

    // Valid parent options (only Level 0 and Level 1, cannot be self, cannot be descendant)
    const validParentOptions = flatCategories.filter(cat => {
        if (category && cat.id === category.id) return false;
        if (category && isDescendant(cat.id, category.id)) return false;
        return getCategoryLevel(cat.id) < 2;
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) closeDialog(); }}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Cập Nhật Danh Mục</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Thay đổi thông tin Danh Mục <strong># {category?.id || ""}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="grid grid-cols-1 gap-2">
                    <form id="update-category-form" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="update-category-name">
                                            Tên danh mục<span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                            value={field.value ?? ""}
                                            id="update-category-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Vui lòng nhập tên danh mục"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="parentId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="update-category-parent">
                                            Danh mục cha (Tối đa 2 cấp)
                                        </FieldLabel>
                                        <Select
                                            aria-invalid={fieldState.invalid}
                                            value={field.value ? field.value.toString() : "null"}
                                            onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn danh mục cha" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="null">-- Không có (Danh mục gốc) --</SelectItem>
                                                {validParentOptions.map(opt => {
                                                    const level = getCategoryLevel(opt.id);
                                                    const prefix = level === 0 ? '📁 [Gốc]' : '  ├── 📂 [Cấp 1]';
                                                    return (
                                                        <SelectItem key={opt.id} value={opt.id.toString()}>
                                                            {prefix} {opt.name}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
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
                                        <FieldLabel htmlFor="update-category-description">
                                            Mô tả
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            id="update-category-description"
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
                                        <FieldLabel htmlFor="update-category-status">
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
                        <Button type="submit" form="update-category-form" disabled={isPending} >
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
