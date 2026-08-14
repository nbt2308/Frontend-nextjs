import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { authService } from '@/services/auth';
import { IRegister, ISignIn, IVerifyOtp } from '@/schemas/auth.schema';
import { toast } from 'sonner';
import { useState } from 'react';
export const useLogin = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (credentials: Record<string, string>) => {
            const result = await signIn("credentials", {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result?.code as string || result?.error);
            }
            return result;
        },
        onSuccess: () => {
            toast.success("Đăng nhập thành công");
            router.push('/');
            router.refresh();
        },
        onError: async (error) => {
            try {
                const parsed = JSON.parse(decodeURIComponent(error.message));

                if (parsed.code === 'INACTIVE_ACCOUNT' && parsed.verifyToken) {
                    toast.warning("Tài khoản chưa được kích hoạt, vui lòng xác thực email");
                    router.push(`/auth/verify-otp?token=${parsed.verifyToken}`);
                    return;
                }
            } catch {
                // error.message không phải JSON, xử lý bình thường
            }
            toast.error("Đăng nhập thất bại");
        }
    })
}

export const useRegister = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (data: IRegister) => {
            const result = await authService.register(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success("Đăng ký thành công, vui lòng kiểm tra email để xác thực tài khoản");
            router.push(`/auth/verify-otp?token=${result?.data?.verifyToken}`);
        }
    })
}

export const useVerifyOtp = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (data: IVerifyOtp) => {
            const result = await authService.verifyOtp(data);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: () => {
            toast.success("Xác thực thành công");
            router.push(`/auth/login`);
            router.refresh();
        }
    })
}

export const useResendOtp = () => {
    return useMutation({
        mutationFn: async (verifyToken: string) => {
            const result = await authService.resendOtp(verifyToken);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: () => {
            toast.success("Gửi lại mã OTP thành công");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useForgotPassword = () => {
    /*
     * 1: Email
     * 2: Code ID
     * 3: Password
     */
    const [email, setEmail] = useState<string>("");
    const [step, setStep] = useState<number>(1);
    const sendForgotPasswordOtp = useMutation({
        mutationFn: async (submitEmail: string) => {
            const result = await authService.sendForgotPasswordOtp(submitEmail);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;

        },
        onSuccess: (result, submittedEmail) => {
            toast.success(result?.message);
            setEmail(submittedEmail);
            setStep(2);
        }
    })
    const verifyForgotPasswordOtp = useMutation({
        mutationFn: async (codeId: string) => {
            const result = await authService.verifyForgotPasswordOtp(email, codeId);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;
        },
        onSuccess: () => {
            toast.success("Xác thực thành công");
            setStep(3);
        }
    })
    const resetPassword = useMutation({
        mutationFn: async (password: string) => {
            const result = await authService.resetPassword(email, password);

            if (result?.error) {
                throw new Error(result?.error);
            }

            return result;

        },
        onSuccess: () => {
            toast.success("Đặt lại mật khẩu thành công");
            setStep(4);
        }
    })
    const prevStep = () => {
        if (step > 1 && step < 4) setStep((prev) => prev - 1);
    };
    return {
        sendForgotPasswordOtp: sendForgotPasswordOtp.mutate,
        verifyForgotPasswordOtp: verifyForgotPasswordOtp.mutate,
        resetPassword: resetPassword.mutate,
        step,
        isPending: sendForgotPasswordOtp.isPending || verifyForgotPasswordOtp.isPending || resetPassword.isPending,
        error: sendForgotPasswordOtp.error || verifyForgotPasswordOtp.error || resetPassword.error,
        prevStep,
        email
    }
}

export const useAdminLogin = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (credentials: ISignIn) => {
            const result = await signIn("admin-login", {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result?.code as string || result?.error);
            }
            return result;
        },
        onSuccess: () => {
            toast.success("Đăng nhập thành công");
            router.push('/admin/dashboard');
            router.refresh();
        },
        onError: (error) => {
            toast.error("Đăng nhập thất bại");
        }
    })
}
