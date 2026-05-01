import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    CalendarDays,
    Stethoscope,
    ClipboardList,
    AlertTriangle,
    AlertOctagon,
    FileWarning,
    ChevronRight,
    PackageOpen,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';

interface RecentBriefing {
    id: number;
    data: string;
    hora: string;
    especialidade: string;
    sala: string;
    surgeries_count: number;
    debriefing: {
        id: number;
        complicacoes: boolean;
        evento_adverso: boolean;
    } | null;
}

interface Stats {
    briefingsTotal: number;
    briefingsSemana: number;
    briefingsMes: number;
    cirurgiasTotal: number;
    cirurgiasSemana: number;
    cirurgiasMes: number;
    debriefsEmFalta: number;
    complicacoesMes: number;
    eventosAdversosMes: number;
}

interface StockStats {
    total: number;
    mes: number;
    semana: number;
    entradaMes: number;
    saidaMes: number;
}

interface TopGasto {
    id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
    total_quantidade: number;
    total_usos: number;
}

interface Props {
    stats: Stats;
    stock: StockStats;
    recentBriefings: RecentBriefing[];
    proximosBriefings: RecentBriefing[];
    topGastos: TopGasto[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

function formatDate(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
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
            <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
            >
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {label}
                </p>
                {sub && (
                    <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({
    stats,
    stock,
    recentBriefings,
    proximosBriefings,
    topGastos,
}: Props) {
    const mesLabel = new Date().toLocaleDateString('pt-PT', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="w-full px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Visão geral —{' '}
                        {new Date().toLocaleDateString('pt-PT', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>

                {/* ── KPIs ── */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <KpiCard
                        label="Briefings total"
                        value={stats.briefingsTotal}
                        icon={CalendarDays}
                        color="bg-blue-500"
                    />
                    <KpiCard
                        label="Briefings esta semana"
                        value={stats.briefingsSemana}
                        icon={CalendarDays}
                        color="bg-blue-500"
                    />
                    <KpiCard
                        label="Briefings este mês"
                        value={stats.briefingsMes}
                        sub={mesLabel}
                        icon={ClipboardList}
                        color="bg-indigo-500"
                    />
                    <KpiCard
                        label="Cirurgias total"
                        value={stats.cirurgiasTotal}
                        sub={mesLabel}
                        icon={Stethoscope}
                        color="bg-violet-500"
                    />
                    <KpiCard
                        label="Cirurgias este mês"
                        value={stats.cirurgiasMes}
                        sub={mesLabel}
                        icon={Stethoscope}
                        color="bg-violet-500"
                    />
                    <KpiCard
                        label="Debriefings em falta"
                        value={stats.debriefsEmFalta}
                        sub="sessões passadas sem debriefing"
                        icon={FileWarning}
                        color={
                            stats.debriefsEmFalta > 0
                                ? 'bg-amber-500'
                                : 'bg-gray-400'
                        }
                        warn
                    />
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* ── Stock: resumo ── */}
                    <section className="lg:col-span-2">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                Movimentos de stock
                            </h2>
                            <Link
                                href="/stock"
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Ver stock
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {/* Total */}
                            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500">
                                    <PackageOpen className="h-4 w-4 text-white" />
                                </span>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {stock.total}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Total registos
                                    </p>
                                </div>
                            </div>
                            {/* Este mês */}
                            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500">
                                    <PackageOpen className="h-4 w-4 text-white" />
                                </span>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {stock.mes}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Este mês
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        {mesLabel}
                                    </p>
                                </div>
                            </div>
                            {/* Esta semana */}
                            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500">
                                    <PackageOpen className="h-4 w-4 text-white" />
                                </span>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {stock.semana}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Esta semana
                                    </p>
                                </div>
                            </div>
                            

                        </div>
                    </section>

                    {/* ── Sessões recentes ── */}
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                Sessões recentes
                            </h2>
                            <Link
                                href="/briefings"
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Ver todas
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {recentBriefings.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    Sem sessões registadas.
                                </p>
                            ) : (
                                recentBriefings.map((b) => (
                                    <Link
                                        key={b.id}
                                        href={`/briefings/${b.id}`}
                                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatDate(b.data)}{' '}
                                                <span className="text-gray-400">
                                                    {b.hora}
                                                </span>
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {b.especialidade} · Sala{' '}
                                                {b.sala} · {b.surgeries_count}{' '}
                                                cirurgia
                                                {b.surgeries_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {b.debriefing ? (
                                                <>
                                                    {b.debriefing
                                                        .evento_adverso && (
                                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                            Evento adverso
                                                        </span>
                                                    )}
                                                    {b.debriefing
                                                        .complicacoes && (
                                                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                                            Complicações
                                                        </span>
                                                    )}
                                                    {!b.debriefing
                                                        .complicacoes &&
                                                        !b.debriefing
                                                            .evento_adverso && (
                                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                                                OK
                                                            </span>
                                                        )}
                                                </>
                                            ) : (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Sem debriefing
                                                </span>
                                            )}
                                            <ChevronRight className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                    {/* ── Próximas sessões ── */}
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                Próximas sessões
                            </h2>
                            <Link
                                href="/briefings/create"
                                className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                                + Nova sessão
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {proximosBriefings.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-gray-300/70 bg-gray-50/50 p-6 text-center text-sm text-gray-500 dark:bg-gray-800/30">
                                    Sem sessões agendadas.
                                </div>
                            ) : (
                                proximosBriefings.map((b) => (
                                    <Link
                                        key={b.id}
                                        href={`/briefings/${b.id}`}
                                        className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm transition hover:shadow-sm dark:border-blue-900/40 dark:bg-blue-950/20"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatDate(b.data)}{' '}
                                                <span className="text-gray-400">
                                                    {b.hora}
                                                </span>
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {b.especialidade} · Sala{' '}
                                                {b.sala} · {b.surgeries_count}{' '}
                                                cirurgia
                                                {b.surgeries_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-300" />
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* ── Top gastos por tipo ── */}
                {topGastos.length > 0 && (
                    <section className="mt-8">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                Top consumíveis gastos
                            </h2>
                            <Link
                                href="/consumos/historico"
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Ver histórico
                            </Link>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                            {(() => {
                                const max = topGastos[0]?.total_quantidade ?? 1;
                                const catLabel: Record<string, string> = {
                                    robotico_vidas: 'Robótico (vidas)',
                                    robotico_descartavel:
                                        'Robótico descartável',
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
                                        <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-400">
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    {g.nome}
                                                </p>
                                                <div className="flex shrink-0 items-center gap-3">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${catColor[g.categoria] ?? 'bg-gray-400'}`}
                                                    >
                                                        {catLabel[
                                                            g.categoria
                                                        ] ?? g.categoria}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {g.total_quantidade}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        ({g.total_usos} uso
                                                        {g.total_usos !== 1
                                                            ? 's'
                                                            : ''}
                                                        )
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div
                                                    className={`h-full rounded-full ${catColor[g.categoria] ?? 'bg-gray-400'} opacity-70`}
                                                    style={{
                                                        width: `${Math.round((g.total_quantidade / max) * 100)}%`,
                                                    }}
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
