import { LessonSchema } from "@/types/generated-zod/schemas";
import z from "zod";
const YOUTUBE_REGEX =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(\&.*)?$/;
export const CreateLessonSchema = LessonSchema.pick({
    title: true,
    videoUrl: true,
    content: true,
    order: true,
    isPreview: true,
    sectionId: true,
}).extend({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    videoUrl: z
        .string()
        .trim()
        .min(1, "Đường dẫn Video không được để trống")
        .regex(
            YOUTUBE_REGEX,
            "Đường dẫn YouTube không hợp lệ (Ví dụ hợp lệ: https://www.youtube.com/watch?v=dQw4w9WgXcQ hoặc https://youtu.be/dQw4w9WgXcQ)"
        ),
    content: z.string().optional(),
    order: z.number().min(0, "Số thứ tự không được để trống"),
    isPreview: z.boolean(),
    sectionId: z.number().min(1, "ID của Chương không được để trống"),
});

export const UpdateLessonSchema = CreateLessonSchema.partial();

export type ICreateLesson = z.infer<typeof CreateLessonSchema>;
export type IUpdateLesson = z.infer<typeof UpdateLessonSchema>;