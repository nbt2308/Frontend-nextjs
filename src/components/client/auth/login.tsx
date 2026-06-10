"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignInWithGoogle from "@/components/shared/sign-in-with-google";
import SignInWithGithub from "@/components/shared/sign-in-with-github";
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (passwordInput) {
            passwordInput.type = showPassword ? 'password' : 'text';
        }
    }
    return (
        <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
            <div className="py-4 max-w-md w-full">
                <div
                    className="p-6 rounded-lg border border-slate-300 shadow-xs md:p-8 dark:border-neutral-700">
                    <div className="mb-6 flex justify-center">
                        <Logo size="lg" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-slate-900 text-center text-xl font-semibold mb-2 dark:text-slate-50">Chào mừng bạn quay trở lại</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Nhập email và mật khẩu để đăng nhập.</p>
                    </div>

                    <form className="space-y-6 mt-10">
                        <div>
                            <label htmlFor="email"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Email</label>
                            {/* <input type="email" id="email" name="email" placeholder="Nhập email của bạn" required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md  w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:outline-neutral-600" /> */}
                            <Input type="email" id="email" name="email" placeholder="Nhập email của bạn" required
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Mật khẩu</label>

                            {/* <input type="password" id="password" name="password" placeholder="••••••••" required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md  w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:outline-neutral-600" /> */}
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••••" required></Input>
                                <button type="button" id="togglePassword" aria-label="Show password" aria-pressed="false"
                                    className="absolute top-1 right-2 p-0.5 flex cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                                    onClick={togglePassword}>
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start flex-wrap gap-2">
                            <Link href="/auth/forgot-password"
                                className="ml-auto text-sm font-medium text-blue-700 dark:text-blue-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full h-10 py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide">Đăng nhập</Button>
                    </form>

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
        </main>
    )
}