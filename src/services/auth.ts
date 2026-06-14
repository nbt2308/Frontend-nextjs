import axios from 'axios';
import { InActiveAccountError, InvalidEmailPasswordError } from "@/types/errors";

const authAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authService = {
    login: async (credentials: Record<string, string>) => {
        try {
            // Nếu API trả về 2xx, code sẽ chạy trơn tru và trả về data
            const res = await authAxios.post('/auth/login', {
                username: credentials.email,
                password: credentials.password,
            });

            return res.data;

        } catch (error: any) {
            // Khi API trả về 401, 403..., code sẽ nhảy thẳng vào đây
            if (error.response) {
                const status = error.response.status;

                // Bây giờ bạn mới check status từ object error của Axios
                if (status === 401) {
                    throw new InvalidEmailPasswordError();
                }
                if (status === 403) {
                    throw new InActiveAccountError();
                }
            }

            // Nếu là lỗi khác (như 500 server sập, mất mạng...), quăng lỗi gốc ra
            throw error;
        }

    },
};