"use client";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, MessageCircle, PlayCircle, Star, Users, ArrowUpRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useHome } from "@/hooks/useHome";
import FeatureCourses from "./FeatureCourse/featureCourse";
import { fadeIn, staggerContainer } from "../animation/animations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {

    const { data: home, isPending, isError, error, refetch } = useHome();
    const router = useRouter();
    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative pt-20 pb-20 md:pt-20 md:pb-32 px-6">
                <div className="container mx-auto">
                    <div className="flex gap-12 items-center justify-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-2xl flex flex-col items-center justify-center"
                        >
                            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-full text-xs font-medium mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Nền tảng học tập thế hệ mới
                            </motion.div>
                            <motion.h1
                                variants={fadeIn}
                                className="text-5xl md:text-7xl text-center font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center gap-1"
                            >
                                <span>HỌC TẬP.</span>
                                <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                                    SÁNG TẠO.
                                </span>
                                <span className="text-muted-foreground">VƯỢT TRỘI.</span>
                            </motion.h1>
                            <motion.p variants={fadeIn} className="text-lg text-center text-muted-foreground mb-8 max-w-lg leading-relaxed">
                                Nâng tầm kỹ năng lập trình của bạn với các khoá học chất lượng cao, bài viết chuyên sâu và cộng đồng hỏi đáp năng động. Môi trường phù hợp để phát triển bản thân.
                            </motion.p>
                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={() => router.push("/courses")} className="bg-primary text-md text-primary-foreground px-8 py-7 rounded-none font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group">
                                    Khám phá Khoá học
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="outline" className="bg-transparent border border-border text-foreground px-8 py-7 rounded-none font-bold hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center gap-2">
                                    <PlayCircle className="w-5 h-5" /> Xem giới thiệu
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATS MARQUEE */}
            <div className="border-y border-border bg-muted/50 overflow-hidden py-4">
                <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] opacity-70">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8 px-8 text-sm font-bold tracking-widest uppercase text-foreground">
                            <span>Hơn 10.000+ Học viên</span>
                            <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                            <span>500+ Bài viết chất lượng</span>
                            <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                            <span>Cộng đồng sôi nổi</span>
                            <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FEATURED COURSES */}
            <FeatureCourses data={home?.popularCourses} isPending={isPending} />

            {/* LATEST ARTICLES */}
            <section id="blog" className="py-24 px-6 bg-muted/30 relative border-y border-border">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">Bài viết mới nhất</h2>
                            <p className="text-muted-foreground max-w-xl text-lg">Chia sẻ kiến thức, kinh nghiệm và những xu hướng công nghệ mới nhất từ cộng đồng.</p>
                        </div>
                        <Link href="/blog" className="group flex items-center gap-2 text-foreground font-medium border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors">
                            Xem blog <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Featured Post */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden mb-6 border border-border">
                                {/* <Image src="" alt="Blog 1" fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" /> */}
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium mb-4">
                                <span className="bg-foreground text-background px-3 py-1 uppercase tracking-wider text-xs">Deep Dive</span>
                                <span className="text-muted-foreground">2 ngày trước • 8 phút đọc</span>
                            </div>
                            <h3 className="text-3xl font-black mb-4 leading-tight group-hover:underline underline-offset-4 decoration-2">Tại sao Tailwind CSS v4 lại thay đổi cách chúng ta viết code?</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">Khám phá những cải tiến vượt bậc trong phiên bản mới nhất của Tailwind CSS và cách nó tối ưu hóa workflow của lập trình viên Frontend...</p>
                        </motion.div>
                        {/* Other Posts List */}
                        <div className="flex flex-col gap-10">
                            {[
                                { title: "Hướng dẫn tối ưu Core Web Vitals cho Next.js App", date: "4 ngày trước", tag: "Tutorial", img: "" },
                                { title: "React Server Components: Tương lai của React", date: "1 tuần trước", tag: "Concept", img: "" },
                                { title: "Hành trình từ Junior lên Senior Backend Engineer", date: "2 tuần trước", tag: "Career", img: "" }
                            ].map((post, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="group flex gap-6 cursor-pointer items-center border-b border-border pb-10 last:border-0 last:pb-0"
                                >
                                    <div className="relative w-32 h-32 md:w-48 md:h-32 shrink-0 overflow-hidden border border-border">
                                        {/* <Image src={post.img} alt={post.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /> */}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 text-xs font-medium mb-2">
                                            <span className="border border-border px-2 py-0.5 uppercase tracking-wider">{post.tag}</span>
                                            <span className="text-muted-foreground">{post.date}</span>
                                        </div>
                                        <h4 className="text-xl font-bold leading-tight group-hover:underline underline-offset-4">{post.title}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* COMMUNITY QUESTIONS */}
            <section id="questions" className="py-24 px-6 relative">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">Hỏi đáp Cộng đồng</h2>
                        <p className="text-muted-foreground text-lg">Nơi giải đáp mọi thắc mắc và cùng nhau phát triển.</p>
                    </div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-4"
                    >
                        {[
                            { q: "Lỗi CORS khi gọi API từ Next.js Client Component tới NestJS Backend?", votes: 42, answers: 5, tags: ["Next.js", "NestJS", "CORS"] },
                            { q: "Cách tốt nhất để quản lý state toàn cục trong React 19?", votes: 28, answers: 12, tags: ["React", "State Management"] },
                            { q: "Triển khai CI/CD cho dự án Monorepo bằng GitHub Actions?", votes: 15, answers: 3, tags: ["DevOps", "CI/CD", "Monorepo"] },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="bg-muted/20 border border-border p-6 hover:bg-muted/50 transition-colors cursor-pointer group flex flex-col md:flex-row gap-6 md:items-center"
                            >
                                <div className="flex flex-row md:flex-col gap-4 md:gap-2 shrink-0">
                                    <div className="text-center px-4 py-2 border border-border bg-muted">
                                        <span className="block text-xl font-bold text-foreground">{item.votes}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Votes</span>
                                    </div>
                                    <div className="text-center px-4 py-2 border border-border text-muted-foreground">
                                        <span className="block text-xl font-bold">{item.answers}</span>
                                        <span className="text-[10px] uppercase tracking-wider">Answers</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-xl font-medium mb-3 group-hover:text-foreground text-foreground/80 transition-colors leading-snug">
                                        {item.q}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-muted px-2 py-1 text-muted-foreground">#{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="shrink-0 hidden md:block">
                                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-12 text-center">
                        <button className="bg-transparent border border-border text-foreground px-8 py-4 font-bold hover:bg-accent hover:text-accent-foreground transition-all">
                            Đặt câu hỏi mới
                        </button>
                    </div>
                </div>
            </section>



            {/* GLOBAL STYLES FOR MARQUEE */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
        </div>
    );
}