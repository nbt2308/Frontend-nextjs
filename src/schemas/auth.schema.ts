import { UserSchema } from '@/types/generated-zod/schemas/models';
import * as z from "zod";

export const signInSchema = UserSchema.pick({
    email: true,
    password: true,
})
    .extend({
        email: z
            .string()
            .min(1, { message: "Vui lòng nhập email" })
            .email({ message: "Email không hợp lệ" }),
        password: z
            .string()
            .min(6, { message: "Password phải có ít nhất 6 ký tự" }),
    });

export type ISignIn = z.infer<typeof signInSchema>;