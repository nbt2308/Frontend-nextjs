import React from "react";

export default function AdminHeader() {
    return (
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div>
                {/* Add admin profile/logout here */}
                Admin User
            </div>
        </header>
    );
}
