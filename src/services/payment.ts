import axiosClient from '@/lib/axiosClient';
import { PaymentType } from '@/types/generated-zod/schemas/models/Payment.schema';
import { OrderType } from '@/types/generated-zod/schemas/models/Order.schema';

export type PaymentResponse = Omit<PaymentType, 'amount'> & {
    amount: number;
    order: Pick<OrderType, 'id' | 'orderNumber' | 'status'>;
};

export const PaymentService = {
    createPayment: async (orderId: number): Promise<PaymentResponse> => {
        const response = await axiosClient.post(`/payment`, { orderId });
        return response.data;
    },

    getPaymentByOrderNumber: async (orderNumber: string): Promise<PaymentResponse> => {
        const response = await axiosClient.get(`/payment/${orderNumber}`);
        return response.data;
    },
};