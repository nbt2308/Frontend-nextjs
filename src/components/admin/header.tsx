"use client"
import React from "react";
import { ModeToggle } from "../shared/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar"
export default function AdminHeader() {
    return (
        <header className="shadow-sm px-6 py-4 flex items-center justify-between border-b">
            <div>
                <SidebarTrigger />
            </div>

            <div>
                <div>
                    <ModeToggle />
                </div>

            </div>
        </header>
    );
}
