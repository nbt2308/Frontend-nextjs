import React from "react";
import { Clock, ArrowRight, ShoppingCart, Video, FileCode, Infinity as InfinityIcon, Smartphone, Award, Share2 } from "lucide-react";

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
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} giờ ${m} phút`;
  return `${m} phút`;
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
  shareCourse
}: CoursePurchaseCardProps) {

  const finalPrice = discount > 0 && discount < price ? price - discount : price;

  return (
    <div className="lg:col-span-4 sticky top-20 z-30 transition-all duration-300">
      <div className="border border-border rounded-2xl bg-card p-5 shadow-lg space-y-5">
        
        <div className={`relative aspect-video rounded-xl overflow-hidden bg-muted border border-border transition-all duration-300 ${isStickyVisible ? 'max-h-0 opacity-0 mb-0 border-0' : 'max-h-[300px] opacity-100 mb-5'}`}>
          <img src={thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"} alt="Course Banner" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
              Loại khóa học: {courseType}
            </span>
            {discount > 0 && price > 0 && (
              <span className="text-xs font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded">
                Giảm {Math.round((discount / price) * 100)}%
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {courseType === "FREE" ? "Miễn phí" : `${finalPrice.toLocaleString('vi-VN')}đ`}
            </span>
            {discount > 0 && price > 0 && courseType !== "FREE" && (
              <span className="text-sm line-through text-muted-foreground font-medium">
                {price.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <button onClick={handleEnroll} className="w-full py-3 px-4 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2">
            <span>Đăng ký ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {courseType !== "FREE" && (
            <button onClick={addToCart} className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-foreground border border-input hover:bg-accent transition flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Thêm vào giỏ hàng
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Khóa học bao gồm:</h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-foreground/80" />
              <span>{formatDuration(totalDuration)} video chất lượng cao</span>
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
          <span>Hoàn tiền trong 7 ngày</span>
        </div>

      </div>
    </div>
  );
}