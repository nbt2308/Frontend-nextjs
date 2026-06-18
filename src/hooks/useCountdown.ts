import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook đếm ngược thời gian (countdown).
 * @param initialSeconds - Số giây ban đầu (mặc định 120s)
 * @returns { seconds, isActive, start, reset, formatted }
 */
export function useCountdown(initialSeconds: number = 120) {
    const [seconds, setSeconds] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Dọn dẹp interval khi unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Xử lý đếm ngược
    useEffect(() => {
        if (isActive && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        setIsActive(false);
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, seconds > 0]);

    // Bắt đầu đếm ngược
    const start = useCallback(() => {
        setSeconds(initialSeconds);
        setIsActive(true);
    }, [initialSeconds]);

    // Reset về trạng thái ban đầu
    const reset = useCallback(() => {
        setSeconds(0);
        setIsActive(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    // Format thời gian thành mm:ss
    const formatted = `${Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

    return { seconds, isActive, start, reset, formatted };
}
