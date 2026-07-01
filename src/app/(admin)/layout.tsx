import AdminHeader from "@/components/admin/header";
import AdminFooter from "@/components/admin/footer";
import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}
