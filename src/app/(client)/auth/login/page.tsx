
import Login from "@/components/client/auth/login";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <Login />
        </Suspense>
    );
}
