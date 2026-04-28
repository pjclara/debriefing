import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

function FlashToast() {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;
    const [message, setMessage] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setMessage(null), 3000);
        }
    }, [flash?.success]);

    if (!message) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xl dark:bg-gray-700 animate-in fade-in slide-in-from-bottom-2">
            <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {message}
        </div>
    );
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <FlashToast />
        </AppShell>
    );
}
