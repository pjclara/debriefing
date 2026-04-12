import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Consumivel {
    id: number;
    designacao: string;
    categoria: string;
}

interface StockMovimento {
    id: number;
    consumivel_id: number;
    tipo_mov: string;
    referencia: string | null;
    codigo: string | null;
    vidas_inicial: number | null;
    vidas_atual: number | null;
    data_entrada: string;
    data_saida: string | null;
    motivo: string | null;
    observacoes: string | null;
    consumivel: Consumivel;
}

interface Paginated {
    data: StockMovimento[];
    links: any;
    current_page: number;
}

interface Props {
    movimentos: Paginated;
    tiposMovLabel: Record<string, string>;
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

export default function StockMovimentosIndex({ movimentos, tiposMovLabel }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo', href: '#' },
        { title: 'Movimentos de Stock', href: '/stock_movimentos' },
    ];

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
                    <Link href="/stock_movimentos/create" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        <Plus size={18} />
                        Novo Movimento
                    </Link>
                </div>

                {movimentos.data.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Consumível</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Referência</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Vidas</th>
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
                                        <td className="px-4 py-3 text-sm text-gray-900">{mov.consumivel.designacao}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{mov.referencia || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{mov.codigo || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{mov.vidas_atual !== null ? `${mov.vidas_atual}/${mov.vidas_inicial}x` : '—'}</td>
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
