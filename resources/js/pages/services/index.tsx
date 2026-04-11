import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Wrench, Plus, Pencil, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Service {
    id: number;
    nome: string;
    descricao: string | null;
    codigo: string;
    ativo: boolean;
}

interface Department {
    id: number;
    nome: string;
    descricao: string | null;
    codigo: string;
    service_id: number;
    ativo: boolean;
}

interface Props {
    services: Service[];
    departments: Department[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Serviços', href: '/services' },
];

export default function ServicesIndex({ services, departments, flash }: Props) {
    function confirmDelete(s: Service) {
        if (confirm(`Eliminar serviço "${s.nome}"?`)) {
            router.delete(`/services/${s.id}`);
        }
    }

    // Agrupar departamentos por serviço
    const grouped = services.map((service) => ({
        service,
        departments: departments.filter((d) => d.service_id === service.id),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Serviços" />
            <div className="mx-auto max-w-5xl p-6">
                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Serviços</h1>
                        <p className="mt-1 text-sm text-gray-500">{services.length} serviço{services.length !== 1 ? 's' : ''} registado{services.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Link
                        href="/services/create"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Novo Serviço
                    </Link>
                </div>

                <div className="flex flex-col gap-6">
                    {grouped.map(({ service, departments: serviceDepts }) => (
                        <div
                            key={service.id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wrench size={18} className="text-gray-600 dark:text-gray-300" />
                                        <div>
                                            <h2 className="font-semibold text-gray-900 dark:text-white">{service.nome}</h2>
                                            {service.descricao && (
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{service.descricao}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                            {serviceDepts.length} {serviceDepts.length === 1 ? 'área' : 'áreas'}
                                        </span>
                                        <Link
                                            href={`/services/${service.id}/edit`}
                                            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            onClick={() => confirmDelete(service)}
                                            className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {serviceDepts.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma área definida</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Nome da Área</th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Código</th>
                                                <th className="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                                <th className="px-6 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceDepts.map((dept, idx) => (
                                                <tr
                                                    key={dept.id}
                                                    className={
                                                        idx !== serviceDepts.length - 1
                                                            ? 'border-t border-gray-200 dark:border-gray-700'
                                                            : ''
                                                    }
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {dept.nome}
                                                            </p>
                                                            {dept.descricao && (
                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    {dept.descricao}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                        {dept.codigo}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                                dept.ativo
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                            }`}
                                                        >
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
                                </div>
                            )}
                        </div>
                    ))}

                    {services.length === 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <Wrench size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500 dark:text-gray-400">Nenhum serviço registado</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
