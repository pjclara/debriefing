import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Pencil, Trash2, TrendingUp, Search, X, FileDown } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { useState, useCallback } from 'react';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: string;
}

interface StockMovimento {
    id: number;
    consumivel_tipo_id: number | null;
    consumivel_tipo: ConsumivelTipo | null;
    tipo_mov: string;
    referencia: string | null;
    codigo: string | null;
    vidas_inicial: number | null;
    vidas_atual: number | null;
    unidades_inicial: number | null;
    unidades_atual: number | null;
    data_entrada: string;
    data_saida: string | null;
    motivo: string | null;
    observacoes: string | null;
}

interface Paginated {
    data: StockMovimento[];
    links: any;
    current_page: number;
}

interface Props {
    movimentos: Paginated;
    tiposMovLabel: Record<string, string>;
    filters: { q?: string; tipo?: string; data_de?: string; data_ate?: string };
}

const tiposMovColors: Record<string, string> = {
    entrada: 'bg-green-100 text-green-800',
    saida: 'bg-red-100 text-red-800',
    ajuste: 'bg-yellow-100 text-yellow-800',
    encomenda: 'bg-blue-100 text-blue-800',
    devolucao: 'bg-purple-100 text-purple-800',
};

const tiposMovIcons: Record<string, string> = {
    entrada: '↓',
    saida: '↑',
    ajuste: '⟷',
    encomenda: '◷',
    devolucao: '↺',
};

export default function StockMovimentosIndex({ movimentos, tiposMovLabel, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo', href: '#' },
        { title: 'Movimentos de Stock', href: '/stock_movimentos' },
    ];

    const [q, setQ] = useState(filters.q ?? '');
    const [tipo, setTipo] = useState(filters.tipo ?? '');
    const [dataDE, setDataDE] = useState(filters.data_de ?? '');
    const [dataATE, setDataATE] = useState(filters.data_ate ?? '');

    const applyFilters = useCallback((overrides: Record<string, string> = {}) => {
        const params: Record<string, string> = {};
        const merged = { q, tipo, data_de: dataDE, data_ate: dataATE, ...overrides };
        Object.entries(merged).forEach(([k, v]) => { if (v) params[k] = v; });
        router.get('/stock_movimentos', params, { preserveState: true, replace: true });
    }, [q, tipo, dataDE, dataATE]);

    const clearFilters = () => {
        setQ(''); setTipo(''); setDataDE(''); setDataATE('');
        router.get('/stock_movimentos', {}, { preserveState: false, replace: true });
    };

    const hasFilters = !!(filters.q || filters.tipo || filters.data_de || filters.data_ate);

    const printUrl = () => {
        const params = new URLSearchParams();
        if (filters.q)       params.set('q', filters.q);
        if (filters.tipo)    params.set('tipo', filters.tipo);
        if (filters.data_de)  params.set('data_de', filters.data_de);
        if (filters.data_ate) params.set('data_ate', filters.data_ate);
        const qs = params.toString();
        return `/stock_movimentos/print${qs ? '?' + qs : ''}`;
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Confirmar eliminação?')) {
            router.delete(`/stock_movimentos/${id}`);
        }
    };

    const formatData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-PT');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Movimentos de Stock" />
            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Movimentos de Stock</h1>
                    <div className="flex items-center gap-2">
                        <a
                            href={printUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            <FileDown size={16} />
                            PDF
                        </a>
                        <Link href="/stock_movimentos/create" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                            <Plus size={18} />
                            Novo Movimento
                        </Link>
                    </div>
                </div>

                {/* ── Barra de filtros ── */}
                <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
                    {/* Pesquisa livre */}
                    <div className="relative min-w-[220px] flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Designação, referência, código…"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Tipo de movimento */}
                    <select
                        value={tipo}
                        onChange={e => { setTipo(e.target.value); applyFilters({ tipo: e.target.value }); }}
                        className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Todos os tipos</option>
                        {Object.entries(tiposMovLabel).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>

                    {/* Data de */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 whitespace-nowrap">De</span>
                        <input
                            type="date"
                            value={dataDE}
                            onChange={e => { setDataDE(e.target.value); applyFilters({ data_de: e.target.value }); }}
                            className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Data até */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 whitespace-nowrap">Até</span>
                        <input
                            type="date"
                            value={dataATE}
                            onChange={e => { setDataATE(e.target.value); applyFilters({ data_ate: e.target.value }); }}
                            className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Pesquisar / Limpar */}
                    <button
                        onClick={() => applyFilters()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Pesquisar
                    </button>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            <X size={14} /> Limpar
                        </button>
                    )}
                </div>

                {movimentos.data.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Descrição</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Referência</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Qtd.</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Data</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Acções</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {movimentos.data.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tiposMovColors[mov.tipo_mov]}`}>
                                                <span>{tiposMovIcons[mov.tipo_mov]}</span>
                                                {tiposMovLabel[mov.tipo_mov]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{mov.consumivel_tipo?.nome ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{mov.referencia || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {mov.consumivel_tipo?.categoria === 'robotico_vidas' ? (mov.codigo || '—') : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {mov.consumivel_tipo?.categoria === 'robotico_vidas'
                                                ? (mov.vidas_atual !== null ? `${mov.vidas_atual}/${mov.vidas_inicial}x` : '—')
                                                : (mov.unidades_atual !== null ? `${mov.unidades_atual}/${mov.unidades_inicial} un.` : '—')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatData(mov.data_entrada)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/stock_movimentos/${mov.id}/edit`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(mov.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                        <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Nenhum movimento de stock registado.</p>
                        <Link href="/stock_movimentos/create" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                            Registar Primeiro Movimento
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
