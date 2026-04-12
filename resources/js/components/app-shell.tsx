import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

type Props = {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
};

export function AppShell({ children, variant = 'header' }: Props) {
    const page = usePage();
    const isOpen = page.props.sidebarOpen;
    const user = (page.props.auth as any)?.user;

    // Aplicar dark mode ao renderizar
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        const isDarkMode = savedDarkMode !== null 
            ? JSON.parse(savedDarkMode) 
            : user?.dark_mode ?? false;
        
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [user?.dark_mode]);

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
