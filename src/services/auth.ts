import axios from 'axios';
import { ConflictAccountError, InActiveAccountError, InvalidEmailPasswordError, InvalidParameters } from "@/types/errors";

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
                console.log('check res', error.response);

                const status = error.response.data.statusCode;
                if (status === 401) {
                    throw new InvalidEmailPasswordError();
                }
                if (status === 403) {
                    throw new InActiveAccountError();
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

    }
};