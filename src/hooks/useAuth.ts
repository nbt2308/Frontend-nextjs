import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { authService } from '@/services/auth';
import { IRegister, IVerifyOtp } from '@/schemas/auth.schema';
import { toast } from 'sonner';
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
            toast.error(error.message || "Đăng nhập thất bại");
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
            router.push(`/auth/verify-otp?token${result?.data?.verifyToken}`);
            router.refresh();
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
        }
    })
}
