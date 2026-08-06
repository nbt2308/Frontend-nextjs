import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface KpiCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    iconColor?: string;            // Màu biểu tượng (vd: "text-blue-500")
    glowColor?: string;           // Nền mờ cho Icon (vd: "bg-blue-500/15 border-blue-500/30")
    valueColor?: string;          // Màu của con số
    hoverBorderColor?: string;    // Màu viền khi hover (vd: "hover:border-blue-500/60")
    hoverShadowColor?: string;    // Màu bóng/glow xung quanh card khi hover (vd: "hover:shadow-blue-500/20")
    subtext?: string;             // Mô tả ở chân thẻ (tùy chọn)
    badgeText?: string | number;  // Badge phụ đi kèm số (tùy chọn)
}

export default function KpiCard({
    label,
    value,
    icon: Icon,
    iconColor = "text-blue-500",
    glowColor = "bg-blue-500/15 border-blue-500/25",
    valueColor = "text-zinc-100",
    hoverBorderColor = "hover:border-blue-500/60",
    hoverShadowColor = "hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]",
    subtext,
    badgeText,
}: KpiCardProps) {
    return (
        <div
            className={`group relative rounded-2xl p-5 
        border transition-all duration-300 ease-out hover:-translate-y-0.5
        ${hoverBorderColor} ${hoverShadowColor} flex flex-col justify-between`}
        >
            <div>
                {/* Header: Label & Icon mờ */}
                <div className="flex items-center justify-between text-zinc-400 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider line-clamp-1">
                        {label}
                    </span>

                    {Icon && (
                        <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                            {/* Vầng sáng hiệu ứng phía sau Icon */}
                            <div
                                className={`absolute inset-0 rounded-xl blur-md transition-opacity duration-300 opacity-50 group-hover:opacity-100 ${glowColor.split(' ')[0]}`}
                            />

                            {/* Khung Icon mờ */}
                            <div className={`relative w-full h-full rounded-xl border flex items-center justify-center backdrop-blur-md ${glowColor}`}>
                                <Icon className={`h-5 w-5 ${iconColor}`} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Body: Value & Badge */}
                <div className="flex items-baseline flex-wrap gap-2">
                    <span className={`text-3xl font-extrabold tracking-tight ${valueColor}`}>
                        {value}
                    </span>
                    {badgeText && (
                        <span className="text-[10px] text-zinc-400 bg-zinc-800/60 border border-zinc-700/40 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {badgeText}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer: Subtext */}
            {subtext && (
                <p className="text-[11px] text-zinc-500 mt-3 truncate font-medium">
                    {subtext}
                </p>
            )}
        </div>
    );
}

function KpiCardSkeleton() {
    return (
        <div className="border rounded-2xl p-5 flex flex-col justify-between h-full space-y-4">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-4 w-28 rounded-md animate-pulse" />
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                    <Skeleton className="h-8 w-16 rounded-md animate-pulse" />
                    <Skeleton className="h-4 w-10 rounded-full animate-pulse" />
                </div>
            </div>
            <Skeleton className="h-3 w-32 rounded-md animate-pulse" />
        </div>
    );
}

KpiCard.Skeleton = KpiCardSkeleton;