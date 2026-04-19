import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { History, FileDown } from 'lucide-react';
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

interface Props {
    consumos: PaginatedConsumos;
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

export default function HistoricoConsumos({ consumos }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Histórico de Consumos', href: '/consumos/historico' },
    ];

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
                        href="/consumos/historico/print"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <FileDown size={16} />
                        PDF
                    </a>
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
