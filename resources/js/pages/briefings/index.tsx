import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Briefing {
    id: number;
    data: string;
    hora: string;
    especialidade: string;
    sala: string;
    surgeries_count: number;
}

interface Props {
    briefings: Briefing[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Briefings Cirúrgicos', href: '/briefings' },
];

export default function BriefingsIndex({ briefings, flash }: Props) {
    function confirmDelete(id: number) {
        if (confirm('Eliminar este briefing e todas as cirurgias associadas?')) {
            router.delete(`/briefings/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Briefings Cirúrgicos" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Briefings Cirúrgicos</h1>
                    <Link
                        href="/briefings/create"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Novo Briefing
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                {briefings.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                        Nenhum briefing registado.{' '}
                        <Link href="/briefings/create" className="text-blue-600 underline">
                            Criar o primeiro
                        </Link>
                        .
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Data', 'Hora', 'Sala', 'Especialidade', 'Cirurgias', ''].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {briefings.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm">{b.data}</td>
                                        <td className="px-4 py-3 text-sm">{b.hora}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{b.sala}</td>
                                        <td className="px-4 py-3 text-sm">{b.especialidade}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {b.surgeries_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <Link
                                                href={`/briefings/${b.id}`}
                                                className="mr-3 text-blue-600 hover:underline"
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/briefings/${b.id}/edit`}
                                                className="mr-3 text-gray-600 hover:underline"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(b.id)}
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
