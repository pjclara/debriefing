import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard } from '@/components/form-ui';
import { FlaskConical, Plus, Pencil, Trash2, BarChart2, AlertTriangle } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Consumivel {
    id: number;
    designacao: string;
    categoria: string;
    unidade: string;
    ativo: boolean;
    stock_atual: number;
    stock_minimo: number;
}

interface Props {
    consumiveis: Consumivel[];
    categorias: Record<string, string>;
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Catálogo de Consumíveis', href: '/consumiveis' },
];

const CATEGORY_COLORS: Record<string, string> = {
    robotico_vidas:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    robotico_descartavel: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    extra:                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function ConsumiveisIndex({ consumiveis, categorias, flash }: Props) {
    function confirmDelete(c: Consumivel) {
        if (confirm(`Eliminar "${c.designacao}"?`)) {
            router.delete(`/consumiveis/${c.id}`);
        }
    }

    // Agrupar por categoria
    const grouped = Object.entries(categorias).map(([key, label]) => ({
        key,
        label,
        items: consumiveis.filter((c) => c.categoria === key),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catálogo de Consumíveis" />
            <div className="mx-auto max-w-4xl p-6">

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Catálogo de Consumíveis</h1>
                        <p className="mt-1 text-sm text-gray-500">{consumiveis.length} itens registados</p>
                    </div>
                    <Link
                        href="/consumiveis/create"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Novo Consumível
                    </Link>
                </div>

                <div className="flex flex-col gap-6">
                    {grouped.map(({ key, label, items }) => (
                        <SectionCard key={key} icon={FlaskConical} title={label} description={`${items.length} ite${items.length !== 1 ? 'ns' : 'm'}`}>
                            {items.length === 0 ? (
                                <p className="text-sm text-gray-400">Sem itens nesta categoria.</p>
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    {items.map((c) => (
                                        <div
                                            key={c.id}
                                            className={`flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-700 ${c.ativo ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-100 opacity-50 dark:bg-gray-900'}`}
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[c.categoria]}`}>
                                                    {c.unidade}
                                                </span>
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{c.designacao}</p>
                                                {!c.ativo && (
                                                    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                                        Inativo
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex shrink-0 items-center gap-1">
                                                {/* Badge de stock */}
                                                {c.stock_atual <= c.stock_minimo ? (
                                                    <span className="mr-1 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400" title="Stock abaixo do mínimo">
                                                        <AlertTriangle size={11} />
                                                        {c.stock_atual} {c.unidade}
                                                    </span>
                                                ) : (
                                                    <span className="mr-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        {c.stock_atual} {c.unidade}
                                                    </span>
                                                )}
                                                <Link
                                                    href={`/consumiveis/${c.id}/stock`}
                                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-emerald-600 dark:hover:bg-gray-700"
                                                    title="Gerir Stock"
                                                >
                                                    <BarChart2 size={15} />
                                                </Link>
                                                <Link
                                                    href={`/consumiveis/${c.id}/edit`}
                                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-blue-600 dark:hover:bg-gray-700"
                                                    title="Editar"
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(c)}
                                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-500 dark:hover:bg-gray-700"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </SectionCard>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
