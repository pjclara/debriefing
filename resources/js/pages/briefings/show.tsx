import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

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

export default function BriefingShow({ briefing, flash }: Props) {
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
                                        </div>
                                    </div>
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
