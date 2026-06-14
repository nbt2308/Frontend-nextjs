import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
            router.push('/');
            router.refresh();
        }
    })
}