import { RoleSchema } from "@/types/generated-zod/schemas";
import { z } from "zod";

export const ChangeRoleStatusSchema = z.object({
    id: z.number().min(1, "ID không được để trống"),
    status: z.boolean(),
});

export const BulkDeleteRoleSchema = z.object({
    ids: z
        .array(z.number().min(1, "ID không được để trống"))
        .min(1, "Danh sách ID phải có ít nhất 1 phần tử")
});

export const CreateRoleSchema = RoleSchema.pick({
    name: true,
    description: true,
}).extend({
    name: z.string()
    .min(1, "Tên không được để trống")
    .transform((value) =>
        value
            .trim()
            .replace(/\s+/g, '_')
            .toUpperCase(),
    )
    .refine((value) => /^[A-Z][A-Z0-9_]*$/.test(value), {
        message: 'Tên role chỉ được chứa chữ cái in hoa, số và dấu gạch dưới.',
    }),
    description: z.string().optional().nullable(),
    permissionIds: z.array(z.number()).optional(),
});

export const UpdateRoleSchema = CreateRoleSchema.partial();

export type IChangeRoleStatus = z.infer<typeof ChangeRoleStatusSchema>;
export type IBulkDeleteRole = z.infer<typeof BulkDeleteRoleSchema>;
export type ICreateRole= z.infer<typeof CreateRoleSchema>;
export type IUpdateRole = z.infer<typeof UpdateRoleSchema>;
