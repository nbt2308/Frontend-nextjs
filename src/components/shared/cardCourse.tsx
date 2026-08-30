"use client";
import { Star, Users, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";

interface CardCourseProps {
    course: CourseForUser
    size?: 'sm' | 'lg'
}

export default function CardCourse({ course, size = 'sm' }: CardCourseProps) {
    const CourseType = CourseTypeSchema.enum;
    const Level = LevelSchema.enum;

    const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })

    const hasDiscount = () => {
        const isPaid = course.courseType === CourseType.PAID || course.courseType === 'PAID';
        const discountValue = parseFloat(String(course.discount ?? 0));
        const priceValue = parseFloat(String(course.price ?? 0));
        const hasValidDiscount = discountValue > 0 && discountValue < priceValue;
        return isPaid && hasValidDiscount;
    }

    const isLarge = size === 'lg';
    const padding = isLarge ? 'p-4' : 'p-3';
    const badgePadding = isLarge ? 'px-2.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-[10px]';
    const titleSize = isLarge ? 'text-lg' : 'text-sm';
    const tagSize = isLarge ? 'text-xs' : 'text-[10px]';
    const statSize = isLarge ? 'text-xs' : 'text-[10px]';
    const priceSize = isLarge ? 'text-base' : 'text-xs';
    const instructorSize = isLarge ? 'text-xs' : 'text-[10px]';

    return (
        <div className={`group cursor-pointer rounded-lg border border-border/60 bg-card hover:border-primary/40 ${isLarge ? 'hover:shadow-xl hover:-translate-y-1' : 'hover:shadow-lg hover:-translate-y-0.5'} transition-all duration-300 flex flex-col justify-between overflow-hidden`}>
            {/* Image & Overlays */}
            <div className="relative aspect-video w-full overflow-hidden border-b border-border/40">
                <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                />

                {/* Top-Left: Badges (Level & CourseType) */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
                    {/* Badge Loại khóa học */}
                    <span className={`${badgePadding} font-bold rounded-md shadow-sm ${course.courseType === 'free'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-primary text-primary-foreground'
                        }`}>
                        {course.courseType === CourseType.FREE ? 'Miễn phí' : 'Trả phí'}
                    </span>

                    {/* Badge Cấp độ */}
                    <span className={`${badgePadding} font-semibold bg-background/80 backdrop-blur-md text-foreground border border-border/60 rounded-md shadow-sm`}>
                        {course.level === Level.BEGINNER && 'Cơ bản'}
                        {course.level === Level.INTERMEDIATE && 'Trung cấp'}
                        {course.level === Level.ADVANCED && 'Nâng cao'}
                    </span>
                </div>

                {/* Top-Right: Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className={`absolute top-2 right-2 ${isLarge ? 'p-2' : 'p-1.5'} rounded-full bg-background/80 backdrop-blur-md text-muted-foreground hover:text-rose-500 hover:bg-background transition-all z-10 shadow-sm active:scale-95`}
                >
                    <Heart className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} transition-colors`} />
                </button>
            </div>

            {/* Content */}
            <div className={`${padding} flex flex-col justify-between flex-1`}>
                <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                        {course.tags?.slice(0, isLarge ? 3 : 2).map((tag: any) => (
                            <span key={tag.name} className={`${tagSize} text-muted-foreground font-medium hover:text-foreground transition-colors`}>
                                #{tag.name}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className={`${titleSize} font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug`}>
                        {course.title}
                    </h3>

                    {/* Stats */}
                    <div className={`flex items-center gap-2 ${statSize} text-muted-foreground mb-2`}>
                        <div className="flex items-center gap-1">
                            <Users className={`${isLarge ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} />
                            <span>{course.studentCount}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Star className={`${isLarge ? 'w-3.5 h-3.5' : 'w-3 h-3'} fill-amber-400 text-amber-400`} />
                            <span className="font-bold text-foreground">{course.averageRating}</span>
                        </div>
                    </div>
                </div>

                {/* Footer: Instructor & Price */}
                <div className="pt-2 border-t border-border/50">
                    <p className={`${instructorSize} text-muted-foreground font-medium truncate mb-2`}>
                        {course?.instructor?.name}
                    </p>

                    {/* Price */}
                    <div className={`flex items-center gap-1 flex-wrap ${isLarge ? 'text-base' : 'text-xs'}`}>
                        {course.courseType === CourseType.FREE || course.price === 0 ? (
                            <span className={`${priceSize} font-semibold text-emerald-500`}>Miễn phí</span>
                        ) : hasDiscount() ? (
                            <>
                                <span className={`px-1 py-0.5 text-[9px] font-bold bg-rose-500/10 text-rose-500 rounded border border-rose-500/20`}>
                                    -{Math.round(((course.price - course.discount) / course.price) * 100)}%
                                </span>
                                <span className={`${isLarge ? 'text-xs' : 'text-[10px]'} text-muted-foreground line-through`}>
                                    {formatter.format(course.price)}
                                </span>
                                <span className={`${priceSize} font-extrabold text-primary`}>
                                    {formatter.format(course.discount)}
                                </span>
                            </>
                        ) : (
                            <span className={`${priceSize} font-extrabold text-primary`}>
                                {formatter.format(course.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

