import React from "react";
import { Star } from "lucide-react";
import { useRelatedCourses } from "@/hooks/useCourse";
import CardCourse from "@/components/shared/cardCourse";

export default function CourseRelated({slug}: {slug: string}) {

  const {data: relatedCourses} = useRelatedCourses(slug)
  if(!relatedCourses || relatedCourses.length === 0) return null;
  return (
    <div className="space-y-4 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground tracking-tight">Khóa học liên quan</h3>
        <a href="/course" className="text-xs font-semibold text-foreground hover:underline">Xem tất cả</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedCourses?.map((course: CourseForUser) => (
          <CardCourse course={course} key={course.id}/>
        ))}
      </div>
    </div>
  );
}