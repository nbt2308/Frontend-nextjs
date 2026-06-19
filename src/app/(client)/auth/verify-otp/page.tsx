import VerifyOtp from "@/components/client/auth/verify-otp";

interface PageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function VerifyOtpPage({ searchParams }: PageProps) {
    const { token } = await searchParams;
    return (
        <VerifyOtp token={token as string} />
    );
}