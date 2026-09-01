"use client";
import { ArrowRight, BookOpen, MessageCircle, PlayCircle, Star, Users, ArrowUpRight, Heart } from "lucide-react";
import Image from "next/image";
import { fadeIn, staggerContainer } from "@/components/client/animation/animations";
import Link from "next/link";
import { motion } from "motion/react";
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { CourseSkeletonLoader } from "./FeatureCourse/courseSkeleton";

interface FeatureCoursesProps {
    data?: any[]
    isPending?: boolean
}

export default function FeatureCourses({ data, isPending }: FeatureCoursesProps) {
    const CourseType = CourseTypeSchema.enum;
    const Level = LevelSchema.enum;

    //
    const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })
    return (
        <section id="courses" className="py-24 px-6 relative">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">Khoá học nổi bật</h2>
                        <p className="text-muted-foreground max-w-xl text-lg">Được thiết kế tỉ mỉ để mang lại trải nghiệm học tập tốt nhất, từ cơ bản đến chuyên sâu.</p>
                    </div>
                    <Link href="/courses" className="group flex items-center gap-2 text-foreground font-medium border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors">
                        Xem tất cả <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {isPending ? (
                    <CourseSkeletonLoader course={3} />
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {data?.map((course: any) => (
                            <motion.div
                                key={course.id}
                                variants={fadeIn}
                                className="group cursor-pointer rounded-none border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Image & Overlays */}
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 border border-border/40">
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-all duration-500"
                                        />

                                        {/* Top-Left: Badges (Level & CourseType) */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                                            {/* Badge Trạng thái Loại khóa học */}
                                            <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md shadow-sm ${course.courseType === 'free'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-primary text-primary-foreground'
                                                }`}>
                                                {course.courseType === CourseType.FREE ? 'Miễn phí' : 'Trả phí'}
                                            </span>

                                            {/* Badge Cấp độ */}
                                            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-background/80 backdrop-blur-md text-foreground border border-border/60 rounded-md shadow-sm">
                                                {course.level === Level.BEGINNER && 'Cơ bản'}
                                                {course.level === Level.INTERMEDIATE && 'Trung cấp'}
                                                {course.level === Level.ADVANCED && 'Nâng cao'}
                                            </span>
                                        </div>

                                        {/* Top-Right: Nút Yêu thích (Wishlist) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Thêm logic Toggle Wishlist ở đây
                                            }}
                                            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-md text-muted-foreground hover:text-rose-500 hover:bg-background transition-all z-10 shadow-sm active:scale-95"
                                        >
                                            <Heart className="w-4 h-4 transition-colors group-hover/btn:fill-rose-500" />
                                        </button>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {course.tags?.map((tag: any) => (
                                            <span key={tag.name} className="text-xs text-muted-foreground font-medium hover:text-foreground transition-colors">
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                        {course.title}
                                    </h3>

                                    {/* Stats: Học viên & Đánh giá */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>{course.studentCount} học viên</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span className="font-bold text-foreground">{course.averageRating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Card: Giảng viên & Giá tiền */}
                                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground font-medium truncate max-w-[110px]">
                                        {course?.instructor?.name}
                                    </p>

                                    {/* Hiển thị Giá tiền & Giảm giá */}
                                    <div className="flex items-center gap-2">
                                        {course.courseType === CourseType.FREE || !course.price ? (
                                            <span className="text-base font-semibold text-emerald-500">Miễn phí</span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {course.courseType === CourseType.PAID && course.discount > 0 && course.discount < course.price ? (
                                                    <>
                                                        {/* Phần trăm giảm giá */}
                                                        <span className="px-1.5 py-0.5 text-[11px] font-bold bg-rose-500/10 text-rose-500 rounded border border-rose-500/20">
                                                            -{Math.round(((course.price - course.discount) / course.price) * 100)}%
                                                        </span>

                                                        {/* Giá gốc bị gạch ngang */}
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            {course.price.toLocaleString('en-US')}đ
                                                        </span>

                                                        {/* Giá đã giảm */}
                                                        <span className="text-base font-extrabold text-primary">
                                                            {course.discount.toLocaleString('en-US')}đ
                                                        </span>
                                                    </>
                                                ) : (
                                                    /* Giá gốc khi không có giảm giá */
                                                    <span className="text-base font-extrabold text-primary">
                                                        {course.price.toLocaleString('en-US')}đ
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>)

}