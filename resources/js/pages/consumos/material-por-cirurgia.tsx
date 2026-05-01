import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PackageOpen, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Material {
    consumivel_id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
    num_cirurgias: number;
    total_quantidade: number;
    media_quantidade: number;
}

interface ProcedimentoGroup {
    procedimento: string;
    num_cirurgias: number;
    materiais: Material[];
}

interface Props {
    porProcedimento: ProcedimentoGroup[];
}

const catLabel: Record<string, string> = {
    robotico_vidas:       'Robótico (vidas)',
    robotico_descartavel: 'Robótico (descartável)',
    extra:                'Extra',
};

const catCls: Record<string, string> = {
    robotico_vidas:       'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    robotico_descartavel: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    extra:                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Material por Cirurgia', href: '/consumos/material-por-cirurgia' },
];

export default function MaterialPorCirurgia({ porProcedimento }: Props) {
    const [search, setSearch] = useState('');
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    function toggle(proc: string) {
        setCollapsed((prev) => ({ ...prev, [proc]: !prev[proc] }));
    }

    const filtered = porProcedimento.filter((g) =>
        g.procedimento.toLowerCase().includes(search.toLowerCase()) ||
        g.materiais.some((m) => m.nome.toLowerCase().includes(search.toLowerCase())),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material por Cirurgia" />

            <div className="w-full px-8 py-10">
                {/* Cabeçalho */}
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            <PackageOpen className="h-7 w-7 text-blue-600" />
                            Material por Cirurgia
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Consumíveis utilizados habitualmente por tipo de procedimento, com base no histórico de cirurgias.
                        </p>
                    </div>
                    <Link
                        href="/consumos/historico"
                        className="shrink-0 text-xs text-blue-600 hover:underline"
                    >
                        Ver histórico completo →
                    </Link>
                </div>

                {/* Barra de pesquisa */}
                <div className="relative mb-6 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar procedimento ou material…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300/70 bg-gray-50/50 p-10 text-center text-sm text-gray-500 dark:bg-gray-800/30">
                        {search ? 'Nenhum resultado encontrado.' : 'Ainda não existem consumos registados.'}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filtered.map((group) => {
                            const isOpen = !collapsed[group.procedimento];
                            // Se a pesquisa bate num material, expandir automaticamente
                            const hasMatMatch = search
                                ? group.materiais.some((m) => m.nome.toLowerCase().includes(search.toLowerCase()))
                                : false;
                            const open = hasMatMatch ? true : isOpen;

                            return (
                                <div
                                    key={group.procedimento}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
                                >
                                    {/* Cabeçalho do procedimento */}
                                    <button
                                        type="button"
                                        onClick={() => toggle(group.procedimento)}
                                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-base font-semibold text-gray-900 dark:text-white">
                                                {group.procedimento}
                                            </span>
                                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {group.num_cirurgias} cirurgia{group.num_cirurgias !== 1 ? 's' : ''}
                                            </span>
                                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                {group.materiais.length} material{group.materiais.length !== 1 ? 'is' : ''}
                                            </span>
                                        </div>
                                        {open ? (
                                            <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                                        )}
                                    </button>

                                    {/* Tabela de materiais */}
                                    {open && (
                                        <div className="border-t border-gray-100 dark:border-gray-800">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                                                        <th className="px-5 py-2.5 text-left font-medium">Material</th>
                                                        <th className="px-4 py-2.5 text-left font-medium">Categoria</th>
                                                        <th className="px-4 py-2.5 text-center font-medium">
                                                            Usado em
                                                            <span className="block text-[10px] normal-case tracking-normal">cirurgias</span>
                                                        </th>
                                                        <th className="px-4 py-2.5 text-center font-medium">
                                                            Frequência
                                                            <span className="block text-[10px] normal-case tracking-normal">% cirurgias</span>
                                                        </th>
                                                        <th className="px-4 py-2.5 text-center font-medium">
                                                            Qty média
                                                            <span className="block text-[10px] normal-case tracking-normal">por cirurgia</span>
                                                        </th>
                                                        <th className="px-4 py-2.5 text-center font-medium">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.materiais.map((m, idx) => {
                                                        const freq = group.num_cirurgias > 0
                                                            ? Math.round((m.num_cirurgias / group.num_cirurgias) * 100)
                                                            : 0;
                                                        const highlight = search && m.nome.toLowerCase().includes(search.toLowerCase());
                                                        return (
                                                            <tr
                                                                key={m.consumivel_id}
                                                                className={`border-t border-gray-100 dark:border-gray-800 ${
                                                                    highlight
                                                                        ? 'bg-yellow-50 dark:bg-yellow-900/10'
                                                                        : idx % 2 === 0
                                                                        ? ''
                                                                        : 'bg-gray-50/50 dark:bg-gray-800/20'
                                                                }`}
                                                            >
                                                                <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                                                                    {m.nome}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${catCls[m.categoria] ?? 'bg-gray-100 text-gray-600'}`}>
                                                                        {catLabel[m.categoria] ?? m.categoria}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                                                                    {m.num_cirurgias}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                                            <div
                                                                                className="h-full rounded-full bg-blue-500"
                                                                                style={{ width: `${freq}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="w-8 text-right text-xs text-gray-500">{freq}%</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                                                                    {m.media_quantidade}
                                                                </td>
                                                                <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                                                                    {m.total_quantidade}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
