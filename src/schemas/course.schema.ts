import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { CourseSchema } from "@/types/generated-zod/schemas/models";
import * as z from "zod";


export const BaseCourseSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập tên khoá học" }),

    description: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập mô tả" }),

    price: z
        .number({ message: "Giá phải là số" })
        .min(0, { message: "Giá không được nhỏ hơn 0" }),

    discount: z
        .number({ message: "Giảm giá phải là số" })
        .min(0, { message: "Giảm giá không được nhỏ hơn 0" }),

    courseType: CourseTypeSchema,
    level: LevelSchema,
    status: z.boolean(),
    instructorId: z
        .string({ message: "Vui lòng chọn người hướng dẫn" })
        .min(1, { message: "Vui lòng chọn người hướng dẫn" }),

    tags: z
        .array(z.number(), { message: "Vui lòng chọn tag" })
        .min(1, { message: "Vui lòng chọn ít nhất 1 tag" }),

    thumbnail: z
        .string({ message: "Vui lòng chọn ảnh" })
        .min(1, { message: "Vui lòng chọn ảnh" }),

    thumbnail_publicID: z
        .string({ message: "Thiếu public_id của ảnh" })
        .min(1, { message: "Thiếu public_id của ảnh" }),
})
const courseRefineLogic = (data: any, ctx: z.RefinementCtx) => {
    // Nếu khóa học FREE
    if (data.courseType === CourseTypeSchema.enum.FREE) {
        if (data.price !== undefined && data.price > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Khóa học miễn phí không được nhập giá lớn hơn 0",
                path: ["price"],
            });
        }
        if (data.discount !== undefined && data.discount > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Khóa học miễn phí không được nhập giảm giá lớn hơn 0",
                path: ["discount"],
            });
        }
    }
    // Nếu khóa học PAID
    if (data.courseType === CourseTypeSchema.enum.PAID) {
        if (data.price !== undefined && data.price <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Khóa học trả phí phải có giá lớn hơn 0",
                path: ["price"],
            });
        }
    }
    if (data.discount !== undefined && data.price !== undefined && data.discount > data.price) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Giá giảm không được lớn hơn giá gốc",
            path: ["discount"],
        });
    }
}
export const CreateCourseSchema = BaseCourseSchema.superRefine(courseRefineLogic);
export const UpdateCourseSchema = BaseCourseSchema
    .partial()
    .omit({ instructorId: true })
    .superRefine(courseRefineLogic);

export const CreateUpdateCourseSchema = CreateCourseSchema;

export const ChangeStatusSchema = CourseSchema.pick({
    id: true,
    status: true,
}).extend({
    id: z.string().min(1, "ID không được để trống"),
    status: z.boolean(),
})

export const BulkStatusSchema = CourseSchema.pick({
    status: true
}).extend({
    ids: z
        .array(z.string().min(1, "ID không được để trống"))
        .min(1, "Danh sách ID phải có ít nhất 1 phần tử"),
    status: z.boolean("Trạng thái không hợp lệ"),
});

export const BulkDeleteSchema = z.object({
    ids: z
        .array(z.string().min(1, "ID không được để trống"))
        .min(1, "Danh sách ID phải có ít nhất 1 phần tử")
});
export type ICreateCourse = z.infer<typeof CreateCourseSchema>;
export type IUpdateCourse = z.infer<typeof UpdateCourseSchema>;
export type ICourse = z.infer<typeof CreateUpdateCourseSchema>;
export type IChangeStatus = z.infer<typeof ChangeStatusSchema>;
export type IBulkStatus = z.infer<typeof BulkStatusSchema>;
export type IBulkDelete = z.infer<typeof BulkDeleteSchema>;