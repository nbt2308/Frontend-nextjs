import Payment from '@/components/client/payment/payment';
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Thanh toán | NevaGiveUp`,
    };
}

export default async function PaymentPage({ params }: { params: Promise<{ orderNumber: string }> }) {
    const { orderNumber } = await params;
    return <Payment orderNumber={String(orderNumber)} />;
}
