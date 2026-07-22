import AdminHeader from "@/components/admin/header";
import AdminFooter from "@/components/admin/footer";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider className="flex min-h-screen">
            <AdminSidebar />
            <SidebarInset className="flex-1 flex flex-col min-w-0">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
                <AdminFooter />
            </SidebarInset>
        </SidebarProvider>
    );
}