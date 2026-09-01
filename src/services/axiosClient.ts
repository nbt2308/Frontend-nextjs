
import { RoleSchema } from '@/types/generated-zod/schemas';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 giây
});

// ===== Request Interceptor =====
// Tự động gắn access_token vào mỗi request
axiosClient.interceptors.request.use(
    async (config) => {
        let session = null;
        try {
            session = await getSession();
        } catch (error) {
            console.error("Lấy session thất bại:", error);
        }

        const token = (session as any)?.access_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===== Response Interceptor với Refresh Token =====

// Flag và queue để tránh gọi refresh đồng thời
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = [];

/**
 * Xử lý các request đang chờ trong queue sau khi refresh xong
 */
const processQueue = (error: any, session: any = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(session);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => response.data, // Chỉ trả về data, bỏ qua các thông tin bọc ngoài của axios
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Chỉ xử lý 401 và request chưa được retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Nếu đang có request khác refresh rồi → đưa vào queue chờ
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(async (session: any) => {
                    // Sau khi refresh xong, retry request với token mới
                    const token = session?.access_token;
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return axiosClient(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Trigger NextAuth update session → jwt callback sẽ tự gọi refresh
                // getSession() sẽ gọi lại jwt callback, nếu token hết hạn jwt callback sẽ refresh
                const session = await getSession();

                // Kiểm tra nếu refresh thất bại (jwt callback set error)
                if (session?.error === "RefreshTokenError") {
                    processQueue(new Error("RefreshTokenError"), null);
                    // Rút gọn điều hướng logout cưỡng bức
                    const callbackUrl = session.user?.role === RoleSchema.enum.ADMIN 
                        ? "/admin-login" 
                        : "/auth/login";
                    await signOut({ callbackUrl });
                    return new Promise(() => { });
                }

                // Refresh thành công → xử lý queue
                processQueue(null, session);

                // Retry request gốc với token mới
                const newToken = session?.access_token;
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return axiosClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                // Nếu có lỗi không mong muốn → signOut
                await signOut({ callbackUrl: "/auth/login" });
                return new Promise(() => { }); // Ngăn react-query retry
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error.response?.data || 'Có lỗi xảy ra');
    }
);

export default axiosClient;