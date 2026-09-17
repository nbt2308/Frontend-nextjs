import CourseDetail from "@/components/client/course/course-detail/courseDetail";

interface CourseDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CourseDetailPage({
    params,
}: CourseDetailPageProps) {
    const { slug } = await params;

    return <CourseDetail slug={slug} />;
}