"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton";
import SignInWithGoogle from "@/components/shared/sign-in-with-google";
import SignInWithGithub from "@/components/shared/sign-in-with-github";
import { Controller, useForm } from "react-hook-form";
import { IRegister, registerSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/hooks/useAuth";
export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (passwordInput) {
            passwordInput.type = showPassword ? 'password' : 'text';
        }
    }
    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
        const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
        if (confirmPasswordInput) {
            confirmPasswordInput.type = showConfirmPassword ? 'password' : 'text';
        }
    }
    const form = useForm<IRegister>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            phone: "",
            confirmPassword: ""
        },
    })
    const { mutate, isPending, error } = useRegister();
    const handleSubmit = (data: IRegister) => {
        mutate(data);
    };

    return (
        <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
            <div className="py-4 max-w-md w-full">
                <div
                    className="p-6 rounded-lg border border-slate-300 shadow-xs md:p-8 dark:border-neutral-700">
                    <div className="mb-3 flex justify-center">
                        <Logo size="lg" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-slate-900 text-center text-xl font-semibold mb-3 dark:text-slate-50">Đăng ký tài khoản</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Vui lòng điền thông tin bên dưới.</p>
                    </div>
                    {!isPending && error && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Lỗi đăng ký</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}
                    <form id="register-form" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="space-y-6 mt-5">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Nhập email của bạn"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-name">
                                            Tên người dùng
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Nhập tên người dùng của bạn"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-phone">
                                            Số điện thoại
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-phone"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Nhập số điện thoại của bạn"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-password">
                                            Mật khẩu
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                                id="register-password"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Nhập mật khẩu của bạn"
                                                autoComplete="off"
                                            />
                                            <button type="button" id="togglePassword" aria-label="Show password" aria-pressed="false"
                                                className="absolute top-1 right-2 p-0.5 flex cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                                                onClick={togglePassword}>
                                                {showPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-confirmPassword">
                                            Xác nhận mật khẩu
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                {...field}
                                                id="register-confirmPassword"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Nhập lại mật khẩu"
                                                autoComplete="off"
                                            />
                                            <button type="button" id="toggleConfirmPassword" aria-label="Show password" aria-pressed="false"
                                                className="absolute top-1 right-2 p-0.5 flex cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                                                onClick={toggleConfirmPassword}>
                                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        {isPending ?
                            <>
                                <Skeleton className="w-full h-10 py-2 px-3.5 text-sm rounded-md font-semibold flex items-center justify-center gap-2.5 bg-black dark:bg-white text-white dark:text-black">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    Đang xử lý...
                                </Skeleton>

                            </>
                            :
                            <Button type="submit" className="w-full h-10 py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide">
                                Đăng ký
                            </Button>
                        }
                    </form>

                    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
                        <div className="flex items-center gap-4 my-6">
                            <hr className="w-full border-slate-300 dark:border-neutral-700" />
                            <p className="text-sm text-slate-700 text-center dark:text-slate-300">hoặc</p>
                            <hr className="w-full border-slate-300 dark:border-neutral-700" />
                        </div>

                        <SignInWithGoogle></SignInWithGoogle>
                        <div className=" my-2"></div>
                        <SignInWithGithub></SignInWithGithub>

                        <div className="mt-6 text-slate-900 text-sm text-center dark:text-slate-50">Bạn đã có tài khoản?
                            <Link href="/auth/login"
                                className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">Đăng
                                nhập ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
