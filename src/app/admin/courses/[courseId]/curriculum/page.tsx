import CurriculumView from "@/components/admin/courses/curriculum/curriculum-view";
import { use } from "react";

export default function CurriculumPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);

    return (
        <CurriculumView courseId={courseId} />
    );
}
