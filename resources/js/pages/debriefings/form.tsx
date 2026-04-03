import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FormRow, YesNo, inputCls, textareaCls } from '@/components/form-ui';
import { AlertTriangle, Wrench, Clock, MessageSquare, AlertOctagon } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface BriefingContext {
    id: number;
    data: string;
    hora: string;
    sala: string;
    especialidade: string;
}

interface Debriefing {
    id?: number;
    complicacoes?: boolean;
    descricao_complicacoes?: string;
    falha_sistema?: boolean;
    descricao_falha_sistema?: string;
    falha_solucionada?: boolean;
    falha_reportada?: boolean;
    falha_reportada_a_quem?: string;
    inicio_a_horas?: boolean;
    descricao_inicio?: string;
    fim_a_horas?: boolean;
    descricao_fim?: string;
    correu_bem?: string;
    melhorar?: string;
    falha_comunicacao?: string;
    evento_adverso?: boolean;
    descricao_evento?: string;
}

interface Props {
    briefing: BriefingContext;
    debriefing?: Debriefing | null;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function SectionTab({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
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

// ─── component ───────────────────────────────────────────────────────────────

export default function DebriefingForm({ briefing, debriefing }: Props) {
    const isEdit = !!debriefing?.id;

    const { data, setData, post, put, processing, errors } = useForm<Debriefing>({
        complicacoes: debriefing?.complicacoes ?? false,
        descricao_complicacoes: debriefing?.descricao_complicacoes ?? '',
        falha_sistema: debriefing?.falha_sistema ?? false,
        descricao_falha_sistema: debriefing?.descricao_falha_sistema ?? '',
        falha_solucionada: debriefing?.falha_solucionada ?? false,
        falha_reportada: debriefing?.falha_reportada ?? false,
        falha_reportada_a_quem: debriefing?.falha_reportada_a_quem ?? '',
        inicio_a_horas: debriefing?.inicio_a_horas ?? false,
        descricao_inicio: debriefing?.descricao_inicio ?? '',
        fim_a_horas: debriefing?.fim_a_horas ?? false,
        descricao_fim: debriefing?.descricao_fim ?? '',
        correu_bem: debriefing?.correu_bem ?? '',
        melhorar: debriefing?.melhorar ?? '',
        falha_comunicacao: debriefing?.falha_comunicacao ?? '',
        evento_adverso: debriefing?.evento_adverso ?? false,
        descricao_evento: debriefing?.descricao_evento ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/briefings/${briefing.id}/debriefing`);
        } else {
            post(`/briefings/${briefing.id}/debriefing`);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = e.target as HTMLInputElement;
        const key = target.name as keyof Debriefing;
        setData(key, (target.type === 'checkbox' ? target.checked : target.value) as any);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Briefings', href: '/briefings' },
        { title: `${briefing.data} – Sala ${briefing.sala}`, href: `/briefings/${briefing.id}` },
        { title: isEdit ? 'Editar Debriefing' : 'Registar Debriefing', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Debriefing' : 'Registar Debriefing'} />
            <div className="mx-auto max-w-4xl p-6">

                {/* Contexto do briefing */}
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                    <span className="font-semibold">Sessão:</span>{' '}
                    {briefing.data} &mdash; {briefing.hora} &middot; {briefing.especialidade} &middot; Sala {briefing.sala}
                </div>

                <h1 className="mb-6 text-2xl font-bold">
                    {isEdit ? 'Editar Debriefing' : 'Registar Debriefing'}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Tabs defaultValue="complicacoes">
                        <TabsList className="mb-2 flex-wrap">
                            <TabsTrigger value="complicacoes">Complicações</TabsTrigger>
                            <TabsTrigger value="falha">Falha Sistema</TabsTrigger>
                            <TabsTrigger value="lista">Lista Operatória</TabsTrigger>
                            <TabsTrigger value="reflexao">Reflexão</TabsTrigger>
                            <TabsTrigger value="evento">Evento Adverso</TabsTrigger>
                        </TabsList>

                        {/* ── COMPLICAÇÕES ── */}
                        <TabsContent value="complicacoes">
                            <SectionTab color="border-orange-500" title="Complicações">
                                <div className="flex flex-col gap-2 sm:col-span-2">
                                    <CheckField
                                        label="Complicações intra-operatórias?"
                                        name="complicacoes"
                                        checked={!!data.complicacoes}
                                        onChange={handleChange}
                                    />
                                </div>
                                {data.complicacoes && (
                                    <Field label="Quais as complicações?" error={errors.descricao_complicacoes} full>
                                        <textarea
                                            name="descricao_complicacoes"
                                            value={data.descricao_complicacoes}
                                            onChange={handleChange}
                                            rows={3}
                                            className={inputCls}
                                        />
                                    </Field>
                                )}
                            </SectionTab>
                        </TabsContent>

                        {/* ── FALHA DO SISTEMA ── */}
                        <TabsContent value="falha">
                            <SectionTab color="border-red-500" title="Falha do Sistema Da Vinci Xi">
                                <div className="flex flex-col gap-2 sm:col-span-2">
                                    <CheckField
                                        label="Falhas no sistema Da Vinci Xi?"
                                        name="falha_sistema"
                                        checked={!!data.falha_sistema}
                                        onChange={handleChange}
                                    />
                                </div>
                                {data.falha_sistema && (
                                    <>
                                        <Field label="Descrição da falha" error={errors.descricao_falha_sistema} full>
                                            <textarea
                                                name="descricao_falha_sistema"
                                                value={data.descricao_falha_sistema}
                                                onChange={handleChange}
                                                rows={3}
                                                className={inputCls}
                                            />
                                        </Field>
                                        <div className="flex flex-col gap-3 sm:col-span-2">
                                            <CheckField
                                                label="Falha solucionada?"
                                                name="falha_solucionada"
                                                checked={!!data.falha_solucionada}
                                                onChange={handleChange}
                                            />
                                            <CheckField
                                                label="Falha reportada?"
                                                name="falha_reportada"
                                                checked={!!data.falha_reportada}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {data.falha_reportada && (
                                            <Field label="Reportada a quem?" error={errors.falha_reportada_a_quem} full>
                                                <input
                                                    type="text"
                                                    name="falha_reportada_a_quem"
                                                    value={data.falha_reportada_a_quem}
                                                    onChange={handleChange}
                                                    className={inputCls}
                                                />
                                            </Field>
                                        )}
                                    </>
                                )}
                            </SectionTab>
                        </TabsContent>

                        {/* ── LISTA OPERATÓRIA ── */}
                        <TabsContent value="lista">
                            <SectionTab color="border-yellow-500" title="Lista Operatória">
                                <div className="flex flex-col gap-3 sm:col-span-2">
                                    <CheckField
                                        label="Iniciou a horas?"
                                        name="inicio_a_horas"
                                        checked={!!data.inicio_a_horas}
                                        onChange={handleChange}
                                    />
                                </div>
                                {!data.inicio_a_horas && (
                                    <Field label="Motivo do atraso no início" error={errors.descricao_inicio} full>
                                        <textarea
                                            name="descricao_inicio"
                                            value={data.descricao_inicio}
                                            onChange={handleChange}
                                            rows={2}
                                            className={inputCls}
                                        />
                                    </Field>
                                )}
                                <div className="flex flex-col gap-3 sm:col-span-2">
                                    <CheckField
                                        label="Finalizou a horas?"
                                        name="fim_a_horas"
                                        checked={!!data.fim_a_horas}
                                        onChange={handleChange}
                                    />
                                </div>
                                {!data.fim_a_horas && (
                                    <Field label="Motivo do atraso no fim" error={errors.descricao_fim} full>
                                        <textarea
                                            name="descricao_fim"
                                            value={data.descricao_fim}
                                            onChange={handleChange}
                                            rows={2}
                                            className={inputCls}
                                        />
                                    </Field>
                                )}
                            </SectionTab>
                        </TabsContent>

                        {/* ── REFLEXÃO ── */}
                        <TabsContent value="reflexao">
                            <SectionTab color="border-green-500" title="Reflexão da Sessão">
                                <Field label="O que correu bem?" error={errors.correu_bem} full>
                                    <textarea
                                        name="correu_bem"
                                        value={data.correu_bem}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputCls}
                                        placeholder="Descreva o que correu bem nesta sessão…"
                                    />
                                </Field>
                                <Field label="O que podia ser melhorado?" error={errors.melhorar} full>
                                    <textarea
                                        name="melhorar"
                                        value={data.melhorar}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputCls}
                                        placeholder="Sugestões de melhoria…"
                                    />
                                </Field>
                                <Field
                                    label="Falha de comunicação ou preocupação relativa à segurança do doente?"
                                    error={errors.falha_comunicacao}
                                    full
                                >
                                    <textarea
                                        name="falha_comunicacao"
                                        value={data.falha_comunicacao}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputCls}
                                    />
                                </Field>
                            </SectionTab>
                        </TabsContent>

                        {/* ── EVENTO ADVERSO ── */}
                        <TabsContent value="evento">
                            <SectionTab color="border-pink-600" title="Evento Adverso">
                                <div className="flex flex-col gap-2 sm:col-span-2">
                                    <CheckField
                                        label="Incidente / evento adverso que precise de ser notificado?"
                                        name="evento_adverso"
                                        checked={!!data.evento_adverso}
                                        onChange={handleChange}
                                    />
                                </div>
                                {data.evento_adverso && (
                                    <Field label="Descrição do evento adverso" error={errors.descricao_evento} full>
                                        <textarea
                                            name="descricao_evento"
                                            value={data.descricao_evento}
                                            onChange={handleChange}
                                            rows={3}
                                            className={inputCls}
                                        />
                                    </Field>
                                )}
                            </SectionTab>
                        </TabsContent>
                    </Tabs>

                    {/* ── AÇÕES ── */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar Debriefing' : 'Registar Debriefing'}
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
