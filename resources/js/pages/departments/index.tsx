import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Department {
    id: number;
    nome: string;
    descricao: string | null;
    codigo: string | null;
    ativo: boolean;
    services?: Service[];
    created_at: string;
}

interface Service {
    id: number;
    nome: string;
}

interface Props {
    departments: Department[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Departamentos', href: '/departments' },
];

export default function DepartmentsIndex({ departments, flash }: Props) {
    function confirmDelete(d: Department) {
        if (confirm(`Eliminar departamento "${d.nome}"?\n\nIsso irá remover este departamento e todos os seus serviços.`)) {
            router.delete(`/departments/${d.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departamentos" />
            <div className="mx-auto max-w-5xl p-6">
                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Departamentos</h1>
                        <p className="mt-1 text-sm text-gray-500">{departments.length} departamento{departments.length !== 1 ? 's' : ''} registado{departments.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Link
                        href="/departments/create"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Novo Departamento
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {departments.length === 0 ? (
                        <div className="p-8 text-center">
                            <Building2 size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500">Nenhum departamento registado</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Código</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Serviços</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((dept, idx) => (
                                    <tr
                                        key={dept.id}
                                        className={idx !== departments.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{dept.nome}</p>
                                                {dept.descricao && (
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{dept.descricao}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {dept.codigo || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {dept.services?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                dept.ativo
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                                {dept.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/departments/${dept.id}/edit`}
                                                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
