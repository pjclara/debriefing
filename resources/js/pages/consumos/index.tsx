import { useState, useRef, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
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
    unidades?: number;
    observacoes?: string;
}

interface Consumo {
    id: number;
    stock_movimento_id: number;
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
    return m.unidades != null ? `${m.unidades} un.` : null;
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

// ─── Combobox de Stock Movimentos ─────────────────────────────────────────────

function StockCombobox({
    stockMovimentos,
    value,
    onChange,
}: {
    stockMovimentos: StockMovimento[];
    value: string;
    onChange: (id: string) => void;
}) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = value ? stockMovimentos.find((m) => String(m.id) === value) : null;

    const filtered = query.trim() === ''
        ? stockMovimentos
        : stockMovimentos.filter((m) =>
            (m.consumivel_tipo?.nome ?? '').toLowerCase().includes(query.toLowerCase()) ||
            (m.referencia ?? '').toLowerCase().includes(query.toLowerCase())
          );

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                <input
                    type="text"
                    className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none dark:text-gray-100"
                    placeholder="Pesquisar movimento de stock…"
                    value={open ? query : (selected ? `${movLabel(selected)} (${selected.tipo_mov})` : '')}
                    onFocus={() => { setOpen(true); setQuery(''); }}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                />
                {selected && !open && (
                    <button type="button" onClick={() => onChange('')} className="mr-2 rounded p-0.5 text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            {open && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {filtered.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-400">Sem resultados</div>
                    )}
                    {filtered.map((m) => (
                        <div
                            key={m.id}
                            onMouseDown={(e) => { e.preventDefault(); onChange(String(m.id)); setOpen(false); setQuery(''); }}
                            className={`cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                                String(m.id) === value ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'
                            }`}
                        >
                            <span className="font-medium">{movLabel(m)}</span>
                            {m.referencia && <span className="ml-2 text-gray-400 text-xs">Ref: {m.referencia}</span>}
                            {m.consumivel_tipo?.categoria === 'robotico_vidas' && m.codigo && <span className="ml-2 text-gray-400 text-xs">Cód: {m.codigo}</span>}
                            {movQtd(m) && <span className="ml-2 text-gray-400 text-xs">{movQtd(m)}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Formulário de adicionar consumo ─────────────────────────────────────────

function ConsumoForm({
    surgeryId,
    stockMovimentos,
    onCancel,
}: {
    surgeryId: number;
    stockMovimentos: StockMovimento[];
    onCancel: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        stock_movimento_id: '',
        observacoes: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/surgeries/${surgeryId}/consumos`, {
            onSuccess: () => { reset(); onCancel(); },
        });
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex flex-col gap-3">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Movimento de Stock *</label>
                    <StockCombobox
                        stockMovimentos={stockMovimentos}
                        value={data.stock_movimento_id}
                        onChange={(id) => setData('stock_movimento_id', id)}
                    />
                    {errors.stock_movimento_id && <p className="mt-1 text-xs text-red-500">{errors.stock_movimento_id}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Observações</label>
                    <input
                        type="text"
                        value={data.observacoes}
                        onChange={(e) => setData('observacoes', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Opcional"
                    />
                </div>
            </div>
            <div className="mt-3 flex gap-2">
                <button
                    type="submit"
                    disabled={processing || !data.stock_movimento_id}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    <Check size={14} />
                    Adicionar
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <X size={14} />
                    Cancelar
                </button>
            </div>
        </form>
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
                            Adicionar consumo
                        </button>
                    )}

                    {adding && (
                        <ConsumoForm
                            surgeryId={surgery.id}
                            stockMovimentos={disponiveis}
                            onCancel={() => setAdding(false)}
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
                                                {mov && movQtd(mov) && <span>{movQtd(mov)}</span>}
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
