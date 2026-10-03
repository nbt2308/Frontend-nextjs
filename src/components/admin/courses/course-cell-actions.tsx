import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Info, Lock, MoreHorizontal, Trash2, Unlock, Layers, Check, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChangeStatus } from "@/hooks/useCourse"
import { CourseResponse } from "./courses"
import { CourseStatusSchema } from "@/types/generated-zod/schemas"


interface CourseCellActionProps {
    course: CourseResponse;
    status: boolean;
    onEdit: (course: CourseResponse) => void;
    onView: (course: CourseResponse) => void;
    onDelete: (course: CourseResponse) => void;
}

export const CourseCellAction = ({ course, status, onEdit, onView, onDelete }: CourseCellActionProps) => {
    const router = useRouter()
    const CourseStatus = CourseStatusSchema.enum;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onView(course)}>
                    <Info className="h-4 w-4 mr-2" /> Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onEdit(course)}>
                    <Edit className="h-4 w-4 mr-2" /> Cập nhật khoá học
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(`/admin/courses/${course?.id}/curriculum`)}>
                    <Layers className="h-4 w-4 mr-2" /> Quản lý nội dung
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => onDelete(course)}>
                    <Trash2 /> Xóa khoá học
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}