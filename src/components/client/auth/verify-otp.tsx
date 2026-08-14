"use client"
import Logo from "@/components/ui/logo";
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { IVerifyOtp, verifyOtpSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendOtp, useVerifyOtp } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
export default function VerifyOtp({ token }: { token: string }) {
    const form = useForm<IVerifyOtp>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            verifyToken: token,
            codeId: ""
        },
    })
    const { mutate: verifyMutate, isPending: verifyIsPending, error: verifyError } = useVerifyOtp();
    const handleSubmit = (data: IVerifyOtp) => {
        verifyMutate(data);
    };



    const { mutate: resendMutate, isPending: resendIsPending, error: resendError } = useResendOtp();
    const { isActive: isCountdownActive, formatted: countdownFormatted, start: startCountdown } = useCountdown(120);
    const handleResendOTP = () => {
        resendMutate(token);
        if (!resendError) {
            startCountdown();
        }
    }

    const errorMessage = verifyError?.message || resendError?.message;

    return (
        <>
            <div
                className="pointer-events-none fixed inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(to_bottom,black_60%,transparent)] dark:bg-[url('/grid-dark.svg')]">
            </div>
            <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
                <div className="py-4 max-w-md w-full">
                    <div
                        className="p-6 rounded-lg border border-slate-300 shadow-xs md:p-8 dark:border-neutral-700">
                        <div className="mb-3 flex justify-center">
                            <Logo size="lg" />
                        </div>
                        <div className="text-center mb-3">
                            <h1 className="text-slate-900 text-center text-xl font-semibold mb-3 dark:text-slate-50">Xác thực tài khoản</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Vui lòng nhập mã OTP được gửi đến email của bạn.</p>
                        </div>
                        {!verifyIsPending && !resendIsPending && errorMessage && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>Lỗi xác thực</AlertTitle>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                        <form id="verify-otp-form" onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit(handleSubmit)(e);
                        }} className="space-y-6 mt-5">
                            <Controller
                                name="codeId"
                                control={form.control}
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
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
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
                                    <Button type="button" variant="link" onClick={handleResendOTP} disabled={resendIsPending || isCountdownActive}>
                                        {resendIsPending ? "Đang gửi..." : isCountdownActive ? `Gửi lại sau ${countdownFormatted}` : "Gửi lại mã OTP"}
                                    </Button>
                                </div>
                            </Field>
                            {verifyIsPending ?
                                <>
                                    <Skeleton className="w-full h-10 py-2 px-3.5 text-sm rounded-md font-semibold flex items-center justify-center gap-2.5 bg-black dark:bg-white text-white dark:text-black">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Đang xử lý...
                                    </Skeleton>

                                </>
                                :
                                <Button type="submit" className="w-full h-10 py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide">
                                    Xác nhận
                                </Button>
                            }
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}