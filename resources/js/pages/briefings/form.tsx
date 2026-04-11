import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SectionCard, FormRow, YesNo, inputCls, textareaCls } from '@/components/form-ui';
import { Calendar, Users, ClipboardCheck, ListChecks } from 'lucide-react';
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

interface Department {
    id: number;
    nome: string;
}

interface Props {
    briefing?: BriefingData;
    departments: Department[];
}

// ─── component ────────────────────────────────────────────────────────────────

export default function BriefingForm({ briefing, departments }: Props) {
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
        setData(e.target.name as keyof BriefingData, e.target.value as any);
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
            <div className="mx-auto max-w-2xl px-4 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {isEdit ? 'Editar Briefing' : 'Novo Briefing'}
                    </h1>
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                        Preencha todos os campos antes de iniciar a sessão cirúrgica.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Tabs defaultValue="sala">
                        <TabsList className="w-full">
                            <TabsTrigger value="sala" className="flex-1">Sala / Dia</TabsTrigger>
                            <TabsTrigger value="equipa" className="flex-1">Equipa</TabsTrigger>
                            <TabsTrigger value="checklist" className="flex-1">Checklist</TabsTrigger>
                            <TabsTrigger value="plano" className="flex-1">Plano</TabsTrigger>
                        </TabsList>

                        {/* ── SALA / DIA ── */}
                        <TabsContent value="sala">
                            <SectionCard icon={Calendar} title="Dados da Sessão" description="Data, hora e localização">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormRow label="Data" error={errors.data}>
                                        <input type="date" name="data" value={data.data} onChange={handleChange} className={inputCls} required />
                                    </FormRow>
                                    <FormRow label="Hora de início" error={errors.hora}>
                                        <input type="time" name="hora" value={data.hora} onChange={handleChange} className={inputCls} required />
                                    </FormRow>
                                    <FormRow label="Especialidade" error={errors.especialidade}>
                                        <select name="especialidade" value={data.especialidade} onChange={handleChange} className={inputCls} required>
                                            <option value="">Selecione um departamento…</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.nome}>
                                                    {dept.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </FormRow>
                                    <FormRow label="Sala" error={errors.sala}>
                                        <input type="text" name="sala" value={data.sala} onChange={handleChange} className={inputCls} placeholder="ex: Sala 3" required />
                                    </FormRow>
                                </div>
                            </SectionCard>
                        </TabsContent>

                        {/* ── EQUIPA ── */}
                        <TabsContent value="equipa">
                            <SectionCard icon={Users} title="Equipa" description="Constituição e alterações de equipa">
                                <FormRow label="Dotação segura?">
                                    <YesNo value={!!data.equipa_segura} onChange={toggle('equipa_segura')} />
                                </FormRow>
                                <FormRow label="Alguma alteração de equipa que afecte o plano operatório?">
                                    <YesNo value={!!data.alteracao_equipa} onChange={toggle('alteracao_equipa')} />
                                </FormRow>
                                <FormRow label="Descrição da alteração de equipa" error={errors.descricao_alteracao_equipa}>
                                    <textarea name="descricao_alteracao_equipa" value={data.descricao_alteracao_equipa} onChange={handleChange} rows={3} className={textareaCls} placeholder="Descreva se aplicável…" />
                                </FormRow>
                            </SectionCard>
                        </TabsContent>

                        {/* ── CHECKLIST SALA ── */}
                        <TabsContent value="checklist">
                            <SectionCard icon={ClipboardCheck} title="Checklist da Sala" description="Verificação pré-operatória">
                                <FormRow label="Problemas identificados na sala?">
                                    <YesNo value={!!data.problemas_sala} onChange={toggle('problemas_sala')} />
                                </FormRow>
                                <FormRow label="Descrição dos problemas" error={errors.descricao_problemas}>
                                    <textarea name="descricao_problemas" value={data.descricao_problemas} onChange={handleChange} rows={3} className={textareaCls} placeholder="Descreva se aplicável…" />
                                </FormRow>
                                <FormRow label="Equipamento, instrumental e consumíveis disponíveis e funcionantes?">
                                    <YesNo value={!!data.equipamento_ok} onChange={toggle('equipamento_ok')} />
                                </FormRow>
                                <FormRow label="O que não está disponível / funcionante?" error={errors.descricao_equipamento}>
                                    <textarea name="descricao_equipamento" value={data.descricao_equipamento} onChange={handleChange} rows={3} className={textareaCls} placeholder="Indique o equipamento em falta ou avariado…" />
                                </FormRow>
                                <FormRow label="Mesa operatória emparelhada?">
                                    <YesNo value={!!data.mesa_emparelhada} onChange={toggle('mesa_emparelhada')} />
                                </FormRow>
                            </SectionCard>
                        </TabsContent>

                        {/* ── PLANO CIRÚRGICO ── */}
                        <TabsContent value="plano">
                            <SectionCard icon={ListChecks} title="Plano Cirúrgico" description="Ordem e disposição dos doentes">
                                <FormRow label="Ordem de doentes mantida?">
                                    <YesNo value={!!data.ordem_mantida} onChange={toggle('ordem_mantida')} />
                                </FormRow>
                                <FormRow label="Alterações à ordem de doentes" error={errors.descricao_ordem}>
                                    <textarea name="descricao_ordem" value={data.descricao_ordem} onChange={handleChange} rows={3} className={textareaCls} placeholder="Descreva as alterações se aplicável…" />
                                </FormRow>
                            </SectionCard>
                        </TabsContent>
                    </Tabs>

                    {/* ── AÇÕES ── */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar Briefing' : 'Criar Briefing'}
                        </button>
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
