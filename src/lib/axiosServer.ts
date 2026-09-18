import axios from "axios";
import { auth } from "@/auth";

const axiosServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosServer.interceptors.request.use(
    async (config) => {
        try {
            const session = await auth();

            if (session?.error === "RefreshTokenError") {
                return config;
            }

            const token = session?.access_token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error(
                "Không thể lấy server session:",
                error,
            );
        }

        return config;
    },
);

axiosServer.interceptors.response.use(
    (response) => response.data,
    (error) =>
        Promise.reject(
            error?.response?.data || error,
        ),
);

export default axiosServer;