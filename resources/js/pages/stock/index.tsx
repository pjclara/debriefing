import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Boxes, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { BreadcrumbItem } from '@/types';

interface StockItem {
    stock_key: string;
    stock_movimento_id: number | null;
    consumivel_tipo_id: number;
    consumivel_nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
    referencia?: string | null;
    codigo?: string | null;
    quantidade_disponivel: number;
    quantidade_inicial: number;
    tipo: 'vidas' | 'unidade';
}

interface Props {
    vidasItems: StockItem[];
    unidadeItems: StockItem[];
    flash?: { success?: string };
}

const PAGE_SIZE = 10;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock Disponível', href: '/stock' },
];

function VidasRow({ item }: { item: StockItem }) {
    const pct = item.quantidade_inicial > 0 ? (item.quantidade_disponivel / item.quantidade_inicial) * 100 : 0;
    const low = pct <= 30;
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.consumivel_nome}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {item.codigo && <span className="mr-2 font-mono">{item.codigo}</span>}
                    {item.referencia && <span>Ref: {item.referencia}</span>}
                </p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className={`text-sm font-semibold ${low ? 'text-orange-500' : 'text-green-600 dark:text-green-400'}`}>
                    {item.quantidade_disponivel}/{item.quantidade_inicial} vidas
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                        className={`h-full rounded-full transition-all ${low ? 'bg-orange-400' : 'bg-green-500'}`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function UnidadeRow({ item }: { item: StockItem }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.consumivel_nome}</p>
                {item.referencia && (
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Ref: {item.referencia}</p>
                )}
            </div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {item.quantidade_disponivel} un.
            </span>
        </div>
    );
}

function Pagination({
    page,
    total,
    pageSize,
    onChange,
}: {
    page: number;
    total: number;
    pageSize: number;
    onChange: (p: number) => void;
}) {
    const pages = Math.ceil(total / pageSize);
    if (pages <= 1) return null;
    return (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
                {total} itens &middot; página {page}/{pages}
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`h-6 w-6 rounded text-xs font-medium transition-colors ${
                            p === page
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === pages}
                    className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

type Categoria = 'all' | 'vidas' | 'unidade';

export default function StockIndex({ vidasItems, unidadeItems, flash }: Props) {
    const [search, setSearch] = useState('');
    const [categoria, setCategoria] = useState<Categoria>('vidas');
    const [pageVidas, setPageVidas] = useState(1);
    const [pageUnidade, setPageUnidade] = useState(1);

    const lc = (s: string) => s.toLowerCase();

    const filteredVidas = useMemo(() => {
        if (categoria === 'unidade') return [];
        if (!search) return vidasItems;
        const q = lc(search);
        return vidasItems.filter(
            (i) =>
                lc(i.consumivel_nome).includes(q) ||
                lc(i.referencia ?? '').includes(q) ||
                lc(i.codigo ?? '').includes(q),
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vidasItems, search, categoria]);

    const filteredUnidade = useMemo(() => {
        if (categoria === 'vidas') return [];
        if (!search) return unidadeItems;
        const q = lc(search);
        return unidadeItems.filter(
            (i) =>
                lc(i.consumivel_nome).includes(q) ||
                lc(i.referencia ?? '').includes(q),
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unidadeItems, search, categoria]);

    function handleSearch(v: string) {
        setSearch(v);
        setPageVidas(1);
        setPageUnidade(1);
    }
    function handleCategoria(v: Categoria) {
        setCategoria(v);
        setPageVidas(1);
        setPageUnidade(1);
    }

    const pagedVidas = filteredVidas.slice((pageVidas - 1) * PAGE_SIZE, pageVidas * PAGE_SIZE);
    const pagedUnidade = filteredUnidade.slice((pageUnidade - 1) * PAGE_SIZE, pageUnidade * PAGE_SIZE);

    const total = filteredVidas.length + filteredUnidade.length;
    const totalGlobal = vidasItems.length + unidadeItems.length;

    const tabs: { label: string; value: Categoria }[] = [
        //{ label: 'Todos', value: 'all' },
        { label: 'Instrumentos Robóticos', value: 'vidas' },
        { label: 'Descartável / Extra', value: 'unidade' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Disponível" />
            <div className="mx-auto w-[80%] p-6">
                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                {/* Cabeçalho */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Disponível</h1>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            {totalGlobal} {totalGlobal === 1 ? 'item' : 'itens'} com stock
                        </p>
                    </div>
                    <Link
                        href="/stock_movimentos"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Ver movimentos →
                    </Link>
                </div>

                {/* Filtros */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800">
                        <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Pesquisar por nome, referência ou código…"
                            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 dark:text-gray-100"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => handleSearch('')}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => handleCategoria(tab.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                    categoria === tab.value
                                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vazio */}
                {total === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-14 text-center dark:border-gray-600">
                        <Boxes className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm text-gray-400">
                            {search || categoria !== 'all'
                                ? 'Sem resultados para os filtros aplicados.'
                                : 'Sem stock disponível de momento.'}
                        </p>
                        {!search && categoria === 'all' && (
                            <Link href="/stock_movimentos/create" className="text-sm text-blue-600 hover:underline">
                                Registar entrada de stock
                            </Link>
                        )}
                    </div>
                )}

                {/* Instrumentos Robóticos */}
                {pagedVidas.length > 0 && (
                    <section className="mb-8">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            Instrumentos Robóticos
                        </h2>
                        <div className="flex flex-col gap-2">
                            {pagedVidas.map((item) => (
                                <VidasRow key={item.stock_key} item={item} />
                            ))}
                        </div>
                        <Pagination
                            page={pageVidas}
                            total={filteredVidas.length}
                            pageSize={PAGE_SIZE}
                            onChange={setPageVidas}
                        />
                    </section>
                )}

                {/* Material Descartável / Extra */}
                {pagedUnidade.length > 0 && (
                    <section>
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            Material Descartável / Extra
                        </h2>
                        <div className="flex flex-col gap-2">
                            {pagedUnidade.map((item) => (
                                <UnidadeRow key={item.stock_key} item={item} />
                            ))}
                        </div>
                        <Pagination
                            page={pageUnidade}
                            total={filteredUnidade.length}
                            pageSize={PAGE_SIZE}
                            onChange={setPageUnidade}
                        />
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
