import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Plus, Trash2, PackageOpen, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, ShoppingCart, RotateCcw } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { inputCls, selectCls, textareaCls, SectionCard } from '@/components/form-ui';
import { FormEvent, useState } from 'react';

interface Consumivel {
    id: number;
    designacao: string;
    categoria: string;
    unidade: string;
    stock_atual: number;
    stock_minimo: number;
}

interface StockMovimento {
    id: number;
    tipo: 'entrada' | 'saida' | 'ajuste' | 'encomenda' | 'devolucao';
    quantidade: number;
    stock_apos?: number;
    referencia_doc?: string;
    fornecedor?: string;
    data_movimento: string;
    observacoes?: string;
}

interface Props {
    consumivel: Consumivel;
    movimentos: StockMovimento[];
    tiposLabel: Record<string, string>;
    flash?: { success?: string };
}

const TIPO_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    entrada:   { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-300',  icon: TrendingUp },
    saida:     { bg: 'bg-red-100 dark:bg-red-900/30',     text: 'text-red-700 dark:text-red-300',       icon: TrendingDown },
    ajuste:    { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', icon: RefreshCw },
    encomenda: { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-300',    icon: ShoppingCart },
    devolucao: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', icon: RotateCcw },
};

function formatDate(dateStr: string): string {
    const d = dateStr.substring(0, 10).split('-');
    return `${d[2]}/${d[1]}/${d[0]}`;
}

export default function StockIndex({ consumivel, movimentos, tiposLabel, flash }: Props) {
    const [adding, setAdding] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo: 'entrada',
        quantidade: '',
        data_movimento: new Date().toISOString().substring(0, 10),
        referencia_doc: '',
        fornecedor: '',
        observacoes: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo de Consumíveis', href: '/consumiveis' },
        { title: consumivel.designacao, href: `/consumiveis/${consumivel.id}/stock` },
    ];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/consumiveis/${consumivel.id}/stock`, {
            onSuccess: () => {
                reset();
                setAdding(false);
            },
        });
    }

    function confirmDelete(m: StockMovimento) {
        if (confirm(`Eliminar este movimento de ${tiposLabel[m.tipo] ?? m.tipo}?`)) {
            router.delete(`/consumiveis/${consumivel.id}/stock/${m.id}`);
        }
    }

    const stockBaixo = consumivel.stock_atual <= consumivel.stock_minimo;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Stock — ${consumivel.designacao}`} />
            <div className="mx-auto max-w-4xl p-6">

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                {/* Cabeçalho */}
                <div className="mb-6">
                    <Link
                        href="/consumiveis"
                        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeft size={15} />
                        Voltar ao catálogo
                    </Link>

                    <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{consumivel.designacao}</h1>
                            <p className="mt-0.5 text-sm text-gray-500">Gestão de stock</p>
                        </div>

                        {/* Card de stock */}
                        <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 ${stockBaixo ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'}`}>
                            {stockBaixo && <AlertTriangle size={18} className="shrink-0 text-red-500" />}
                            <div>
                                <p className={`text-2xl font-bold ${stockBaixo ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                                    {consumivel.stock_atual} <span className="text-base font-normal text-gray-500">{consumivel.unidade}</span>
                                </p>
                                <p className="text-xs text-gray-500">Mínimo: {consumivel.stock_minimo} {consumivel.unidade}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão adicionar */}
                {!adding && (
                    <button
                        onClick={() => setAdding(true)}
                        className="mb-6 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Registar movimento
                    </button>
                )}

                {/* Formulário inline */}
                {adding && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/10"
                    >
                        <h2 className="mb-4 text-sm font-semibold text-blue-700 dark:text-blue-300">Novo Movimento</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Tipo *</label>
                                <select
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                    className={selectCls}
                                >
                                    {Object.entries(tiposLabel).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                                {errors.tipo && <p className="mt-1 text-xs text-red-500">{errors.tipo}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Quantidade ({consumivel.unidade}) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.quantidade}
                                    onChange={(e) => setData('quantidade', e.target.value)}
                                    className={inputCls}
                                    placeholder="0"
                                />
                                {errors.quantidade && <p className="mt-1 text-xs text-red-500">{errors.quantidade}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Data *</label>
                                <input
                                    type="date"
                                    value={data.data_movimento}
                                    onChange={(e) => setData('data_movimento', e.target.value)}
                                    className={inputCls}
                                />
                                {errors.data_movimento && <p className="mt-1 text-xs text-red-500">{errors.data_movimento}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Referência doc.</label>
                                <input
                                    type="text"
                                    value={data.referencia_doc}
                                    onChange={(e) => setData('referencia_doc', e.target.value)}
                                    className={inputCls}
                                    placeholder="Nº guia, fatura..."
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Fornecedor</label>
                                <input
                                    type="text"
                                    value={data.fornecedor}
                                    onChange={(e) => setData('fornecedor', e.target.value)}
                                    className={inputCls}
                                    placeholder="Nome do fornecedor"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Observações</label>
                            <textarea
                                value={data.observacoes}
                                onChange={(e) => setData('observacoes', e.target.value)}
                                rows={2}
                                className={textareaCls}
                                placeholder="Notas adicionais..."
                            />
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Guardar
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAdding(false); reset(); }}
                                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {/* Tabela de movimentos */}
                <SectionCard icon={PackageOpen} title="Histórico de movimentos" description={`${movimentos.length} registo${movimentos.length !== 1 ? 's' : ''}`}>
                    {movimentos.length === 0 ? (
                        <p className="py-4 text-center text-sm text-gray-400">Sem movimentos registados.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-700">
                                        <th className="pb-2 pr-4">Data</th>
                                        <th className="pb-2 pr-4">Tipo</th>
                                        <th className="pb-2 pr-4 text-right">Qtd.</th>
                                        <th className="pb-2 pr-4 text-right">Stock após</th>
                                        <th className="pb-2 pr-4">Referência</th>
                                        <th className="pb-2 pr-4">Fornecedor</th>
                                        <th className="pb-2"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {movimentos.map((m) => {
                                        const style = TIPO_STYLES[m.tipo] ?? TIPO_STYLES['ajuste'];
                                        const Icon = style.icon;
                                        return (
                                            <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="py-3 pr-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                                                    {formatDate(m.data_movimento)}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                                                        <Icon size={11} />
                                                        {tiposLabel[m.tipo] ?? m.tipo}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-right font-medium">
                                                    {m.tipo === 'saida' || m.tipo === 'ajuste' ? (
                                                        <span className="text-red-600 dark:text-red-400">−{m.quantidade}</span>
                                                    ) : m.tipo === 'encomenda' ? (
                                                        <span className="text-blue-600 dark:text-blue-400">{m.quantidade}</span>
                                                    ) : (
                                                        <span className="text-green-600 dark:text-green-400">+{m.quantidade}</span>
                                                    )}
                                                    <span className="ml-1 text-xs text-gray-400">{consumivel.unidade}</span>
                                                </td>
                                                <td className="py-3 pr-4 text-right text-gray-500">
                                                    {m.stock_apos != null ? `${m.stock_apos} ${consumivel.unidade}` : '—'}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                                                    {m.referencia_doc || <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                                                    {m.fornecedor || <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="py-3">
                                                    <button
                                                        onClick={() => confirmDelete(m)}
                                                        className="rounded p-1 text-gray-300 hover:bg-white hover:text-red-500 dark:hover:bg-gray-700"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>
            </div>
        </AppLayout>
    );
}
