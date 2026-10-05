import { useQuery, useMutation } from "@tanstack/react-query";
import { PaymentService, PaymentResponse } from "@/services/payment";
import { toast } from "sonner";
import { PaymentStatusSchema } from "@/types/generated-zod/schemas";

/**
 * Hook polling payment status theo id.
 * Tự động refetch mỗi 3 giây khi payment còn ở trạng thái PENDING/PROCESSING.
 */
export function usePaymentPolling(orderNumber: string) {
    const PaymentStatus = PaymentStatusSchema.enum
    return useQuery<PaymentResponse>({
        queryKey: ['payment', orderNumber],
        queryFn: () => PaymentService.getPaymentByOrderNumber(orderNumber),
        enabled: !!orderNumber,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            // Dừng polling khi status đã ở trạng thái cuối
            if (status === PaymentStatus.PAID || status === PaymentStatus.FAILED || status === PaymentStatus.EXPIRED || status === PaymentStatus.REFUNDED) {
                return false;
            }
            return 3000; // poll mỗi 3 giây
        },
        refetchIntervalInBackground: false,
        staleTime: 0, // Luôn refetch để cập nhật trạng thái mới nhất
    });
}

/**
 * Hook tạo payment mới từ orderId.
 */
export function useCreatePayment() {
    return useMutation({
        mutationFn: (orderId: number) => PaymentService.createPayment(orderId),
        onError: (error: any) => {
            toast.error(error?.message || 'Tạo thanh toán thất bại');
        },
    });
}
