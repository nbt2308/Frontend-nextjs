import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { decodeJwt } from "jose";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Thêm số 0 phía trước nếu chữ số hàng đơn vị (< 10)
  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${pad(minutes)}:${pad(secs)}`;
}

export const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

export const getTokenExpire = (accessToken: string) => {
    const payload = decodeJwt(accessToken);

    if (!payload.exp) {
        throw new Error("Access token không có exp");
    }

    return payload.exp * 1000;
};