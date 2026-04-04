import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Users, ShieldCheck, ShieldOff } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard } from '@/components/form-ui';
import type { BreadcrumbItem, Auth } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface Props {
    users: User[];
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilizadores', href: '/users' },
];

export default function UsersIndex({ users, flash }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    function confirmDelete(u: User) {
        if (confirm(`Eliminar o utilizador "${u.name}"?`)) {
            router.delete(`/users/${u.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Utilizadores" />
            <div className="mx-auto max-w-3xl p-6">

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-800">
                        {flash.error}
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Utilizadores</h1>
                        <p className="mt-1 text-sm text-gray-500">{users.length} utilizador{users.length !== 1 ? 'es' : ''} registado{users.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Link
                        href="/users/create"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Novo Utilizador
                    </Link>
                </div>

                <SectionCard icon={Users} title="Lista de Utilizadores" description={`${users.length} registos`}>
                    {users.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhum utilizador encontrado.</p>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            {users.map((u) => (
                                <div
                                    key={u.id}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold uppercase text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {u.name}
                                                {u.id === auth.user.id && (
                                                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                                                        Eu
                                                    </span>
                                                )}
                                            </p>
                                            <p className="truncate text-xs text-gray-500">{u.email}</p>
                                        </div>
                                        <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                            u.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {u.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                        {u.email_verified_at ? (
                                            <span title="Email verificado" className="ml-auto shrink-0 text-green-500">
                                                <ShieldCheck size={15} />
                                            </span>
                                        ) : (
                                            <span title="Email não verificado" className="ml-auto shrink-0 text-amber-400">
                                                <ShieldOff size={15} />
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <Link
                                            href={`/users/${u.id}/edit`}
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-blue-600 dark:hover:bg-gray-700"
                                            title="Editar"
                                        >
                                            <Pencil size={15} />
                                        </Link>
                                        {u.id !== auth.user.id && (
                                            <button
                                                onClick={() => confirmDelete(u)}
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-500 dark:hover:bg-gray-700"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>
        </AppLayout>
    );
}
