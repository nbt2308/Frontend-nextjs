import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default function CourseBreadcrumb({title}: { title: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground pb-2">
      <Link href="/" className="hover:text-foreground transition flex items-center gap-1">
        <Home className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <Link href="/courses" className="hover:text-foreground transition">
        Khóa học
      </Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-foreground font-medium">{title}</span>
    </nav>
  );
}