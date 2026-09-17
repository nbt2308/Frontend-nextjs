import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import { StarRating } from "./StarRating";
import { useCreateCourseReview } from "@/hooks/useCourseReview";

interface CourseReviewWriteFormProps {
    slug: string;
    onCancel: () => void;
}

export function CourseReviewWriteForm({ slug, onCancel }: CourseReviewWriteFormProps) {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const { mutate: createReview, isPending } = useCreateCourseReview();

    const handleSubmit = () => {
        createReview({ slug, data: { content, rating } }, {
            onSuccess: () => {
                setContent("");
                setRating(0);
                onCancel();
            }
        });
    };

    return (
        <div className="p-4 rounded-xl border border-border space-y-4 bg-card">
            <h4 className="font-bold text-foreground">Đánh giá của bạn</h4>
            
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Chất lượng:</span>
                <StarRating
                    rating={rating}
                    interactive={true}
                    hoverRating={hoverRating}
                    onHover={setHoverRating}
                    onClick={setRating}
                    starClassName="w-6 h-6"
                />
            </div>
            
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Khóa học này như thế nào? Cảm nhận của bạn..."
                className="text-sm min-h-[100px] resize-none"
            />
            
            <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
                    Hủy
                </Button>
                <Button 
                    size="sm" 
                    onClick={handleSubmit} 
                    disabled={!content.trim() || rating === 0 || isPending}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white"
                >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Gửi đánh giá
                </Button>
            </div>
        </div>
    );
}
