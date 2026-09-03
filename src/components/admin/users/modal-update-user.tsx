
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
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { SYSTEM_ROLES } from "../../../constants/roles.constant";
export default function ModalEditUser({ open, closeDialog, data }: { open: boolean, closeDialog: () => void, data: UserType }) {
    const user = data as UserType;
    const Role = SYSTEM_ROLES;
    const form = useForm<IUpdateUserInput, any, IUpdateUser>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            status: true,
            roles: [Role.STUDENT]
        },
    })

    useEffect(() => {
        if (user) {
            let initialRoles = [Role.STUDENT];
            if (user?.roles && Array.isArray(user.roles)) {
                initialRoles = user.roles.map((r: any) => typeof r === "string" ? r : r?.name || r?.role?.name || r);
            } else if ((user as any)?.role) {
                initialRoles = [(user as any).role];
            }
            form.reset({
                name: user?.name || "",
                phone: user?.phone || "",
                address: user?.address || "",
                status: user?.status,
                roles: initialRoles
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
                                    name="roles"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Vai trò<span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {[
                                                    { value: Role.ADMIN, label: "Admin" },
                                                    { value: Role.STUDENT, label: "Student" },
                                                    { value: Role.INSTRUCTOR, label: "Instructor" }
                                                ].map((r) => (
                                                    <div key={r.value} className="flex flex-row items-center space-x-2">
                                                        <Checkbox
                                                            id={`role-${r.value}`}
                                                            checked={field.value?.includes(r.value)}
                                                            onCheckedChange={(checked) => {
                                                                const newValue = field.value || [];
                                                                if (checked) {
                                                                    field.onChange([...newValue, r.value]);
                                                                } else {
                                                                    field.onChange(newValue.filter((val: string) => val !== r.value));
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`role-${r.value}`}
                                                            className="text-sm font-medium leading-none cursor-pointer"
                                                        >
                                                            {r.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
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