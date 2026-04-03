import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { BreadcrumbItem } from '@/types';

interface BriefingContext {
    id: number;
    data: string;
    hora: string;
    sala: string;
    especialidade: string;
}

interface Surgery {
    id?: number;
    processo?: string;
    procedimento?: string;
    destino?: string;
    antecedentes_relevantes?: boolean;
    descricao_antecedentes?: string;
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
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function SectionCard({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
    return (
        <div className={`rounded-xl border-l-4 ${color} bg-white p-6 shadow-sm dark:bg-gray-900`}>
            <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">
                {title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">{children}</div>
        </div>
    );
}

function Field({ label, error, children, full }: { label: string; error?: string; children: React.ReactNode; full?: boolean }) {
    return (
        <div className={full ? 'sm:col-span-2' : ''}>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

const inputCls =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

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

export default function SurgeryForm({ briefing, surgery }: Props) {
    const isEdit = !!surgery?.id;

    const { data, setData, post, put, processing, errors } = useForm<Surgery>({
        processo: surgery?.processo ?? '',
        procedimento: surgery?.procedimento ?? '',
        destino: surgery?.destino ?? '',

        antecedentes_relevantes: surgery?.antecedentes_relevantes ?? false,
        descricao_antecedentes: surgery?.descricao_antecedentes ?? '',

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
                                    <input type="text" name="procedimento" value={data.procedimento} onChange={handleChange} className={inputCls} required />
                                </Field>
                                <Field label="Destino" error={errors.destino}>
                                    <input type="text" name="destino" value={data.destino} onChange={handleChange} className={inputCls} required />
                                </Field>
                                <div className="flex flex-col gap-3 sm:col-span-2">
                                    <CheckField
                                        label="Antecedentes de relevo / comorbidades / variações técnicas / passos críticos identificados?"
                                        name="antecedentes_relevantes"
                                        checked={!!data.antecedentes_relevantes}
                                        onChange={handleChange}
                                    />
                                </div>
                                {data.antecedentes_relevantes && (
                                    <Field label="Descrição" error={errors.descricao_antecedentes} full>
                                        <textarea
                                            name="descricao_antecedentes"
                                            value={data.descricao_antecedentes}
                                            onChange={handleChange}
                                            rows={3}
                                            className={inputCls}
                                        />
                                    </Field>
                                )}
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
