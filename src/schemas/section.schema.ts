import { SectionSchema } from "@/types/generated-zod/schemas";
import z from "zod";

export const CreateSectionSchema = SectionSchema.pick({
    title: true,
    order: true,
    courseId: true
}).extend({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    order: z.number().min(0, "Số thứ tự không được để trống"),
    courseId: z.string().min(1, "ID khóa học không được để trống"),
});

export const UpdateSectionSchema = SectionSchema.pick({
    title: true,
    order: true,
    courseId: true
}).extend({
    title: z.string().min(1, "Tiêu đề không được để trống").optional(),
    order: z.number().min(0, "Số thứ tự không được để trống").optional(),
    courseId: z.string().min(1, "ID khóa học không được để trống"),
})



export type ICreateSection = z.infer<typeof CreateSectionSchema>;
export type IUpdateSection = z.infer<typeof UpdateSectionSchema>;
