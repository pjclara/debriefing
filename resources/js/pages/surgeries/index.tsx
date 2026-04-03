import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Surgery {
    id: number;
    data: string;
    hora: string;
    procedimento: string;
    sala: string;
    especialidade: string;
}

interface Props {
    surgeries: Surgery[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cirurgias', href: '/surgeries' },
];

export default function SurgeriesIndex({ surgeries, flash }: Props) {
    function confirmDelete(id: number) {
        if (confirm('Tem a certeza que pretende eliminar esta cirurgia?')) {
            router.delete(`/surgeries/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cirurgias" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Cirurgias</h1>
                    <Link
                        href="/surgeries/create"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Nova Cirurgia
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                {surgeries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                        Nenhuma cirurgia registada.{' '}
                        <Link href="/surgeries/create" className="text-blue-600 underline">
                            Criar a primeira
                        </Link>
                        .
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                        Data
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                        Hora
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                        Procedimento
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                        Sala
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                        Especialidade
                                    </th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {surgeries.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm">{s.data}</td>
                                        <td className="px-4 py-3 text-sm">{s.hora}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{s.procedimento}</td>
                                        <td className="px-4 py-3 text-sm">{s.sala}</td>
                                        <td className="px-4 py-3 text-sm">{s.especialidade}</td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <Link
                                                href={`/surgeries/${s.id}/edit`}
                                                className="mr-3 text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(s.id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
