import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Ban, Edit, Info, Lock, MoreHorizontal, Trash2, Unlock } from "lucide-react"
import ModalViewUser from "./modal-view-user"
import ModalEditUser from "./modal-update-user"
import { useChangeStatus, useSoftDelete } from "@/hooks/useUser"
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal"



export const UserCellAction = ({ user, status }: { user: any, status: boolean }) => {
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteAlert, setIsDeleteAlert] = useState(false)
    const { mutate: handleChangeStatus, isPending: isChangeStatusPending } = useChangeStatus();
    const { mutate: handleSoftDelete, isPending: isSoftDeletePending } = useSoftDelete();

    const deleteHandler = async () => {
        handleSoftDelete(user?.id);
        setIsDeleteAlert(false);
    }
    return (
        <>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={() => {
                            // Logic xử lý hành động
                            setIsViewOpen(true)

                        }}
                    >
                        <Info className="h-4 w-4 mr-2" /> Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            // Logic xử lý hành động
                            setIsEditOpen(true)

                        }}>
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật người dùng</DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            handleChangeStatus({
                                id: user?.id,
                                status: !status
                            })
                        }}
                        disabled={isChangeStatusPending}
                    >
                        {
                            status ?
                                <Lock className="h-4 w-4 mr-2" />
                                :
                                <Unlock className="h-4 w-4 mr-2" />
                        }
                        {status ? "Khóa" : "Mở khóa"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive"
                        onSelect={() => setIsDeleteAlert(true)}
                        disabled={isSoftDeletePending}
                    ><Trash2 /> Xóa tài khoản</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ModalViewUser open={isViewOpen} closeDialog={() => setIsViewOpen(false)} data={user} />
            <ModalEditUser open={isEditOpen} closeDialog={() => setIsEditOpen(false)} data={user} />
            <ConfirmModal
                isOpen={isDeleteAlert}
                onClose={() => setIsDeleteAlert(false)}
                onConfirm={deleteHandler}
                title="Xóa Tài khoản?"
                isLoading={isSoftDeletePending}
                description={
                    <>
                        Bạn có chắc chắn muốn xóa người dùng với email{" "}
                        <strong className="text-foreground">{user?.email}</strong> không?
                    </>
                }
                confirmText="Xóa vĩnh viễn"
            />
        </>
    )
}