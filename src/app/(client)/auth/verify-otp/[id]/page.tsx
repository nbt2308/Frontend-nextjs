import VerifyOtp from "@/components/client/auth/verify-otp";


export default async function VerifyOtpPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <VerifyOtp id={Number(id)} />
    );
}