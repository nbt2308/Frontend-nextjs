import { CourseStatusSchema, CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { CourseSchema } from "@/types/generated-zod/schemas/models";
import * as z from "zod";


export const BaseCourseSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập tên khoá học" }),

    introduction: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập phần giới thiệu" }),

    learningOutcomes: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập nội dung bạn sẽ học được" })
    .refine(
        (val) => {
            const lines = val.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
            return lines.length >= 4
        },
        { message: "Cần nhập ít nhất 4 mục tiêu (mỗi dòng là một mục tiêu)" }
    ),

    requirements: z
        .string()
        .trim()
        .optional(),

    resources: z
        .string()
        .trim()
        .url({ message: "Link tài nguyên không hợp lệ" })
        .optional()
        .or(z.literal("")),

    price: z
        .number({ message: "Giá phải là số" })
        .min(0, { message: "Giá không được nhỏ hơn 0" }),

    discount: z
        .number({ message: "Giảm giá phải là số" })
        .min(0, { message: "Giảm giá không được nhỏ hơn 0" }),

    courseType: CourseTypeSchema,
    level: LevelSchema,
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
    status: CourseStatusSchema,
    categoryId: z
        .number({ message: "Vui lòng chọn danh mục" })
        .min(1, { message: "Vui lòng chọn danh mục" }),
})
const courseRefineLogic = (data: any, ctx: z.RefinementCtx) => {
    //Nếu status là reject thì phải có reason
    if (data.status === CourseStatusSchema.enum.REJECTED) {
        if (!data.reason_rejected || data.reason_rejected.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Lý do bị từ chối không được để trống",
                path: ["reason_rejected"],
            });
        }
    }
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

    // Validate status transition
    if (data.originalStatus && data.status && data.originalStatus !== data.status) {
        const ALLOWED_TRANSITIONS: Record<string, string[]> = {
            DRAFT: ["PENDING"],
            PENDING: ["DRAFT", "PUBLISHED", "REJECTED"],
            REJECTED: ["DRAFT"],
            PUBLISHED: ["UNPUBLISHED"],
            UNPUBLISHED: ["PUBLISHED"],
        };

        const allowed = ALLOWED_TRANSITIONS[data.originalStatus] || [];
        if (!allowed.includes(data.status)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Không thể chuyển trạng thái từ "${data.originalStatus}" sang "${data.status}". Vui lòng sử dụng đúng quy trình.`,
                path: ["status"],
            });
        }
    }
}
export const CreateCourseSchema = BaseCourseSchema.omit({ status: true }).superRefine(courseRefineLogic);
export const UpdateCourseSchema = BaseCourseSchema
    .extend({
        originalStatus: CourseStatusSchema.optional(),
        reason_rejected: z.string().optional()
    })
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