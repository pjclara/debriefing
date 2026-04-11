import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SectionCard, FormRow, YesNo, inputCls, selectCls, textareaCls } from '@/components/form-ui';
import { User, FileText, Cpu } from 'lucide-react';
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
    hora_prep_inicio?: number | string;
    min_prep_inicio?: number | string;
    hora_prep_fim?: number | string;
    min_prep_fim?: number | string;
    docking?: number | string;
    hora_consola_inicio?: number | string;
    min_consola_inicio?: number | string;
    hora_consola_fim?: number | string;
    min_consola_fim?: number | string;
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
    monopolar_coag?: string;
    monopolar_cut?: string;
    bipolar_coag?: string;
    b1?: string;
    b2?: string;
    b3?: string;
    b4?: string;
    equipamento_extra?: string;
}

interface Props {
    briefing: BriefingContext;
    surgery?: Surgery;
    procedures: Procedure[];
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, children, full }: { label: string; error?: string; children: React.ReactNode; full?: boolean }) {
    return (
        <div className={full ? 'sm:col-span-2' : ''}>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function CheckField({ label, name, checked, onChange }: {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {label}
        </label>
    );
}

// ─── component ────────────────────────────────────────────────────────────────

export default function SurgeryForm({ briefing, surgery, procedures }: Props) {
    const isEdit = !!surgery?.id;

    const { data, setData, post, put, processing, errors } = useForm<Surgery>({
        processo: surgery?.processo ?? '',
        procedimento: surgery?.procedimento ?? '',
        destino: surgery?.destino ?? '',

        hora_prep_inicio: surgery?.hora_prep_inicio ?? '',
        min_prep_inicio: surgery?.min_prep_inicio ?? '',
        hora_prep_fim: surgery?.hora_prep_fim ?? '',
        min_prep_fim: surgery?.min_prep_fim ?? '',
        docking: surgery?.docking ?? '',
        hora_consola_inicio: surgery?.hora_consola_inicio ?? '',
        min_consola_inicio: surgery?.min_consola_inicio ?? '',
        hora_consola_fim: surgery?.hora_consola_fim ?? '',
        min_consola_fim: surgery?.min_consola_fim ?? '',

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
        monopolar_coag: surgery?.monopolar_coag ?? '',
        monopolar_cut: surgery?.monopolar_cut ?? '',
        bipolar_coag: surgery?.bipolar_coag ?? '',
        b1: surgery?.b1 ?? '',
        b2: surgery?.b2 ?? '',
        b3: surgery?.b3 ?? '',
        b4: surgery?.b4 ?? '',
        equipamento_extra: surgery?.equipamento_extra ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/surgeries/${surgery!.id}`);
        } else {
            post(`/briefings/${briefing.id}/surgeries`);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = e.target as HTMLInputElement;
        const key = target.name as keyof Surgery;
        setData(key, (target.type === 'checkbox' ? target.checked : target.value) as any);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: `${briefing.data} – Sala ${briefing.sala}`, href: `/briefings/${briefing.id}` },
        { title: isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia'} />
            <div className="mx-auto max-w-4xl p-6">

                {/* Contexto do briefing */}
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                    <span className="font-semibold">Briefing:</span>{' '}
                    {briefing.data} &mdash; {briefing.hora} &middot; {briefing.especialidade} &middot; Sala {briefing.sala}
                </div>

                <h1 className="mb-6 text-2xl font-bold">{isEdit ? 'Editar Cirurgia' : 'Nova Cirurgia'}</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Tabs defaultValue="identificacao">
                        <TabsList className="mb-2 flex-wrap">
                            <TabsTrigger value="identificacao">Identificação</TabsTrigger>
                            <TabsTrigger value="tempos">Tempos</TabsTrigger>
                            <TabsTrigger value="planeamento">Planeamento</TabsTrigger>
                            <TabsTrigger value="robotico">Robótico</TabsTrigger>
                        </TabsList>

                        {/* ── IDENTIFICAÇÃO DO DOENTE ── */}
                        <TabsContent value="identificacao">
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
                                    <input type="text" name="destino" value={data.destino} onChange={handleChange} className={inputCls} required />
                                </Field>

                                {/* ── 4 campos clínicos ── */}
                                {(
                                    [
                                        { flag: 'antecedentes_relevantes', desc: 'descricao_antecedentes',  label: 'Antecedentes de relevo' },
                                        { flag: 'comorbidades',            desc: 'descricao_comorbidades', label: 'Comorbidades' },
                                        { flag: 'variacoes_tecnicas',      desc: 'descricao_variacoes',    label: 'Variações técnicas' },
                                        { flag: 'passos_criticos',         desc: 'descricao_passos',       label: 'Passos críticos identificados' },
                                    ] as const
                                ).map(({ flag, desc, label }) => (
                                    <div key={flag} className="flex flex-col gap-2 sm:col-span-2 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
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
                                                placeholder="Descreva..."
                                                className={inputCls}
                                            />
                                        )}
                                    </div>
                                ))}
                            </SectionCard>
                        </TabsContent>

                        {/* ── TEMPOS ── */}
                        <TabsContent value="tempos">
                            <SectionCard color="border-green-500" title="Tempos Cirúrgicos">
                                <div className="mb-4 flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                                    <span className="font-semibold">Preenchimento de Horários em horas e minutos</span>
                                </div>

                                {/* Início de preparação */}
                                <div className="mb-6 rounded-lg border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-900/10">
                                    <label className="mb-3 block text-sm font-semibold text-orange-900 dark:text-orange-200">Início de Preparação</label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <Field label="Hora (0-23)" error={errors.hora_prep_inicio}>
                                            <input type="number" name="hora_prep_inicio" value={data.hora_prep_inicio as string} onChange={handleChange} min={0} max={23} className={inputCls} />
                                        </Field>
                                        <Field label="Minuto (0-59)" error={errors.min_prep_inicio}>
                                            <input type="number" name="min_prep_inicio" value={data.min_prep_inicio as string} onChange={handleChange} min={0} max={59} className={inputCls} />
                                        </Field>
                                    </div>
                                </div>

                                {/* Fim de preparação */}
                                <div className="mb-6 rounded-lg border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-900/10">
                                    <label className="mb-3 block text-sm font-semibold text-orange-900 dark:text-orange-200">Fim de Preparação</label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <Field label="Hora (0-23)" error={errors.hora_prep_fim}>
                                            <input type="number" name="hora_prep_fim" value={data.hora_prep_fim as string} onChange={handleChange} min={0} max={23} className={inputCls} />
                                        </Field>
                                        <Field label="Minuto (0-59)" error={errors.min_prep_fim}>
                                            <input type="number" name="min_prep_fim" value={data.min_prep_fim as string} onChange={handleChange} min={0} max={59} className={inputCls} />
                                        </Field>
                                    </div>
                                </div>

                                {/* Docking */}
                                <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-900/10">
                                    <Field label="Docking (Minutos)" error={errors.docking} full>
                                        <input type="number" name="docking" value={data.docking as string} onChange={handleChange} min={0} className={inputCls} placeholder="Tempo de preparação em minutos" />
                                    </Field>
                                </div>

                                {/* Início da consola */}
                                <div className="mb-6 rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900 dark:bg-purple-900/10">
                                    <label className="mb-3 block text-sm font-semibold text-purple-900 dark:text-purple-200">Início da Consola</label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <Field label="Hora (0-23)" error={errors.hora_consola_inicio}>
                                            <input type="number" name="hora_consola_inicio" value={data.hora_consola_inicio as string} onChange={handleChange} min={0} max={23} className={inputCls} />
                                        </Field>
                                        <Field label="Minuto (0-59)" error={errors.min_consola_inicio}>
                                            <input type="number" name="min_consola_inicio" value={data.min_consola_inicio as string} onChange={handleChange} min={0} max={59} className={inputCls} />
                                        </Field>
                                    </div>
                                </div>

                                {/* Fim da consola */}
                                <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900 dark:bg-purple-900/10">
                                    <label className="mb-3 block text-sm font-semibold text-purple-900 dark:text-purple-200">Fim da Consola</label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <Field label="Hora (0-23)" error={errors.hora_consola_fim}>
                                            <input type="number" name="hora_consola_fim" value={data.hora_consola_fim as string} onChange={handleChange} min={0} max={23} className={inputCls} />
                                        </Field>
                                        <Field label="Minuto (0-59)" error={errors.min_consola_fim}>
                                            <input type="number" name="min_consola_fim" value={data.min_consola_fim as string} onChange={handleChange} min={0} max={59} className={inputCls} />
                                        </Field>
                                    </div>
                                </div>
                            </SectionCard>
                        </TabsContent>

                        {/* ── PLANEAMENTO ── */}
                        <TabsContent value="planeamento">
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
                                <div className="flex flex-col gap-3 sm:col-span-2">
                                    <CheckField label="Consentimento obtido" name="consentimento" checked={!!data.consentimento} onChange={handleChange} />
                                    <CheckField label="Medicação suspensa" name="medicacao_suspensa" checked={!!data.medicacao_suspensa} onChange={handleChange} />
                                    <CheckField label="Profilaxia" name="profilaxia" checked={!!data.profilaxia} onChange={handleChange} />
                                    <CheckField label="Reserva activa" name="reserva_ativa" checked={!!data.reserva_ativa} onChange={handleChange} />
                                </div>
                                <Field label="Antibiótico" error={errors.antibiotico} full>
                                    <input type="text" name="antibiotico" value={data.antibiotico} onChange={handleChange} className={inputCls} placeholder="Deixar vazio se não aplicável" />
                                </Field>
                            </SectionCard>
                        </TabsContent>

                        {/* ── ROBÓTICO ── */}
                        <TabsContent value="robotico">
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
                                <Field label="Monopolar Coag" error={errors.monopolar_coag}>
                                    <input type="text" name="monopolar_coag" value={data.monopolar_coag} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="Monopolar Cut" error={errors.monopolar_cut}>
                                    <input type="text" name="monopolar_cut" value={data.monopolar_cut} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="Bipolar Coag" error={errors.bipolar_coag}>
                                    <input type="text" name="bipolar_coag" value={data.bipolar_coag} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="B1" error={errors.b1}>
                                    <input type="text" name="b1" value={data.b1} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="B2" error={errors.b2}>
                                    <input type="text" name="b2" value={data.b2} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="B3" error={errors.b3}>
                                    <input type="text" name="b3" value={data.b3} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="B4" error={errors.b4}>
                                    <input type="text" name="b4" value={data.b4} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="Equipamento extra" error={errors.equipamento_extra} full>
                                    <textarea name="equipamento_extra" value={data.equipamento_extra} onChange={handleChange} rows={3} className={inputCls} />
                                </Field>
                            </SectionCard>
                        </TabsContent>
                    </Tabs>

                    {/* ── AÇÕES ── */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar' : 'Adicionar Cirurgia'}
                        </button>
                        <Link href={`/briefings/${briefing.id}`} className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
