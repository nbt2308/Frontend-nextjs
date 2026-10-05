import React from "react";
import { Clock, ArrowRight, ShoppingCart, Video, FileCode, Infinity as InfinityIcon, Smartphone, Award, Share2, CheckCircle } from "lucide-react";
import { formatSectionDuration, formatter } from "@/lib/utils";
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";

interface CoursePurchaseCardProps {
  isStickyVisible: boolean;
  price: number;
  discount: number;
  courseType: string;
  thumbnail: string;
  totalDuration: number;
  handleEnroll: () => void;
  addToCart: () => void;
  shareCourse: () => void;
  isEnrolled: boolean;
}

export default function CoursePurchaseCard({
  isStickyVisible,
  price,
  discount,
  courseType,
  thumbnail,
  totalDuration,
  handleEnroll,
  addToCart,
  shareCourse,
  isEnrolled
}: CoursePurchaseCardProps) {
  const CourseType = CourseTypeSchema.enum;
  // const finalPrice = discount > 0 && discount < price ? discount : price;
  const originalPrice = Number(price) || 0
  const salePrice = Number(discount) || 0
  const hasDiscount = courseType === CourseTypeSchema.enum.PAID && salePrice > 0 && salePrice < originalPrice
  let discountPercent = 0;
  if (hasDiscount) {
    discountPercent = Math.round(
      ((price - discount) / price) * 100
    );
  }

  return (
    <div className={`lg:col-span-4 sticky z-30 transition-all duration-300 ${isStickyVisible ? 'top-36' : 'top-20'}`}>
      <div className="border border-border rounded-2xl bg-card p-5 shadow-lg space-y-5">

        <div className={`relative aspect-video rounded-xl overflow-hidden bg-muted border border-border transition-all duration-300 ${isStickyVisible ? 'max-h-0 opacity-0 mb-0 border-0' : 'max-h-[300px] opacity-100 mb-5'}`}>
          <img src={thumbnail} alt="Course Banner" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-2">
          <div className={`flex items-center  ${isEnrolled ? '' : 'justify-between'}`}>

            {
              isEnrolled ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold">Bạn đã đăng ký khóa học này</span>
                  </div>
                </>
              ) : <>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                  Loại khóa học: {courseType === CourseType.FREE ? "Miễn phí" : "Trả phí"}
                </span>
                {discount > 0 && price > 0 && (
                  <span className="text-xs font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded">
                    Giảm {discountPercent}%
                  </span>
                )}

              </>
            }

          </div>

          <div className="flex items-baseline gap-3">
            {courseType === CourseType.FREE ? (
              <div className="text-xl font-bold text-emerald-600">Miễn phí</div>
            ) : (
              <div className="flex">
                {hasDiscount && (
                  <span className="text-2xl mr-2 font-black text-primary tracking-tight">
                    {formatter.format(discount)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-muted-foreground font-medium line-through text-sm mt-0.5 flex items-center gap-2">
                    {formatter.format(price)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {isEnrolled ? (
          <>
            <div className="space-y-2.5 pt-1">
              <button onClick={handleEnroll} className="w-full py-3 px-4 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2">
                <span>Xem khóa học</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) :
          (<>
            <div className="space-y-2.5 pt-1">
              <button onClick={handleEnroll} className="w-full py-3 px-4 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2">
                <span>Đăng ký ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {courseType !== CourseType.FREE && (
                <button onClick={addToCart} className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-foreground border border-input hover:bg-accent transition flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Thêm vào giỏ hàng
                </button>
              )}
            </div>
          </>)
        }

        <div className="pt-4 border-t border-border space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Khóa học bao gồm:</h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-foreground/80" />
              <span>{formatSectionDuration(totalDuration)} video chất lượng cao</span>
            </li>
            <li className="flex items-center gap-2.5">
              <InfinityIcon className="w-4 h-4 text-foreground/80" />
              <span>Quyền truy cập trọn đời, cập nhật vĩnh viễn</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-foreground/80" />
              <span>Học trên máy tính, điện thoại, máy tính bảng</span>
            </li>
          </ul>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <button onClick={shareCourse} className="hover:text-foreground flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            Chia sẻ khóa học
          </button>

        </div>

      </div>
    </div>
  );
}