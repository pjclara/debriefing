import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { History, FileDown, Search, X } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
}

interface StockMovimento {
    id: number;
    referencia?: string;
    codigo?: string;
    consumivel_tipo?: ConsumivelTipo;
}

interface Briefing {
    id: number;
    data: string;
    sala: string;
    especialidade: string;
}

interface Surgery {
    id: number;
    processo: string;
    procedimento: string;
    briefing: Briefing;
}

interface Consumo {
    id: number;
    quantidade: number;
    observacoes?: string;
    created_at: string;
    surgery: Surgery;
    stock_movimento?: StockMovimento;
}

interface PaginatedConsumos {
    data: Consumo[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Filters {
    search: string;
    categoria: string;
    data_inicio: string;
    data_fim: string;
}

interface Props {
    consumos: PaginatedConsumos;
    filters: Filters;
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

function formatDateTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const categoriaLabel: Record<string, string> = {
    robotico_vidas:       'Robótico (vidas)',
    robotico_descartavel: 'Robótico (descartável)',
    extra:                'Extra',
};

const categoriaCls: Record<string, string> = {
    robotico_vidas:       'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    robotico_descartavel: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    extra:                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function HistoricoConsumos({ consumos, filters }: Props) {
    const [search, setSearch]         = useState(filters.search);
    const [categoria, setCategoria]   = useState(filters.categoria);
    const [dataInicio, setDataInicio] = useState(filters.data_inicio);
    const [dataFim, setDataFim]       = useState(filters.data_fim);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Histórico de Consumos', href: '/consumos/historico' },
    ];

    function applyFilters(overrides: Partial<Filters> = {}) {
        const params: Record<string, string> = {};
        const f = { search, categoria, data_inicio: dataInicio, data_fim: dataFim, ...overrides };
        if (f.search)      params.search      = f.search;
        if (f.categoria)   params.categoria   = f.categoria;
        if (f.data_inicio) params.data_inicio = f.data_inicio;
        if (f.data_fim)    params.data_fim    = f.data_fim;
        router.get('/consumos/historico', params, { preserveState: true, replace: true });
    }

    function clearFilters() {
        setSearch('');
        setCategoria('');
        setDataInicio('');
        setDataFim('');
        router.get('/consumos/historico', {}, { preserveState: false, replace: true });
    }

    const hasFilters = !!(filters.search || filters.categoria || filters.data_inicio || filters.data_fim);

    const inputCls = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

    // Build print URL preserving active filters
    const printParams = new URLSearchParams();
    if (filters.search)      printParams.set('search',      filters.search);
    if (filters.categoria)   printParams.set('categoria',   filters.categoria);
    if (filters.data_inicio) printParams.set('data_inicio', filters.data_inicio);
    if (filters.data_fim)    printParams.set('data_fim',    filters.data_fim);
    const printUrl = '/consumos/historico/print' + (printParams.toString() ? '?' + printParams.toString() : '');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Histórico de Consumos" />
            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="h-6 w-6 text-gray-500" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Histórico de Consumos</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {consumos.total} registo{consumos.total !== 1 ? 's' : ''} no total
                            </p>
                        </div>
                    </div>
                    <a
                        href={printUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <FileDown size={16} />
                        PDF
                    </a>
                </div>

                {/* ── Filtros ── */}
                <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    {/* Pesquisa texto */}
                    <div className="relative min-w-[200px] flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar processo, procedimento, consumível…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
                            className={inputCls + ' pl-9 w-full'}
                        />
                    </div>

                    {/* Categoria */}
                    <select
                        value={categoria}
                        onChange={(e) => { setCategoria(e.target.value); applyFilters({ categoria: e.target.value }); }}
                        className={inputCls}
                    >
                        <option value="">Todas as categorias</option>
                        <option value="robotico_vidas">Robótico (vidas)</option>
                        <option value="robotico_descartavel">Robótico (descartável)</option>
                        <option value="extra">Extra</option>
                    </select>

                    {/* Data início */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400">De</label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            onBlur={() => applyFilters({ data_inicio: dataInicio })}
                            className={inputCls}
                        />
                    </div>

                    {/* Data fim */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Até</label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            onBlur={() => applyFilters({ data_fim: dataFim })}
                            className={inputCls}
                        />
                    </div>

                    {/* Aplicar */}
                    <button
                        onClick={() => applyFilters()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Filtrar
                    </button>

                    {/* Limpar */}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <X size={14} />
                            Limpar
                        </button>
                    )}
                </div>

                {consumos.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-gray-700">
                        Nenhum consumo registado.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Data</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Cirurgia</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Sala</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Consumível</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Categoria</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Referência</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Código</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Qtd.</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Observações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {consumos.data.map((c) => {
                                    const tipo = c.stock_movimento?.consumivel_tipo;
                                    const cat  = tipo?.categoria ?? '';
                                    return (
                                        <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {formatDateTime(c.created_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/surgeries/${c.surgery.id}/consumos`}
                                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    {c.surgery.processo}
                                                </Link>
                                                <p className="text-xs text-gray-400">{c.surgery.procedimento}</p>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {c.surgery.briefing
                                                    ? `Sala ${c.surgery.briefing.sala} · ${formatDate(c.surgery.briefing.data)}`
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                {tipo?.nome ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {cat ? (
                                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoriaCls[cat] ?? ''}`}>
                                                        {categoriaLabel[cat] ?? cat}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {c.stock_movimento?.referencia ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {cat === 'robotico_vidas' ? (c.stock_movimento?.codigo ?? '—') : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                                                {c.quantidade}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                {c.observacoes || '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Paginação */}
                {consumos.last_page > 1 && (
                    <div className="mt-4 flex flex-wrap items-center gap-1">
                        {consumos.links.map((link, i) => (
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
            </div>
        </AppLayout>
    );
}
