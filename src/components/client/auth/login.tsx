"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignInWithGoogle from "@/components/shared/sign-in-with-google";
import SignInWithGithub from "@/components/shared/sign-in-with-github";
import { Controller, useForm } from "react-hook-form";
import { ISignIn, signInSchema } from "@/schemas/auth.schema";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { useLogin } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { ForgotPassword } from "./forgot-password";
import { toast } from "sonner";
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlError = searchParams?.get('error');

    useEffect(() => {
        if (urlError) {
            // NextAuth may return 'AccessDenied' if an error occurs but we return the custom error msg
            if (urlError !== 'AccessDenied') {
                toast.error(urlError);
            }
            // Optional: clean up the URL to remove the error param
            const url = new URL(window.location.href);
            url.searchParams.delete('error');
            window.history.replaceState({}, '', url.toString());
        }
    }, [urlError]);
    const togglePassword = () => {
        setShowPassword(!showPassword);
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (passwordInput) {
            passwordInput.type = showPassword ? 'password' : 'text';
        }
    }
    const form = useForm<ISignIn>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const { mutate, isPending, error } = useLogin();
    const handleSubmit = (data: ISignIn) => {
        mutate(data);
    };

    const getErrorMessage = () => {
        if (!error) return null;
        switch (error.message) {
            case 'BAD_REQUEST':
                return {
                    text: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
                };
            case 'UNAUTHORIZED':
                return {
                    text: 'Tài khoản của bạn đã bị khoá',
                };
            case 'INACTIVE_ACCOUNT':
                return {
                    text: 'Tài khoản của bạn chưa được kích hoạt!',
                };
            case 'ACCOUNT_CONFLICT':
                return {
                    text: 'Email này đã được đăng ký bằng Google hoặc GitHub. Vui lòng chọn đúng phương thức đăng nhập!',
                };
            default:
                return {
                    text: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
                };
        }
    };
    const errorMessage = getErrorMessage();
    return (
        <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
            <div className="py-4 max-w-md w-full">
                <div
                    className="p-6 rounded-lg border border-slate-300 shadow-xs md:p-8 dark:border-neutral-700">
                    <div className="mb-3 flex justify-center">
                        <Logo size="lg" />
                    </div>
                    <div className="text-center mb-3">
                        <h1 className="text-slate-900 text-center text-xl font-semibold mb-2 dark:text-slate-50">Chào mừng bạn quay trở lại</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Nhập email và mật khẩu để đăng nhập.</p>
                    </div>
                    {!isPending && errorMessage && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Lỗi đăng nhập</AlertTitle>
                            <AlertDescription>{errorMessage.text}</AlertDescription>
                        </Alert>
                    )}

                    <form id="login-form" onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)(e);
                    }} className="mt-5">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="login-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="login-email"
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
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="login-password">
                                            Mật khẩu
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                                id="login-password"
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
                        </FieldGroup>

                        {isPending ?
                            <>
                                <Skeleton className="w-full h-10 mt-3 py-2 px-3.5 text-sm rounded-md font-semibold flex items-center justify-center gap-2.5 bg-black dark:bg-white text-white dark:text-black">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    Đang xử lý...
                                </Skeleton>

                            </>
                            :
                            <Button type="submit" className="w-full h-10 mt-3 py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide">
                                Đăng nhập
                            </Button>
                        }
                    </form>

                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(true)} className="mt-3 w-full cursor-pointer">Quên mật khẩu?</Button>
                    {
                        isModalOpen && (
                            <>
                                <ForgotPassword open={isModalOpen} onOpenChange={setIsModalOpen} />
                                <div className=" fixed inset-0 bg-black/20" />
                            </>
                        )
                    }

                    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
                        <div className="flex items-center gap-4 my-6">
                            <hr className="w-full border-slate-300 dark:border-neutral-700" />
                            <p className="text-sm text-slate-700 text-center dark:text-slate-300">hoặc</p>
                            <hr className="w-full border-slate-300 dark:border-neutral-700" />
                        </div>

                        <SignInWithGoogle></SignInWithGoogle>
                        <div className=" my-2"></div>
                        <SignInWithGithub></SignInWithGithub>

                        <div className="mt-6 text-slate-900 text-sm text-center dark:text-slate-50">Bạn chưa có tài khoản?
                            <Link href="/auth/register"
                                className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">Đăng
                                ký ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}