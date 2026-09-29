import CurriculumView from "@/components/admin/courses/curriculum/curriculum-view";

export default async function CurriculumPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    return (
        <CurriculumView courseId={courseId} />
    );
}
