import React from "react";
import { X, Play } from "lucide-react";
import { usePreviewLesson } from "@/hooks/useLession";
import { getYouTubeEmbedUrl } from "@/lib/utils";

interface CoursePreviewModalProps {
  isVideoModalOpen: boolean;
  setIsVideoModalOpen: (open: boolean) => void;
  slug: string;
  lessonId:number
}



export default function CoursePreviewModal({
  isVideoModalOpen,
  setIsVideoModalOpen,
  slug,
  lessonId
}: CoursePreviewModalProps) {
  const {data: previewLesson, isPending: isPreviewPending} = usePreviewLesson(slug, lessonId);

  if (!isVideoModalOpen) return null;

  if (isPreviewPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
        <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 text-white">
            <h4 className="text-sm font-bold truncate">Loading...</h4>
            <button onClick={() => setIsVideoModalOpen(false)} className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!previewLesson) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
        <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 text-white">
            <h4 className="text-sm font-bold truncate">Video Not Found</h4>
            <button onClick={() => setIsVideoModalOpen(false)} className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 text-white">
          <h4 className="text-sm font-bold truncate">{previewLesson?.title}</h4>
          <button onClick={() => setIsVideoModalOpen(false)} className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative aspect-video bg-black flex items-center justify-center text-white">
          <iframe 
                id="preview-iframe" 
                className="w-full h-full" 
                src={getYouTubeEmbedUrl(previewLesson?.videoUrl || "")} 
                title="Video bài giảng" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
        </div>
      </div>
    </div>
  );
}