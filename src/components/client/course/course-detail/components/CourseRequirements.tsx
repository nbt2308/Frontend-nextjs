import React from "react";
import { DescriptionList } from "@/components/shared/DescriptionList";
import { CircleDot } from "lucide-react";

export default function CourseRequirements({ requirements }: { requirements: string }) {
  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <h3 className="text-lg font-bold text-foreground tracking-tight">Yêu cầu khóa học</h3>
      <DescriptionList value={requirements} icon={CircleDot} cols={1} />
    </div>
  );
}