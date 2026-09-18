import { useToggleInteraction } from "@/hooks/useInteraction";
import { formatDate, getInitials } from "@/lib/utils";
import { ICreateInteraction } from "@/schemas/interaction.schema";
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCourseReview, useUpdateCourseReview } from "@/hooks/useCourseReview";
import { StarRating } from "./StarRating";
import { CourseReviewActions } from "./CourseReviewActions";
import { CourseReviewEditForm } from "./CourseReviewEditForm";
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal";

type ReviewItem = CourseReviewForUser["items"][number];

function ReviewCard({ slug, review, params }: { slug: string, review: ReviewItem, params: CourseUserReviewQueryParams }) {

    const { data: session } = useSession();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { mutate, isPending } = useToggleInteraction(params)
    const handleInteraction = async (data: ICreateInteraction) => {
        if (!session) {
            toast.warning("Bạn cần phải đăng nhập để thực hiện hành động này");
            // router.push("/auth/login");
            return;
        }
        mutate(data)
    }

    const handleStartEdit = () => {
        setIsEditing(true);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
    }

    const { mutate: updateReview, isPending: isEditPending } = useUpdateCourseReview()
    const handleSaveEdit = (content: string, rating: number) => {
        updateReview({ slug: String(slug), reviewId: Number(review.id), data: { content, rating } })
        setIsEditing(false);
    }

    const handleStartDelete = () => {
        setIsDeleting(true);
    }

    const { mutate: deleteReview, isPending: isDeletePending } = useDeleteCourseReview()
    const handleDeleteReview = async () => {
        deleteReview({ slug: String(slug), id: String(review.id) })
        setIsDeleting(false);
    }

    return (
        <div className="p-4 rounded-xl border border-border space-y-3 bg-card">
            {/* Header: Avatar + Name + Stars */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {review.user?.avatar ? (
                        <img
                            src={review.user?.avatar}
                            className="w-9 h-9 rounded-full object-cover"
                            alt={getInitials(review.user?.name)}
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground font-bold text-sm">
                                {getInitials(review.user?.name)}
                            </span>
                        </div>
                    )}
                    <div>
                        <h5 className="text-sm font-bold text-foreground">
                            {review.user?.name || "Không có tên"} {session?.user?.id === review.user?.id ? "- (Bạn)" : ""}
                        </h5>
                        <StarRating rating={review.rating} />
                        <span className="text-[11px] text-muted-foreground">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">

                    {session?.user?.id === review.user?.id && (
                        <CourseReviewActions
                            onEdit={handleStartEdit}
                            onDelete={handleStartDelete}
                        />
                    )}
                </div>
            </div>

            {/* Nội dung review hoặc form chỉnh sửa */}
            {isEditing ? (
                <CourseReviewEditForm
                    initialContent={review.content}
                    initialRating={review.rating}
                    isPending={isEditPending}
                    onCancel={handleCancelEdit}
                    onSave={handleSaveEdit}
                />
            ) : (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {review.content || "Không có thông tin đánh giá!"}
                </p>
            )}

            {/* Like / Dislike */}
            <div className="flex items-center gap-3 pt-1 border-t border-border">
                <span className="text-xs text-muted-foreground">{review.myInteraction ? "Cảm ơn bạn đã đánh giá!" : "Đánh giá có hữu ích không?"}</span>
                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        onClick={() => handleInteraction({ targetId: String(review.id), targetType: "COURSE_REVIEW", actionType: 'LIKE' })}
                        variant={review.myInteraction === 'LIKE' ? 'default' : 'outline'}
                        className='hover:cursor-pointer'
                        disabled={isPending}
                    // className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                    //     ${review.myInteraction === 'LIKE'
                    //         ? "bg-primary text-primary-foreground border-primary"
                    //         : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    //     }`}
                    >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{review.likes}</span>
                    </Button>
                    <Button
                        onClick={() => handleInteraction({ targetId: String(review.id), targetType: "COURSE_REVIEW", actionType: 'DISLIKE' })}
                        variant={review.myInteraction === 'DISLIKE' ? 'default' : 'outline'}
                        className='hover:cursor-pointer'
                        disabled={isPending}
                    // className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                    //     ${review.myInteraction === 'DISLIKE'
                    //         ? "bg-destructive text-destructive-foreground border-destructive"
                    //         : "border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                    //     }`}
                    >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{review.dislikes}</span>
                    </Button>
                </div>
            </div>
            <ConfirmModal
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                onConfirm={handleDeleteReview}
                title="Xóa đánh giá?"
                isLoading={isDeletePending}
                description={
                    <>
                        Bạn có chắc chắn muốn xóa đánh giá{" "}
                        <strong className="text-foreground">{review?.content}</strong> không?
                    </>
                }
                confirmText="Xóa vĩnh viễn"
            />
        </div>
    );
}

export default function CourseReviewCard({ slug, reviews, params }: { slug: string, reviews: CourseReviewForUser, params: CourseUserReviewQueryParams }) {
    return (
        <div className="space-y-4">
            {reviews?.items?.length > 0 && reviews.items.map((review) => (
                <ReviewCard key={review.id} slug={slug} review={review} params={params} />
            ))}
        </div>
    );
}