import { MoreHorizontal, Trash2, ShieldCheck, ShieldAlert, Pencil, Copy, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useState } from "react"
import { useChangeRoleStatus, useDeleteRole } from "@/hooks/useRole"
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal"
import ModalEditRole from "./modal-edit-role"

export function RoleCellAction({ role, status }: { role: any, status: boolean }) {
    const { mutate: changeRoleStatus, isPending: isChangeStatusPending } = useChangeRoleStatus();
    const { mutate: deleteRole, isPending: isDeletePending } = useDeleteRole();

    const [openDelete, setOpenDelete] = useState(false);
    const [openChangeStatus, setOpenChangeStatus] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Đã copy ID vai trò")
    }

    const handleDelete = () => {
        deleteRole(role.id, {
            onSuccess: () => setOpenDelete(false),
            onError: () => setOpenDelete(false)
        });
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCopy(role.id)}>
                        <Copy className="h-4 w-4 mr-2" /> Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpenEditModal(true)}
                        className="cursor-pointer"
                    >
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật vai trò
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setOpenDelete(true)}
                        variant="destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" /> Xoá vai trò
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Bạn có chắc chắn muốn xoá vai trò này?"
                description={
                    <>
                        Hành động này sẽ xoá vai trò <strong className="text-foreground">{role.name}</strong>. Không thể xoá vai trò đang có người dùng hoặc vai trò hệ thống.
                    </>
                }
                onConfirm={handleDelete}
                confirmText="Xoá vĩnh viễn"
                cancelText="Hủy"
                variant="destructive"
                isLoading={isDeletePending}
            />

            

            <ModalEditRole
                open={openEditModal}
                closeDialog={() => setOpenEditModal(false)}
                role={role}
            />
        </>
    )
}
