import React from "react";
import { Star } from "lucide-react";
import { CourseTypeSchema } from "@/types/generated-zod/schemas";
import { formatter } from "@/lib/utils";

interface CourseStickyTopBarProps {
  isStickyVisible: boolean;
  course: {
    title: string;
    averageRating?: number;
    reviewCount?: number;
    studentCount?: number;
    courseType: string;
    price: number;
    discount: number;
  };
  handleEnroll: () => void;
}

export default function CourseStickyTopBar({
  isStickyVisible,
  course,
  handleEnroll,
}: CourseStickyTopBarProps) {
  const CourseType = CourseTypeSchema.enum;
  const originalPrice = Number(course.price) || 0
  const salePrice = Number(course.discount) || 0
  const hasDiscount = course.courseType === CourseType.PAID && salePrice > 0 && salePrice < originalPrice
  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-sm transition-all duration-300 ${isStickyVisible
        ? "translate-y-0 opacity-100"
        : "translate-y-[-100%] opacity-0 pointer-events-none"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">


            <h2 className="text-sm md:text-base font-bold text-foreground truncate">
              {course.title}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <div className="flex items-center gap-1 text-foreground font-semibold">
              <span>{course.averageRating || 0}</span>
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span>•</span>
            <span>{course.reviewCount || 0} đánh giá</span>
            <span>•</span>
            <span>{course.studentCount || 0} học viên</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-baseline gap-2">
            {course.courseType === CourseType.FREE ? (
              <div className="text-xl font-bold text-emerald-600">Miễn phí</div>
            ) : (
              <div className="flex">
                {hasDiscount && (
                  <span className="text-2xl mr-2 font-black text-primary tracking-tight">
                    {formatter.format(salePrice)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-muted-foreground font-medium line-through text-sm mt-0.5 flex items-center gap-2">
                    {formatter.format(originalPrice)}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleEnroll}
            className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow-sm transition"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
