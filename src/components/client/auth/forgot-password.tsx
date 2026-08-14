"use client"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IForgotPasswordStep1, IForgotPasswordStep2, IForgotPasswordStep3, forgotPasswordStep1Schema, forgotPasswordStep2Schema, forgotPasswordStep3Schema } from "@/schemas/auth.schema";
import { useForgotPassword } from "@/hooks/useAuth";
import { AlertCircleIcon, CheckCircleIcon, CircleCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
interface ForgotPasswordProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ForgotPassword({ open, onOpenChange }: ForgotPasswordProps) {
    const { isActive: isCountdownActive, formatted: countdownFormatted, start: startCountdown } = useCountdown(120);
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
    const formStep1 = useForm<IForgotPasswordStep1>({
        resolver: zodResolver(forgotPasswordStep1Schema),
        defaultValues: {
            email: "",
        },
    })
    const formStep2 = useForm<IForgotPasswordStep2>({
        resolver: zodResolver(forgotPasswordStep2Schema),
        defaultValues: {
            codeId: "",
        },
    })
    const formStep3 = useForm<IForgotPasswordStep3>({
        resolver: zodResolver(forgotPasswordStep3Schema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })
    const { step, sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPassword, prevStep, isPending, error, email } = useForgotPassword();
    const handleSubmitStep1 = (data: IForgotPasswordStep1) => {
        sendForgotPasswordOtp(data.email);

    };

    const handleSubmitStep2 = (data: IForgotPasswordStep2) => {
        verifyForgotPasswordOtp(data.codeId);
    };

    const handleSubmitStep3 = (data: IForgotPasswordStep3) => {
        resetPassword(data.password);
    };

    const handleResendOTP = () => {
        sendForgotPasswordOtp(email, {
            onSuccess: () => {
                startCountdown();
            }
        });
    }
    const errorMessage = error?.message;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => {
                e.preventDefault();
            }}>
                <DialogHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>
                            {step === 4 ? "Hoàn tất" : "Quên mật khẩu"}
                        </DialogTitle>
                        <DialogDescription></DialogDescription>

                    </div>
                    {step < 4 && (
                        <div className="flex gap-2 mt-4">
                            {[
                                { id: 1, label: "XÁC MINH" },
                                { id: 2, label: "XÁC THỰC" },
                                { id: 3, label: "CẬP NHẬT" },
                            ].map((s) => (
                                <div key={s.id} className="flex-1 flex flex-col gap-2">
                                    <div className={`w-full rounded-full ${step >= s.id ? "h-1 bg-slate-900 dark:bg-slate-50 transition-all duration-300" : "h-[2px] bg-slate-200 dark:bg-slate-700"}`}></div>
                                    <span className={`text-[10px] font-semibold tracking-wider uppercase ${step >= s.id ? "text-slate-900 dark:text-slate-50" : "text-slate-400 dark:text-slate-500"}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogHeader>
                {!isPending && errorMessage && (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                {step === 1 &&
                    <>
                        <div>
                            <p className=" text-sm text-slate-600 dark:text-slate-400">
                                Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn mã xác minh để xác thực tài khoản của bạn.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={formStep1.handleSubmit(handleSubmitStep1)}>
                            <FieldGroup>
                                <Controller
                                    control={formStep1.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="forgot-password-email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="forgot-password-email"
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
                            </FieldGroup>
                            {isPending ? (
                                <Button type="button" className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full">Gửi mã OTP</Button>
                            )}
                        </form>
                    </>}
                {
                    step === 2 &&
                    <>
                        <div >
                            <p className=" text-sm text-slate-600 dark:text-slate-400">
                                Chúng tôi đã gửi mã đến <span className="font-medium text-slate-900 dark:text-slate-50">{email}</span>. Vui lòng nhập mã đó bên dưới.
                            </p>
                        </div>
                        <form className="space-y-6" onSubmit={formStep2.handleSubmit(handleSubmitStep2)}>
                            <FieldGroup>
                                <Controller
                                    control={formStep2.control}
                                    name="codeId"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex flex-col items-center">
                                                <InputOTP id="verify-otp-code"
                                                    maxLength={6}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} defaultValue="" />
                                                        <InputOTPSlot index={1} defaultValue="" />
                                                        <InputOTPSlot index={2} defaultValue="" />
                                                        <InputOTPSlot index={3} defaultValue="" />
                                                        <InputOTPSlot index={4} defaultValue="" />
                                                        <InputOTPSlot index={5} defaultValue="" />
                                                    </InputOTPGroup>
                                                </InputOTP>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </div>
                                        </Field>
                                    )}
                                />
                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel className="text-slate-600 dark:text-slate-400">Bạn chưa nhận được mã OTP?</FieldLabel>
                                        <Button type="button" variant="link" onClick={() => handleResendOTP()} disabled={isPending || isCountdownActive}>
                                            {isPending ? "Đang gửi..." : isCountdownActive ? `Gửi lại sau ${countdownFormatted}` : "Gửi lại mã OTP"}
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                            {isPending ? (
                                <Button type="button" className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full">Xác nhận</Button>
                            )}
                        </form>
                    </>
                }
                {step === 3 && (
                    <>
                        <div >
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Nhập mật khẩu mới cho tài khoản của bạn. Hãy chọn một mật khẩu mạnh mà bạn chưa từng sử dụng trước đây.
                            </p>
                        </div>
                        <form className="space-y-6" onSubmit={formStep3.handleSubmit(handleSubmitStep3)}>
                            <FieldGroup>
                                <Controller
                                    control={formStep3.control}
                                    name="password"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="password">
                                                Mật khẩu
                                            </FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Nhập mật khẩu mới"
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="new-password"
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
                                    control={formStep3.control}
                                    name="confirmPassword"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="confirmPassword">
                                                Xác nhận mật khẩu
                                            </FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    id="confirmPassword"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Xác nhận mật khẩu mới"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    autoComplete="new-password"
                                                />
                                                <button type="button" id="togglePassword" aria-label="Show password" aria-pressed="false"
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
                            {isPending ? (
                                <Button type="button" className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full">Đặt lại mật khẩu</Button>
                            )}
                        </form>
                    </>
                )}

                {
                    step === 4 && (
                        <div className="flex flex-col items-center gap-4">
                            <CircleCheck className="w-10 h-10 text-green-600" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Đặt lại mật khẩu thành công</h3>
                                <p className="text-sm text-muted-foreground">Mật khẩu của bạn đã được đặt lại. Bạn có thể đăng nhập vào tài khoản của mình ngay bây giờ.</p>
                            </div>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="w-full">← Trở lại đăng nhập</Button>
                            </DialogClose>
                        </div>
                    )
                }
                {step > 1 && step < 3 && (
                    <Button variant="outline" onClick={prevStep} disabled={isPending}>
                        ← Quay lại
                    </Button>
                )}

            </DialogContent>
        </Dialog>
    )
}