import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PackageOpen } from 'lucide-react';
import { SectionCard } from '@/components/form-ui';
import type { BreadcrumbItem } from '@/types';

interface Consumo {
    id: number;
    designacao: string;
    referencia?: string;
    quantidade: number | string;
    unidade: string;
    observacoes?: string;
}

interface Group {
    surgery: { id: number; processo: string; procedimento: string };
    briefing: { id: number; data: string; sala: string; especialidade: string };
    consumos: Consumo[];
}

interface Props {
    groups: Group[];
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Consumos', href: '/consumos' },
];

export default function ConsumosAll({ groups }: Props) {
    const total = groups.reduce((sum, g) => sum + g.consumos.length, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consumos" />
            <div className="mx-auto max-w-4xl p-6">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Consumos Intra-operatórios</h1>
                        <p className="mt-1 text-sm text-gray-500">{total} consumo{total !== 1 ? 's' : ''} registado{total !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {groups.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
                        Nenhum consumo registado ainda.
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {groups.map((g) => (
                            <SectionCard
                                key={g.surgery.id}
                                icon={PackageOpen}
                                title={`${g.surgery.processo} — ${g.surgery.procedimento}`}
                                description={`${formatDate(g.briefing.data)} · Sala ${g.briefing.sala} · ${g.briefing.especialidade}`}
                            >
                                <div className="flex flex-col gap-2">
                                    {g.consumos.map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.designacao}</p>
                                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {c.quantidade} {c.unidade}
                                                    {c.referencia && <> · Ref: {c.referencia}</>}
                                                    {c.observacoes && <> · {c.observacoes}</>}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href={`/surgeries/${g.surgery.id}/consumos`}
                                    className="self-start text-xs text-blue-600 hover:underline"
                                >
                                    Gerir consumos desta cirurgia →
                                </Link>
                            </SectionCard>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
