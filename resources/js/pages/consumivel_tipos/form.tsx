import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls } from '@/components/form-ui';
import { Package } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface ConsumivelTipo {
    id?: number;
    nome?: string;
    categoria?: string;
    ativo?: boolean;
}

interface Props {
    tipo?: ConsumivelTipo;
    categorias: Record<string, string>;
}

export default function ConsumivelTipoForm({ tipo, categorias }: Props) {
    const isEdit = !!tipo?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        nome: tipo?.nome ?? '',
        categoria: tipo?.categoria ?? 'robotico_vidas',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo', href: '#' },
        { title: 'Tipos de Consumíveis', href: '/consumivel_tipos' },
        { title: isEdit ? 'Editar' : 'Novo', href: '#' },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/consumivel_tipos/${tipo!.id}`);
        } else {
            post('/consumivel_tipos');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Tipo' : 'Novo Tipo'} />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    {isEdit ? 'Editar Tipo de Consumível' : 'Novo Tipo de Consumível'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <SectionCard icon={Package} title="Dados do Tipo">
                        <FormRow label="Nome" error={errors.nome}>
                            <input
                                type="text"
                                value={data.nome}
                                onChange={(e) => setData('nome', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: PROGRASP FORCEPS"
                                required
                                autoFocus
                            />
                        </FormRow>

                        <FormRow label="Categoria" error={errors.categoria}>
                            <select
                                value={data.categoria}
                                onChange={(e) => setData('categoria', e.target.value)}
                                className={selectCls}
                            >
                                {Object.entries(categorias).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </FormRow>
                    </SectionCard>

                    <div className="mt-6 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar' : 'Criar Tipo'}
                        </button>
                        <Link href="/consumivel_tipos" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
