import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/layouts/app-layout';
import { SectionCard } from '@/components/form-ui';
import { PackageOpen, Trash2, Plus, X, Check, Search } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
}

interface StockMovimento {
    id: number;
    consumivel_tipo?: ConsumivelTipo;
    tipo_mov: string;
    referencia?: string;
    codigo?: string;
    vidas_inicial?: number;
    vidas_atual?: number;
    unidades_inicial?: number;
    unidades_atual?: number;
    observacoes?: string;
}

interface Consumo {
    id: number;
    stock_movimento_id: number;
    quantidade: number;
    observacoes?: string;
    stock_movimento?: StockMovimento;
}

interface Briefing {
    id: number;
    data: string;
    hora: string;
    sala: string;
    especialidade: string;
}

interface SurgeryContext {
    id: number;
    processo: string;
    procedimento: string;
    briefing: Briefing;
}

interface Props {
    surgery: SurgeryContext;
    consumos: Consumo[];
    stockMovimentos: StockMovimento[];
    flash?: { success?: string };
}

function movLabel(m: StockMovimento): string {
    return m.consumivel_tipo?.nome ?? `Movimento #${m.id}`;
}

function movQtd(m: StockMovimento): string | null {
    if (m.consumivel_tipo?.categoria === 'robotico_vidas') {
        return m.vidas_atual != null ? `Vidas: ${m.vidas_atual}/${m.vidas_inicial}` : null;
    }
    return m.unidades_atual != null ? `${m.unidades_atual}/${m.unidades_inicial} un.` : null;
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

// ─── StockModal ───────────────────────────────────────────────────────────────

interface SelectedItem {
    stock_movimento_id: number;
    quantidade: number;
    observacoes: string;
}

function StockModal({
    surgeryId,
    stockMovimentos,
    onClose,
}: {
    surgeryId: number;
    stockMovimentos: StockMovimento[];
    onClose: () => void;
}) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Record<number, SelectedItem>>({});
    const [processing, setProcessing] = useState(false);

    const filtered = stockMovimentos.filter((m) =>
        (m.consumivel_tipo?.nome ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (m.referencia ?? '').toLowerCase().includes(search.toLowerCase())
    );

    function toggle(m: StockMovimento) {
        setSelected((prev) => {
            if (prev[m.id]) {
                const next = { ...prev };
                delete next[m.id];
                return next;
            }
            return { ...prev, [m.id]: { stock_movimento_id: m.id, quantidade: 1, observacoes: '' } };
        });
    }

    function setQty(id: number, qty: number) {
        setSelected((prev) => ({ ...prev, [id]: { ...prev[id], quantidade: Math.max(1, qty) } }));
    }

    function setObs(id: number, obs: string) {
        setSelected((prev) => ({ ...prev, [id]: { ...prev[id], observacoes: obs } }));
    }

    function handleConfirm() {
        const items = Object.values(selected);
        if (items.length === 0) return;
        setProcessing(true);
        router.post(
            `/surgeries/${surgeryId}/consumos/batch`,
            { items },
            {
                onSuccess: () => onClose(),
                onError: () => setProcessing(false),
                onFinish: () => setProcessing(false),
            }
        );
    }

    const count = Object.keys(selected).length;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl dark:bg-gray-900" style={{ maxHeight: '85vh' }}>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Adicionar consumos</h3>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="border-b border-gray-200 px-5 py-3 dark:border-gray-700">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-800">
                        <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Pesquisar stock…"
                            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 dark:text-gray-100"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-5">
                    {filtered.length === 0 ? (
                        <p className="text-center text-sm text-gray-400">Sem resultados</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {filtered.map((m) => {
                                const checked = !!selected[m.id];
                                const item = selected[m.id];
                                const qtdInfo = movQtd(m);
                                return (
                                    <div
                                        key={m.id}
                                        className={`flex flex-col gap-2 rounded-lg border p-3 transition-colors ${
                                            checked
                                                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750'
                                        }`}
                                    >
                                        {/* Linha principal: checkbox + nome */}
                                        <label className="flex cursor-pointer items-start gap-2.5">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggle(m)}
                                                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-blue-600"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium leading-tight text-gray-900 dark:text-white">
                                                    {m.consumivel_tipo?.nome ?? `Movimento #${m.id}`}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {m.tipo_mov}
                                                    {m.referencia && <span className="ml-1.5">· Ref: {m.referencia}</span>}
                                                    {qtdInfo && <span className="ml-1.5 font-medium text-blue-600 dark:text-blue-400">· {qtdInfo}</span>}
                                                </p>
                                            </div>
                                        </label>

                                        {/* Campos de detalhe quando seleccionado */}
                                        {checked && (
                                            <div className="flex gap-2 pl-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <label className="text-xs text-gray-500">Qtd.</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantidade}
                                                        onChange={(e) => setQty(m.id, parseInt(e.target.value) || 1)}
                                                        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col gap-0.5">
                                                    <label className="text-xs text-gray-500">Observações</label>
                                                    <input
                                                        type="text"
                                                        value={item.observacoes}
                                                        onChange={(e) => setObs(m.id, e.target.value)}
                                                        placeholder="Opcional"
                                                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {count} item{count !== 1 ? 's' : ''} seleccionado{count !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={count === 0 || processing}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Check className="h-4 w-4" />
                            {processing ? 'A guardar…' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsumosIndex({ surgery, consumos, stockMovimentos, flash }: Props) {
    const [adding, setAdding] = useState(false);

    const briefing = surgery.briefing;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: `${formatDate(briefing.data)} – Sala ${briefing.sala}`, href: `/briefings/${briefing.id}` },
        { title: surgery.procedimento, href: '#' },
        { title: 'Consumos', href: '#' },
    ];

    const associadosIds = new Set(consumos.map((c) => c.stock_movimento_id));
    const disponiveis = stockMovimentos.filter((m) => !associadosIds.has(m.id));

    function confirmDelete(consumo: Consumo) {
        const label = consumo.stock_movimento ? movLabel(consumo.stock_movimento) : `Consumo #${consumo.id}`;
        if (confirm(`Remover "${label}" desta cirurgia?`)) {
            router.delete(`/surgeries/${surgery.id}/consumos/${consumo.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Consumos – ${surgery.procedimento}`} />
            <div className="mx-auto max-w-3xl p-6">

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                    <span className="font-semibold">Cirurgia:</span>{' '}
                    {surgery.processo} &mdash; {surgery.procedimento} &middot;{' '}
                    {formatDate(briefing.data)} &middot; Sala {briefing.sala}
                </div>

                <SectionCard icon={PackageOpen} title="Consumos Intra-operatórios" description="Registo de material consumido durante a cirurgia">

                    {!adding && disponiveis.length > 0 && (
                        <button
                            onClick={() => setAdding(true)}
                            className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Adicionar consumos
                        </button>
                    )}

                    {adding && (
                        <StockModal
                            surgeryId={surgery.id}
                            stockMovimentos={disponiveis}
                            onClose={() => setAdding(false)}
                        />
                    )}

                    {consumos.length === 0 && !adding ? (
                        <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
                            Nenhum consumo registado.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {consumos.map((c) => {
                                const mov = c.stock_movimento;
                                return (
                                    <div key={c.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {mov ? movLabel(mov) : `Movimento #${c.stock_movimento_id}`}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                {c.quantidade > 1 && <span className="font-medium">{c.quantidade}×</span>}
                                                {' '}{mov && movQtd(mov) && <span>{movQtd(mov)}</span>}
                                                {mov?.referencia && <span className="ml-2">Ref: {mov.referencia}</span>}
                                                {c.observacoes && <span className="ml-2">{c.observacoes}</span>}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => confirmDelete(c)}
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-500 dark:hover:bg-gray-700"
                                            title="Remover"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SectionCard>

                <div className="mt-6">
                    <Link
                        href={`/briefings/${briefing.id}`}
                        className="text-sm text-gray-500 hover:text-gray-700 hover:underline dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ← Voltar ao briefing
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
