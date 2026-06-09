"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    return (
        <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
            <div className="py-4 max-w-md w-full">
                <div
                    className="p-6 rounded-lg border border-slate-300 shadow-xs md:p-8 dark:border-neutral-700">
                    <div className="mb-6 flex justify-center">
                        <Logo size="lg" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-slate-900 text-center text-xl font-semibold mb-2 dark:text-slate-50">Đăng ký tài khoản</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Vui lòng điền thông tin bên dưới.</p>
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
                        <div>
                            <label htmlFor="username"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Tên đăng nhập</label>
                            {/* <input type="email" id="email" name="email" placeholder="Nhập email của bạn" required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md  w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:outline-neutral-600" /> */}
                            <Input type="text" id="username" name="username" placeholder="Nhập tên đăng nhập của bạn" required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Số điện thoại</label>
                            {/* <input type="email" id="email" name="email" placeholder="Nhập email của bạn" required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md  w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:outline-neutral-600" /> */}
                            <Input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại của bạn" required
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
                        <div className="relative">
                            <label htmlFor="confirmPassword"
                                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Xác nhận mật khẩu</label>

                            {/* <input type="password" id="password" name="password" placeholder="••••••••" required
                                className="px-3 py-2.5 text-sm text-slate-900 rounded-md  w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:outline-neutral-600" /> */}
                            <div className="relative">
                                <Input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="••••••••" required></Input>
                                <button type="button" id="toggleConfirmPassword" aria-label="Show password" aria-pressed="false"
                                    className="absolute top-1 right-2 p-0.5 flex cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                                    onClick={toggleConfirmPassword}>
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        {/* <button type="submit"
                            className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                            Đăng ký</button> */}
                        <Button type="submit" className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide">Đăng ký</Button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <hr className="w-full border-slate-300 dark:border-neutral-700" />
                        <p className="text-sm text-slate-700 text-center dark:text-slate-300">hoặc</p>
                        <hr className="w-full border-slate-300 dark:border-neutral-700" />
                    </div>

                    <div>
                        <a href="#"
                            className="w-full flex items-center justify-center gap-2.5 py-2 px-3.5 text-sm rounded-md font-semibold text-slate-900 border border-slate-300 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-50 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px]" viewBox="0 0 512 512" aria-hidden="true">
                                <path fill="#fbbd00"
                                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                                    data-original="#fbbd00" />
                                <path fill="#0f9d58"
                                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                                    data-original="#0f9d58" />
                                <path fill="#31aa52"
                                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                                    data-original="#31aa52" />
                                <path fill="#3c79e6"
                                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                                    data-original="#3c79e6" />
                                <path fill="#cf2d48"
                                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                                    data-original="#cf2d48" />
                                <path fill="#eb4132"
                                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                                    data-original="#eb4132" />
                            </svg>
                            Đăng ký bằng Google
                        </a>
                    </div>

                    <div className="mt-6 text-slate-900 text-sm text-center dark:text-slate-50">Bạn đã có tài khoản?
                        <Link href="/auth/login"
                            className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">Đăng
                            nhập ngay</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
