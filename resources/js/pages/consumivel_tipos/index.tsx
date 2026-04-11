import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: string;
    ativo: boolean;
}

interface Props {
    tipos: ConsumivelTipo[];
    categorias: Record<string, string>;
}

const categoriaColors: Record<string, string> = {
    robotico_vidas: 'bg-blue-100 text-blue-800',
    robotico_descartavel: 'bg-green-100 text-green-800',
    extra: 'bg-purple-100 text-purple-800',
};

export default function ConsumivelTiposIndex({ tipos, categorias }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo', href: '#' },
        { title: 'Tipos de Consumíveis', href: '/consumivel_tipos' },
    ];

    const handleDelete = (id: number) => {
        if (window.confirm('Confirmar eliminação?')) {
            router.delete(`/consumivel_tipos/${id}`);
        }
    };

    // Agrupar por categoria
    const tiposPorCategoria = Object.keys(categorias).map((cat) => ({
        categoria: cat,
        label: categorias[cat],
        itens: tipos.filter((t) => t.categoria === cat),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipos de Consumíveis" />
            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tipos de Consumíveis</h1>
                    <Link href="/consumivel_tipos/create" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        <Plus size={18} />
                        Novo Tipo
                    </Link>
                </div>

                {tiposPorCategoria.map(
                    (grupo) =>
                        grupo.itens.length > 0 && (
                            <div key={grupo.categoria} className="mb-6">
                                <h2 className="mb-3 text-lg font-semibold text-gray-700">{grupo.label}</h2>
                                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                                    {grupo.itens.map((tipo) => (
                                        <div key={tipo.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <Package size={20} className="text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{tipo.nome}</p>
                                                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${categoriaColors[tipo.categoria]}`}>
                                                        {grupo.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded px-2 py-1 text-xs font-semibold ${tipo.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {tipo.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                                <Link href={`/consumivel_tipos/${tipo.id}/edit`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(tipo.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ),
                )}

                {tipos.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                        <Package size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Nenhum tipo de consumível registado.</p>
                        <Link href="/consumivel_tipos/create" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                            Criar Primeiro Tipo
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
