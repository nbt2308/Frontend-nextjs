import { useMutation } from "@tanstack/react-query";
import { PaymentService } from "@/services/payment";
import { toast } from "sonner";
import { OrderService } from "@/services/order";

export function useCreateOrder() {
    return useMutation({
        mutationFn: (courseId: string) => OrderService.createOrder(courseId),
        onSuccess: () => {
            toast.success('Tạo đơn hàng thành công');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Tạo đơn hàng thất bại');
        },
    });
}