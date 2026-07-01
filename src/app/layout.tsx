import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react"
import Providers from "./providers";
import { Toaster } from "sonner";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "NevaGiveup - Học tập và phát triển bản thân",
    description: "Học tập và phát triển bản thân",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html
            suppressHydrationWarning
            lang="en"
            className="h-full antialiased"
        >

            <body className={`${geistSans.className} min-h-full flex flex-col`} >
                <SessionProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <Providers>
                            {children}
                        </Providers>
                        <Toaster position="top-right" richColors />
                    </ThemeProvider>
                </SessionProvider>
            </body>

        </html>

    );
}
