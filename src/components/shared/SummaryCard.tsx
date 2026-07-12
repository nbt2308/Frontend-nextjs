import React from 'react';
import { LucideIcon } from 'lucide-react';
interface KpiCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;             // Nhận vào một Lucide Icon Component (tùy chọn)
    subtext?: string;             // Văn bản mô tả ở chân thẻ (tùy chọn)
    badgeText?: string | number;  // Thẻ phụ đi kèm con số (tùy chọn)
    valueColor?: string;          // Lớp CSS màu sắc tùy biến (mặc định có sẵn)
}
export default function KpiCard({
    label,
    value,
    icon: Icon, // Nhận vào một React Component Icon (ví dụ từ thư viện lucide-react)
    subtext,
    badgeText,
    valueColor = "text-zinc-900 dark:text-zinc-100", // Màu sắc tùy biến cho con số chính
}: KpiCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm transition hover:shadow-md flex flex-col justify-between">
            <div>
                {/* Phần đầu: Nhãn (Label) hiển thị và Biểu tượng đại diện (Icon) */}
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider line-clamp-2">
                        {label}
                    </span>
                    {Icon && <Icon className="h-4 w-4 text-zinc-400 shrink-0 ml-2" />}
                </div>

                {/* Phần thân: Chỉ số chính và Thẻ phụ đi kèm (Badge) nếu có */}
                <div className="flex items-baseline flex-wrap gap-2">
                    <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${valueColor}`}>
                        {value}
                    </span>
                    {badgeText && (
                        <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                            {badgeText}
                        </span>
                    )}
                </div>
            </div>

            {/* Phần chân: Văn bản mô tả bổ sung (Subtext) */}
            {subtext && (
                <p className="text-[11px] text-zinc-400 mt-2 truncate">
                    {subtext}
                </p>
            )}
        </div>
    );
}

function KpiCardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full space-y-4">
            <div>
                {/* Khung xương cho Phần đầu (Label + Icon) */}
                <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0 ml-2 animate-pulse" />
                </div>

                {/* Khung xương cho Phần thân (Value + Badge) */}
                <div className="flex items-baseline gap-2 mt-1">
                    <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
            </div>

            {/* Khung xương cho Phần chân (Subtext) */}
            <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mt-2 animate-pulse" />
        </div>
    );
}

// Gắn Skeleton làm thuộc tính mở rộng của KpiCard để tiện sử dụng
KpiCard.Skeleton = KpiCardSkeleton;