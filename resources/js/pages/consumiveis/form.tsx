import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls } from '@/components/form-ui';
import { FlaskConical } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Consumivel {
    id?: number;
    designacao?: string;
    categoria?: string;
    unidade?: string;
    ativo?: boolean;
}

interface Props {
    consumivel?: Consumivel;
    categorias: Record<string, string>;
}

const UNIDADES = ['un', 'cx', 'par', 'rolo', 'fr', 'amp', 'ml', 'g'];

export default function ConsumivelForm({ consumivel, categorias }: Props) {
    const isEdit = !!consumivel?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        designacao: consumivel?.designacao ?? '',
        categoria:  consumivel?.categoria  ?? 'robotico_vidas',
        unidade:    consumivel?.unidade    ?? 'un',
        ativo:      consumivel?.ativo      ?? true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo de Consumíveis', href: '/consumiveis' },
        { title: isEdit ? 'Editar' : 'Novo', href: '#' },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/consumiveis/${consumivel!.id}`);
        } else {
            post('/consumiveis');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Consumível' : 'Novo Consumível'} />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    {isEdit ? 'Editar Consumível' : 'Novo Consumível'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <SectionCard icon={FlaskConical} title="Dados do Consumível">
                        <FormRow label="Designação" error={errors.designacao}>
                            <input
                                type="text"
                                value={data.designacao}
                                onChange={e => setData('designacao', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: PROGRASP FORCEPS"
                                required
                                autoFocus
                            />
                        </FormRow>

                        <FormRow label="Categoria" error={errors.categoria}>
                            <select
                                value={data.categoria}
                                onChange={e => setData('categoria', e.target.value)}
                                className={selectCls}
                            >
                                {Object.entries(categorias).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Unidade" error={errors.unidade}>
                            <select
                                value={data.unidade}
                                onChange={e => setData('unidade', e.target.value)}
                                className={selectCls}
                            >
                                {UNIDADES.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Estado">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('ativo', true)}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${data.ativo ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700 dark:bg-gray-800'}`}
                                >
                                    Ativo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('ativo', false)}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${!data.ativo ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-700 dark:bg-gray-800'}`}
                                >
                                    Inativo
                                </button>
                            </div>
                        </FormRow>
                    </SectionCard>

                    <div className="mt-6 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar' : 'Criar Consumível'}
                        </button>
                        <Link href="/consumiveis" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
