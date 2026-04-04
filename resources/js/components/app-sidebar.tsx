import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, FlaskConical, LayoutGrid, PackageOpen, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types';

const allNavItems: (NavItem & { adminOnly?: boolean })[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Briefings Cirúrgicos',
        href: '/briefings',
        icon: ClipboardList,
    },
    {
        title: 'Consumos',
        href: '/consumos',
        icon: PackageOpen,
        adminOnly: true,
    },
    {
        title: 'Catálogo de Consumíveis',
        href: '/consumiveis',
        icon: FlaskConical,
        adminOnly: true,
    },
    {
        title: 'Utilizadores',
        href: '/users',
        icon: Users,
        adminOnly: true,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.role === 'admin';
    const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
