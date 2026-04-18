import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls, textareaCls } from '@/components/form-ui';
import { User, Clock, FileText, Cpu, Check, AlertCircle } from 'lucide-react';
import SearchableMultiSelect from '@/components/SearchableMultiSelect';
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
    antecedentes_relevantes?: boolean;
    descricao_antecedentes?: string;
    comorbidades?: boolean;
    descricao_comorbidades?: string;
    variacoes_tecnicas?: boolean;
    descricao_variacoes?: string;
    passos_criticos?: boolean;
    descricao_passos?: string;
    consentimento?: boolean;
    lateralidade?: string;
    medicacao_suspensa?: boolean;
    antibiotico?: string;
    profilaxia?: boolean;
    perdas_estimadas?: number | string;
    reserva_ativa?: boolean;
    reserva_unidades?: number | string;
    trocares?: number | string;
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

function CheckField({label, name, checked, onChange}: {label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor={name} className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {label}
            </label>
        </div>
    );
}

// ─── component ────────────────────────────────────────────────────────────────

export default function SurgeryForm({ briefing, surgery, procedures, consumivel_tipos, consumivel_tipos_extra }: Props) {
    const isEdit = !!surgery?.id;
    const [currentStep, setCurrentStep] = useState<number>(0);

    const steps: Step[] = [
        { id: 'identificacao', label: 'Identificação', icon: User },
        { id: 'clinicos', label: 'Clínicos', icon: FileText },
        { id: 'tempos', label: 'Tempos', icon: Clock },
        { id: 'planeamento', label: 'Planeamento', icon: FileText },
        { id: 'robotico', label: 'Robótico', icon: Cpu },
        { id: 'review', label: 'Revisão', icon: Check },
    ];

    const { data, setData, post, put, processing, errors } = useForm<Surgery>({
        processo: surgery?.processo ?? '',
        procedimento: surgery?.procedimento ?? '',
        destino: surgery?.destino ?? '',

        prep_inicio: surgery?.prep_inicio ?? '',
        prep_fim: surgery?.prep_fim ?? '',
        docking: surgery?.docking ?? '',
        consola_inicio: surgery?.consola_inicio ?? '',
        consola_fim: surgery?.consola_fim ?? '',

        antecedentes_relevantes: surgery?.antecedentes_relevantes ?? false,
        descricao_antecedentes: surgery?.descricao_antecedentes ?? '',
        comorbidades: surgery?.comorbidades ?? false,
        descricao_comorbidades: surgery?.descricao_comorbidades ?? '',
        variacoes_tecnicas: surgery?.variacoes_tecnicas ?? false,
        descricao_variacoes: surgery?.descricao_variacoes ?? '',
        passos_criticos: surgery?.passos_criticos ?? false,
        descricao_passos: surgery?.descricao_passos ?? '',

        consentimento: surgery?.consentimento ?? false,
        lateralidade: surgery?.lateralidade ?? 'N/A',
        medicacao_suspensa: surgery?.medicacao_suspensa ?? false,
        antibiotico: surgery?.antibiotico ?? '',
        profilaxia: surgery?.profilaxia ?? false,
        perdas_estimadas: surgery?.perdas_estimadas ?? '',
        reserva_ativa: surgery?.reserva_ativa ?? false,
        reserva_unidades: surgery?.reserva_unidades ?? '',

        trocares: surgery?.trocares ?? '',
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
            default:
                return null;
        }
    }

    function nextStep() {
        const stepId = steps[currentStep].id as StepName;
        const error = validateStep(stepId);
        if (error) {
            alert(error);
            return;
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    function previousStep() {
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

        setData(key, (target.type === 'checkbox' ? target.checked : value) as any);
    }

    function toggleFlag(flag: keyof Surgery) {
        setData(flag, !data[flag]);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: `${briefing.data} – Sala ${briefing.sala}`, href: `/briefings/${briefing.id}` },
        { title: isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia'} />
            <div className="mx-auto max-w-6xl p-6">

                {/* Contexto do briefing */}
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                    <span className="font-semibold">Briefing:</span>{' '}
                    {briefing.data} &mdash; {briefing.hora} &middot; {briefing.especialidade} &middot; Sala {briefing.sala}
                </div>

                <h1 className="mb-6 text-2xl font-bold">{isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia'}</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {/* ── PROGRESS BAR ── */}
                    <div className="flex items-center justify-between gap-2">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex flex-1 items-center">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(idx)}
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

                    {/* ── STEP 1: IDENTIFICAÇÃO ── */}
                    {currentStep === 0 && (
                        <SectionCard color="border-blue-500" title="Identificação do Doente">
                            <Field label="Processo" error={errors.processo}>
                                <input type="text" name="processo" value={data.processo} onChange={handleChange} className={inputCls} required />
                            </Field>
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
                            <Field label="Destino" error={errors.destino}>
                                <select name="destino" value={data.destino} onChange={handleChange} className={selectCls} required>
                                    <option value="">Selecione o destino…</option>
                                    <option value="UCPA">UCPA</option>
                                    <option value="Enfermaria">Enfermaria</option>
                                    <option value="SMI">SMI</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </Field>
                        </SectionCard>
                    )}

                    {/* ── STEP 2: CLÍNICOS ── */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
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
                                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${data[flag] ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-green-100 hover:text-green-700 dark:bg-gray-700 dark:hover:bg-green-900/30'}`}
                                            >
                                                Sim
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData(flag, false)}
                                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${!data[flag] ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-gray-700'}`}
                                            >
                                                Não
                                            </button>
                                        </div>
                                    </div>
                                    {data[flag] && (
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
                                    <input type="number" name="docking" value={data.docking as string} onChange={handleChange} min={0} className={inputCls} placeholder="Tempo de preparação do robô em minutos" />
                                </Field>
                            </div>

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
                    )}

                    {/* ── STEP 4: PLANEAMENTO ── */}
                    {currentStep === 3 && (
                        <SectionCard color="border-yellow-500" title="Planeamento">
                            <Field label="Lateralidade" error={errors.lateralidade}>
                                <select name="lateralidade" value={data.lateralidade} onChange={handleChange} className={inputCls}>
                                    <option value="N/A">N/A</option>
                                    <option value="Direito">Direito</option>
                                    <option value="Esquerdo">Esquerdo</option>
                                </select>
                            </Field>
                            <Field label="Perdas estimadas (mL)" error={errors.perdas_estimadas}>
                                <input type="number" name="perdas_estimadas" value={data.perdas_estimadas as string} onChange={handleChange} min={0} className={inputCls} />
                            </Field>
                            <Field label="Reserva de unidades" error={errors.reserva_unidades}>
                                <input type="number" name="reserva_unidades" value={data.reserva_unidades as string} onChange={handleChange} min={0} className={inputCls} />
                            </Field>
                            <div className="flex flex-col gap-3">
                                <CheckField label="Consentimento obtido" name="consentimento" checked={!!data.consentimento} onChange={handleChange} />
                                <CheckField label="Medicação suspensa" name="medicacao_suspensa" checked={!!data.medicacao_suspensa} onChange={handleChange} />
                                <CheckField label="Profilaxia" name="profilaxia" checked={!!data.profilaxia} onChange={handleChange} />
                                <CheckField label="Reserva activa" name="reserva_ativa" checked={!!data.reserva_ativa} onChange={handleChange} />
                            </div>
                            <Field label="Antibiótico" error={errors.antibiotico} full>
                                <input type="text" name="antibiotico" value={data.antibiotico} onChange={handleChange} className={inputCls} placeholder="Deixar vazio se não aplicável" />
                            </Field>
                        </SectionCard>
                    )}

                    {/* ── STEP 5: ROBÓTICO ── */}
                    {currentStep === 4 && (
                        <SectionCard color="border-purple-500" title="Robótico">
                            <Field label="Trócares" error={errors.trocares}>
                                <input type="number" name="trocares" value={data.trocares as string} onChange={handleChange} min={0} className={inputCls} />
                            </Field>
                            <Field label="Ótica" error={errors.otica}>
                                <select name="otica" value={data.otica} onChange={handleChange} className={inputCls}>
                                    <option value="0">0°</option>
                                    <option value="30">30°</option>
                                </select>
                            </Field>

                            {/* Monopolar Coag */}
                            <div className="grid grid-cols-2 gap-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-900/10 sm:col-span-2">
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
                            <div className="grid grid-cols-2 gap-4 rounded-lg border border-green-100 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-900/10 sm:col-span-2">
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
                            <div className="grid grid-cols-2 gap-4 rounded-lg border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-900/10 sm:col-span-2">
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

                            <Field label="B1 - Pinças" error={errors.b1}>
                                <SearchableMultiSelect
                                    options={consumivel_tipos}
                                    selectedIds={(data.b1 as number[]) ?? []}
                                    onSelectionChange={(selectedIds) => setData('b1', selectedIds)}
                                    placeholder="Procurar pinças B1..."
                                />
                            </Field>
                            <Field label="B2 - Pinças" error={errors.b2}>
                                <SearchableMultiSelect
                                    options={consumivel_tipos}
                                    selectedIds={(data.b2 as number[]) ?? []}
                                    onSelectionChange={(selectedIds) => setData('b2', selectedIds)}
                                    placeholder="Procurar pinças B2..."
                                />
                            </Field>
                            <Field label="B3 - Pinças" error={errors.b3}>
                                <SearchableMultiSelect
                                    options={consumivel_tipos}
                                    selectedIds={(data.b3 as number[]) ?? []}
                                    onSelectionChange={(selectedIds) => setData('b3', selectedIds)}
                                    placeholder="Procurar pinças B3..."
                                />
                            </Field>
                            <Field label="B4 - Pinças" error={errors.b4}>
                                <SearchableMultiSelect
                                    options={consumivel_tipos}
                                    selectedIds={(data.b4 as number[]) ?? []}
                                    onSelectionChange={(selectedIds) => setData('b4', selectedIds)}
                                    placeholder="Procurar pinças B4..."
                                />
                            </Field>
                            <Field label="Equipamento extra" error={errors.equipamento_extra} full>
                                <SearchableMultiSelect
                                    options={consumivel_tipos_extra}
                                    selectedIds={(data.equipamento_extra as number[]) ?? []}
                                    onSelectionChange={(selectedIds) => setData('equipamento_extra', selectedIds as number[])}
                                    placeholder="Procurar equipamento extra…"
                                />
                            </Field>
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
                                        <p><span className="font-medium">Lateralidade:</span> {data.lateralidade}</p>
                                        <p><span className="font-medium">Perdas:</span> {data.perdas_estimadas} mL</p>
                                        <p><span className="font-medium">Reserva:</span> {data.reserva_unidades || '—'}</p>
                                        <p><span className="font-medium">Antibiótico:</span> {data.antibiotico || '—'}</p>
                                    </div>
                                </div>

                                {/* Robótico */}
                                <div className="rounded-lg border border-pink-100 p-4 dark:border-pink-900 md:col-span-2">
                                    <h3 className="mb-3 font-semibold text-pink-900 dark:text-pink-200">Robótico</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <p><span className="font-medium">Trócares:</span> {data.trocares}</p>
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
