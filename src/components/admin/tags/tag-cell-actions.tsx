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
import { useChangeStatus, useDeleteTag } from "@/hooks/useTag"
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal"
import ModalEditTag from "./modal-edit-tag"
import ModalViewTag from "./modal-view-tag"


export const TagCellAction = ({ tag, status }: { tag: any, status: boolean }) => {
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const { mutate: handleChangeStatus, isPending } = useChangeStatus();
    const { mutate: handleDelete, isPending: isDeletePending } = useDeleteTag();

    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const deleteHandler = async () => {
        handleDelete(tag?.id);
        setShowDeleteAlert(false);
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
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật Tag</DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            handleChangeStatus({
                                id: tag?.id,
                                status: !status
                            })
                        }}
                        disabled={isPending}
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
                        onSelect={() => setShowDeleteAlert(true)}
                    ><Trash2 /> Xóa tag</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ModalViewTag open={isViewOpen} closeDialog={() => setIsViewOpen(false)} tag={tag} />
            <ModalEditTag open={isEditOpen} closeDialog={() => setIsEditOpen(false)} tag={tag} />
            <ConfirmModal
                isOpen={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={deleteHandler}
                title="Xóa Tag?"
                isLoading={isDeletePending}
                description={
                    <>
                        Bạn có chắc chắn muốn xóa Tag{" "}
                        <strong className="text-foreground">{tag?.name}</strong> không?
                    </>
                }
                confirmText="Xóa vĩnh viễn"
            />
        </>
    )
}