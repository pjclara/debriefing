import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    CalendarDays,
    Stethoscope,
    FileWarning,
    Clock,
    Cpu,
    MonitorPlay,
} from 'lucide-react';

interface Stats {
    briefingsTotal: number;
    briefingsMes: number;
    cirurgiasTotal: number;
    cirurgiasMes: number;
    debriefsEmFalta: number;
    complicacoesMes: number;
    eventosAdversosMes: number;
}

interface CirurgiasPorDepartamento {
    departamento: string;
    total: number;
}

interface TopGasto {
    id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
    total_quantidade: number;
    total_usos: number;
}

interface TaxaMensal {
    mes: string;
    total: number;
    complicacoes: number;
    eventos_adversos: number;
}

interface TemposGlobais {
    prep_media: number | null;
    docking_media: number | null;
    consola_media: number | null;
}

interface TempoPorProcedimento {
    procedimento: string;
    total: number;
    prep_media: number | null;
    docking_media: number | null;
    consola_media: number | null;
}

interface Props {
    stats: Stats;
    cirurgiasPorDepartamento: CirurgiasPorDepartamento[];
    topGastos: TopGasto[];
    taxaMensal: TaxaMensal[];
    temposGlobais: TemposGlobais;
    temposPorProcedimento: TempoPorProcedimento[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Estatísticas', href: '/estatisticas' },
];

function formatMinutos(min: number | null) {
    if (min === null) return '—';
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function formatMesLabel(mes: string) {
    const [ano, mesNum] = mes.split('-');
    return new Date(Number(ano), Number(mesNum) - 1, 1).toLocaleDateString('pt-PT', {
        month: 'short',
        year: '2-digit',
    });
}

function KpiCard({
    label,
    value,
    sub,
    icon: Icon,
    color,
    warn,
}: {
    label: string;
    value: number;
    sub?: string;
    icon: React.ElementType;
    color: string;
    warn?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-gray-900 ${
                warn && value > 0
                    ? 'border-red-200 dark:border-red-800'
                    : 'border-gray-200 dark:border-gray-700'
            }`}
        >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
                {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
            </div>
        </div>
    );
}

function TempoCard({ label, value, icon: Icon, color }: { label: string; value: number | null; icon: React.ElementType; color: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-4 w-4 text-white" />
            </span>
            <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMinutos(value)}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
}

export default function Estatisticas({
    stats,
    cirurgiasPorDepartamento,
    topGastos,
    taxaMensal,
    temposGlobais,
    temposPorProcedimento,
}: Props) {
    const mesLabel = new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estatísticas" />

            <div className="w-full px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Estatísticas
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Dados agregados, sem informação identificativa de doentes.
                    </p>
                </div>

                {/* ── KPIs ── */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <KpiCard label="Briefings total" value={stats.briefingsTotal} icon={CalendarDays} color="bg-blue-500" />
                    <KpiCard label="Briefings este mês" value={stats.briefingsMes} sub={mesLabel} icon={CalendarDays} color="bg-indigo-500" />
                    <KpiCard label="Cirurgias total" value={stats.cirurgiasTotal} icon={Stethoscope} color="bg-violet-500" />
                    <KpiCard label="Cirurgias este mês" value={stats.cirurgiasMes} sub={mesLabel} icon={Stethoscope} color="bg-violet-500" />
                    <KpiCard
                        label="Debriefings em falta"
                        value={stats.debriefsEmFalta}
                        sub="sessões passadas sem debriefing"
                        icon={FileWarning}
                        color={stats.debriefsEmFalta > 0 ? 'bg-amber-500' : 'bg-gray-400'}
                        warn
                    />
                    <KpiCard
                        label="Complicações este mês"
                        value={stats.complicacoesMes}
                        sub={mesLabel}
                        icon={FileWarning}
                        color={stats.complicacoesMes > 0 ? 'bg-orange-500' : 'bg-gray-400'}
                        warn
                    />
                </div>

                {/* ── Tempos médios de cirurgia ── */}
                <section className="mb-8">
                    <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Tempos médios de cirurgia
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <TempoCard label="Preparação" value={temposGlobais.prep_media} icon={Clock} color="bg-teal-500" />
                        <TempoCard label="Docking" value={temposGlobais.docking_media} icon={Cpu} color="bg-cyan-500" />
                        <TempoCard label="Consola" value={temposGlobais.consola_media} icon={MonitorPlay} color="bg-sky-500" />
                    </div>
                </section>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* ── Cirurgias por departamento ── */}
                    <section>
                        <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Cirurgias por departamento
                        </h2>
                        {cirurgiasPorDepartamento.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300/70 bg-gray-50/50 p-6 text-center text-sm text-gray-500 dark:bg-gray-800/30">
                                Sem dados disponíveis.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                {(() => {
                                    const max = cirurgiasPorDepartamento[0].total;
                                    return cirurgiasPorDepartamento.map((item, i) => (
                                        <div
                                            key={item.departamento}
                                            className={`flex items-center gap-4 px-5 py-3 ${
                                                i < cirurgiasPorDepartamento.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                                            }`}
                                        >
                                            <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-400">{i + 1}</span>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center justify-between gap-2">
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.departamento}</p>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{item.total}</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                    <div
                                                        className="h-full rounded-full bg-blue-500 opacity-70"
                                                        style={{ width: `${Math.round((item.total / max) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}
                    </section>

                    {/* ── Taxa de complicações / eventos adversos (6 meses) ── */}
                    <section>
                        <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Complicações e eventos adversos (últimos 6 meses)
                        </h2>
                        {taxaMensal.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300/70 bg-gray-50/50 p-6 text-center text-sm text-gray-500 dark:bg-gray-800/30">
                                Sem dados disponíveis.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-gray-100 dark:border-gray-800">
                                        <tr className="text-xs text-gray-500 dark:text-gray-400">
                                            <th className="px-5 py-2.5 text-left font-medium">Mês</th>
                                            <th className="px-5 py-2.5 text-right font-medium">Debriefings</th>
                                            <th className="px-5 py-2.5 text-right font-medium">Complicações</th>
                                            <th className="px-5 py-2.5 text-right font-medium">Eventos adversos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {taxaMensal.map((row, i) => (
                                            <tr
                                                key={row.mes}
                                                className={i < taxaMensal.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}
                                            >
                                                <td className="px-5 py-2.5 font-medium text-gray-900 capitalize dark:text-white">
                                                    {formatMesLabel(row.mes)}
                                                </td>
                                                <td className="px-5 py-2.5 text-right text-gray-600 dark:text-gray-300">{row.total}</td>
                                                <td className="px-5 py-2.5 text-right">
                                                    <span className={row.complicacoes > 0 ? 'font-semibold text-orange-600 dark:text-orange-400' : 'text-gray-400'}>
                                                        {row.complicacoes}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-2.5 text-right">
                                                    <span className={row.eventos_adversos > 0 ? 'font-semibold text-red-600 dark:text-red-400' : 'text-gray-400'}>
                                                        {row.eventos_adversos}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                {/* ── Tempos médios por procedimento ── */}
                {temposPorProcedimento.length > 0 && (
                    <section className="mt-8">
                        <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Tempos médios por procedimento (top 8 por volume)
                        </h2>
                        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                            <table className="w-full text-sm">
                                <thead className="border-b border-gray-100 dark:border-gray-800">
                                    <tr className="text-xs text-gray-500 dark:text-gray-400">
                                        <th className="px-5 py-2.5 text-left font-medium">Procedimento</th>
                                        <th className="px-5 py-2.5 text-right font-medium">Cirurgias</th>
                                        <th className="px-5 py-2.5 text-right font-medium">Preparação</th>
                                        <th className="px-5 py-2.5 text-right font-medium">Docking</th>
                                        <th className="px-5 py-2.5 text-right font-medium">Consola</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {temposPorProcedimento.map((row, i) => (
                                        <tr
                                            key={row.procedimento}
                                            className={i < temposPorProcedimento.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}
                                        >
                                            <td className="max-w-xs truncate px-5 py-2.5 font-medium text-gray-900 dark:text-white">
                                                {row.procedimento}
                                            </td>
                                            <td className="px-5 py-2.5 text-right text-gray-600 dark:text-gray-300">{row.total}</td>
                                            <td className="px-5 py-2.5 text-right text-gray-600 dark:text-gray-300">{formatMinutos(row.prep_media)}</td>
                                            <td className="px-5 py-2.5 text-right text-gray-600 dark:text-gray-300">{formatMinutos(row.docking_media)}</td>
                                            <td className="px-5 py-2.5 text-right text-gray-600 dark:text-gray-300">{formatMinutos(row.consola_media)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* ── Top consumíveis gastos ── */}
                {topGastos.length > 0 && (
                    <section className="mt-8">
                        <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Top consumíveis gastos
                        </h2>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                            {(() => {
                                const max = topGastos[0]?.total_quantidade ?? 1;
                                const catLabel: Record<string, string> = {
                                    robotico_vidas: 'Robótico (vidas)',
                                    robotico_descartavel: 'Robótico descartável',
                                    extra: 'Extra',
                                };
                                const catColor: Record<string, string> = {
                                    robotico_vidas: 'bg-violet-500',
                                    robotico_descartavel: 'bg-blue-500',
                                    extra: 'bg-teal-500',
                                };
                                return topGastos.map((g, i) => (
                                    <div
                                        key={g.id}
                                        className={`flex items-center gap-4 px-5 py-3 ${i < topGastos.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
                                    >
                                        <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-400">{i + 1}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{g.nome}</p>
                                                <div className="flex shrink-0 items-center gap-3">
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${catColor[g.categoria] ?? 'bg-gray-400'}`}>
                                                        {catLabel[g.categoria] ?? g.categoria}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{g.total_quantidade}</span>
                                                    <span className="text-xs text-gray-400">
                                                        ({g.total_usos} uso{g.total_usos !== 1 ? 's' : ''})
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div
                                                    className={`h-full rounded-full ${catColor[g.categoria] ?? 'bg-gray-400'} opacity-70`}
                                                    style={{ width: `${Math.round((g.total_quantidade / max) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
