import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Consumivel {
    id: number;
    designacao: string;
    categoria: string;
    unidade: string;
}

interface Consumo {
    id: number;
    consumivel_id?: number;
    designacao: string;
    referencia?: string;
    quantidade: number | string;
    unidade: string;
    observacoes?: string;
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
    consumiveis: Consumivel[];
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

// ─── Constantes ───────────────────────────────────────────────────────────────

const CATEGORIA_LABELS: Record<string, string> = {
    robotico_vidas:       'Itens Robóticos com Vidas',
    robotico_descartavel: 'Consumíveis Robóticos Descartáveis',
    extra:                'Extras',
};

const fieldCls =
    'w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

// ─── Formulário inline de consumo ─────────────────────────────────────────────

function ConsumoInlineForm({
    surgeryId,
    consumiveis,
    editing,
    onCancel,
}: {
    surgeryId: number;
    consumiveis: Consumivel[];
    editing?: Consumo;
    onCancel: () => void;
}) {
    const isEdit = !!editing?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        consumivel_id: editing?.consumivel_id ? String(editing.consumivel_id) : '',
        designacao:    editing?.designacao  ?? '',
        referencia:    editing?.referencia  ?? '',
        quantidade:    editing?.quantidade  ?? 1,
        unidade:       editing?.unidade     ?? 'un',
        observacoes:   editing?.observacoes ?? '',
    });

    const grupos = Object.entries(CATEGORIA_LABELS).map(([cat, label]) => ({
        label,
        items: consumiveis.filter((c) => c.categoria === cat),
    })).filter((g) => g.items.length > 0);

    function handleConsumivelChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const id = e.target.value;
        if (id) {
            const found = consumiveis.find((c) => String(c.id) === id);
            if (found) {
                setData((prev) => ({ ...prev, consumivel_id: id, designacao: found.designacao, unidade: found.unidade }));
                return;
            }
        }
        setData((prev) => ({ ...prev, consumivel_id: id }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/surgeries/${surgeryId}/consumos/${editing!.id}`, {
                onSuccess: () => { reset(); onCancel(); },
            });
        } else {
            post(`/surgeries/${surgeryId}/consumos`, {
                onSuccess: () => { reset(); onCancel(); },
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="grid gap-2">
                {!isEdit && (
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Catálogo</label>
                        <select value={data.consumivel_id} onChange={handleConsumivelChange} className={fieldCls}>
                            <option value="">— Manual —</option>
                            {grupos.map((g) => (
                                <optgroup key={g.label} label={g.label}>
                                    {g.items.map((c) => (
                                        <option key={c.id} value={String(c.id)}>{c.designacao}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Designação *</label>
                    <input type="text" value={data.designacao} onChange={(e) => setData('designacao', e.target.value)} className={fieldCls} required />
                    {errors.designacao && <p className="mt-0.5 text-xs text-red-500">{errors.designacao}</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Ref.</label>
                        <input type="text" value={data.referencia} onChange={(e) => setData('referencia', e.target.value)} className={fieldCls} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Qtd. *</label>
                        <input type="number" value={data.quantidade as string} onChange={(e) => setData('quantidade', e.target.value)} className={fieldCls} min="0.01" step="0.01" required />
                        {errors.quantidade && <p className="mt-0.5 text-xs text-red-500">{errors.quantidade}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Un. *</label>
                        <input type="text" value={data.unidade} onChange={(e) => setData('unidade', e.target.value)} className={fieldCls} required />
                    </div>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Observações</label>
                    <input type="text" value={data.observacoes} onChange={(e) => setData('observacoes', e.target.value)} className={fieldCls} />
                </div>
            </div>
            <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700">
                    <X className="h-3 w-3" /> Cancelar
                </button>
                <button type="submit" disabled={processing} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                    <Check className="h-3 w-3" /> {isEdit ? 'Guardar' : 'Adicionar'}
                </button>
            </div>
        </form>
    );
}

// ─── Painel de consumos por cirurgia ─────────────────────────────────────────

function SurgeryConsumosPanel({
    surgery,
    consumiveis,
}: {
    surgery: Surgery;
    consumiveis: Consumivel[];
}) {
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const consumos = surgery.consumos ?? [];

    function handleDelete(consumoId: number) {
        if (confirm('Eliminar este consumo?')) {
            router.delete(`/surgeries/${surgery.id}/consumos/${consumoId}`);
        }
    }

    return (
        <div className="mt-2 border-t border-gray-100 pt-2 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Consumíveis{consumos.length > 0 ? ` (${consumos.length})` : ''}
                </span>
                {!showAdd && editingId === null && (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                        <Plus className="h-3 w-3" />
                        Adicionar
                    </button>
                )}
            </div>

            {consumos.length > 0 && (
                <div className="mb-2 flex flex-col gap-1">
                    {consumos.map((c) =>
                        editingId === c.id ? (
                            <ConsumoInlineForm
                                key={c.id}
                                surgeryId={surgery.id}
                                consumiveis={consumiveis}
                                editing={c}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div key={c.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5 dark:bg-gray-800/50">
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{c.designacao}</span>
                                    <span className="ml-2 text-xs text-gray-500">{c.quantidade} {c.unidade}</span>
                                    {c.referencia && (
                                        <span className="ml-2 text-xs text-gray-400">Ref: {c.referencia}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => { setShowAdd(false); setEditingId(c.id); }}
                                    className="rounded p-0.5 text-gray-400 hover:text-blue-600"
                                    title="Editar"
                                >
                                    <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="rounded p-0.5 text-gray-400 hover:text-red-600"
                                    title="Eliminar"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}

            {showAdd && (
                <ConsumoInlineForm
                    surgeryId={surgery.id}
                    consumiveis={consumiveis}
                    onCancel={() => setShowAdd(false)}
                />
            )}
        </div>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function BriefingShow({ briefing, consumiveis, flash }: Props) {
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
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white">
                                            {s.procedimento}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            Proc. {s.processo} &middot;{' '}
                                            {s.destino}
                                        </p>

                                        {/* Indicadores clínicos */}
                                        {[
                                            { flag: s.antecedentes_relevantes, label: 'Antecedentes', desc: s.descricao_antecedentes },
                                            { flag: s.comorbidades,            label: 'Comorbidades',  desc: s.descricao_comorbidades },
                                            { flag: s.variacoes_tecnicas,      label: 'Var. técnicas', desc: s.descricao_variacoes },
                                            { flag: s.passos_criticos,         label: 'Passos críticos', desc: s.descricao_passos },
                                        ].filter(f => f.flag).length > 0 && (
                                            <div className="mt-2 flex flex-col gap-1">
                                                {[
                                                    { flag: s.antecedentes_relevantes, label: 'Antecedentes', desc: s.descricao_antecedentes },
                                                    { flag: s.comorbidades,            label: 'Comorbidades',  desc: s.descricao_comorbidades },
                                                    { flag: s.variacoes_tecnicas,      label: 'Var. técnicas', desc: s.descricao_variacoes },
                                                    { flag: s.passos_criticos,         label: 'Passos críticos', desc: s.descricao_passos },
                                                ].filter(f => f.flag).map(f => (
                                                    <span
                                                        key={f.label}
                                                        className="inline-flex items-start gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                                                    >
                                                        <span className="shrink-0">⚠</span>
                                                        <span><strong>{f.label}</strong>{f.desc ? ': ' + f.desc : ''}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <SurgeryConsumosPanel surgery={s} consumiveis={consumiveis} />

                                        <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-2 dark:border-gray-700">
                                            <Link
                                                href={`/surgeries/${s.id}/edit`}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    confirmDeleteSurgery(s.id)
                                                }
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </div>                                    </div>
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
