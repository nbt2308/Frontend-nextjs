import { TagSchema } from "@/types/generated-zod/schemas";
import { z } from "zod";


export const ChangeStatusSchema = TagSchema.pick({
    id: true,
    status: true,
}).extend({
    id: z.number().min(1, "ID không được để trống"),
    status: z.boolean(),
})
export const BulkStatusSchema = TagSchema.pick({
    status: true
}).extend({
    ids: z
        .array(z.number().min(1, "ID không được để trống"))
        .min(1, "Danh sách ID phải có ít nhất 1 phần tử"),
    status: z.boolean("Trạng thái không hợp lệ"),
});

export const BulkDeleteSchema = z.object({
    ids: z
        .array(z.number().min(1, "ID không được để trống"))
        .min(1, "Danh sách ID phải có ít nhất 1 phần tử")
});

export const CreateTagSchema = TagSchema.pick({
    name: true,
    description: true,
    status: true,
}).extend({
    name: z.string().min(1, "Tên không được để trống"),
    description: z.string().optional().nullable(),
    status: z.boolean(),
});

export const UpdateTagSchema = TagSchema.pick({
    name: true,
    description: true,
    status: true,
}).extend({
    name: z.string().min(1, "Tên không được để trống").optional(),
    description: z.string().optional().nullable(),
    status: z.boolean().optional(),
});

export type IChangeStatus = z.infer<typeof ChangeStatusSchema>;
export type IBulkStatus = z.infer<typeof BulkStatusSchema>;
export type IBulkDelete = z.infer<typeof BulkDeleteSchema>;
export type ICreateTag = z.infer<typeof CreateTagSchema>;
export type IUpdateTag = z.infer<typeof UpdateTagSchema>;