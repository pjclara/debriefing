import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Syringe, Plus, Pencil, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Procedure {
    id: number;
    nome: string;
    descricao: string | null;
    codigo: string;
    ativo: boolean;
    department_id: number;
    department: Department;
}

interface Department {
    id: number;
    nome: string;
}

interface Props {
    procedures: Procedure[];
    departments: Department[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Procedimentos', href: '/procedures' },
];

export default function ProceduresIndex({ procedures, departments, flash }: Props) {
    function confirmDelete(p: Procedure) {
        if (confirm(`Eliminar procedimento "${p.nome}"?`)) {
            router.delete(`/procedures/${p.id}`);
        }
    }

    // Agrupar procedimentos por departamento
    const grouped = departments.map((dept) => ({
        department: dept,
        procedures: procedures.filter((p) => p.department_id === dept.id),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Procedimentos" />
            <div className="mx-auto max-w-5xl p-6">
                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Procedimentos</h1>
                        <p className="mt-1 text-sm text-gray-500">{procedures.length} procedimento{procedures.length !== 1 ? 's' : ''} registado{procedures.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Link
                        href="/procedures/create"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Novo Procedimento
                    </Link>
                </div>

                <div className="flex flex-col gap-6">
                    {grouped.map(({ department, procedures: deptProcedures }) => (
                        <div
                            key={department.id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center gap-2">
                                    <Syringe size={18} className="text-gray-600 dark:text-gray-300" />
                                    <h2 className="font-semibold text-gray-900 dark:text-white">{department.nome}</h2>
                                    <span className="ml-auto inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        {deptProcedures.length}
                                    </span>
                                </div>
                            </div>

                            {deptProcedures.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum procedimento neste departamento</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Nome</th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Código</th>
                                                <th className="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                                <th className="px-6 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deptProcedures.map((procedure, idx) => (
                                                <tr
                                                    key={procedure.id}
                                                    className={
                                                        idx !== deptProcedures.length - 1
                                                            ? 'border-t border-gray-200 dark:border-gray-700'
                                                            : ''
                                                    }
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {procedure.nome}
                                                            </p>
                                                            {procedure.descricao && (
                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    {procedure.descricao}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                        {procedure.codigo}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                                procedure.ativo
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            {procedure.ativo ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/procedures/${procedure.id}/edit`}
                                                                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                            >
                                                                <Pencil size={16} />
                                                            </Link>
                                                            <button
                                                                onClick={() => confirmDelete(procedure)}
                                                                className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}

                    {procedures.length === 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <Syringe size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500 dark:text-gray-400">Nenhum procedimento registado</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
