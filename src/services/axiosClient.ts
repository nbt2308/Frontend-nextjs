
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { signOut } from "next-auth/react"
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 giây
});

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

let isSigningOut = false;

// Xử lý dữ liệu và lỗi tập trung sau khi nhận response
axiosClient.interceptors.response.use(
    (response) => response.data, // Chỉ trả về data, bỏ qua các thông tin bọc ngoài của axios
    (error) => {
        // Ví dụ: Nếu BE trả về 401 (Hết hạn token) -> Tự động logout hoặc refresh token
        if (error.response?.status === 401) {
            if (!isSigningOut) {
                isSigningOut = true;
                // Xử lý logout hoặc gọi API Refresh Token tại đây
                signOut();
            }
            // Trả về một Promise không bao giờ resolve để ngăn react-query retry liên tục
            // trong lúc chờ NextAuth signOut và chuyển hướng trang.
            return new Promise(() => {});
        }
        return Promise.reject(error.response?.data || 'Có lỗi xảy ra');
    }
);

export default axiosClient;