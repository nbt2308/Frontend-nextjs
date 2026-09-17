import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CourseDescription({ introduction }: { introduction: string }) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <h3 className="text-xl font-bold text-foreground tracking-tight">Mô tả khóa học</h3>

      <div className="relative">
        <div className={`w-full text-sm text-muted-foreground space-y-3 leading-relaxed break-words overflow-hidden transition-all duration-300 ease-in-out ${isDescExpanded ? 'max-h-[1000px]' : 'max-h-64'
          }`} >
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: introduction || "Chưa có thông tin" }}
          />
        </div>

        {!isDescExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
        )}
      </div>

      <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-muted-foreground pt-1">
        <span>{isDescExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
        <ChevronDown className={`w-4 h-4 ${isDescExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}