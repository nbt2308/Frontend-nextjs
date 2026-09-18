"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Globe } from "lucide-react";
import CourseBreadcrumb from "./components/CourseBreadcrumb";
import CourseWhatYouLearn from "./components/CourseWhatYouLearn";
import CourseQuickInfo from "./components/CourseQuickInfo";
import CourseContent from "./components/CourseContent";
import CourseDescription from "./components/CourseDescription";
import CourseRequirements from "./components/CourseRequirements";
import CourseResources from "./components/CourseResources";
import CourseInstructor from "./components/CourseInstructor";
import CourseReviews from "./components/course-review/CourseReviews";
import CourseRelated from "./components/CourseRelated";
import CoursePurchaseCard from "./components/CoursePurchaseCard";
import CoursePreviewModal from "./components/CoursePreviewModal";
import { useCourseBySlug } from "@/hooks/useCourse";
import { Loader2 } from "lucide-react";


export default function CourseDetail({ slug }: { slug?: string }) {
  const { data: course, isLoading, isError } = useCourseBySlug(slug);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");
    
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsStickyVisible(heroBottom < 50);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (isError || !course) return <div className="flex h-screen items-center justify-center text-red-500">Không tìm thấy khóa học!</div>;

  const openPreview = (title: string, lessonId: number) => {
    // We can also fetch the preview video URL here if needed.

    setPreviewTitle(title);
    setIsVideoModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleEnroll = () => showToast('Đang chuyển hướng đến trang thanh toán...');
  const addToCart = () => showToast('Đã thêm khóa học vào giỏ hàng thành công!');
  const shareCourse = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Đã sao chép đường dẫn khóa học!');
  };

  

  
  return (
    <div className="bg-background text-foreground antialiased min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
      
      {/* STICKY TOP BAR */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-sm transition-all duration-300 ${isStickyVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground border border-border">
                Bestseller
              </span>
              <h2 className="text-sm md:text-base font-bold text-foreground truncate">
                {course.title}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <div className="flex items-center gap-1 text-foreground font-semibold">
                <span>{course.averageRating || 0}</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>•</span>
              <span>{course.reviewCount || 0} đánh giá</span>
              <span>•</span>
              <span>{course.studentCount || 0} học viên</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                {course.courseType === "FREE" ? "Miễn phí" : `${(course.discount > 0 && course.discount < course.price ? course.price - course.discount : course.price).toLocaleString('vi-VN')}đ`}
              </span>
              {course.discount > 0 && course.price > 0 && course.courseType !== "FREE" && (
                <span className="text-xs line-through text-muted-foreground">{course.price.toLocaleString('vi-VN')}đ</span>
              )}
            </div>
            <button onClick={handleEnroll} className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow-sm transition">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* HERO HEADER */}
            <div ref={heroRef} id="course-hero-header" className="space-y-4">
              <CourseBreadcrumb title={course.title}/>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground text-base">{course.averageRating || 0}</span>
                  <div className="flex text-foreground">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <a href="#reviews" className="text-muted-foreground underline font-medium hover:text-foreground">
                    ({course.reviewCount || 0} đánh giá)
                  </a>
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>Tiếng Việt (Có phụ đề)</span>
                </div>
              </div>
            </div>

            {/* WHAT YOU'LL LEARN */}
            <CourseWhatYouLearn learningOutcomes={course.courseDescription?.learningOutcomes} />

            {/* QUICK INFO */}
            <CourseQuickInfo instructorName={course.instructor?.name} totalLessons={course.totalLessons} studentCount={course.studentCount} level={course.level} />

            {/* COURSE CONTENT */}
            <CourseContent 
              sections={course.sections}
              totalLessons={course.totalLessons}
              totalDuration={course.totalDuration}
              openPreview={openPreview}
            />

            {/* DESCRIPTION */}
            <CourseDescription introduction={course.courseDescription?.introduction} />

            {/* REQUIREMENTS */}
            <CourseRequirements requirements={course.courseDescription?.requirements} />

            {/* RESOURCES */}
            <CourseResources resources={course.courseDescription?.resources} />

            {/* INSTRUCTOR */}
            <CourseInstructor instructor={course.instructor} />

            {/* RATINGS & REVIEWS */}
            <CourseReviews slug={course.slug}/>

            {/* RELATED COURSES */}
            <CourseRelated slug={course.slug} />

          </div>

          {/* RIGHT COLUMN: STICKY PURCHASE CARD */}
          <CoursePurchaseCard 
            isStickyVisible={isStickyVisible}
            price={course.price}
            discount={course.discount}
            courseType={course.courseType}
            thumbnail={course.thumbnail}
            totalDuration={course.totalDuration}
            handleEnroll={handleEnroll}
            addToCart={addToCart}
            shareCourse={shareCourse}
          />

        </div>
      </main>

      {/* PREVIEW VIDEO MODAL */}
      <CoursePreviewModal 
        isVideoModalOpen={isVideoModalOpen}
        setIsVideoModalOpen={setIsVideoModalOpen}
        previewTitle={previewTitle}
      />

      {/* TOAST NOTIFICATION - temporarily disabled */}
      {/* {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex px-4 py-3 rounded-xl bg-foreground text-background shadow-xl text-sm font-medium items-center gap-3 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )} */}
    </div>
  );
}