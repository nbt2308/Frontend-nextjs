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
            router.push(`/auth/verify-otp/${result?.data?.id}`);
            router.refresh();
        }
    })
}

export const useVerifyOtp = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (data: IVerifyOtp) => {
            const result = await authService.verifyOtp(data);

            console.log('verifyOtp result', result);

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
        mutationFn: async (id: number) => {
            const result = await authService.resendOtp(id);

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
