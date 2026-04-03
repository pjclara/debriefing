import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Surgery {
    id: number;
    processo: string;
    procedimento: string;
    destino: string;
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
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                value
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}
        >
            {value ? 'Sim' : 'Não'}
        </span>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 border-b border-gray-100 py-2 last:border-0 dark:border-gray-700">
            <span className="w-72 shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-sm font-medium">{children}</span>
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
        { title: `${formatDate(briefing.data)} – Sala ${briefing.sala}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Briefing ${formatDate(briefing.data)}`} />
            <div className="mx-auto max-w-4xl p-6">

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                {/* Cabeçalho */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {formatDate(briefing.data)} &mdash; {briefing.hora}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {briefing.especialidade} &middot; Sala {briefing.sala}
                        </p>
                    </div>
                    <Link
                        href={`/briefings/${briefing.id}/edit`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Editar briefing
                    </Link>
                </div>

                {/* Checklist da sala */}
                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Checklist da Sala
                    </h2>
                    <Row label="Dotação segura"><Badge value={briefing.equipa_segura} /></Row>
                    <Row label="Alteração de equipa"><Badge value={briefing.alteracao_equipa} /></Row>
                    {briefing.descricao_alteracao_equipa && (
                        <Row label="Descrição da alteração de equipa">{briefing.descricao_alteracao_equipa}</Row>
                    )}
                    <Row label="Problemas identificados na sala"><Badge value={briefing.problemas_sala} /></Row>
                    {briefing.descricao_problemas && (
                        <Row label="Descrição dos problemas">{briefing.descricao_problemas}</Row>
                    )}
                    <Row label="Equipamento, instrumental e consumíveis OK"><Badge value={briefing.equipamento_ok} /></Row>
                    {briefing.descricao_equipamento && (
                        <Row label="Problemas de equipamento">{briefing.descricao_equipamento}</Row>
                    )}
                    <Row label="Mesa operatória emparelhada"><Badge value={briefing.mesa_emparelhada} /></Row>
                    <Row label="Ordem de doentes mantida"><Badge value={briefing.ordem_mantida} /></Row>
                    {briefing.descricao_ordem && (
                        <Row label="Alterações à ordem">{briefing.descricao_ordem}</Row>
                    )}
                </div>

                {/* Cirurgias */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Cirurgias ({briefing.surgeries.length})
                    </h2>
                    <Link
                        href={`/briefings/${briefing.id}/surgeries/create`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Adicionar Cirurgia
                    </Link>
                </div>

                {briefing.surgeries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                        Nenhuma cirurgia adicionada ainda.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Processo', 'Procedimento', 'Destino', ''].map((h) => (                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {briefing.surgeries.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm">{s.processo}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{s.procedimento}</td>
                                        <td className="px-4 py-3 text-sm">{s.destino}</td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <Link
                                                href={`/surgeries/${s.id}/consumos`}
                                                className="mr-3 text-purple-600 hover:underline"
                                            >
                                                Consumos
                                            </Link>
                                            <Link
                                                href={`/surgeries/${s.id}/edit`}
                                                className="mr-3 text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => confirmDeleteSurgery(s.id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Debriefing */}
                <div className="mt-8">
                    <h2 className="mb-3 text-lg font-semibold">Debriefing</h2>
                    {briefing.debriefing ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                    ✓ Debriefing registado
                                </span>
                                <Link
                                    href={`/briefings/${briefing.id}/debriefing/edit`}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Editar Debriefing
                                </Link>
                            </div>
                            <Row label="Complicações intra-operatórias"><Badge value={briefing.debriefing.complicacoes} /></Row>
                            <Row label="Falha no sistema Da Vinci Xi"><Badge value={briefing.debriefing.falha_sistema} /></Row>
                            <Row label="Lista operatória – Iniciou a horas"><Badge value={briefing.debriefing.inicio_a_horas} /></Row>
                            <Row label="Lista operatória – Finalizou a horas"><Badge value={briefing.debriefing.fim_a_horas} /></Row>
                            <Row label="Evento adverso notificado"><Badge value={briefing.debriefing.evento_adverso} /></Row>
                            {briefing.debriefing.correu_bem && (
                                <Row label="O que correu bem">{briefing.debriefing.correu_bem}</Row>
                            )}
                            {briefing.debriefing.melhorar && (
                                <Row label="O que podia ser melhorado">{briefing.debriefing.melhorar}</Row>
                            )}
                            {briefing.debriefing.falha_comunicacao && (
                                <Row label="Falha de comunicação">{briefing.debriefing.falha_comunicacao}</Row>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                            <p className="text-sm">O debriefing desta sessão ainda não foi registado.</p>
                            <Link
                                href={`/briefings/${briefing.id}/debriefing/create`}
                                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Registar Debriefing
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
