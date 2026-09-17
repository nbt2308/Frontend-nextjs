import React from "react";
import { Star } from "lucide-react";

export default function CourseRelated() {
  return (
    <div className="space-y-4 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground tracking-tight">Khóa học liên quan</h3>
        <a href="#" className="text-xs font-semibold text-foreground hover:underline">Xem tất cả</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-border rounded-xl overflow-hidden hover:shadow-md transition flex flex-col bg-card group">
          <div className="relative aspect-video bg-muted overflow-hidden">
            <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=80" alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground">Advanced</span>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground line-clamp-2 group-hover:underline">
                React Native & Expo: Phát Triển Ứng Dụng Di Động Đa Nền Tảng
              </h4>
              <p className="text-xs text-muted-foreground">Trần Minh Hoàng</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <div className="flex items-center gap-1 font-bold text-foreground">
                <span>4.8</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-foreground text-sm">1.490.000đ</span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden hover:shadow-md transition flex flex-col bg-card group">
          <div className="relative aspect-video bg-muted overflow-hidden">
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80" alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground">Popular</span>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground line-clamp-2 group-hover:underline">
                DevOps & Kubernetes Thực Chiến Cho Web Developer
              </h4>
              <p className="text-xs text-muted-foreground">Trần Minh Hoàng</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <div className="flex items-center gap-1 font-bold text-foreground">
                <span>4.9</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-foreground text-sm">1.690.000đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}