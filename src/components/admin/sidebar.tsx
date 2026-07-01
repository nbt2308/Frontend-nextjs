import React from "react";
import Link from "next/link";

export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
            <div className="p-4 border-b border-gray-700">
                <Link href="/admin">
                    <h2 className="text-2xl font-bold">Admin Panel</h2>
                </Link>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <Link href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
                    Dashboard
                </Link>
                <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-700">
                    Users
                </Link>
                <Link href="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-700">
                    Settings
                </Link>
                {/* Add more admin links here */}
            </nav>
        </aside>
    );
}
