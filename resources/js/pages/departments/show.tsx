import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Wrench, ArrowLeft } from 'lucide-react';
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
    codigo: string | null;
    ativo: boolean;
    services: Service[];
    created_at: string;
}

interface Props {
    department: Department;
}

export default function ShowDepartment({ department }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Departamentos', href: '/departments' },
        { title: department.nome, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={department.nome} />
            <div className="mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/departments"
                                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-2xl font-bold">{department.nome}</h1>
                        </div>
                        {department.descricao && (
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{department.descricao}</p>
                        )}
                    </div>
                    <Link
                        href={`/departments/${department.id}/edit`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Editar
                    </Link>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Código</p>
                        <p className="mt-1 font-medium text-gray-900 dark:text-white">{department.codigo || '—'}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Status</p>
                        <p className="mt-1 font-medium">
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                department.ativo
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                                {department.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Serviços</p>
                        <p className="mt-1 font-medium text-gray-900 dark:text-white">{department.services.length}</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Wrench size={18} className="text-gray-600 dark:text-gray-300" />
                                <h2 className="font-semibold text-gray-900 dark:text-white">Serviços</h2>
                            </div>
                            <Link
                                href="/services/create"
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                Novo Serviço
                            </Link>
                        </div>
                    </div>

                    {department.services.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum serviço neste departamento</p>
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
                                    {department.services.map((service, idx) => (
                                        <tr
                                            key={service.id}
                                            className={
                                                idx !== department.services.length - 1
                                                    ? 'border-t border-gray-200 dark:border-gray-700'
                                                    : ''
                                            }
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{service.nome}</p>
                                                    {service.descricao && (
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            {service.descricao}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{service.codigo}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                    service.ativo
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                }`}>
                                                    {service.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/services/${service.id}/edit`}
                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
