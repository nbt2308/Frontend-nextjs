import CourseDetail from "@/components/client/course/course-detail/courseDetail";
import { CourseService } from "@/services/course";
import type { Metadata } from "next";

interface CourseDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}
export async function generateMetadata({
    params,
}: CourseDetailPageProps): Promise<Metadata> {
    const { slug } = await params;

    const course = await CourseService.getCourseBySlugServer(slug);

    return {
        title: `Khóa học ${course?.title || slug} | NevaGiveUp`, 
    };
}
export default async function CourseDetailPage({
    params,
}: CourseDetailPageProps) {
    const { slug } = await params;

    return <CourseDetail slug={slug} />;
}