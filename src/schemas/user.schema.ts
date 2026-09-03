import { SYSTEM_ROLES } from '@/constants/roles.constant';
import { RoleSchema } from '@/types/generated-zod/schemas';
import { UserSchema } from '@/types/generated-zod/schemas/models';

import * as z from "zod";

const phoneRegex = /^(?:\+84|84|0)(3|5|7|8|9)\d{8}$/;
export const createUserSchema = UserSchema.pick({
    email: true,
    password: true,
    name: true,
    phone: true,
    isActive: true,
    roles: true
})
    .extend({
        email: z
            .string()
            .min(1, { message: "Vui lòng nhập email" })
            .email({ message: "Email không hợp lệ" }),
        password: z
            .string()
            .min(6, { message: "Password phải có ít nhất 6 ký tự" })
            .max(32, { message: "Password không được vượt quá 32 ký tự" }),
        name: z
            .string()
            .min(1, { message: "Vui lòng nhập tên" }),
        phone: z
            .string()
            .min(1, { message: "Vui lòng nhập số điện thoại" })
            .regex(phoneRegex, { message: "Số điện thoại Việt Nam không hợp lệ" })
            .transform((val) => {
                let cleaned = val.replace(/^(\+84|84)/, "0");
                return cleaned;
            }),
        isActive: z
            .boolean()
            .default(true),
        roles: z.array(RoleSchema)

    })

export const BulkStatusSchema = UserSchema.pick({
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

export const UpdateUserSchema = UserSchema.pick({
    name: true,
    phone: true,
    address: true,
    status: true,
}).extend({
    roles: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 quyền").optional(),
    name: z.string().min(1, "Vui lòng nhập tên").optional(),
    address: z.string().optional(),
    phone: z
        .string()
        .regex(phoneRegex, { message: "Số điện thoại Việt Nam không hợp lệ" })
        .or(z.literal(""))
        .or(z.null())
        .optional()
        .transform((val) => (val === "" || val === null ? undefined : val)),
    status: z.boolean().optional(),
})
export const ChangeStatusSchema = UserSchema.pick({
    id: true,
    status: true,
}).extend({
    id: z.string().min(1, "ID không được để trống"),
    status: z.boolean(),
})

export type IBulkStatus = z.infer<typeof BulkStatusSchema>;
export type IBulkDelete = z.infer<typeof BulkDeleteSchema>;
export type IUpdateUser = z.infer<typeof UpdateUserSchema>; // output when submit form
export type IUpdateUserInput = z.input<typeof UpdateUserSchema>; // input validate form 
export type IChangeStatus = z.infer<typeof ChangeStatusSchema>;
