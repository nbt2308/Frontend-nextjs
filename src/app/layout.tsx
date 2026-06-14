import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Header from "@/components/client/header";
import Footer from "@/components/client/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react"
import Providers from "./providers";
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
        <SessionProvider>
            <html
                suppressHydrationWarning
                lang="en"
                className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            >

                <body className="min-h-full flex flex-col">
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <Header />
                        <Providers>
                            {children}
                        </Providers>
                        <Footer />
                    </ThemeProvider>
                </body>

            </html>
        </SessionProvider>
    );
}
