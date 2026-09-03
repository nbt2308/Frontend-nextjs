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
import { Ban, Edit, Info, Lock, MoreHorizontal, Trash2, Unlock, BookOpen, Layers } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChangeStatus, useDeleteCourse } from "@/hooks/useCourse"
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal"
import ModalUpdateCourse from "./modal-update-course"
import { useAllTags } from "@/hooks/useTag"
import { useAllInstructors } from "@/hooks/useUser"
import ModalViewCourse from "./modal-view-course"



export const CourseCellAction = ({ course, status }: { course: any, status: boolean }) => {
    const router = useRouter()
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const { mutate: handleChangeStatus, isPending: isChangeStatusPending } = useChangeStatus();
    const { mutate: handleDelete, isPending: isDeletePending } = useDeleteCourse();
    const { data: tags, isLoading: isLoadingTags } = useAllTags();
    const { data: instructors, isLoading: isLoadingInstructors } = useAllInstructors();
    const deleteHandler = async () => {
        handleDelete(course?.id);
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
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật khoá học
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`/admin/courses/${course?.id}/curriculum`)
                        }}>
                        <Layers className="h-4 w-4 mr-2" /> Quản lý nội dung
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            handleChangeStatus({
                                id: course?.id,
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
                        onSelect={() => {
                            setShowDeleteAlert(true)
                        }}
                    ><Trash2 /> Xóa khoá học</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* <ModalViewCourse open={isViewOpen} closeDialog={() => setIsViewOpen(false)} data={user} /> */}
            <ModalUpdateCourse open={isEditOpen} closeDialog={() => setIsEditOpen(false)} course={course} tags={tags} instructors={instructors} />
            <ModalViewCourse open={isViewOpen} closeDialog={() => setIsViewOpen(false)} course={course} />
            <ConfirmModal
                isOpen={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={deleteHandler}
                title="Xóa khoá học?"
                isLoading={isDeletePending}
                description={
                    <>
                        Bạn có chắc chắn muốn xóa khóa học{" "}
                        <strong className="text-foreground">{course?.title}</strong> không?
                    </>
                }
                confirmText="Xóa vĩnh viễn"
            />
        </>
    )
}