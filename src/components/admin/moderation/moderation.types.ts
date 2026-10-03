import { CourseStatus, CourseType, Level, VideoUploadStatus, VideoUploadStatusSchema } from "@/types/generated-zod/schemas";

export interface ModerationResource {
    id: number;
    name: string;
    size?: number;
    mimeType?: string;
}

export interface ModerationLesson {
    id: number;
    title: string;
    order: number;
    duration: number; // in seconds
    videoStatus: VideoUploadStatus;
    videoId?: string;
    isPreview: boolean;
    content?: string;
    resources?: ModerationResource[];
}

export interface ModerationSection {
    id: number;
    title: string;
    order: number;
    duration: number; // in seconds
    lessons: ModerationLesson[];
}

export interface ModerationInstructor {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isActive: boolean;
    status: boolean;
    bio?: string;
    createdAt: string;
    stats: {
        totalCourses: number;
        totalStudents: number;
        instructorRating: number;
    };
}

export interface ModerationCourseDescription {
    introduction: string;
    learningOutcomes: string;
    requirements: string | null;
    resources: string | null;
}

/** Validation error returned from backend API */
export interface ValidationError {
    code: string;
    message: string;
    sectionId?: number;
    sectionTitle?: string;
    lessonId?: number;
    lessonTitle?: string;
    resourceId?: number;
    resourceName?: string;
    meta?: Record<string, any>;
}

/** Summary stats returned from backend validation API */
export interface ValidationSummary {
    totalSections: number;
    totalLessons: number;
    totalVideoDuration: number;
    totalPreviewLessons: number;
    totalResources: number;
}

/** Shape of validationSummary embedded in each course from API */
export interface CourseValidationReport {
    isValid: boolean;
    errors: ValidationError[];
    summary: ValidationSummary;
}

/** Lightweight course shape returned by moderation/list API (no validation, no full sections) */
export interface ModerationListCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    courseType: CourseType;
    price: number;
    discount: number;
    level: Level;
    status: CourseStatus;
    category: {
        id: string;
        name: string;
        status: boolean;
    };
    instructor: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    sections: Array<{
        id: number;
        lessons: Array<{ duration: number; isPreview: boolean }>;
    }>;
    submittedAt: string;
    updatedAt: string;
    rejectReason?: string | null;
}

/** Full course shape returned by moderation/:id/review API */
export interface ModerationCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    courseType: CourseType;
    price: number;
    discount: number;
    level: Level;
    status: CourseStatus;
    category: {
        id: string;
        name: string;
        status: boolean;
    };
    tags: Array<{ id: string; name: string }>;
    courseDescription: ModerationCourseDescription | null;
    instructor: ModerationInstructor;
    sections: ModerationSection[];
    
    validationSummary: CourseValidationReport;
    submittedAt: string;
    updatedAt: string;
    reviewedAt?: string | null;
    reviewedBy?: string | null;
    rejectReason?: string | null;
}
