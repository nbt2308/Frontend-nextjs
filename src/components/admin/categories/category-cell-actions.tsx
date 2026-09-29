import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Info, Lock, MoreHorizontal, Trash2, Unlock, Plus } from "lucide-react"
import { useChangeCategoryStatus } from "@/hooks/useCategory"
import { CategoryType } from "@/types/generated-zod/schemas/models/Category.schema"

interface CategoryCellActionProps {
    category: CategoryType;
    status: boolean;
    onEdit: (category: CategoryType) => void;
    onView: (category: CategoryType) => void;
    onDelete: (category: CategoryType) => void;
    onAddChild: (parentId: number) => void;
    depth: number;
}

export const CategoryCellAction = ({ category, status, onEdit, onView, onDelete, onAddChild, depth }: CategoryCellActionProps) => {
    const { mutate: handleChangeStatus, isPending } = useChangeCategoryStatus();

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
                    <DropdownMenuItem onSelect={() => onView(category)}>
                        <Info className="h-4 w-4 mr-2" /> Xem chi tiết
                    </DropdownMenuItem>
                    {/* Only show add child if level < 2 */}
                    {depth < 1 && (
                        <DropdownMenuItem onSelect={() => onAddChild(category.id)}>
                            <Plus className="h-4 w-4 mr-2" /> Thêm danh mục con
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => onEdit(category)}>
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật danh mục
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            handleChangeStatus({
                                id: category?.id,
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
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(category)}>
                        <Trash2 /> Xóa danh mục
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}