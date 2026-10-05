import axiosClient from "@/lib/axiosClient";
import { PaymentResponse } from "./payment";
import { OrderType } from "@/types/generated-zod/schemas/models/Order.schema";

export const OrderService = {
    createOrder: async (courseId: string): Promise<OrderType> => {
        const response = await axiosClient.post(`/orders`, { courseId });
        return response.data;
    },
};