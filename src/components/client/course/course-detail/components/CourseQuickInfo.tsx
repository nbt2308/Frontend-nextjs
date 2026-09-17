import React from "react";
import { UserCheck, BookOpen, Users, BarChart } from "lucide-react";
import { LevelSchema } from "@/types/generated-zod/schemas";

export default function CourseQuickInfo({ instructorName, totalLessons, studentCount, level }: { instructorName: string, totalLessons: number, studentCount: number, level: string }) {
  const levelSchema = LevelSchema.enum;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border text-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5 text-foreground" />
        </div>
        <div className="min-w-0">
          <span className="block text-xs text-muted-foreground font-medium">Giảng viên</span>
          <span className="font-semibold text-foreground truncate block">{instructorName}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-foreground" />
        </div>
        <div className="min-w-0">
          <span className="block text-xs text-muted-foreground font-medium">Tổng số bài giảng</span>
          <span className="font-semibold text-foreground">{totalLessons} Bài học</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-foreground" />
        </div>
        <div className="min-w-0">
          <span className="block text-xs text-muted-foreground font-medium">Đã đăng ký</span>
          <span className="font-semibold text-foreground">{studentCount} Học viên</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <BarChart className="w-5 h-5 text-foreground" />
        </div>
        <div className="min-w-0">
          <span className="block text-xs text-muted-foreground font-medium">Trình độ</span>
          <span className="font-semibold text-foreground">
            {level === levelSchema.BEGINNER ? "Cơ bản" :
              level === levelSchema.ADVANCED ? "Nâng cao" :
                level === levelSchema.INTERMEDIATE ? "Trung cấp" :
                  ""}
          </span>
        </div>
      </div>
    </div>
  );
}