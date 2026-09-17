
import { InteractionSchema } from "@/types/generated-zod/schemas";
import z from "zod";
export const CreateInteractionSchema = InteractionSchema.pick({
    targetId: true,
    targetType: true,
    actionType: true
}).extend({
    targetId: z.string().min(1, "Target ID không được để trống"),
    targetType: z.enum(["COURSE", "COURSE_REVIEW", "POST", "POST_COMMENT"], { message: "Target Type không hợp lệ" }),
    actionType: z.enum(["LIKE", "DISLIKE"], { message: "Action Type không hợp lệ" }),
});

export type ICreateInteraction = z.infer<typeof CreateInteractionSchema>;