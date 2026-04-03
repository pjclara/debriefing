import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import type { BreadcrumbItem } from '@/types';

interface BriefingData {
    id?: number;
    data?: string;
    hora?: string;
    especialidade?: string;
    sala?: string;
    equipa_segura?: boolean;
    alteracao_equipa?: boolean;
    descricao_alteracao_equipa?: string;
    problemas_sala?: boolean;
    descricao_problemas?: string;
    equipamento_ok?: boolean;
    descricao_equipamento?: string;
    mesa_emparelhada?: boolean;
    ordem_mantida?: boolean;
    descricao_ordem?: string;
}

interface Props {
    briefing?: BriefingData;
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

function ToggleField({ label, name, checked, onCheckedChange }: {
    label: string;
    name: string;
    checked: boolean;
    onCheckedChange: (val: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 sm:col-span-2 dark:border-gray-700 dark:bg-gray-800/50">
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            <Switch name={name} checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}

// ─── component ────────────────────────────────────────────────────────────────

export default function BriefingForm({ briefing }: Props) {
    const isEdit = !!briefing?.id;

    const { data, setData, post, put, processing, errors } = useForm<BriefingData>({
        data: briefing?.data ?? '',
        hora: briefing?.hora ?? '',
        especialidade: briefing?.especialidade ?? '',
        sala: briefing?.sala ?? '',
        equipa_segura: briefing?.equipa_segura ?? false,
        alteracao_equipa: briefing?.alteracao_equipa ?? false,
        descricao_alteracao_equipa: briefing?.descricao_alteracao_equipa ?? '',
        problemas_sala: briefing?.problemas_sala ?? false,
        descricao_problemas: briefing?.descricao_problemas ?? '',
        equipamento_ok: briefing?.equipamento_ok ?? false,
        descricao_equipamento: briefing?.descricao_equipamento ?? '',
        mesa_emparelhada: briefing?.mesa_emparelhada ?? false,
        ordem_mantida: briefing?.ordem_mantida ?? true,
        descricao_ordem: briefing?.descricao_ordem ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/briefings/${briefing!.id}`) : post('/briefings');
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const key = e.target.name as keyof BriefingData;
        setData(key, e.target.value as any);
    }

    function toggle(key: keyof BriefingData) {
        return (val: boolean) => setData(key, val as any);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: isEdit ? 'Editar Briefing' : 'Novo Briefing', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Briefing' : 'Novo Briefing'} />
            <div className="mx-auto max-w-3xl p-6">
                <h1 className="mb-6 text-2xl font-bold">{isEdit ? 'Editar Briefing' : 'Novo Briefing'}</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Tabs defaultValue="sala">
                        <TabsList className="mb-2 flex-wrap">
                            <TabsTrigger value="sala">Sala / Dia</TabsTrigger>
                            <TabsTrigger value="equipa">Equipa</TabsTrigger>
                            <TabsTrigger value="checklist">Checklist</TabsTrigger>
                            <TabsTrigger value="plano">Plano Cirúrgico</TabsTrigger>
                        </TabsList>

                        {/* ── SALA / DIA ── */}
                        <TabsContent value="sala">
                            <SectionCard color="border-blue-500" title="Sala / Dia">
                                <Field label="Data" error={errors.data}>
                                    <input type="date" name="data" value={data.data} onChange={handleChange} className={inputCls} required />
                                </Field>
                                <Field label="Hora (início)" error={errors.hora}>
                                    <input type="time" name="hora" value={data.hora} onChange={handleChange} className={inputCls} required />
                                </Field>
                                <Field label="Especialidade" error={errors.especialidade}>
                                    <input type="text" name="especialidade" value={data.especialidade} onChange={handleChange} className={inputCls} required />
                                </Field>
                                <Field label="Sala" error={errors.sala}>
                                    <input type="text" name="sala" value={data.sala} onChange={handleChange} className={inputCls} required />
                                </Field>
                            </SectionCard>
                        </TabsContent>

                        {/* ── EQUIPA ── */}
                        <TabsContent value="equipa">
                            <SectionCard color="border-green-500" title="Equipa">
                                <ToggleField
                                    label="Dotação segura?"
                                    name="equipa_segura"
                                    checked={!!data.equipa_segura}
                                    onCheckedChange={toggle('equipa_segura')}
                                />
                                <ToggleField
                                    label="Alguma alteração de equipa que afecte o plano operatório?"
                                    name="alteracao_equipa"
                                    checked={!!data.alteracao_equipa}
                                    onCheckedChange={toggle('alteracao_equipa')}
                                />
                                <Field label="Descrição da alteração de equipa" error={errors.descricao_alteracao_equipa} full>
                                    <textarea
                                        name="descricao_alteracao_equipa"
                                        value={data.descricao_alteracao_equipa}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputCls}
                                    />
                                </Field>
                            </SectionCard>
                        </TabsContent>

                        {/* ── CHECKLIST SALA ── */}
                        <TabsContent value="checklist">
                            <SectionCard color="border-yellow-500" title="Checklist Sala Operatória">
                                <ToggleField
                                    label="Problemas identificados na sala?"
                                    name="problemas_sala"
                                    checked={!!data.problemas_sala}
                                    onCheckedChange={toggle('problemas_sala')}
                                />
                                <Field label="Descrição dos problemas" error={errors.descricao_problemas} full>
                                    <textarea
                                        name="descricao_problemas"
                                        value={data.descricao_problemas}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputCls}
                                    />
                                </Field>
                                <ToggleField
                                    label="Equipamento, instrumental e consumíveis disponíveis e funcionantes?"
                                    name="equipamento_ok"
                                    checked={!!data.equipamento_ok}
                                    onCheckedChange={toggle('equipamento_ok')}
                                />
                                <Field label="O que não está disponível / funcionante?" error={errors.descricao_equipamento} full>
                                    <textarea
                                        name="descricao_equipamento"
                                        value={data.descricao_equipamento}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputCls}
                                    />
                                </Field>
                                <ToggleField
                                    label="Mesa operatória emparelhada?"
                                    name="mesa_emparelhada"
                                    checked={!!data.mesa_emparelhada}
                                    onCheckedChange={toggle('mesa_emparelhada')}
                                />
                            </SectionCard>
                        </TabsContent>

                        {/* ── PLANO CIRÚRGICO ── */}
                        <TabsContent value="plano">
                            <SectionCard color="border-purple-500" title="Plano Cirúrgico">
                                <ToggleField
                                    label="Ordem de doentes mantida?"
                                    name="ordem_mantida"
                                    checked={!!data.ordem_mantida}
                                    onCheckedChange={toggle('ordem_mantida')}
                                />
                                <Field label="Alterações à ordem de doentes" error={errors.descricao_ordem} full>
                                    <textarea
                                        name="descricao_ordem"
                                        value={data.descricao_ordem}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputCls}
                                    />
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
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar' : 'Criar Briefing'}
                        </button>
                        <Link href="/briefings" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
