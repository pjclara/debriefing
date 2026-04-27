import { useState, useRef, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/layouts/app-layout';
import { Trash2, Plus, X, Check, Search, Pencil, Clock } from 'lucide-react';
import type { Auth, BreadcrumbItem } from '@/types';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
}

interface StockMovimento {
    id: number;
    consumivel_tipo?: ConsumivelTipo;
    tipo_mov: string;
    codigo?: string;
    referencia?: string;
    vidas_inicial?: number;
    vidas_atual?: number;
    unidades_inicial?: number;
    unidades_atual?: number;
    data_entrada: string;
    data_saida?: string;
    motivo?: string;
    observacoes?: string;
}

interface Consumo {
    id: number;
    stock_movimento_id: number;
    quantidade: number;
    observacoes?: string;
    stock_movimento?: StockMovimento;
}

interface Surgery {
    id: number;
    processo: string;
    procedimento: string;
    destino: string;
    antecedentes_relevantes: boolean;
    descricao_antecedentes?: string;
    comorbidades: boolean;
    descricao_comorbidades?: string;
    variacoes_tecnicas: boolean;
    descricao_variacoes?: string;
    passos_criticos: boolean;
    descricao_passos?: string;
    prep_inicio?: string | null;
    prep_fim?: string | null;
    docking?: number | null;
    consola_inicio?: string | null;
    consola_fim?: string | null;
    consumos?: Consumo[];
}

interface Debriefing {
    id: number;
    complicacoes: boolean;
    falha_sistema: boolean;
    inicio_a_horas: boolean;
    fim_a_horas: boolean;
    correu_bem?: string;
    melhorar?: string;
    falha_comunicacao?: string;
    evento_adverso: boolean;
}

interface Briefing {
    id: number;
    data: string;
    hora: string;
    especialidade: string;
    sala: string;
    equipa_segura: boolean;
    alteracao_equipa: boolean;
    descricao_alteracao_equipa?: string;
    problemas_sala: boolean;
    descricao_problemas?: string;
    equipamento_ok: boolean;
    descricao_equipamento?: string;
    mesa_emparelhada: boolean;
    ordem_mantida: boolean;
    descricao_ordem?: string;
    surgeries: Surgery[];
    debriefing?: Debriefing | null;
}

interface Props {
    briefing: Briefing;
    stockMovimentos: StockMovimento[];
    flash?: { success?: string };
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

function Badge({ value }: { value: boolean }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                value
                    ? 'bg-green-50 text-green-700 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800'
                    : 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800'
            }`}
        >
            {value ? 'Sim' : 'Não'}
        </span>
    );
}

function Row({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-0 dark:border-gray-700">
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                {label}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {children}
            </span>
        </div>
    );
}
// ─── Painel de Tempos Operatórios Robóticos ───────────────────────────────────────

function toDatetimeLocal(dt: string | null | undefined): string {
    if (!dt) return '';
    // Normaliza 'YYYY-MM-DD HH:MM:SS' para 'YYYY-MM-DDTHH:MM'
    return dt.substring(0, 16).replace(' ', 'T');
}

function formatTime(dt: string | null | undefined): string {
    if (!dt) return '—';
    return dt.substring(11, 16);
}

function diffMin(a: string | null | undefined, b: string | null | undefined): string {
    if (!a || !b) return '';
    const mins = Math.round((new Date(b.replace(' ', 'T')).getTime() - new Date(a.replace(' ', 'T')).getTime()) / 60000);
    if (mins < 0) return '';
    return `${mins} min`;
}

function SurgeryTemposPanel({ surgery }: { surgery: Surgery }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        prep_inicio: toDatetimeLocal(surgery.prep_inicio),
        prep_fim: toDatetimeLocal(surgery.prep_fim),
        docking: surgery.docking != null ? String(surgery.docking) : '',
        consola_inicio: toDatetimeLocal(surgery.consola_inicio),
        consola_fim: toDatetimeLocal(surgery.consola_fim),
    });
    const [saving, setSaving] = useState(false);

    const hasData = surgery.prep_inicio || surgery.consola_inicio || surgery.docking != null;

    function handleSave() {
        setSaving(true);
        router.patch(
            `/surgeries/${surgery.id}/tempos`,
            {
                prep_inicio: form.prep_inicio || null,
                prep_fim: form.prep_fim || null,
                docking: form.docking !== '' ? Number(form.docking) : null,
                consola_inicio: form.consola_inicio || null,
                consola_fim: form.consola_fim || null,
            },
            {
                preserveState: true,
                onSuccess: () => { setSaving(false); setIsEditing(false); },
                onError: () => setSaving(false),
            },
        );
    }

    return (
        <div className="mt-2 border-t border-gray-100 pt-2 dark:border-gray-700 bg-gray-200 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="mb-2 flex items-center justify-between ">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    Tempos Robóticos
                </span>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setForm({
                                prep_inicio: toDatetimeLocal(surgery.prep_inicio),
                                prep_fim: toDatetimeLocal(surgery.prep_fim),
                                docking: surgery.docking != null ? String(surgery.docking) : '',
                                consola_inicio: toDatetimeLocal(surgery.consola_inicio),
                                consola_fim: toDatetimeLocal(surgery.consola_fim),
                            });
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
                    >
                        <Pencil className="h-3 w-3 text-green-500" />
                        {hasData ? 'Editar' : 'Registar'}
                    </button>
                )}
            </div>

            {/* View mode */}
            {!isEditing && hasData && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {(surgery.prep_inicio || surgery.prep_fim) && (
                        <span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Prep:</span>{' '}
                            {formatTime(surgery.prep_inicio)} → {formatTime(surgery.prep_fim)}
                            {diffMin(surgery.prep_inicio, surgery.prep_fim) && (
                                <span className="ml-1 text-gray-400">({diffMin(surgery.prep_inicio, surgery.prep_fim)})</span>
                            )}
                        </span>
                    )}
                    {surgery.docking != null && (
                        <span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Docking:</span>{' '}
                            {surgery.docking} min
                        </span>
                    )}
                    {(surgery.consola_inicio || surgery.consola_fim) && (
                        <span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Cons.:</span>{' '}
                            {formatTime(surgery.consola_inicio)} → {formatTime(surgery.consola_fim)}
                            {diffMin(surgery.consola_inicio, surgery.consola_fim) && (
                                <span className="ml-1 text-gray-400">({diffMin(surgery.consola_inicio, surgery.consola_fim)})</span>
                            )}
                        </span>
                    )}
                </div>
            )}

            {/* Edit mode */}
            {isEditing && (
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="mb-0.5 block text-xs text-gray-500">Prep início</label>
                            <input type="datetime-local" value={form.prep_inicio}
                                onChange={(e) => setForm((p) => ({ ...p, prep_inicio: e.target.value }))}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="mb-0.5 block text-xs text-gray-500">Prep fim</label>
                            <input type="datetime-local" value={form.prep_fim}
                                onChange={(e) => setForm((p) => ({ ...p, prep_fim: e.target.value }))}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="mb-0.5 block text-xs text-gray-500">Consola início</label>
                            <input type="datetime-local" value={form.consola_inicio}
                                onChange={(e) => setForm((p) => ({ ...p, consola_inicio: e.target.value }))}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="mb-0.5 block text-xs text-gray-500">Consola fim</label>
                            <input type="datetime-local" value={form.consola_fim}
                                onChange={(e) => setForm((p) => ({ ...p, consola_fim: e.target.value }))}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs whitespace-nowrap text-gray-500">Docking (min)</label>
                        <input type="number" min={0} value={form.docking}
                            onChange={(e) => setForm((p) => ({ ...p, docking: e.target.value }))}
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-center text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                        <div className="flex-1" />
                        <button onClick={handleSave} disabled={saving}
                            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                            <Check className="h-3 w-3" />
                            {saving ? 'A guardar…' : 'Guardar'}
                        </button>
                        <button onClick={() => setIsEditing(false)}
                            className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
// ─── Modal para associar StockMovimento a Surgery ────────────────────────────

function AssociarStockModal({
    surgeryId,
    stockMovimentos,
    onClose,
}: {
    surgeryId: number;
    stockMovimentos: StockMovimento[];
    onClose: () => void;
}) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<
        Record<number, { quantidade: number; observacoes: string }>
    >({});
    const [processing, setProcessing] = useState(false);

    const filtered = stockMovimentos.filter(
        (m) =>
            (m.consumivel_tipo?.nome ?? '')
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            (m.referencia ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (m.codigo ?? '').toLowerCase().includes(search.toLowerCase()),
    );

    const toggle = (id: number) => {
        setSelected((prev) => {
            if (prev[id]) {
                const next = { ...prev };
                delete next[id];
                return next;
            }
            return { ...prev, [id]: { quantidade: 1, observacoes: '' } };
        });
    };

    const selectedCount = Object.keys(selected).length;

    function handleConfirm() {
        if (selectedCount === 0) return;
        setProcessing(true);
        const items = Object.entries(selected).map(([id, v]) => ({
            stock_movimento_id: Number(id),
            quantidade: v.quantidade,
            observacoes: v.observacoes || null,
        }));
        router.post(
            `/surgeries/${surgeryId}/consumos/batch`,
            { items },
            {
                onSuccess: () => onClose(),
                onError: () => setProcessing(false),
                onFinish: () => setProcessing(false),
            },
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div
                className="relative flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl dark:bg-gray-900"
                style={{ maxHeight: '85vh' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Associar stock à cirurgia
                        {selectedCount > 0 && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                {selectedCount}
                            </span>
                        )}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
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
                            placeholder="Pesquisar por nome, referência ou código…"
                            className="flex-1 bg-transparent text-sm placeholder-gray-400 outline-none dark:text-gray-100"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto p-5">
                    {filtered.length === 0 ? (
                        <p className="text-center text-sm text-gray-400">
                            Sem resultados
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {filtered.map((m) => {
                                const checked = !!selected[m.id];
                                const isVidas =
                                    m.consumivel_tipo?.categoria ===
                                    'robotico_vidas';
                                return (
                                    <div
                                        key={m.id}
                                        className={`rounded-lg border p-3 transition-colors ${
                                            checked
                                                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                                        }`}
                                    >
                                        <label className="flex cursor-pointer items-start gap-2.5">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggle(m.id)}
                                                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-blue-600"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm leading-tight font-medium text-gray-900 dark:text-white">
                                                    {m.consumivel_tipo?.nome ??
                                                        `Movimento #${m.id}`}
                                                </p>
                                                <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {m.referencia && (
                                                        <span>
                                                            Ref: {m.referencia}
                                                        </span>
                                                    )}
                                                    {m.codigo && (
                                                        <span>
                                                            Cód: {m.codigo}
                                                        </span>
                                                    )}
                                                    {isVidas &&
                                                    m.vidas_atual != null ? (
                                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                                            Vidas:{' '}
                                                            {m.vidas_atual}/
                                                            {m.vidas_inicial}
                                                        </span>
                                                    ) : m.unidades_atual !=
                                                      null ? (
                                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                                            Unid.:{' '}
                                                            {m.unidades_atual}/
                                                            {m.unidades_inicial}
                                                        </span>
                                                    ) : null}
                                                </p>
                                            </div>
                                        </label>

                                        {/* Quantidade + obs. — apenas quando selecionado */}
                                        {checked && (
                                            <div className="mt-2 flex items-center gap-2 pl-6">
                                                <label className="text-xs whitespace-nowrap text-gray-500">
                                                    Qtd.
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={
                                                        selected[m.id]
                                                            .quantidade
                                                    }
                                                    onChange={(e) => {
                                                        const qty = Math.max(
                                                            1,
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 1,
                                                        );
                                                        setSelected((prev) => ({
                                                            ...prev,
                                                            [m.id]: {
                                                                ...prev[m.id],
                                                                quantidade: qty,
                                                            },
                                                        }));
                                                    }}
                                                    className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Obs. (opcional)"
                                                    value={
                                                        selected[m.id]
                                                            .observacoes
                                                    }
                                                    onChange={(e) => {
                                                        setSelected((prev) => ({
                                                            ...prev,
                                                            [m.id]: {
                                                                ...prev[m.id],
                                                                observacoes:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        }));
                                                    }}
                                                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3 dark:border-gray-700">
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
                        disabled={selectedCount === 0 || processing}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Check className="h-4 w-4" />
                        {processing
                            ? 'A associar…'
                            : `Associar${selectedCount > 0 ? ` (${selectedCount})` : ''}`}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

// ─── Painel de consumos (associações StockMovimento ↔ Surgery) ───────────────

function SurgeryStockPanel({
    surgery,
    stockMovimentos,
}: {
    surgery: Surgery;
    stockMovimentos: StockMovimento[];
}) {
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<Record<number, { quantidade: number; observacoes: string }>>({});
    const [localConsumos, setLocalConsumos] = useState<Consumo[]>(surgery.consumos ?? []);
    const [toast, setToast] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setLocalConsumos(surgery.consumos ?? []);
    }, [surgery.consumos]);

    const consumos = localConsumos;

    // Filtrar movimentos já associados a esta cirurgia
    const associadosIds = new Set(consumos.map((c) => c.stock_movimento_id));
    const disponiveis = stockMovimentos.filter((m) => !associadosIds.has(m.id));

    function handleDelete(consumoId: number) {
        if (confirm('Remover esta associação de stock?')) {
            router.delete(`/surgeries/${surgery.id}/consumos/${consumoId}`);
        }
    }

    function startEdit(c: Consumo) {
        setEditing((prev) => ({
            ...prev,
            [c.id]: { quantidade: c.quantidade, observacoes: c.observacoes ?? '' },
        }));
    }

    function cancelEdit(id: number) {
        setEditing((prev) => { const next = { ...prev }; delete next[id]; return next; });
    }

    function saveEdit(consumoId: number) {
        const vals = editing[consumoId];
        if (!vals) return;
        router.put(
            `/surgeries/${surgery.id}/consumos/${consumoId}`,
            { quantidade: vals.quantidade, observacoes: vals.observacoes || null },
            {
                preserveState: true,
                onSuccess: () => {
                    setLocalConsumos((prev) =>
                        prev.map((c) =>
                            c.id === consumoId
                                ? { ...c, quantidade: vals.quantidade, observacoes: vals.observacoes || undefined }
                                : c,
                        ),
                    );
                    cancelEdit(consumoId);
                    if (toastTimer.current) clearTimeout(toastTimer.current);
                    setToast('Gravado');
                    toastTimer.current = setTimeout(() => setToast(null), 2500);
                },
            },
        );
    }

    return (
        <div className="mt-2 border-t border-gray-100 pt-2 dark:border-gray-700 bg-gray-200 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Stock{consumos.length > 0 ? ` (${consumos.length})` : ''}
                </span>
                {!showAdd && disponiveis.length > 0 && (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                        <Plus className="h-3 w-3" />
                        Associar
                    </button>
                )}
            </div>

            {consumos.length > 0 && (
                <div className="mb-2 flex flex-col gap-1">
                    {consumos.map((c) => {
                        const mov = c.stock_movimento;
                        const isEditing = !!editing[c.id];
                        return (
                            <div
                                key={c.id}
                                className="rounded-lg bg-gray-50 px-2.5 py-1.5 dark:bg-gray-800/50"
                            >
                                {/* View mode */}
                                {!isEditing && (
                                    <div className="flex items-center gap-2">
                                        <div className="min-w-0 flex-1">
                                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                                {mov?.consumivel_tipo?.nome ??
                                                    `Movimento #${c.stock_movimento_id}`}
                                            </span>
                                            <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-gray-500">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                    Qtd: {c.quantidade}
                                                </span>
                                                {mov?.consumivel_tipo?.categoria === 'robotico_vidas'
                                                    ? mov?.vidas_atual != null && (
                                                          <span>Vidas: {mov.vidas_atual}/{mov.vidas_inicial}</span>
                                                      )
                                                    : mov?.unidades_atual != null && (
                                                          <span>Unid.: {mov.unidades_atual}/{mov.unidades_inicial}</span>
                                                      )}
                                                {mov?.consumivel_tipo?.categoria === 'robotico_vidas' && mov?.codigo && (
                                                    <span>Codigo: {mov.codigo}</span>
                                                )}
                                                {mov?.referencia && <span>Referencia: {mov.referencia}</span>}
                                            </div>
                                            {c.observacoes && (
                                                <p className="mt-0.5 text-xs text-gray-400">{c.observacoes}</p>
                                            )}
                                        </div>
                                        {mov?.consumivel_tipo?.categoria !== 'robotico_vidas' && (
                                        <button
                                            onClick={() => startEdit(c)}
                                            className="rounded p-0.5 text-gray-400 hover:text-blue-600"
                                            title="Editar"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="rounded p-0.5 text-gray-400 hover:text-red-600"
                                            title="Remover associação"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}

                                {/* Edit mode */}
                                {isEditing && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                            {mov?.consumivel_tipo?.nome ?? `Movimento #${c.stock_movimento_id}`}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs whitespace-nowrap text-gray-500">Qtd.</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={editing[c.id].quantidade}
                                                onChange={(e) =>
                                                    setEditing((prev) => ({
                                                        ...prev,
                                                        [c.id]: { ...prev[c.id], quantidade: Math.max(1, parseInt(e.target.value) || 1) },
                                                    }))
                                                }
                                                className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Obs. (opcional)"
                                                value={editing[c.id].observacoes}
                                                onChange={(e) =>
                                                    setEditing((prev) => ({
                                                        ...prev,
                                                        [c.id]: { ...prev[c.id], observacoes: e.target.value },
                                                    }))
                                                }
                                                className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                            <button
                                                onClick={() => saveEdit(c.id)}
                                                className="rounded p-0.5 text-green-600 hover:text-green-700"
                                                title="Guardar"
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => cancelEdit(c.id)}
                                                className="rounded p-0.5 text-gray-400 hover:text-gray-600"
                                                title="Cancelar"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showAdd && (
                <AssociarStockModal
                    surgeryId={surgery.id}
                    stockMovimentos={disponiveis}
                    onClose={() => setShowAdd(false)}
                />
            )}
            {toast && createPortal(
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xl dark:bg-gray-700">
                    <Check className="h-4 w-4 text-green-400" />
                    {toast}
                </div>,
                document.body,
            )}
        </div>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function BriefingShow({
    briefing,
    stockMovimentos,
    flash,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.role === 'admin';

    function confirmDeleteSurgery(id: number) {
        if (confirm('Eliminar esta cirurgia?')) {
            router.delete(`/surgeries/${id}`);
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        {
            title: `${formatDate(briefing.data)} – Sala ${briefing.sala}`,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Briefing ${formatDate(briefing.data)}`} />

            <div className="w-full px-8 py-10">
                {flash?.success && (
                    <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800">
                        {flash.success}
                    </div>
                )}

                {/* Cabeçalho */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            {formatDate(briefing.data)} &mdash; {briefing.hora}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {briefing.especialidade} &middot; Sala{' '}
                            {briefing.sala}
                        </p>
                    </div>
                    <a
                        href={`/briefings/${briefing.id}/print`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700 hover:shadow-md"
                    >
                        🖨 PDF
                    </a>
                </div>

                {/* Grid */}
                <div className="grid gap-10 lg:grid-cols-3">
                    {/* ── Briefing ── */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600/90 text-xs font-semibold text-white shadow-sm">
                                    1
                                </span>
                                Briefing
                            </h2>
                            <Link
                                href={`/briefings/${briefing.id}/edit`}
                                className="rounded-xl border border-gray-300/70 bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 hover:shadow-sm dark:border-gray-600 dark:hover:bg-gray-800"
                            >
                                Editar
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900/80">
                            <Row label="Dotação segura">
                                <Badge value={briefing.equipa_segura} />
                            </Row>
                            <Row label="Alteração de equipa">
                                <Badge value={briefing.alteracao_equipa} />
                            </Row>
                            {briefing.descricao_alteracao_equipa && (
                                <Row label="Desc. alteração equipa">
                                    {briefing.descricao_alteracao_equipa}
                                </Row>
                            )}
                            <Row label="Problemas na sala">
                                <Badge value={briefing.problemas_sala} />
                            </Row>
                            {briefing.descricao_problemas && (
                                <Row label="Desc. problemas">
                                    {briefing.descricao_problemas}
                                </Row>
                            )}
                            <Row label="Equipamento OK">
                                <Badge value={briefing.equipamento_ok} />
                            </Row>
                            {briefing.descricao_equipamento && (
                                <Row label="Desc. equipamento">
                                    {briefing.descricao_equipamento}
                                </Row>
                            )}
                            <Row label="Mesa emparelhada">
                                <Badge value={briefing.mesa_emparelhada} />
                            </Row>
                            <Row label="Ordem mantida">
                                <Badge value={briefing.ordem_mantida} />
                            </Row>
                        </div>
                    </div>

                    {/* ── Cirurgias ── */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600/90 text-xs font-semibold text-white shadow-sm">
                                    2
                                </span>
                                Cirurgias
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    {briefing.surgeries.length}
                                </span>
                            </h2>

                            <Link
                                href={`/briefings/${briefing.id}/surgeries/create`}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                            >
                                + Adicionar
                            </Link>
                        </div>

                        {briefing.surgeries.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-300/70 bg-gray-50/50 p-6 text-center text-sm text-gray-500 dark:bg-gray-800/30">
                                Nenhuma cirurgia adicionada ainda.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {briefing.surgeries.map((s) => (
                                    <div
                                        key={s.id}
                                        className="group rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white">
                                            <div className="flex justify-between">
                                                {/* Nome do procedimento */}
                                                <div className='mt-1 flex items-center gap-3 border-t border-gray-100 pt-2 dark:border-gray-700'>{s.procedimento}</div>

                                                {/* Ações (Editar / Eliminar) */}
                                                <div className="mt-1 flex items-center gap-3 border-t border-gray-100 pt-2 dark:border-gray-700">
                                                    <Link
                                                        href={`/surgeries/${s.id}/edit`}
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        Editar
                                                    </Link>

                                                    {isAdmin && (
                                                        <button
                                                            onClick={() =>
                                                                confirmDeleteSurgery(
                                                                    s.id,
                                                                )
                                                            }
                                                            className="text-xs text-red-500 hover:underline"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            Proc. {s.processo} &middot;{' '}
                                            {s.destino}
                                        </p>
                                        {/* Indicadores clínicos */}
                                        {[
                                            {
                                                flag: s.antecedentes_relevantes,
                                                label: 'Antecedentes',
                                                desc: s.descricao_antecedentes,
                                            },
                                            {
                                                flag: s.comorbidades,
                                                label: 'Comorbidades',
                                                desc: s.descricao_comorbidades,
                                            },
                                            {
                                                flag: s.variacoes_tecnicas,
                                                label: 'Var. técnicas',
                                                desc: s.descricao_variacoes,
                                            },
                                            {
                                                flag: s.passos_criticos,
                                                label: 'Passos críticos',
                                                desc: s.descricao_passos,
                                            },
                                        ].filter((f) => f.flag).length > 0 && (
                                            <div className="mt-2 flex flex-col gap-1">
                                                {[
                                                    {
                                                        flag: s.antecedentes_relevantes,
                                                        label: 'Antecedentes',
                                                        desc: s.descricao_antecedentes,
                                                    },
                                                    {
                                                        flag: s.comorbidades,
                                                        label: 'Comorbidades',
                                                        desc: s.descricao_comorbidades,
                                                    },
                                                    {
                                                        flag: s.variacoes_tecnicas,
                                                        label: 'Var. técnicas',
                                                        desc: s.descricao_variacoes,
                                                    },
                                                    {
                                                        flag: s.passos_criticos,
                                                        label: 'Passos críticos',
                                                        desc: s.descricao_passos,
                                                    },
                                                ]
                                                    .filter((f) => f.flag)
                                                    .map((f) => (
                                                        <span
                                                            key={f.label}
                                                            className="inline-flex items-start gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                                                        >
                                                            <span className="shrink-0">
                                                                ⚠
                                                            </span>
                                                            <span>
                                                                <strong>
                                                                    {f.label}
                                                                </strong>
                                                                {f.desc
                                                                    ? ': ' +
                                                                      f.desc
                                                                    : ''}
                                                            </span>
                                                        </span>
                                                    ))}
                                            </div>
                                        )}
                                        <SurgeryTemposPanel surgery={s} />
                                        <SurgeryStockPanel
                                            surgery={s}
                                            stockMovimentos={stockMovimentos}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Debriefing ── */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600/90 text-xs font-semibold text-white shadow-sm">
                                    3
                                </span>
                                Debriefing
                            </h2>

                            <Link
                                href={`/briefings/${briefing.id}/debriefing/edit`}
                                className="rounded-xl border border-gray-300/70 bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 hover:shadow-sm dark:border-gray-600 dark:hover:bg-gray-800"
                            >
                                Editar
                            </Link>
                        </div>

                        {briefing.debriefing ? (
                            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/80">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800">
                                    ✓ Registado
                                </span>

                                <Row label="Complicações">
                                    <Badge
                                        value={briefing.debriefing.complicacoes}
                                    />
                                </Row>
                                <Row label="Falha sistema">
                                    <Badge
                                        value={
                                            briefing.debriefing.falha_sistema
                                        }
                                    />
                                </Row>
                                <Row label="Iniciou a horas">
                                    <Badge
                                        value={
                                            briefing.debriefing.inicio_a_horas
                                        }
                                    />
                                </Row>
                                <Row label="Finalizou a horas">
                                    <Badge
                                        value={briefing.debriefing.fim_a_horas}
                                    />
                                </Row>
                                <Row label="Cirurgia correu bem">
                                    {briefing.debriefing.correu_bem ||
                                        'Nenhum comentário.'}
                                </Row>
                                <Row label="Situações a melhorar">
                                    {briefing.debriefing.melhorar ||
                                        'Nenhum comentário.'}
                                </Row>
                                <Row label="Falha comunicação">
                                    {briefing.debriefing.falha_comunicacao ||
                                        'Nenhum comentário.'}
                                </Row>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300/70 bg-gray-50/50 p-8 text-center text-gray-500 dark:bg-gray-800/30">
                                <p className="text-sm">
                                    O debriefing ainda não foi registado.
                                </p>
                                <Link
                                    href={`/briefings/${briefing.id}/debriefing/create`}
                                    className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
                                >
                                    Registar Debriefing
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
