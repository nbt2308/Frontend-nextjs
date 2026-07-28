import { CourseSchema } from "@/types/generated-zod/schemas/models";
import { CourseType, Level } from "@prisma/client";
import * as z from "zod";

export const createCourseSchema = z.object({
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

    courseType: z
        .nativeEnum(CourseType, {
            message: "Loại khóa học không hợp lệ",
        }),

    level: z
        .nativeEnum(Level, {
            message: "Cấp độ không hợp lệ",
        }),

    status: z.boolean(),

    instructorId: z
        .string({ message: "Vui lòng chọn người hướng dẫn" })
        .min(1, { message: "Vui lòng chọn người hướng dẫn" }),

    tagId: z
        .number({ message: "Vui lòng chọn tag" })
        .min(1, { message: "Vui lòng chọn tag" }),

    thumbnail: z
        .string({ message: "Vui lòng chọn ảnh" })
        .min(1, { message: "Vui lòng chọn ảnh" }),

    thumbnail_publicID: z
        .string({ message: "Thiếu public_id của ảnh" })
        .min(1, { message: "Thiếu public_id của ảnh" }),
})
    // Refine ràng buộc logic giá tiền dựa theo loại khóa học (Sync với NestJS DTO)
    .superRefine((data, ctx) => {
        // Nếu khóa học FREE
        if (data.courseType === CourseType.FREE) {
            if (data.price > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Khóa học miễn phí không được nhập giá lớn hơn 0",
                    path: ["price"],
                });
            }
            if (data.discount > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Khóa học miễn phí không được nhập giảm giá lớn hơn 0",
                    path: ["discount"],
                });
            }
        }

        // Nếu khóa học PAID
        if (data.courseType === CourseType.PAID) {
            if (data.price <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Khóa học trả phí phải có giá lớn hơn 0",
                    path: ["price"],
                });
            }
            if (data.discount > data.price) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Giá giảm không được lớn hơn giá gốc",
                    path: ["discount"],
                });
            }
        }
    });

export type ICreateCourse = z.infer<typeof createCourseSchema>;