'use client'
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { DescriptionList } from "@/components/shared/DescriptionList";

export default function CourseWhatYouLearn({ learningOutcomes }: { learningOutcomes: string }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-muted/30 space-y-4">
      <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-foreground" />
        Bạn sẽ học được gì
      </h3>
      <DescriptionList value={learningOutcomes} />
    </div>
  );
}