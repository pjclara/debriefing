import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, History, LayoutGrid, Users, Building2, Wrench, Syringe, Boxes, TrendingDown } from 'lucide-react';
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
import type { Auth, NavGroup } from '@/types';

const allNavGroups: NavGroup[] = [
    {
        label: 'Cirurgias',
        items: [
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
        ],
    },
    {
        label: 'Consumíveis & Stock',
        items: [
            {
                title: 'Tipos de Consumíveis',
                href: '/consumivel_tipos',
                icon: Boxes,
                adminOnly: true,
            },
            {
                title: 'Movimentos de Stock',
                href: '/stock_movimentos',
                icon: TrendingDown,
                adminOnly: true,
            },
            {
                title: 'Histórico de Consumos',
                href: '/consumos/historico',
                icon: History,
            },
        ],
    },
    {
        label: 'Administração',
        items: [
            {
                title: 'Departamentos',
                href: '/departments',
                icon: Building2,
                adminOnly: true,
            },
            {
                title: 'Serviços',
                href: '/services',
                icon: Wrench,
                adminOnly: true,
            },
            {
                title: 'Procedimentos',
                href: '/procedures',
                icon: Syringe,
                adminOnly: true,
            },
            {
                title: 'Utilizadores',
                href: '/users',
                icon: Users,
                adminOnly: true,
            },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.role === 'admin';
    
    const filteredGroups = allNavGroups.map(group => ({
        ...group,
        items: group.items.filter(item => !item.adminOnly || isAdmin),
    })).filter(group => group.items.length > 0);

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
                <NavMain groups={filteredGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
