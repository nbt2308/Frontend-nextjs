
import {CourseReviewSchema} from "@/types/generated-zod/schemas";
import z from "zod";
export const CreateCourseReviewSchema = CourseReviewSchema
.pick({
    rating: true,
    content: true,
})
.extend({
    rating: z.number().min(1, "Rating phải từ 1 đến 5").max(5, "Rating phải từ 1 đến 5"),
    content: z.string().min(1, "Nội dung đánh giá không được để trống"),
});

export const UpdateCourseReviewSchema = CreateCourseReviewSchema.partial();
export type ICreateCourseReview = z.infer<typeof CreateCourseReviewSchema>;
export type IUpdateCourseReview = z.infer<typeof UpdateCourseReviewSchema>;