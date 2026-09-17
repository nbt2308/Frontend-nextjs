import React, { useState } from "react";
import CourseReviewRatingBar from "./courseReviewRatingBar";
import CourseReviewCard from "./courseReviewCard";
import { CourseReviewFilter } from "./courseReviewFilter";
import { useCourseReviewsForUser } from "@/hooks/useCourseReview";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseReviewWriteForm } from "./CourseReviewWriteForm";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CourseReviews({ slug }: { slug: string }) {
  const [filters, setFilters] = useState<CourseUserReviewQueryParams>({
    page: 1,
    limit: 1,
    sortOrder: "desc",
    search: "",
    rating: undefined,
  });
  const [isWriting, setIsWriting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleWriteReviewClick = () => {
    if (!session) {
      toast.warning("Bạn cần đăng nhập để viết đánh giá");
      // router.push("/auth/login");
      return;
    }
    setIsWriting(true);
  };

  const { data: reviews, isPending } = useCourseReviewsForUser(slug, filters);

  const renderPagination = () => {
    if (!reviews || reviews.totalPages <= 1) return null;

    const { page, totalPages } = reviews;

    const handlePageChange = (newPage: number) => {
      setFilters((prev) => ({ ...prev, page: newPage }));
      const element = document.getElementById("reviews");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (page <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (page >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === page}
            onClick={() => handlePageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination className="pt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && handlePageChange(page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pages}   

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && handlePageChange(page + 1)}
              className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div id="reviews" className="space-y-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground tracking-tight">Đánh giá từ học viên</h3>
        {!isWriting && !reviews?.hasReviewed && (
          <Button 
            onClick={handleWriteReviewClick}
            className="bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Viết đánh giá
          </Button>
        )}
      </div>

      {/* Rating bar */}
      {reviews && <CourseReviewRatingBar reviews={reviews} />}

      {/* Filter toolbar */}
      <CourseReviewFilter filters={filters} onFiltersChange={setFilters} />

      {/* Write review */}
      {isWriting && (
        <div className="pt-2">
          <CourseReviewWriteForm slug={slug} onCancel={() => setIsWriting(false)} />
        </div>
      )}
      {/* Review cards */}
      {isPending ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : reviews && reviews?.items.length > 0 ? (
        <>
          <CourseReviewCard slug={slug} reviews={reviews} params={filters} />
          {renderPagination()}
        </>
      ) : (
        <div className="p-4 rounded-xl border border-border space-y-3 bg-card text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            <i>Không có đánh giá nào.</i>
          </p>
        </div>
      )}
    </div>
  );
}