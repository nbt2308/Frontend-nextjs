import React from "react";
import { BadgeCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function CourseInstructor({ instructor }: { instructor: any }) {
  // const altAvatar = instructor?.name ? instructor?.slice(0, 2).toUpperCase() : ""
  return (
    <div className="space-y-4 pt-6 border-t border-border">
      <h3 className="text-xl font-bold text-foreground tracking-tight">Thông tin giảng viên</h3>

      <div className="p-6 border border-border rounded-xl bg-card space-y-4">
        <div className="flex items-center gap-4">
          {
            instructor?.avatar ? (
              <Avatar className="w-16 h-16">
                <AvatarImage src={instructor?.avatar} alt={instructor?.name} />
                <AvatarFallback>{getInitials(instructor?.name)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-lg font-bold">{getInitials(instructor?.name)}</span>
              </div>
            )
          }

          <div>
            <a href="#instructor-profile" className="text-lg font-bold text-foreground hover:underline flex items-center gap-1.5">
              {instructor?.name || "Đang cập nhật"}
              <BadgeCheck className="w-4 h-4 text-foreground fill-background" />
            </a>
            <p className="text-xs text-muted-foreground font-medium">Giảng viên</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 px-4 bg-muted rounded-lg text-xs">
          <div>
            <span className="text-muted-foreground block">Đánh giá giảng viên</span>
            <span className="font-bold text-foreground text-sm flex items-center gap-1">
              {instructor?.instructorRating || "0"} <Star className="w-3.5 h-3.5 fill-current" />
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Học viên</span>
            <span className="font-bold text-foreground text-sm">{instructor?.studentCount || "0"} Học viên</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Khóa học</span>
            <span className="font-bold text-foreground text-sm">{instructor?.courseCount || "0"} Khóa học</span>
          </div>
        </div>

        {/* Todo: Bio instructor */}
        {/* <p className="text-sm text-muted-foreground leading-relaxed">
          Hoàng có kinh nghiệm hơn một thập kỷ trong việc trực tiếp thiết kế và vận hành các hệ thống backend & web frontend quy mô lớn cho các tập đoàn công nghệ hàng đầu. Đam mê chia sẻ kiến thức thực chiến và tư duy lập trình chuẩn mực cho thế hệ lập trình viên trẻ.
        </p> */}
      </div>
    </div >
  );
}