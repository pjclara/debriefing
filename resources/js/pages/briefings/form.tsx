import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, YesNo, inputCls, textareaCls } from '@/components/form-ui';
import { Calendar, Users, ClipboardCheck, ListChecks, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import { DictationTextarea } from '@/components/DictationButton';

interface BriefingData {
    id?: number;
    data?: string;
    hora?: string;
    especialidade?: string;
    sala?: string;
    equipa_segura?: boolean | null;
    alteracao_equipa?: boolean | null;
    descricao_alteracao_equipa?: string;
    problemas_sala?: boolean | null;
    descricao_problemas?: string;
    equipamento_ok?: boolean | null;
    descricao_equipamento?: string;
    mesa_emparelhada?: boolean | null;
    ordem_mantida?: boolean | null;
    descricao_ordem?: string;
}

interface Department {
    id: number;
    nome: string;
}

interface Props {
    briefing?: BriefingData;
    departments: Department[];
}

type StepName = 'sala' | 'equipa' | 'checklist' | 'plano' | 'review';

interface Step {
    id: StepName;
    label: string;
    icon: any;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function BriefingForm({ briefing, departments }: Props) {
    const isEdit = !!briefing?.id;
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [stepError, setStepError] = useState<string | null>(null);

    const steps: Step[] = [
        { id: 'sala', label: 'Sala / Dia', icon: Calendar },
        { id: 'equipa', label: 'Equipa', icon: Users },
        { id: 'checklist', label: 'Checklist', icon: ClipboardCheck },
        { id: 'plano', label: 'Plano', icon: ListChecks },
        { id: 'review', label: 'Revisão', icon: Check },
    ];

    const { data, setData, post, put, processing, errors } = useForm<BriefingData>({
        data: briefing?.data ?? '',
        hora: briefing?.hora ? briefing.hora.substring(0, 5) : '',
        especialidade: briefing?.especialidade ?? '',
        sala: briefing?.sala ?? '',
        equipa_segura: briefing?.equipa_segura ?? null,
        alteracao_equipa: briefing?.alteracao_equipa ?? null,
        descricao_alteracao_equipa: briefing?.descricao_alteracao_equipa ?? '',
        problemas_sala: briefing?.problemas_sala ?? null,
        descricao_problemas: briefing?.descricao_problemas ?? '',
        equipamento_ok: briefing?.equipamento_ok ?? null,
        descricao_equipamento: briefing?.descricao_equipamento ?? '',
        mesa_emparelhada: briefing?.mesa_emparelhada ?? null,
        ordem_mantida: briefing?.ordem_mantida ?? null,
        descricao_ordem: briefing?.descricao_ordem ?? '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setData(e.target.name as keyof BriefingData, e.target.value as any);
    }

    function toggle(key: keyof BriefingData) {
        return (val: boolean) => setData(key, val as any);
    }

    function validateStep(stepId: StepName): string | null {
        switch (stepId) {
            case 'sala':
                if (!data.data) return 'Data é obrigatória';
                if (!data.hora) return 'Hora é obrigatória';
                if (!data.especialidade) return 'Especialidade é obrigatória';
                if (!data.sala) return 'Sala é obrigatória';
                return null;
            case 'equipa':
                if (data.equipa_segura === null) return 'Indique se a dotação é segura';
                return null;
            case 'checklist':
                if (data.problemas_sala === null) return 'Indique se existem problemas na sala';
                if (data.equipamento_ok === null) return 'Indique se o equipamento está disponível e funcionante';
                if (data.mesa_emparelhada === null) return 'Indique se a mesa operatória está emparelhada';
                return null;
            case 'plano':
                if (data.ordem_mantida === null) return 'Indique se a ordem de doentes foi mantida';
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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Só submete se estiver no último passo (Revisão)
        if (currentStep !== steps.length - 1) return;
        if (isEdit && !briefing?.id) return;
        if (isEdit) {
            put(`/briefings/${briefing!.id}`);
        } else {
            post('/briefings');
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: isEdit ? 'Editar Briefing' : 'Novo Briefing', href: '#' },
    ];

    const currentStepName = steps[currentStep].id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Briefing' : 'Novo Briefing'} />
            <div className="mx-auto max-w-2xl px-4 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {isEdit ? 'Editar Briefing' : 'Novo Briefing'}
                    </h1>
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                        Passo {currentStep + 1} de {steps.length}: {steps[currentStep].label}
                    </p>
                </div>

                {/* Steps Progress */}
                <div className="mb-8 flex gap-2">
                    {steps.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;
                        return (
                            <button
                                key={step.id}
                                type="button"
                                onClick={() => { if (idx < currentStep) { setStepError(null); setCurrentStep(idx); } }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : isCompleted
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 cursor-pointer'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                }`}
                            >
                                <StepIcon className="w-4 h-4" />
                                <span className="hidden sm:inline text-xs">{step.label}</span>
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {stepError && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {stepError}
                        </div>
                    )}
                    {/* ── STEP 1: SALA / DIA ── */}
                    {currentStepName === 'sala' && (
                        <SectionCard icon={Calendar} title="Dados da Sessão" description="Data, hora e localização">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormRow label="Data *" error={errors.data}>
                                    <input type="date" name="data" value={data.data} onChange={handleChange} className={inputCls} required />
                                </FormRow>
                                <FormRow label="Hora de início *" error={errors.hora}>
                                    <input type="time" name="hora" value={data.hora} onChange={handleChange} className={inputCls} required />
                                </FormRow>
                                <FormRow label="Especialidade *" error={errors.especialidade}>
                                    <select name="especialidade" value={data.especialidade} onChange={handleChange} className={inputCls} required>
                                        <option value="">Selecione um departamento…</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.nome}>
                                                {dept.nome}
                                            </option>
                                        ))}
                                    </select>
                                </FormRow>
                                <FormRow label="Sala *" error={errors.sala}>
                                    <input type="text" name="sala" value={data.sala} onChange={handleChange} className={inputCls} placeholder="ex: Sala 3" required />
                                </FormRow>
                            </div>
                        </SectionCard>
                    )}

                    {/* ── STEP 2: EQUIPA ── */}
                    {currentStepName === 'equipa' && (
                        <SectionCard icon={Users} title="Equipa" description="Constituição e alterações de equipa">
                            <FormRow label="Dotação segura?">
                                <YesNo value={data.equipa_segura ?? null} onChange={toggle('equipa_segura')} />
                            </FormRow>
                            <FormRow label="Alguma alteração de equipa que afecte o plano operatório?">
                                <YesNo value={data.alteracao_equipa ?? null} onChange={toggle('alteracao_equipa')} />
                            </FormRow>
                            {data.alteracao_equipa === true && (
                                <FormRow label="Descrição da alteração de equipa" error={errors.descricao_alteracao_equipa}>
                                    <DictationTextarea
                                        value={data.descricao_alteracao_equipa ?? ''}
                                        onChange={(value) => setData('descricao_alteracao_equipa', value)}
                                        rows={3}
                                        className={textareaCls}
                                        placeholder="Descreva as alterações…"
                                    />
                                </FormRow>
                            )}
                        </SectionCard>
                    )}

                    {/* ── STEP 3: CHECKLIST SALA ── */}
                    {currentStepName === 'checklist' && (
                        <SectionCard icon={ClipboardCheck} title="Checklist da Sala" description="Verificação pré-operatória">
                            <FormRow label="Problemas identificados na sala?">
                                <YesNo value={data.problemas_sala ?? null} onChange={toggle('problemas_sala')} />
                            </FormRow>
                            {data.problemas_sala === true && (
                                <FormRow label="Descrição dos problemas" error={errors.descricao_problemas}>
                                    <DictationTextarea
                                        value={data.descricao_problemas ?? ''}
                                        onChange={(value) => setData('descricao_problemas', value)}
                                        rows={3}
                                        className={textareaCls}
                                        placeholder="Descreva os problemas…"
                                    />
                                </FormRow>
                            )}
                            <FormRow label="Equipamento, instrumental e consumíveis disponíveis e funcionantes?">
                                <YesNo value={data.equipamento_ok ?? null} onChange={toggle('equipamento_ok')} />
                            </FormRow>
                            {data.equipamento_ok === false && (
                                <FormRow label="O que não está disponível / funcionante?" error={errors.descricao_equipamento}>
                                    <DictationTextarea
                                        value={data.descricao_equipamento ?? ''}
                                        onChange={(value) => setData('descricao_equipamento', value)}
                                        rows={3}
                                        className={textareaCls}
                                        placeholder="Indique o que não está disponível…"
                                    />
                                </FormRow>
                            )}
                            <FormRow label="Mesa operatória emparelhada?">
                                <YesNo value={data.mesa_emparelhada ?? null} onChange={toggle('mesa_emparelhada')} />
                            </FormRow>
                        </SectionCard>
                    )}

                    {/* ── STEP 4: PLANO CIRÚRGICO ── */}
                    {currentStepName === 'plano' && (
                        <SectionCard icon={ListChecks} title="Plano Cirúrgico" description="Ordem e disposição dos doentes">
                            <FormRow label="Ordem de doentes mantida?">
                                <YesNo value={data.ordem_mantida ?? null} onChange={toggle('ordem_mantida')} />
                            </FormRow>
                            {data.ordem_mantida === false && (
                                <FormRow label="Alterações à ordem de doentes" error={errors.descricao_ordem}>
                                    <DictationTextarea
                                        value={data.descricao_ordem ?? ''}
                                        onChange={(value) => setData('descricao_ordem', value)}
                                        rows={3}
                                        className={textareaCls}
                                        placeholder="Descreva as alterações…"
                                    />
                                </FormRow>
                            )}
                        </SectionCard>
                    )}

                    {/* ── STEP 5: REVIEW ── */}
                    {currentStepName === 'review' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Verificação Final</h3>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Revise todos os dados antes de gravar. Clique em Gravar para confirmar.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Sala / Dia Review */}
                                <SectionCard icon={Calendar} title="Dados da Sessão" compact>
                                    <div className="grid gap-2 sm:grid-cols-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Data</p>
                                            <p className="font-medium">{new Date(data.data!).toLocaleDateString('pt-PT')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Hora</p>
                                            <p className="font-medium">{data.hora}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Especialidade</p>
                                            <p className="font-medium">{data.especialidade}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Sala</p>
                                            <p className="font-medium">{data.sala}</p>
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* Equipa Review */}
                                <SectionCard icon={Users} title="Equipa" compact>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Dotação segura?</p>
                                            <p className="font-medium">{data.equipa_segura === true ? 'Sim' : data.equipa_segura === false ? 'Não' : '—'}</p>
                                        </div>
                                        {data.alteracao_equipa === true && (
                                            <div>
                                                <p className="text-gray-500">Alterações de equipa</p>
                                                <p className="font-medium">{data.descricao_alteracao_equipa}</p>
                                            </div>
                                        )}
                                    </div>
                                </SectionCard>

                                {/* Checklist Review */}
                                <SectionCard icon={ClipboardCheck} title="Checklist" compact>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Equipamento ok?</p>
                                            <p className="font-medium">{data.equipamento_ok === true ? 'Sim' : data.equipamento_ok === false ? 'Não' : '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Mesa emparelhada?</p>
                                            <p className="font-medium">{data.mesa_emparelhada === true ? 'Sim' : data.mesa_emparelhada === false ? 'Não' : '—'}</p>
                                        </div>
                                    </div>
                                </SectionCard>
                            </div>
                        </div>
                    )}

                    {/* ── AÇÕES ── */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        {currentStep > 0 && (
                            <button
                                type="button"
                                onClick={previousStep}
                                className="flex h-12 items-center justify-center rounded-xl border border-gray-200 px-6 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                            >
                                ← Anterior
                            </button>
                        )}

                        {currentStep < steps.length - 1 ? (
                            <button
                                key="btn-next"
                                type="button"
                                onClick={nextStep}
                                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 disabled:opacity-60"
                            >
                                Próximo →
                            </button>
                        ) : (
                            <button
                                key="btn-submit"
                                type="submit"
                                disabled={processing}
                                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-green-700 disabled:opacity-60"
                            >
                                {processing ? 'A guardar…' : isEdit ? '✓ Actualizar Briefing' : '✓ Criar Briefing'}
                            </button>
                        )}

                        <Link
                            href="/briefings"
                            className="flex h-12 items-center justify-center rounded-xl border border-gray-200 px-6 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
