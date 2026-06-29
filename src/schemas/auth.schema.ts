import { Password_ResetsSchema, UserSchema } from '@/types/generated-zod/schemas/models';
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
            .min(6, { message: "Password phải có ít nhất 6 ký tự" })
            .max(32, { message: "Password không được vượt quá 32 ký tự" }),
    });

const phoneRegex = /^(?:\+84|84|0)(3|5|7|8|9)\d{8}$/;
export const registerSchema = UserSchema.pick({
    email: true,
    password: true,
    name: true,
    phone: true,
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
        confirmPassword: z
            .string()
            .min(1, { message: "Vui lòng xác nhận lại mật khẩu" }),

    }).refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu nhập lại không trùng khớp",
        path: ["confirmPassword"],
    });

export const verifyOtpSchema = UserSchema.pick({
    verifyToken: true,
    codeId: true,
})
    .extend({
        verifyToken: z
            .string()
            .min(1, { message: "Token không tồn tại" }),
        codeId: z
            .string()
            .min(1, { message: "Vui lòng nhập mã OTP" })
            .length(6, { message: "Mã OTP phải có 6 ký tự" }),
    });

export const forgotPasswordStep1Schema = Password_ResetsSchema.pick({
    email: true,
})
    .extend({
        email: z
            .string()
            .min(1, { message: "Vui lòng nhập email" })
            .email({ message: "Email không hợp lệ" }),

    })
export const forgotPasswordStep2Schema = Password_ResetsSchema.pick({
    codeId: true,
})
    .extend({
        codeId: z
            .string()
            .min(1, { message: "Vui lòng nhập mã OTP" })
            .length(6, { message: "Mã OTP phải có 6 ký tự" }),
    });
export const forgotPasswordStep3Schema = UserSchema.pick({
    password: true,
})
    .extend({
        password: z
            .string()
            .min(6, { message: "Password phải có ít nhất 6 ký tự" })
            .max(32, { message: "Password không được vượt quá 32 ký tự" }),
        confirmPassword: z
            .string()
            .min(1, { message: "Vui lòng xác nhận lại mật khẩu" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu nhập lại không trùng khớp",
        path: ["confirmPassword"],
    });

export type ISignIn = z.infer<typeof signInSchema>;
export type IRegister = z.infer<typeof registerSchema>;
export type IVerifyOtp = z.infer<typeof verifyOtpSchema>;
export type IForgotPasswordStep1 = z.infer<typeof forgotPasswordStep1Schema>;
export type IForgotPasswordStep2 = z.infer<typeof forgotPasswordStep2Schema>;
export type IForgotPasswordStep3 = z.infer<typeof forgotPasswordStep3Schema>;