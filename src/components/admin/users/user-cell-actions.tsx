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
import { Ban, Edit, Info, MoreHorizontal, Trash2, Unlock } from "lucide-react"
import ModalViewUser from "./modal-view-user"



export const UserCellAction = ({ user, status }: { user: any, status: boolean }) => {
    const [isEditOpen, setIsEditOpen] = useState(false)

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
                            setIsEditOpen(true)

                        }}
                    >
                        <Info className="h-4 w-4 mr-2" /> Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật vai trò</DropdownMenuItem>
                    <DropdownMenuItem>
                        {
                            status ?
                                <Ban className="h-4 w-4 mr-2" />
                                :
                                <Unlock className="h-4 w-4 mr-2" />
                        }
                        {status ? "Vô hiệu hóa" : "Kích hoạt"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive"><Trash2 /> Xóa tài khoản</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ModalViewUser open={isEditOpen} closeDialog={() => setIsEditOpen(false)} data={user} />

        </>
    )
}