import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { StarRating } from "./StarRating";

interface CourseReviewEditFormProps {
    initialContent: string;
    initialRating: number;
    isPending?: boolean;
    onCancel: () => void;
    onSave: (content: string, rating: number) => void;
}

export function CourseReviewEditForm({
    initialContent,
    initialRating,
    isPending,
    onCancel,
    onSave,
}: CourseReviewEditFormProps) {
    const [editContent, setEditContent] = useState(initialContent);
    const [editRating, setEditRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="space-y-3">
            {/* Star rating picker */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Đánh giá:</span>
                <div className="flex">
                    <StarRating
                        rating={editRating}
                        interactive={true}
                        hoverRating={hoverRating}
                        onHover={setHoverRating}
                        onClick={setEditRating}
                        starClassName="w-5 h-5"
                    />
                </div>
            </div>
            {/* Textarea */}
            <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Nhập nội dung đánh giá..."
                className="text-sm min-h-[80px] resize-none"
            />
            {/* Action buttons */}
            <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={onCancel}>
                    <X className="w-3.5 h-3.5 mr-1" />
                    Hủy
                </Button>
                <Button 
                    size="sm" 
                    onClick={() => onSave(editContent, editRating)} 
                    disabled={!editContent?.trim() || isPending}
                >
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Lưu
                </Button>
            </div>
        </div>
    );
}
