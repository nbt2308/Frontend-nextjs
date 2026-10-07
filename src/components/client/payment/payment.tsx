'use client';

import React, { useEffect, useState } from 'react';
import { usePaymentPolling } from '@/hooks/usePayment';
import { CheckCircle, XCircle, Loader2, AlertCircle, Copy, Clock } from 'lucide-react';
import { message } from 'antd';
import { PaymentStatusSchema } from '@/types/generated-zod/schemas';
import { Separator } from '@/components/ui/separator';
interface PaymentProps {
    orderNumber: string;
    onSuccess?: () => void;
}

export default function Payment({ orderNumber, onSuccess }: PaymentProps) {
    const { data: payment, isPending: loading, isError, error } = usePaymentPolling(orderNumber);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const PaymentStatus = PaymentStatusSchema.enum
    useEffect(() => {
        if (payment?.status === PaymentStatus.PAID && onSuccess) {
            onSuccess();
        }
    }, [payment?.status, onSuccess]);

    useEffect(() => {
        if (!payment || !payment.expiresAt) {
            setRemainingSeconds(0);
            return;
        }
        if (payment.expiresAt < new Date()) {
            setRemainingSeconds(0);
            return;
        }
        const updateRemaining = () => {
            const expiresAt = !payment.expiresAt ? 0 : new Date(payment.expiresAt).getTime();
            const remaining = Math.max(
                0,
                Math.ceil((expiresAt - Date.now()) / 1000),
            );

            setRemainingSeconds(remaining);
        };

        updateRemaining();

        const timer = setInterval(updateRemaining, 1000);

        return () => clearInterval(timer);
    }, [payment?.expiresAt]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success('Đã sao chép');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải thông tin thanh toán...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center text-card-foreground min-h-[400px]">
                <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Đã xảy ra lỗi</h3>
                <p className="text-muted-foreground text-center">{error?.message || 'Lỗi khi lấy thông tin thanh toán'}</p>
            </div>
        );
    }

    if (!payment) return null;

    const isSuccess = payment.status === PaymentStatus.PAID;
    const isFailed = payment.status === PaymentStatus.FAILED || payment.status === PaymentStatus.EXPIRED || payment.status === PaymentStatus.REFUNDED;
    const isPending = payment.status === PaymentStatus.PENDING || payment.status === PaymentStatus.PROCESSING;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return (
        <div className="max-w-md mx-auto rounded-3xl shadow-xl overflow-hidden border border-border ">
            {/* Header */}
            <div className={`p-6 text-center ${isSuccess ? 'bg-green-500 dark:bg-green-600' : isFailed ? 'bg-destructive' : 'bg-muted text-foreground'} transition-colors duration-500`}>
                {isSuccess ? (
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                ) : isFailed ? (
                    <XCircle className="w-16 h-16 mx-auto mb-3e" />
                ) : (
                    <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    </div>
                )}
                <h2 className="text-2xl font-bold">
                    {isSuccess ? 'Thanh toán thành công' : isFailed ? 'Thanh toán thất bại' : 'Đang chờ thanh toán'}
                </h2>
                <p className=" mt-1 text-sm">
                    {isSuccess ? 'Cảm ơn bạn đã mua khóa học!' : isFailed ? 'Đơn hàng đã hết hạn hoặc bị lỗi.' : 'Vui lòng hoàn tất thanh toán để nhận khóa học'}
                </p>
            </div>

            {/* Content */}
            <div className="p-8">
                {/* QR Code Section */}
                {isPending && payment.qrCodeUrl && (
                    <div className="mb-8">
                        <div className="bg-muted/50 p-4 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center">
                            <img
                                src={payment.qrCodeUrl}
                                alt="QR Code thanh toán"
                                className="w-48 h-48 object-contain mb-4 rounded-lg bg-white p-2 shadow-sm"
                            />
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                Đang chờ bạn quét mã QR...
                            </p>
                        </div>
                    </div>
                )}

                {/* Payment Details */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground text-sm">Số tiền</span>
                        <span className="font-bold text-lg text-primary">{formatCurrency(payment.amount)}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground text-sm">Sản phẩm</span>
                        {/* <span className="font-semibold text-foreground">{payment.order.orderItems.map((orderItem) => orderItem.course?.title).join(', ')}</span> */}
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground text-sm">Mã thanh toán</span>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{payment.paymentCode}</span>
                            <button
                                onClick={() => copyToClipboard(payment.paymentCode)}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                title="Sao chép"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground text-sm">Mã đơn hàng</span>
                        <span className="font-medium text-foreground">
                            {payment.order?.orderNumber || `#${payment.orderId}`}
                        </span>
                    </div>

                    {payment.expiresAt && isPending && (
                        <div className="flex justify-between items-center py-3 border-b border-border">
                            <span className="text-muted-foreground text-sm">Hết hạn sau</span>
                            <span className="font-medium flex items-center gap-1.5 text-orange-500">
                                <Clock className="w-4 h-4" />
                                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                {isPending && (
                    <>
                        <div className="flex items-center gap-2 my-6">
                            <div className="flex-1 border-t border-border"></div>
                            <span className="text-muted-foreground text-sm px-2">Hoặc</span>
                            <div className="flex-1 border-t border-border"></div>
                        </div>
                        <div className="mt-2 space-y-4">
                            {/* Manual Transfer Information */}
                            {(payment as any).bank && (
                                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                    <p className="font-semibold mb-3 text-sm text-foreground">Chuyển khoản thủ công:</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Ngân hàng</span>
                                            <span className="font-semibold text-foreground">{(payment as any).bank.bankName}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Số tài khoản</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">{(payment as any).bank.accountNumber}</span>
                                                <button
                                                    onClick={() => copyToClipboard((payment as any).bank.accountNumber)}
                                                    className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                                    title="Sao chép"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Nội dung CK</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">{payment.paymentCode}</span>
                                                <button
                                                    onClick={() => copyToClipboard(payment.paymentCode)}
                                                    className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                                    title="Sao chép"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                                            <strong>* Lưu ý quan trọng:</strong> Vui lòng nhập chính xác nội dung chuyển khoản để hệ thống tự động xác nhận đơn hàng của bạn.
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50/50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 dark:border-blue-800/30">
                                <p className="font-semibold mb-2">Hướng dẫn thanh toán bằng QR:</p>
                                <ol className="list-decimal pl-4 space-y-1 text-blue-700/80 dark:text-blue-300/80">
                                    <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                                    <li>Chọn tính năng quét mã QR (QR Pay)</li>
                                    <li>Quét mã QR ở trên và xác nhận thanh toán</li>
                                </ol>
                                <p className="mt-3 text-xs opacity-75">
                                    * Giao dịch sẽ được cập nhật tự động trong vài giây sau khi thanh toán thành công.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}