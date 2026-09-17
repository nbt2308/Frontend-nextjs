import { ExternalLink, Link } from "lucide-react";
import React from "react";

export default function CourseResources({ resources }: { resources: string }) {
  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <h3 className="text-lg font-bold text-foreground tracking-tight">Tài nguyên đính kèm</h3>
      <a href={resources} className="p-3 rounded-lg border transition flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-900">
            <Link className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-foreground group-hover:underline">Link tài nguyên</span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition" />
      </a>    </div>
  );
}