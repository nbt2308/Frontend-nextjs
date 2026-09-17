'use client'
import React, { useState } from "react";
import { ChevronDown, PlayCircle, Lock } from "lucide-react";
import { formatLessonDuration, formatSectionDuration } from '@/lib/utils';
interface Lesson {
  id: number;
  title: string;
  duration: number;
  isPreview: boolean;
}

interface Chapter {
  id: string;
  title: string;
  lessonCount: number;
  totalDuration: number;
  lessons: Lesson[];
}

interface CourseContentProps {
  sections: Chapter[];
  totalLessons: number;
  totalDuration: number;
  openPreview: (title: string, lessonId: number) => void;
}



export default function CourseContent({
  sections,
  totalLessons,
  totalDuration,
  openPreview
}: CourseContentProps) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(sections?.length > 0 ? [sections[0].id] : []);

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (expandedChapters.length === sections?.length) {
      setExpandedChapters([]);
    } else {
      setExpandedChapters((sections || []).map(c => c.id));
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">Nội dung khóa học</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {sections?.length || 0} Chương • {totalLessons} Bài giảng • Tổng thời lượng: <span className="font-semibold text-foreground">{formatSectionDuration(totalDuration)}</span>
          </p>
        </div>
        <button onClick={toggleAll} className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline">
          {expandedChapters.length === (sections?.length || 0) ? "Thu gọn tất cả" : "Mở rộng tất cả"}
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden divide-y divide-border shadow-sm">
        {sections?.map((chapter) => {
          const isExpanded = expandedChapters.includes(chapter.id);
          return (
            <div key={chapter.id} className="bg-card">
              <button 
                onClick={() => toggleChapter(chapter.id)} 
                className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-muted/50 transition text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                  <span className="font-semibold text-sm text-foreground truncate">
                    {chapter.title}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground shrink-0 font-medium">
                  {chapter.lessonCount} bài giảng • {formatSectionDuration(chapter.totalDuration)}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-border bg-muted/20 divide-y divide-border">
                  {chapter.lessons.map(lesson => (
                    <div key={lesson.id} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-muted/40 transition text-xs sm:text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        {lesson.isPreview ? (
                          <PlayCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                        )}
                        <span className={`${lesson.isPreview ? 'text-foreground' : 'text-muted-foreground'} truncate`}>{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {lesson.isPreview && (
                          <button onClick={() => openPreview(lesson.title, lesson.id)} className="text-xs font-semibold px-2.5 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition">
                            Xem trước
                          </button>
                        )}
                        <span className="text-xs text-muted-foreground">{formatLessonDuration(lesson.duration)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}