import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginButton() {
    return (
        <Link href={"/auth/login"}>
            <Button className="flex justify-center items-center text-center cursor-pointer" >
                <span>Đăng nhập</span>
            </Button>
        </Link>
    )
}