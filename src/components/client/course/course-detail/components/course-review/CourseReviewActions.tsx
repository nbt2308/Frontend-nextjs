import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface CourseReviewActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export function CourseReviewActions({ onEdit, onDelete }: CourseReviewActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="w-3.5 h-3.5 mr-2" />
                    Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Xóa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
