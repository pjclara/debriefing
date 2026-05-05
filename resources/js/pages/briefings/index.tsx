import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem } from '@/types';
import { Search, X } from 'lucide-react';

interface Filters {
    search: string;
    data_inicio: string;
    data_fim: string;
}

interface Briefing {
    id: number;
    data: string;
    hora: string;
    especialidade: string;
    sala: string;
    surgeries_count: number;
}

interface PaginatedBriefings {
    data: Briefing[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    briefings: PaginatedBriefings;
    filters: Filters;
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Briefings Cirúrgicos', href: '/briefings' },
];

export default function BriefingsIndex({ briefings, filters, flash }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.role === 'admin';

    const [search, setSearch]         = useState(filters.search ?? '');
    const [dataInicio, setDataInicio] = useState(filters.data_inicio ?? '');
    const [dataFim, setDataFim]       = useState(filters.data_fim ?? '');

    function applyFilters(overrides?: Partial<Filters>) {
        const params: Record<string, string> = {
            search:      overrides?.search      ?? search,
            data_inicio: overrides?.data_inicio ?? dataInicio,
            data_fim:    overrides?.data_fim    ?? dataFim,
        };
        // remove chaves vazias
        Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
        router.get('/briefings', params, { preserveState: true, replace: true });
    }

    function clearFilters() {
        setSearch('');
        setDataInicio('');
        setDataFim('');
        router.get('/briefings', {}, { preserveState: false, replace: true });
    }

    const hasFilters = !!(filters.search || filters.data_inicio || filters.data_fim);

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

                {/* ── FILTROS ── */}
                <div className="mb-4 flex flex-wrap items-end gap-3">
                    {/* Pesquisa (sala / especialidade) */}
                    <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800">
                        <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            placeholder="Sala ou especialidade…"
                            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 dark:text-gray-100"
                        />
                        {search && (
                            <button type="button" onClick={() => { setSearch(''); applyFilters({ search: '' }); }} className="text-gray-400 hover:text-gray-600">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Data De */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">De</span>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            onBlur={() => applyFilters()}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        />
                    </div>

                    {/* Data Até */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Até</span>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            onBlur={() => applyFilters()}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => applyFilters()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Filtrar
                    </button>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <X className="h-3.5 w-3.5" />
                            Limpar
                        </button>
                    )}
                </div>

                {briefings.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                        Nenhum briefing encontrado.{' '}
                        {!hasFilters && (
                            <Link href="/briefings/create" className="text-blue-600 underline">
                                Criar o primeiro
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
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
                                {briefings.data.map((b) => (
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

                                            {isAdmin && (
                                            <button
                                                onClick={() => confirmDelete(b.id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    {briefings.last_page > 1 && (
                        <div className="mt-4 flex flex-wrap items-center gap-1">
                            <span className="mr-2 text-xs text-gray-500 dark:text-gray-400">
                                {briefings.total} resultados
                            </span>
                            {briefings.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`rounded-lg px-3 py-1.5 text-sm ${
                                            link.active
                                                ? 'bg-blue-600 font-semibold text-white'
                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 dark:border-gray-700"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
