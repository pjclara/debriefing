import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls, textareaCls } from '@/components/form-ui';
import { User, Clock, FileText, Cpu, Check, AlertCircle, X, Search } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface BriefingContext {
    id: number;
    data: string;
    hora: string;
    sala: string;
    especialidade: string;
}

interface Procedure {
    id: number;
    nome: string;
}

interface TrocarEntry {
    n: string;
    tamanho: string;
}

interface Surgery {
    id?: number;
    processo?: string;
    procedimento?: string;
    destino?: string;
    prep_inicio?: string;
    prep_fim?: string;
    docking?: number | string;
    consola_inicio?: string;
    consola_fim?: string;
    antecedentes_relevantes?: boolean | null;
    descricao_antecedentes?: string;
    comorbidades?: boolean | null;
    descricao_comorbidades?: string;
    variacoes_tecnicas?: boolean | null;
    descricao_variacoes?: string;
    passos_criticos?: boolean | null;
    descricao_passos?: string;
    consentimento?: boolean | null;
    lateralidade?: string;
    lateralidade_lado?: string;
    lateralidade_marcacao?: boolean | null;
    medicacao_suspensa?: string | null;
    medicacao_qual?: string;
    antibiotico?: string;
    antibioterapia?: boolean | null;
    profilaxia?: boolean | null;
    profilaxia_tipo?: string;
    perdas_estimadas?: number | string;
    reserva_ativa?: boolean | null;
    reserva_estado?: string | null;
    reserva_unidades?: number | string;
    trocares?: number | string;
    trocares_roboticos?: number | string;
    trocares_roboticos_tamanhos?: TrocarEntry[];
    trocares_nao_roboticos?: number | string;
    trocares_nao_roboticos_tamanhos?: TrocarEntry[];
    otica?: string;
    monopolar_coag_watts?: number | string;
    monopolar_coag_tipo?: string;
    monopolar_cut_watts?: number | string;
    monopolar_cut_tipo?: string;
    bipolar_coag_watts?: number | string;
    bipolar_coag_tipo?: string;
    b1?: number[];
    b2?: number[];
    b3?: number[];
    b4?: number[];
    equipamento_extra?: number[];
}

interface Props {
    briefing: BriefingContext;
    surgery?: Surgery;
    procedures: Procedure[];
    consumivel_tipos: ConsumivelTipo[];
    consumivel_tipos_extra: ConsumivelTipo[];
}

interface ConsumivelTipo {
    id: number;
    nome: string;
}

type StepName = 'identificacao' | 'clinicos' | 'tempos' | 'planeamento' | 'robotico' | 'review';

interface Step {
    id: StepName;
    label: string;
    icon: any;
}

// ─── component ────────────────────────────────────────────────────────────────

const Field = FormRow; // Alias para manter compatibilidade

function YesNoField({ label, name, value, onSet, error }: {
    label: string;
    name: string;
    value: boolean | null;
    onSet: (v: boolean) => void;
    error?: string;
}) {
    return (
        <div className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 ${
            error ? 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
        }`}>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
            <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-1.5 text-sm">
                    <input type="radio" name={name} checked={value === true} onChange={() => onSet(true)} className="h-4 w-4 accent-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Sim</span>
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 text-sm">
                    <input type="radio" name={name} checked={value === false} onChange={() => onSet(false)} className="h-4 w-4 accent-red-600" />
                    <span className="text-gray-700 dark:text-gray-300">Não</span>
                </label>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ─── PlanRow / SubRow / Btn3 ─────────────────────────────────────────────────

function PlanRow({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <div className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
                error ? 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
                <div className="flex flex-wrap gap-2">{children}</div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function SubRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="ml-6 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-900">
            <span className="min-w-24 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <div className="flex flex-wrap gap-2">{children}</div>
        </div>
    );
}

function Btn3({ active, onClick, color, children }: {
    active: boolean;
    onClick: () => void;
    color: 'green' | 'red' | 'slate' | 'blue' | 'yellow';
    children: React.ReactNode;
}) {
    const base = 'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors';
    const colors: Record<string, string> = {
        green:  active ? 'bg-green-600 text-white'  : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700 dark:bg-gray-700 dark:hover:bg-green-900/30',
        red:    active ? 'bg-red-500 text-white'    : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-700 dark:bg-gray-700 dark:hover:bg-red-900/30',
        slate:  active ? 'bg-gray-500 text-white'   : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
        blue:   active ? 'bg-blue-600 text-white'   : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:hover:bg-blue-900/30',
        yellow: active ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700 dark:bg-gray-700 dark:hover:bg-yellow-900/30',
    };
    return (
        <button type="button" onClick={onClick} className={`${base} ${colors[color]}`}>
            {children}
        </button>
    );
}

// ─── TrocaresEditor ──────────────────────────────────────────────────────────

function TrocaresEditor({ label, entries, onChange }: {
    label: string;
    entries: TrocarEntry[];
    onChange: (entries: TrocarEntry[]) => void;
}) {
    function add() {
        onChange([...entries, { n: '', tamanho: '' }]);
    }
    function remove(idx: number) {
        onChange(entries.filter((_, i) => i !== idx));
    }
    function update(idx: number, field: keyof TrocarEntry, value: string) {
        const next = entries.map((e, i) => i === idx ? { ...e, [field]: value } : e);
        onChange(next);
    }
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            {entries.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500">Nenhum trócar adicionado.</p>
            )}
            {entries.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <input
                        type="number"
                        value={entry.n}
                        onChange={(e) => update(idx, 'n', e.target.value)}
                        min={0}
                        className={inputCls + ' w-10'}
                        placeholder="N.º"
                    />
                    <input
                        type="number"
                        value={entry.tamanho}
                        onChange={(e) => update(idx, 'tamanho', e.target.value)}
                        className={inputCls + ' w-10'}
                        placeholder="Tamanho (ex: 8 mm)"
                    />
                    <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/20"
                        aria-label="Remover"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                className="mt-1 self-start rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300"
            >
                + Adicionar tamanho
            </button>
        </div>
    );
}

// ─── ModalMultiSelect ─────────────────────────────────────────────────────────

function ModalMultiSelect({
    label,
    options,
    selectedIds,
    onSelectionChange,
    error,
}: {
    label: string;
    options: ConsumivelTipo[];
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    error?: string;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selected = options.filter((o) => selectedIds.includes(o.id));
    const filtered = options.filter((o) =>
        o.nome.toLowerCase().includes(search.toLowerCase())
    );

    function toggle(id: number) {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((x) => x !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    }

    const modal = open
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                <div className="relative flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl dark:bg-gray-900" style={{ maxHeight: '80vh' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{label}</h3>
                        <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
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
                                placeholder="Pesquisar…"
                                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 dark:text-gray-100"
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Grid de opções */}
                    <div className="flex-1 overflow-y-auto p-5">
                        {filtered.length === 0 ? (
                            <p className="text-center text-sm text-gray-400">Nenhum resultado</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {filtered.map((opt) => {
                                    const checked = selectedIds.includes(opt.id);
                                    return (
                                        <label
                                            key={opt.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                                                checked
                                                    ? 'border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggle(opt.id)}
                                                className="h-4 w-4 accent-blue-600"
                                            />
                                            <span className="leading-tight">{opt.nome}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedIds.length} selecionado{selectedIds.length !== 1 ? 's' : ''}
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`flex min-h-10 w-full flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    error
                        ? 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/10'
                        : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
                }`}
            >
                {selected.length === 0 ? (
                    <span className="text-gray-400 dark:text-gray-500">Clique para seleccionar…</span>
                ) : (
                    selected.map((o) => (
                        <span key={o.id} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {o.nome}
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.stopPropagation(); toggle(o.id); }}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); toggle(o.id); } }}
                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                            >×</span>
                        </span>
                    ))
                )}
            </button>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            {modal}
        </>
    );
}

export default function SurgeryForm({ briefing, surgery, procedures, consumivel_tipos, consumivel_tipos_extra }: Props) {
    const isEdit = !!surgery?.id;
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [stepError, setStepError] = useState<string | null>(null);

    // Normaliza datetime ISO/DB para 'YYYY-MM-DD HH:MM' esperado pelo input datetime-local e pelo backend
    function normDt(dt: string | null | undefined, fallback: string): string {
        if (!dt) return fallback;
        // ISO 8601: "2026-04-27T10:00:00.000000Z" → "2026-04-27 10:00"
        // DB format: "2026-04-27 10:00:00" → "2026-04-27 10:00"
        return dt.substring(0, 16).replace('T', ' ');
    }

    const defaultDate = briefing.data.substring(0, 10) + ' 00:00';

    const steps: Step[] = [
        { id: 'identificacao', label: 'Identificação do utente', icon: User },
        { id: 'clinicos', label: 'Elementos Clínicos', icon: FileText },
        { id: 'tempos', label: 'Tempos Operatórios Robóticos', icon: Clock },
        { id: 'planeamento', label: 'Planeamento', icon: FileText },
        { id: 'robotico', label: ' Elementos Robóticos', icon: Cpu },
        { id: 'review', label: 'Revisão', icon: Check },
    ];

    const { data, setData, post, put, processing, errors } = useForm<Surgery>({
        processo: surgery?.processo ?? '',
        procedimento: surgery?.procedimento ?? '',
        destino: surgery?.destino ?? '',

        prep_inicio: normDt(surgery?.prep_inicio, defaultDate),
        prep_fim: normDt(surgery?.prep_fim, defaultDate),
        docking: surgery?.docking ?? '',
        consola_inicio: normDt(surgery?.consola_inicio, defaultDate),
        consola_fim: normDt(surgery?.consola_fim, defaultDate),

        antecedentes_relevantes: surgery?.antecedentes_relevantes ?? null,
        descricao_antecedentes: surgery?.descricao_antecedentes ?? '',
        comorbidades: surgery?.comorbidades ?? null,
        descricao_comorbidades: surgery?.descricao_comorbidades ?? '',
        variacoes_tecnicas: surgery?.variacoes_tecnicas ?? null,
        descricao_variacoes: surgery?.descricao_variacoes ?? '',
        passos_criticos: surgery?.passos_criticos ?? null,
        descricao_passos: surgery?.descricao_passos ?? '',

        consentimento: surgery?.consentimento ?? null,
        lateralidade: (!surgery?.lateralidade || surgery.lateralidade === 'N/A') ? 'N/A' : 'Sim',
        lateralidade_lado: surgery?.lateralidade_lado ?? '',
        lateralidade_marcacao: surgery?.lateralidade_marcacao ?? null,
        medicacao_suspensa: (surgery?.medicacao_suspensa as string) ?? null,
        medicacao_qual: surgery?.medicacao_qual ?? '',
        antibiotico: surgery?.antibiotico ?? '',
        antibioterapia: surgery?.antibioterapia ?? null,
        profilaxia: surgery?.profilaxia ?? null,
        profilaxia_tipo: surgery?.profilaxia_tipo ?? '',
        perdas_estimadas: surgery?.perdas_estimadas ?? '',
        reserva_ativa: surgery?.reserva_ativa ?? null,
        reserva_estado: surgery?.reserva_estado ?? null,
        reserva_unidades: surgery?.reserva_unidades ?? '',

        trocares: surgery?.trocares ?? '',
        trocares_roboticos: surgery?.trocares_roboticos ?? '',
        trocares_roboticos_tamanhos: Array.isArray(surgery?.trocares_roboticos_tamanhos) ? surgery.trocares_roboticos_tamanhos : [],
        trocares_nao_roboticos: surgery?.trocares_nao_roboticos ?? '',
        trocares_nao_roboticos_tamanhos: Array.isArray(surgery?.trocares_nao_roboticos_tamanhos) ? surgery.trocares_nao_roboticos_tamanhos : [],
        otica: surgery?.otica ?? '0',
        monopolar_coag_watts: surgery?.monopolar_coag_watts ?? '',
        monopolar_coag_tipo: surgery?.monopolar_coag_tipo ?? '',
        monopolar_cut_watts: surgery?.monopolar_cut_watts ?? '',
        monopolar_cut_tipo: surgery?.monopolar_cut_tipo ?? '',
        bipolar_coag_watts: surgery?.bipolar_coag_watts ?? '',
        bipolar_coag_tipo: surgery?.bipolar_coag_tipo ?? '',
        b1: Array.isArray(surgery?.b1) ? surgery.b1 : [],
        b2: Array.isArray(surgery?.b2) ? surgery.b2 : [],
        b3: Array.isArray(surgery?.b3) ? surgery.b3 : [],
        b4: Array.isArray(surgery?.b4) ? surgery.b4 : [],
        equipamento_extra: Array.isArray(surgery?.equipamento_extra) ? surgery.equipamento_extra : [],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/surgeries/${surgery!.id}`);
        } else {
            post(`/briefings/${briefing.id}/surgeries`);
        }
    }

    function validateStep(stepId: StepName): string | null {
        switch (stepId) {
            case 'identificacao':
                if (!data.processo) return 'Processo é obrigatório';
                if (!data.procedimento) return 'Procedimento é obrigatório';
                if (!data.destino) return 'Destino é obrigatório';
                return null;
            case 'clinicos':
                if (data.antecedentes_relevantes === null) return 'Indique se existem antecedentes de relevo';
                if (data.comorbidades === null) return 'Indique se existem comorbidades';
                if (data.variacoes_tecnicas === null) return 'Indique se existem variações técnicas';
                if (data.passos_criticos === null) return 'Indique se existem passos críticos';
                return null;
            case 'planeamento':
                if (data.consentimento === null) return 'Indique se os consentimentos foram obtidos';
                if (data.medicacao_suspensa === null) return 'Indique o estado da medicação suspensa';
                if (data.antibioterapia === null) return 'Indique se é necessária antibioterapia';
                if (data.profilaxia === null) return 'Indique se é necessária profilaxia tromboembólica';
                if (!data.reserva_estado) return 'Indique o estado da reserva de eritrócitos';
                return null;
            default:
                return null;
        }
    }

    function nextStep() {
        const stepId = steps[currentStep].id as StepName;
        const error = validateStep(stepId);
        if (error) {
            setStepError(error);
            return;
        }
        setStepError(null);
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    function previousStep() {
        setStepError(null);
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = e.target as HTMLInputElement;
        const key = target.name as keyof Surgery;
        let value: any = target.value;

        // Converter datetime-local para formato MySQL datetime (YYYY-MM-DD HH:mm)
        if (target.type === 'datetime-local' && value) {
            // O input já devolve YYYY-MM-DDTHH:mm em hora local — basta substituir o T
            value = value.slice(0, 16).replace('T', ' ');
        }

        // Converter strings vazias em null para campos numéricos
        if (target.type === 'number' && value === '') {
            value = null;
        }

        // Converter strings vazias em null para campos de watts/tipo (se necessário)
        if ((key.toString().includes('_watts') || key.toString().includes('_tipo')) && value === '') {
            value = null;
        }

        setData(key, value as any);
    }

    function toggleFlag(flag: keyof Surgery) {
        setData(flag, !data[flag]);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: `${briefing.data.substring(0, 10)} – Sala ${briefing.sala}`, href: `/briefings/${briefing.id}` },
        { title: isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia'} />
            <div className="mx-auto max-w-6xl p-6">

                {/* Contexto do briefing */}
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                    <span className="font-semibold">Briefing:</span>{' '}
                    {briefing.data.substring(0, 10)} &mdash; {briefing.hora} &middot; {briefing.especialidade} &middot; Sala {briefing.sala}
                </div>

                <h1 className="mb-6 text-2xl font-bold">{isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia'}</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {/* ── PROGRESS BAR ── */}
                    <div className="flex items-center justify-between gap-2">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex flex-1 items-center">
                                <button
                                    type="button"
                                    onClick={() => { setStepError(null); setCurrentStep(idx); }}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                                        idx === currentStep
                                            ? 'bg-blue-600 text-white'
                                            : idx < currentStep
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-300 text-gray-600 dark:bg-gray-700'
                                    }`}
                                >
                                    {idx < currentStep ? <Check size={16} /> : idx + 1}
                                </button>
                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-1 rounded ${idx < currentStep ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── STEP LABEL ── */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Passo {currentStep + 1} de {steps.length}</p>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{steps[currentStep].label}</h2>
                    </div>

                    {stepError && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {stepError}
                        </div>
                    )}

                    {/* ── STEP 1: IDENTIFICAÇÃO ── */}
                    {currentStep === 0 && (
                        <SectionCard color="border-blue-500" title="Identificação do utente">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field label="Processo" error={errors.processo}>
                                    <input type="text" name="processo" value={data.processo} onChange={handleChange} className={inputCls} required />
                                </Field>
                                <Field label="Destino" error={errors.destino}>
                                    <select name="destino" value={data.destino} onChange={handleChange} className={selectCls} required>
                                        <option value="">Selecione o destino…</option>
                                        <option value="UCPA">UCPA</option>
                                        <option value="Enfermaria">Enfermaria</option>
                                        <option value="SMI">SMI</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Procedimento" error={errors.procedimento}>
                                        <select name="procedimento" value={data.procedimento} onChange={handleChange} className={selectCls} required>
                                            <option value="">Selecione um procedimento…</option>
                                            {procedures.map((proc) => (
                                                <option key={proc.id} value={proc.nome}>
                                                    {proc.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {/* ── STEP 2: CLÍNICOS ── */}
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {(
                                [
                                    { flag: 'antecedentes_relevantes', desc: 'descricao_antecedentes',  label: 'Antecedentes de relevo' },
                                    { flag: 'comorbidades',            desc: 'descricao_comorbidades', label: 'Comorbidades' },
                                    { flag: 'variacoes_tecnicas',      desc: 'descricao_variacoes',    label: 'Variações técnicas' },
                                    { flag: 'passos_criticos',         desc: 'descricao_passos',       label: 'Passos críticos identificados' },
                                ] as const
                            ).map(({ flag, desc, label }) => (
                                <div key={flag} className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setData(flag, true)}
                                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${data[flag] === true ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-green-100 hover:text-green-700 dark:bg-gray-700 dark:hover:bg-green-900/30'}`}
                                            >
                                                Sim
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData(flag, false)}
                                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${data[flag] === false ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-gray-700'}`}
                                            >
                                                Não
                                            </button>
                                        </div>
                                    </div>
                                    {data[flag] === true && (
                                        <textarea
                                            name={desc}
                                            value={data[desc] as string}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="Descreva…"
                                            className={inputCls}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── STEP 3: TEMPOS ── */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                                <span className="font-semibold">Formato: YYYY/MM/DD HH:MM</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Prep Início */}
                                <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-900/10">
                                    <Field label="Início de Preparação" error={errors.prep_inicio}>
                                        <input 
                                            type="datetime-local" 
                                            name="prep_inicio" 
                                            value={data.prep_inicio ? (data.prep_inicio as string).slice(0, 16).replace(' ', 'T') : ''} 
                                            onChange={handleChange} 
                                            className={inputCls} 
                                        />
                                    </Field>
                                </div>

                                {/* Prep Fim */}
                                <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-900/10">
                                    <Field label="Fim de Preparação" error={errors.prep_fim}>
                                        <input 
                                            type="datetime-local" 
                                            name="prep_fim" 
                                            value={data.prep_fim ? (data.prep_fim as string).slice(0, 16).replace(' ', 'T') : ''} 
                                            onChange={handleChange} 
                                            className={inputCls} 
                                        />
                                    </Field>
                                </div>

                                {/* Docking */}
                                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-900/10">
                                    <Field label="Docking (Minutos)" error={errors.docking} full>
                                        <input type="number" name="docking" value={data.docking as string} onChange={handleChange} min={0} className={inputCls} placeholder="Minutos" />
                                    </Field>
                                </div>

                                <div></div>

                                {/* Consola Início */}
                                <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900 dark:bg-purple-900/10">
                                    <Field label="Início da Consola" error={errors.consola_inicio}>
                                        <input 
                                            type="datetime-local" 
                                            name="consola_inicio" 
                                            value={data.consola_inicio ? (data.consola_inicio as string).slice(0, 16).replace(' ', 'T') : ''} 
                                            onChange={handleChange} 
                                            className={inputCls} 
                                        />
                                    </Field>
                                </div>

                                {/* Consola Fim */}
                                <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900 dark:bg-purple-900/10">
                                    <Field label="Fim da Consola" error={errors.consola_fim}>
                                        <input 
                                            type="datetime-local" 
                                            name="consola_fim" 
                                            value={data.consola_fim ? (data.consola_fim as string).slice(0, 16).replace(' ', 'T') : ''} 
                                            onChange={handleChange} 
                                            className={inputCls} 
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: PLANEAMENTO ── */}
                    {currentStep === 3 && (
                        <SectionCard color="border-yellow-500" title="Planeamento">
                            <div className="flex flex-col gap-2">

                                {/* Consentimentos obtidos */}
                                <PlanRow label="Consentimentos obtidos" error={errors.consentimento as string}>
                                    <Btn3 active={data.consentimento === true}  onClick={() => setData('consentimento', true)}  color="green">Sim</Btn3>
                                    <Btn3 active={data.consentimento === false} onClick={() => setData('consentimento', false)} color="red">Não</Btn3>
                                </PlanRow>

                                {/* Lateralidade */}
                                <PlanRow label="Lateralidade" error={errors.lateralidade as string}>
                                    <Btn3 active={data.lateralidade === 'Sim'} onClick={() => setData('lateralidade', 'Sim')} color="green">Sim</Btn3>
                                    <Btn3 active={data.lateralidade === 'N/A'} onClick={() => { setData('lateralidade', 'N/A'); setData('lateralidade_lado', ''); setData('lateralidade_marcacao', null); }} color="slate">N/A</Btn3>
                                </PlanRow>

                                {data.lateralidade === 'Sim' && (
                                    <SubRow label="Se sim: lado">
                                        <Btn3 active={data.lateralidade_lado === 'Esquerda'}  onClick={() => setData('lateralidade_lado', 'Esquerda')}  color="blue">Esquerda</Btn3>
                                        <Btn3 active={data.lateralidade_lado === 'Direita'}   onClick={() => setData('lateralidade_lado', 'Direita')}   color="blue">Direita</Btn3>
                                        <Btn3 active={data.lateralidade_lado === 'Bilateral'} onClick={() => setData('lateralidade_lado', 'Bilateral')} color="blue">Bilateral</Btn3>
                                    </SubRow>
                                )}

                                {data.lateralidade === 'Sim' && data.lateralidade_lado && (
                                    <SubRow label="Marcação">
                                        <Btn3 active={data.lateralidade_marcacao === true}  onClick={() => setData('lateralidade_marcacao', true)}  color="green">Sim</Btn3>
                                        <Btn3 active={data.lateralidade_marcacao === false} onClick={() => setData('lateralidade_marcacao', false)} color="red">Não</Btn3>
                                    </SubRow>
                                )}

                                {/* Medicação suspensa */}
                                <PlanRow label="Medicação suspensa" error={errors.medicacao_suspensa as string}>
                                    <Btn3 active={data.medicacao_suspensa === 'Sim'} onClick={() => setData('medicacao_suspensa', 'Sim')} color="green">Sim</Btn3>
                                    <Btn3 active={data.medicacao_suspensa === 'Não'} onClick={() => setData('medicacao_suspensa', 'Não')} color="red">Não</Btn3>
                                    <Btn3 active={data.medicacao_suspensa === 'N/A'} onClick={() => { setData('medicacao_suspensa', 'N/A'); setData('medicacao_qual', ''); }} color="slate">N/A</Btn3>
                                </PlanRow>

                                {data.medicacao_suspensa === 'Não' && (
                                    <SubRow label="Se não: Qual?">
                                        <input type="text" name="medicacao_qual" value={data.medicacao_qual ?? ''} onChange={handleChange} className={inputCls} placeholder="Nome da medicação…" />
                                    </SubRow>
                                )}

                                {/* Antibioterapia necessária */}
                                <PlanRow label="Antibioterapia necessária" error={errors.antibioterapia as string}>
                                    <Btn3 active={data.antibioterapia === true}  onClick={() => setData('antibioterapia', true)}  color="green">Sim</Btn3>
                                    <Btn3 active={data.antibioterapia === false} onClick={() => { setData('antibioterapia', false); setData('antibiotico', ''); }} color="slate">N/A</Btn3>
                                </PlanRow>

                                {data.antibioterapia === true && (
                                    <SubRow label="Se sim: Qual?">
                                        <input type="text" name="antibiotico" value={data.antibiotico ?? ''} onChange={handleChange} className={inputCls} placeholder="Nome do antibiótico…" />
                                    </SubRow>
                                )}

                                {/* Profilaxia tromboembólica */}
                                <PlanRow label="Profilaxia tromboembólica" error={errors.profilaxia as string}>
                                    <Btn3 active={data.profilaxia === true}  onClick={() => setData('profilaxia', true)}  color="green">Sim</Btn3>
                                    <Btn3 active={data.profilaxia === false} onClick={() => { setData('profilaxia', false); setData('profilaxia_tipo', ''); }} color="slate">N/A</Btn3>
                                </PlanRow>

                                {data.profilaxia === true && (
                                    <SubRow label="Se sim: Qual?">
                                        <Btn3 active={data.profilaxia_tipo === 'Farmacológica'} onClick={() => setData('profilaxia_tipo', 'Farmacológica')} color="blue">Farmacológica</Btn3>
                                        <Btn3 active={data.profilaxia_tipo === 'Mecânica'}      onClick={() => setData('profilaxia_tipo', 'Mecânica')}      color="blue">Mecânica</Btn3>
                                        <Btn3 active={data.profilaxia_tipo === 'Ambas'}      onClick={() => setData('profilaxia_tipo', 'Ambas')}      color="blue">Ambas</Btn3>
                                    </SubRow>
                                )}

                                {/* Perdas estimadas */}
                                <PlanRow label="Perdas estimadas" error={errors.perdas_estimadas as string}>
                                    <div className="flex items-center gap-2">
                                        <input type="number" name="perdas_estimadas" value={data.perdas_estimadas as string ?? ''} onChange={handleChange} min={0} className={inputCls + ' w-32'} placeholder="0" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">mL</span>
                                    </div>
                                </PlanRow>

                                {/* Reserva de concentrado de eritrócitos */}
                                <PlanRow label="Reserva de concentrado de eritrócitos" error={errors.reserva_estado as string}>
                                    <Btn3 active={data.reserva_estado === 'Tem'}      onClick={() => setData('reserva_estado', 'Tem')}      color="green">Tem</Btn3>
                                    <Btn3 active={data.reserva_estado === 'Necessita'} onClick={() => setData('reserva_estado', 'Necessita')} color="yellow">Necessita</Btn3>
                                    <Btn3 active={data.reserva_estado === 'N/A'}      onClick={() => { setData('reserva_estado', 'N/A'); setData('reserva_unidades', ''); }} color="slate">N/A</Btn3>
                                </PlanRow>

                                {(data.reserva_estado === 'Tem' || data.reserva_estado === 'Necessita') && (
                                    <SubRow label="N.º Unidades">
                                        <input type="number" name="reserva_unidades" value={data.reserva_unidades as string ?? ''} onChange={handleChange} min={0} className={inputCls + ' w-32'} placeholder="0" />
                                    </SubRow>
                                )}

                            </div>
                        </SectionCard>
                    )}

                    {/* ── STEP 5: ROBÓTICO ── */}
                    {currentStep === 4 && (
                        <SectionCard color="border-purple-500" title="Robótico">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <TrocaresEditor
                                    label="Trócares Robóticos"
                                    entries={(data.trocares_roboticos_tamanhos as TrocarEntry[]) ?? []}
                                    onChange={(entries) => setData('trocares_roboticos_tamanhos', entries)}
                                />
                                <TrocaresEditor
                                    label="Trócares Não Robóticos"
                                    entries={(data.trocares_nao_roboticos_tamanhos as TrocarEntry[]) ?? []}
                                    onChange={(entries) => setData('trocares_nao_roboticos_tamanhos', entries)}
                                />
                                <Field label="Ótica" error={errors.otica}>
                                    <select name="otica" value={data.otica} onChange={handleChange} className={inputCls}>
                                        <option value="0">0°</option>
                                        <option value="30">30°</option>
                                    </select>
                                </Field>

                                {/* Monopolar Coag */}
                                <div className="grid grid-cols-2 gap-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-900/10 md:col-span-2">
                                    <Field label="Monopolar Coag - Potência (W)" error={errors.monopolar_coag_watts}>
                                        <input type="number" name="monopolar_coag_watts" value={data.monopolar_coag_watts as string} onChange={handleChange} min={0} className={inputCls} />
                                    </Field>
                                    <Field label="Monopolar Coag - Tipo" error={errors.monopolar_coag_tipo}>
                                        <select name="monopolar_coag_tipo" value={data.monopolar_coag_tipo} onChange={handleChange} className={selectCls}>
                                            <option value="">Selecione…</option>
                                            <option value="pure">Pure</option>
                                            <option value="flugurate">Flugurate</option>
                                            <option value="soft">Soft</option>
                                        </select>
                                    </Field>
                                </div>

                                {/* Monopolar Cut */}
                                <div className="grid grid-cols-2 gap-4 rounded-lg border border-green-100 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-900/10 md:col-span-2">
                                    <Field label="Monopolar Cut - Potência (W)" error={errors.monopolar_cut_watts}>
                                        <input type="number" name="monopolar_cut_watts" value={data.monopolar_cut_watts as string} onChange={handleChange} min={0} className={inputCls} />
                                    </Field>
                                    <Field label="Monopolar Cut - Tipo" error={errors.monopolar_cut_tipo}>
                                        <select name="monopolar_cut_tipo" value={data.monopolar_cut_tipo} onChange={handleChange} className={selectCls}>
                                            <option value="">Selecione…</option>
                                            <option value="pure">Pure</option>
                                            <option value="flugurate">Flugurate</option>
                                            <option value="soft">Soft</option>
                                        </select>
                                    </Field>
                                </div>

                                {/* Bipolar Coag */}
                                <div className="grid grid-cols-2 gap-4 rounded-lg border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-900/10 md:col-span-2">
                                    <Field label="Bipolar Coag - Potência (W)" error={errors.bipolar_coag_watts}>
                                        <input type="number" name="bipolar_coag_watts" value={data.bipolar_coag_watts as string} onChange={handleChange} min={0} className={inputCls} />
                                    </Field>
                                    <Field label="Bipolar Coag - Tipo" error={errors.bipolar_coag_tipo}>
                                        <select name="bipolar_coag_tipo" value={data.bipolar_coag_tipo} onChange={handleChange} className={selectCls}>
                                            <option value="">Selecione…</option>
                                            <option value="pure">Pure</option>
                                            <option value="flugurate">Flugurate</option>
                                            <option value="soft">Soft</option>
                                        </select>
                                    </Field>
                                </div>

                                <Field label="B1 - Pinças" error={errors.b1 as string}>
                                    <ModalMultiSelect
                                        label="B1 – Pinças"
                                        options={consumivel_tipos}
                                        selectedIds={(data.b1 as number[]) ?? []}
                                        onSelectionChange={(ids) => setData('b1', ids)}
                                        error={errors.b1 as string}
                                    />
                                </Field>
                                <Field label="B2 - Pinças" error={errors.b2 as string}>
                                    <ModalMultiSelect
                                        label="B2 – Pinças"
                                        options={consumivel_tipos}
                                        selectedIds={(data.b2 as number[]) ?? []}
                                        onSelectionChange={(ids) => setData('b2', ids)}
                                        error={errors.b2 as string}
                                    />
                                </Field>
                                <Field label="B3 - Pinças" error={errors.b3 as string}>
                                    <ModalMultiSelect
                                        label="B3 – Pinças"
                                        options={consumivel_tipos}
                                        selectedIds={(data.b3 as number[]) ?? []}
                                        onSelectionChange={(ids) => setData('b3', ids)}
                                        error={errors.b3 as string}
                                    />
                                </Field>
                                <Field label="B4 - Pinças" error={errors.b4 as string}>
                                    <ModalMultiSelect
                                        label="B4 – Pinças"
                                        options={consumivel_tipos}
                                        selectedIds={(data.b4 as number[]) ?? []}
                                        onSelectionChange={(ids) => setData('b4', ids)}
                                        error={errors.b4 as string}
                                    />
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Equipamento extra" error={errors.equipamento_extra as string}>
                                        <ModalMultiSelect
                                            label="Equipamento extra"
                                            options={consumivel_tipos_extra}
                                            selectedIds={(data.equipamento_extra as number[]) ?? []}
                                            onSelectionChange={(ids) => setData('equipamento_extra', ids)}
                                            error={errors.equipamento_extra as string}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {/* ── STEP 6: REVISÃO ── */}
                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                <p className="text-sm font-semibold text-green-900 dark:text-green-200">Revise todos os dados antes de confirmar.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Identificação */}
                                <div className="rounded-lg border border-blue-100 p-4 dark:border-blue-900">
                                    <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-200">Identificação</h3>
                                    <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                        <p><span className="font-medium">Processo:</span> {data.processo}</p>
                                        <p><span className="font-medium">Procedimento:</span> {data.procedimento}</p>
                                        <p><span className="font-medium">Destino:</span> {data.destino}</p>
                                    </div>
                                </div>

                                {/* Clínicos */}
                                <div className="rounded-lg border border-purple-100 p-4 dark:border-purple-900">
                                    <h3 className="mb-3 font-semibold text-purple-900 dark:text-purple-200">Clínicos</h3>
                                    <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                        <p><span className="font-medium">Antecedentes:</span> {data.antecedentes_relevantes ? 'Sim' : 'Não'}</p>
                                        <p><span className="font-medium">Comorbidades:</span> {data.comorbidades ? 'Sim' : 'Não'}</p>
                                        <p><span className="font-medium">Variações técnicas:</span> {data.variacoes_tecnicas ? 'Sim' : 'Não'}</p>
                                        <p><span className="font-medium">Passos críticos:</span> {data.passos_criticos ? 'Sim' : 'Não'}</p>
                                    </div>
                                </div>

                                {/* Tempos */}
                                <div className="rounded-lg border border-green-100 p-4 dark:border-green-900">
                                    <h3 className="mb-3 font-semibold text-green-900 dark:text-green-200">Tempos</h3>
                                    <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                        <p><span className="font-medium">Prep início:</span> {data.prep_inicio ? new Date(data.prep_inicio as string).toLocaleString('pt-PT') : '—'}</p>
                                        <p><span className="font-medium">Prep fim:</span> {data.prep_fim ? new Date(data.prep_fim as string).toLocaleString('pt-PT') : '—'}</p>
                                        <p><span className="font-medium">Docking:</span> {data.docking} min</p>
                                        <p><span className="font-medium">Consola início:</span> {data.consola_inicio ? new Date(data.consola_inicio as string).toLocaleString('pt-PT') : '—'}</p>
                                        <p><span className="font-medium">Consola fim:</span> {data.consola_fim ? new Date(data.consola_fim as string).toLocaleString('pt-PT') : '—'}</p>
                                    </div>
                                </div>

                                {/* Planeamento */}
                                <div className="rounded-lg border border-yellow-100 p-4 dark:border-yellow-900">
                                    <h3 className="mb-3 font-semibold text-yellow-900 dark:text-yellow-200">Planeamento</h3>
                                    <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                        <p><span className="font-medium">Consentimentos:</span> {data.consentimento === true ? 'Sim' : data.consentimento === false ? 'Não' : '—'}</p>
                                        <p>
                                            <span className="font-medium">Lateralidade:</span>{' '}
                                            {data.lateralidade === 'Sim'
                                                ? `Sim — ${data.lateralidade_lado || '—'} (Marcação: ${data.lateralidade_marcacao === true ? 'Sim' : data.lateralidade_marcacao === false ? 'Não' : '—'})`
                                                : 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Medicação suspensa:</span>{' '}
                                            {data.medicacao_suspensa || '—'}
                                            {data.medicacao_suspensa === 'Não' && data.medicacao_qual ? ` — ${data.medicacao_qual}` : ''}
                                        </p>
                                        <p>
                                            <span className="font-medium">Antibioterapia:</span>{' '}
                                            {data.antibioterapia === true ? `Sim — ${data.antibiotico || '—'}` : data.antibioterapia === false ? 'N/A' : '—'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Profilaxia tromboembólica:</span>{' '}
                                            {data.profilaxia === true ? `Sim — ${data.profilaxia_tipo || '—'}` : data.profilaxia === false ? 'N/A' : '—'}
                                        </p>
                                        <p><span className="font-medium">Perdas estimadas:</span> {data.perdas_estimadas ? `${data.perdas_estimadas} mL` : '—'}</p>
                                        <p>
                                            <span className="font-medium">Reserva eritrócitos:</span>{' '}
                                            {data.reserva_estado || '—'}
                                            {(data.reserva_estado === 'Tem' || data.reserva_estado === 'Necessita') && data.reserva_unidades ? ` — ${data.reserva_unidades} un.` : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Robótico */}
                                <div className="rounded-lg border border-pink-100 p-4 dark:border-pink-900 md:col-span-2">
                                    <h3 className="mb-3 font-semibold text-pink-900 dark:text-pink-200">Robótico</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <p><span className="font-medium">Trócares Robóticos:</span>{' '}
                                            {Array.isArray(data.trocares_roboticos_tamanhos) && data.trocares_roboticos_tamanhos.length > 0
                                                ? (data.trocares_roboticos_tamanhos as TrocarEntry[]).map((e, i) => <span key={i} className="mr-2">{e.n}×{e.tamanho}</span>)
                                                : '—'}
                                        </p>
                                        <p><span className="font-medium">Trócares Não Robóticos:</span>{' '}
                                            {Array.isArray(data.trocares_nao_roboticos_tamanhos) && data.trocares_nao_roboticos_tamanhos.length > 0
                                                ? (data.trocares_nao_roboticos_tamanhos as TrocarEntry[]).map((e, i) => <span key={i} className="mr-2">{e.n}×{e.tamanho}</span>)
                                                : '—'}
                                        </p>
                                        <p><span className="font-medium">Ótica:</span> {data.otica}°</p>
                                        <p><span className="font-medium">Monopolar Coag:</span> {data.monopolar_coag_watts ? `${data.monopolar_coag_watts}W ${data.monopolar_coag_tipo || '—'}` : '—'}</p>
                                        <p><span className="font-medium">Monopolar Cut:</span> {data.monopolar_cut_watts ? `${data.monopolar_cut_watts}W ${data.monopolar_cut_tipo || '—'}` : '—'}</p>
                                        <p><span className="font-medium">Bipolar Coag:</span> {data.bipolar_coag_watts ? `${data.bipolar_coag_watts}W ${data.bipolar_coag_tipo || '—'}` : '—'}</p>
                                        <p><span className="font-medium">B1:</span> {Array.isArray(data.b1) && data.b1.length > 0 ? consumivel_tipos.filter(p => data.b1?.includes(p.id)).map(p => p.nome).join(', ') : '—'}</p>
                                        <p><span className="font-medium">B2:</span> {Array.isArray(data.b2) && data.b2.length > 0 ? consumivel_tipos.filter(p => data.b2?.includes(p.id)).map(p => p.nome).join(', ') : '—'}</p>
                                        <p><span className="font-medium">B3:</span> {Array.isArray(data.b3) && data.b3.length > 0 ? consumivel_tipos.filter(p => data.b3?.includes(p.id)).map(p => p.nome).join(', ') : '—'}</p>
                                        <p><span className="font-medium">B4:</span> {Array.isArray(data.b4) && data.b4.length > 0 ? consumivel_tipos.filter(p => data.b4?.includes(p.id)).map(p => p.nome).join(', ') : '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── AÇÕES ── */}
                    <div className="flex items-center justify-between gap-4 pt-4">
                        <button
                            type="button"
                            onClick={previousStep}
                            disabled={currentStep === 0}
                            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Anterior
                        </button>
                        <Link href={`/briefings/${briefing.id}`} className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Próximo
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                            >
                                {processing ? 'A guardar…' : isEdit ? 'Actualizar' : 'Confirmar Cirurgia'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
