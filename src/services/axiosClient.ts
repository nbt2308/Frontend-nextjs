import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    async (config) => {
        try {
            const session = await getSession();

            if (session?.error === "RefreshTokenError") {
                return config;
            }

            const token = (session as any)?.access_token;

            if (token) {
                config.headers.Authorization =
                    `Bearer ${token}`;
            }
        } catch (error) {
            console.error(
                "Không thể lấy session:",
                error,
            );
        }

        return config;
    },
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error?.response?.data || error)
);

export default axiosClient;