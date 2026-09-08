import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRoleSchema, ICreateRole } from "@/schemas/role.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Shield, Layers } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useCreateRole } from "@/hooks/useRole";
import { useAllPermissions, usePermissionsGrouped } from "@/hooks/usePermission";
import { Badge } from "@/components/ui/badge";
import { PermissionGroupSelector } from "./permission-group-selector";
import { Label } from "@/components/ui/label";

// Thứ tự nhóm hiển thị




// ============================================================
// Modal Add Role
// ============================================================
export default function ModalAddRole({ open, closeDialog }: { open: boolean, closeDialog: () => void }) {
    const form = useForm<ICreateRole>({
        resolver: zodResolver(CreateRoleSchema),
        defaultValues: {
            name: '',
            description: '',
            permissionIds: [],
        },
    })

    const { mutate, isPending } = useCreateRole();
    const { data: permissionsGrouped, isLoading: isLoadingPermissions } = usePermissionsGrouped();

    useEffect(() => {
        if (open) {
            form.reset()
        }
    }, [open, form])

    const selectedPermissionIds = form.watch("permissionIds") || [];

    const handleTogglePermission = (permId: number) => {
        const current = form.getValues("permissionIds") || [];
        if (current.includes(permId)) {
            form.setValue("permissionIds", current.filter((id: number) => id !== permId));
        } else {
            form.setValue("permissionIds", [...current, permId]);
        }
    };

    const handleToggleGroup = (ids: number[], checked: boolean) => {
        const current = form.getValues("permissionIds") || [];
        if (checked) {
            form.setValue("permissionIds", Array.from(new Set([...current, ...ids])));
        } else {
            form.setValue("permissionIds", current.filter((id: number) => !ids.includes(id)));
        }
    };

    const handleSubmit = async (data: ICreateRole) => {
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
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Thêm Vai trò mới</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Thêm vai trò mới và gán quyền hạn cho hệ thống
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <form id="create-role-form" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="create-role-name">
                                            Tên vai trò<span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                            value={field.value ?? ""}
                                            id="create-role-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Vui lòng nhập tên vai trò (VD: MANAGER)"
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
                                        <FieldLabel htmlFor="create-role-description">
                                            Mô tả
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            id="create-role-description"
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
                        </FieldGroup>

                        {/* Permission Section */}
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold">Gán quyền cho vai trò này</h3>
                                {selectedPermissionIds.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                        Đã chọn {selectedPermissionIds.length} quyền
                                    </Badge>
                                )}
                            </div>
                            {isLoadingPermissions ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-32 w-full rounded-xl" />
                                    <Skeleton className="h-32 w-full rounded-xl" />
                                </div>
                            ) : permissionsGrouped ? (
                                <PermissionGroupSelector
                                    permissions={permissionsGrouped}
                                    selectedIds={selectedPermissionIds}
                                    onToggle={handleTogglePermission}
                                    onToggleGroup={handleToggleGroup}
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Không có quyền nào trong hệ thống.</p>
                            )}
                        </div>
                    </form>
                </div>

                <DialogFooter className="sm:gap-2 gap-1">
                    {isPending ?
                        <>
                            <Skeleton className="flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 w-[100px]">
                                <Loader2 className="animate-spin h-4 w-4" />
                            </Skeleton>
                        </>
                        :
                        <Button type="submit" form="create-role-form" disabled={isPending} >
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
