import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls } from '@/components/form-ui';
import { PackageOpen, Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Consumo {
    id: number;
    designacao: string;
    referencia?: string;
    quantidade: number | string;
    unidade: string;
    observacoes?: string;
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

interface Consumivel {
    id: number;
    designacao: string;
    referencia: string;
    categoria: string;
    stock_atual: number;
    stock_minimo: number;
}

interface Props {
    surgery: SurgeryContext;
    consumos: Consumo[];
    consumiveis: Consumivel[];
    flash?: { success?: string };
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

// ─── Inline add / edit form ───────────────────────────────────────────────────

function ConsumoForm({
    surgeryId,
    initial,
    onCancel,
    consumiveis,
}: {
    surgeryId: number;
    initial?: Consumo;
    onCancel: () => void;
    consumiveis: Consumivel[];
}) {
    const isEdit = !!initial?.id;
    const [selectedConsumivel, setSelectedConsumivel] = useState<Consumivel | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        designacao:  initial?.designacao  ?? '',
        referencia:  initial?.referencia  ?? '',
        quantidade:  initial?.quantidade  ?? 1,
        unidade:     initial?.unidade     ?? 'un',
        observacoes: initial?.observacoes ?? '',
    });

    // Filtrar consumiveis baseado em search
    const filteredConsumives = consumiveis.filter(c => 
        c.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.referencia.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleConsumvelSelect(consumivel: Consumivel) {
        setSelectedConsumivel(consumivel);
        setData({
            ...data,
            designacao: consumivel.designacao,
            referencia: consumivel.referencia,
            unidade: 'un', // Default unit
        });
        setSearchTerm('');
        setSearchOpen(false);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/surgeries/${surgeryId}/consumos/${initial!.id}`, {
                onSuccess: () => { reset(); onCancel(); },
            });
        } else {
            post(`/surgeries/${surgeryId}/consumos`, {
                onSuccess: () => { reset(); onCancel(); },
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Selector de Consumível */}
                {!isEdit && (
                    <div className="sm:col-span-2 relative">
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Selecionar consumível</label>
                        <button
                            type="button"
                            onClick={() => setSearchOpen(!searchOpen)}
                            className={inputCls + " text-left w-full"}
                        >
                            {selectedConsumivel 
                                ? `${selectedConsumivel.designacao} (Ref: ${selectedConsumivel.referencia})`
                                : 'Procurar consumível...'}
                        </button>
                        
                        {searchOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Procurar..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    autoFocus
                                    className="w-full px-3 py-2 border-b border-gray-200 dark:border-gray-700 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                                <div className="max-h-64 overflow-y-auto">
                                    {filteredConsumives.length > 0 ? (
                                        filteredConsumives.map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => handleConsumvelSelect(c)}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                                            >
                                                <div className="font-medium text-gray-900 dark:text-white">{c.designacao}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Ref: {c.referencia} • Stock: {c.stock_atual} {c.categoria}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                                            Nenhum consumível encontrado
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Stock Info */}
                {selectedConsumivel && !isEdit && (
                    <div className="sm:col-span-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 px-3 py-2 text-xs text-blue-800 dark:text-blue-200">
                        <strong>Stock disponível:</strong> {selectedConsumivel.stock_atual} ({selectedConsumivel.categoria})
                        {selectedConsumivel.stock_atual <= selectedConsumivel.stock_minimo && (
                            <span className="ml-2 text-orange-700 dark:text-orange-300">⚠️ Abaixo do mínimo</span>
                        )}
                    </div>
                )}

                {/* Designação */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Designação *</label>
                    <input
                        type="text"
                        value={data.designacao}
                        onChange={e => setData('designacao', e.target.value)}
                        className={inputCls}
                        placeholder="Ex: PROGRASP FORCEPS"
                        required
                        readOnly={!isEdit && selectedConsumivel !== null}
                    />
                    {errors.designacao && <p className="mt-1 text-xs text-red-500">{errors.designacao}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Referência</label>
                    <input
                        type="text"
                        value={data.referencia}
                        onChange={e => setData('referencia', e.target.value)}
                        className={inputCls}
                        placeholder="Ex: PROGRASP-001"
                        readOnly={!isEdit && selectedConsumivel !== null}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Qtd. *</label>
                        <input
                            type="number"
                            value={data.quantidade as string}
                            onChange={e => setData('quantidade', e.target.value)}
                            className={inputCls}
                            min="0.01"
                            step="0.01"
                            required
                        />
                        {errors.quantidade && <p className="mt-1 text-xs text-red-500">{errors.quantidade}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Unidade *</label>
                        <input
                            type="text"
                            value={data.unidade}
                            onChange={e => setData('unidade', e.target.value)}
                            className={inputCls}
                            required
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Observações</label>
                    <input
                        type="text"
                        value={data.observacoes}
                        onChange={e => setData('observacoes', e.target.value)}
                        className={inputCls}
                        placeholder="Opcional"
                    />
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    <Check size={14} />
                    {isEdit ? 'Actualizar' : 'Adicionar'}
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

export default function ConsumosIndex({ surgery, consumos, consumiveis, flash }: Props) {
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const briefing = surgery.briefing;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: `${formatDate(briefing.data)} – Sala ${briefing.sala}`, href: `/briefings/${briefing.id}` },
        { title: surgery.procedimento, href: '#' },
        { title: 'Consumos', href: '#' },
    ];

    function confirmDelete(consumo: Consumo) {
        if (confirm(`Eliminar "${consumo.designacao}"?`)) {
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

                {/* Contexto */}
                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                    <span className="font-semibold">Cirurgia:</span>{' '}
                    {surgery.processo} &mdash; {surgery.procedimento} &middot;{' '}
                    {formatDate(briefing.data)} &middot; Sala {briefing.sala}
                </div>

                {/* Card principal */}
                <SectionCard icon={PackageOpen} title="Consumos Intra-operatórios" description="Registo de material consumido durante a cirurgia">

                    {/* Botão adicionar */}
                    {!adding && (
                        <button
                            onClick={() => { setAdding(true); setEditingId(null); }}
                            className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Adicionar consumo
                        </button>
                    )}

                    {/* Formulário de adição */}
                    {adding && (
                        <ConsumoForm
                            surgeryId={surgery.id}
                            onCancel={() => setAdding(false)}
                            consumiveis={consumiveis}
                        />
                    )}

                    {/* Lista */}
                    {consumos.length === 0 && !adding ? (
                        <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
                            Nenhum consumo registado.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {consumos.map(c => (
                                <div key={c.id}>
                                    {editingId === c.id ? (
                                        <ConsumoForm
                                            surgeryId={surgery.id}
                                            initial={c}
                                            onCancel={() => setEditingId(null)}
                                            consumiveis={consumiveis}
                                        />
                                    ) : (
                                        <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{c.designacao}</p>
                                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {c.quantidade} {c.unidade}
                                                    {c.referencia && <> &middot; Ref: {c.referencia}</>}
                                                    {c.observacoes && <> &middot; {c.observacoes}</>}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    onClick={() => { setEditingId(c.id); setAdding(false); }}
                                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-blue-600 dark:hover:bg-gray-700"
                                                    title="Editar"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(c)}
                                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-500 dark:hover:bg-gray-700"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* Voltar */}
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
