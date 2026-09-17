import React from "react";
import { X, Play } from "lucide-react";

interface CoursePreviewModalProps {
  isVideoModalOpen: boolean;
  setIsVideoModalOpen: (open: boolean) => void;
  previewTitle: string;
}

export default function CoursePreviewModal({
  isVideoModalOpen,
  setIsVideoModalOpen,
  previewTitle
}: CoursePreviewModalProps) {
  if (!isVideoModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 text-white">
          <h4 className="text-sm font-bold truncate">{previewTitle}</h4>
          <button onClick={() => setIsVideoModalOpen(false)} className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative aspect-video bg-black flex items-center justify-center text-white">
          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center border border-white/20">
              <Play className="w-8 h-8 fill-current text-white translate-x-1" />
            </div>
            <p className="text-xs text-zinc-400">Đang phát video xem trước thử nghiệm</p>
          </div>
        </div>
      </div>
    </div>
  );
}