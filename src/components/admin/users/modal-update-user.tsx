
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User } from "./columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUpdateUser, IUpdateUserInput, UpdateUserSchema } from "@/schemas/user.schema";
import { UserType } from "@/types/generated-zod/schemas/models/User.schema";
import { RoleSchema } from "@/types/generated-zod/schemas";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Loader2 } from "lucide-react";
import { useEffect } from "react";
export default function ModalEditUser({ open, closeDialog, data }: { open: boolean, closeDialog: () => void, data: UserType }) {
    const user = data as UserType;
    const Role = RoleSchema.enum;
    const form = useForm<IUpdateUserInput, any, IUpdateUser>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            status: true,
            role: Role.STUDENT
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                name: user?.name || "",
                phone: user?.phone || "",
                address: user?.address || "",
                status: user?.status,
                role: user?.role || Role.STUDENT
            });
        }
    }, [user, form]);

    const { mutate, isPending } = useUpdateUser();

    const handleSubmit = async (data: IUpdateUser) => {
        try {
            mutate({ id: user.id, data }, {
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
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Cập Nhật Người Dùng</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                <strong>ID: {user.id}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="grid grid-cols-1 gap-2">

                    <form id="update-user-form" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="update-user-name">
                                            Tên người dùng<span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            id="update-user-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Vui lòng nhập tên người dùng"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="update-user-phone">
                                            Số điện thoại<span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            id="update-user-phone"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Vui lòng nhập số điện thoại"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="address"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="update-user-address">
                                            Địa chỉ
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            id="update-user-address"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Vui lòng nhập địa chỉ"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <Controller
                                    name="role"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="update-user-role">
                                                Vai trò<span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                aria-invalid={fieldState.invalid}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                                    <SelectItem value={Role.STUDENT}>Student</SelectItem>
                                                    <SelectItem value={Role.INSTRUCTOR}>Instructor</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                            <FieldLabel htmlFor="update-user-status">
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
                            </div>

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
                        <Button type="submit" form="update-user-form" disabled={isPending} >
                            Cập nhật
                        </Button>
                    }
                    <Button variant="outline" onClick={closeDialog}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}