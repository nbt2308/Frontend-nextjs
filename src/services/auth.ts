import axios from 'axios';
import { ConflictAccountError, CustomAuthError, InActiveAccountError, InvalidParameters, UnauthorizedError } from "@/types/errors";
import { IRegister, ISignIn, IVerifyOtp } from '@/schemas/auth.schema';

const authAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authService = {
    login: async (credentials: Record<string, string>) => {
        try {
            const res = await authAxios.post('/auth/login', {
                username: credentials.email,
                password: credentials.password,
            });

            return res.data;

        } catch (error: any) {
            if (error.response) {
                // console.log('check res', error.response);

                const status = error.response.data.statusCode;
                if (status === 400) {
                    throw new InvalidParameters();
                }
                if (status === 401) {
                    throw new UnauthorizedError();
                }
                if (status === 403) {
                    throw new InActiveAccountError(error.response.data.verifyToken);
                }
                if (status === 409) {
                    throw new ConflictAccountError(error.response.data.message);
                }
            }
            throw error;
        }

    },
    handleOAuthLogin: async (user: any, account: any) => {
        try {
            const res = await authAxios.post('/auth/oauth', {
                email: user.email,
                name: user.name,
                avatar: user.image,
                provider: account.provider,
                providerId: account.providerAccountId
            });
            return res.data;
        }
        catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    throw new InvalidParameters();
                }
            }
            throw error;
        }

    },
    register: async (data: IRegister) => {
        try {
            const { confirmPassword, ...body } = data;
            const res = await authAxios.post('/auth/register', body);

            return res.data;
        } catch (error: any) {
            if (error.response) {

                const status = error.response.data.statusCode;
                if (status === 409) {
                    throw new Error(JSON.stringify(error.response.data));
                }
                if (status === 400) {
                    throw new Error(JSON.stringify(error.response.data));
                }
            }
            throw new Error(JSON.stringify({ message: error.message || "Đã xảy ra lỗi không xác định" }));
        }
    },
    verifyOtp: async (data: IVerifyOtp) => {
        try {
            const res = await authAxios.post('/auth/activate', data);
            return res.data;
        } catch (error: any) {
            if (error.response) {

                const status = error.response.data.statusCode;
                if (status === 400) {
                    throw new Error(JSON.stringify(error.response.data));
                }
                if (status === 404) {
                    throw new Error(JSON.stringify(error.response.data));
                }

            }
            throw new Error(JSON.stringify({ message: error.message || "Đã xảy ra lỗi không xác định" }));
        }
    },
    resendOtp: async (verifyToken: string) => {
        try {
            const res = await authAxios.post('/auth/resend-otp', { verifyToken });

            return res.data;
        } catch (error: any) {
            if (error.response) {
                const status = error.response.data.statusCode;
                if (status === 404) {
                    throw new Error(JSON.stringify(error.response.data));
                }
                if (status === 400) {
                    throw new Error(JSON.stringify(error.response.data));
                }
            }
            throw new Error(JSON.stringify({ message: error.message || "Đã xảy ra lỗi không xác định" }));
        }
    },
    sendForgotPasswordOtp: async (email: string) => {
        try {
            const res = await authAxios.post('/auth/send-reset-password-otp', { email });
            return res.data;
        } catch (error: any) {
            if (error.response) {
                const status = error.response.data.statusCode;
                if (status === 404) {
                    throw new Error(JSON.stringify(error.response.data));
                }
                if (status === 400) {
                    throw new Error(JSON.stringify(error.response.data));
                }
            }
            throw new Error(JSON.stringify({ message: error.message || "Đã xảy ra lỗi không xác định" }));
        }
    },
    verifyForgotPasswordOtp: async (email: string, codeId: string) => {
        try {
            const res = await authAxios.post('/auth/verify-reset-password-otp', { email, codeId });
            return res.data;
        } catch (error: any) {
            if (error.response) {
                const status = error.response.data.statusCode;
                if (status === 404) {
                    throw new Error(JSON.stringify(error.response.data));
                }
                if (status === 400) {
                    throw new Error(JSON.stringify(error.response.data));
                }
            }
            throw new Error(JSON.stringify({ message: error.message || "Đã xảy ra lỗi không xác định" }));
        }
    },
    resetPassword: async (email: string, password: string) => {
        try {
            const res = await authAxios.post('/auth/reset-password', { email, password });
            return res.data;
        } catch (error: any) {
            if (error.response) {
                const status = error.response.data.statusCode;
                if (status === 404) {
                    throw new Error(JSON.stringify(error.response.data));
                }
                if (status === 400) {
                    throw new Error(JSON.stringify(error.response.data));
                }
            }
            throw new Error(JSON.stringify({ message: error.message || "Đã xảy ra lỗi không xác định" }));
        }
    },
    adminLogin: async (data: ISignIn) => {
        try {
            const res = await authAxios.post('/auth/admin-login', data);
            console.log('check res', res.data);

            return res.data;
        } catch (error: any) {
            if (error.response) {
                console.log('check res', error.response.data);

                const status = error.response.data.statusCode;
                if (status === 400) {
                    throw new InvalidParameters();
                }
                if (status === 401) {
                    throw new UnauthorizedError();
                }
                if (status === 403) {
                    throw new InActiveAccountError();
                }
            }
            throw error;
        }
    }
};