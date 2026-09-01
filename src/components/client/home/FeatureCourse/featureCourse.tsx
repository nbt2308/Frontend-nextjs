"use client";
import { ArrowUpRight } from "lucide-react";
import { fadeIn, staggerContainer } from "../../animation/animations";
import Link from "next/link";
import { motion } from "motion/react";
import { CourseSkeletonLoader } from "./courseSkeleton";
import CardCourse from "@/components/shared/cardCourse";

interface FeatureCoursesProps {
    data?: any[]
    isPending?: boolean
}

export default function FeatureCourses({ data, isPending }: FeatureCoursesProps) {
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
                            >
                                <CardCourse course={course} size="lg" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>)

}