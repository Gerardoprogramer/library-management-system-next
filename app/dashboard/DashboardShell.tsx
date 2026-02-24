'use client';

import { useState } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: user } = useQuery({
        queryKey: ["currentUser"],
        queryFn: userService.me,
    });

    return (
    <div className="h-screen bg-background flex">

        <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex-1 flex flex-col min-h-0">
            <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between md:justify-end px-6 sticky top-0 z-30">
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className="flex items-center gap-2">
                        <span className="font-body text-sm text-muted-foreground hidden sm:block">
                            {user?.fullName}
                        </span>
                        <Avatar className="w-9 h-9 border border-border">
                            <AvatarFallback className="font-display text-xs bg-primary/10 text-primary">
                                {user?.fullName
                                    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                                    : 'Ob'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>

        </div>
    </div>
    );
}