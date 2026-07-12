"use client"
import React from "react";

export default function AdminFooter() {
    return (
        <footer className="shadow-sm border-t py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NevaGiveup Admin. All rights reserved.
        </footer>
    );
}
