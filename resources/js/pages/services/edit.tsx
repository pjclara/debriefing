import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, textareaCls } from '@/components/form-ui';
import { Wrench, ArrowLeft, AlertCircle } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';

interface Service {
    id: number;
    nome: string;
    descricao: string | null;
    codigo: string;
    ativo: boolean;
}

interface Props {
    service: Service;
}

export default function EditService({ service }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Serviços', href: '/services' },
        { title: 'Editar Serviço', href: '#' },
    ];

    const { data, setData, put, errors, processing } = useForm({
        nome: service.nome,
        descricao: service.descricao || '',
        codigo: service.codigo,
        ativo: service.ativo,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/services/${service.id}`);
    };

    const handleDelete = () => {
        if (confirm('Tem a certeza que pretende eliminar este serviço?')) {
            router.delete(`/services/${service.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${service.nome}`} />
            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar Serviço</h1>
                    <Link
                        href="/services"
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <SectionCard icon={Wrench} title="Dados do Serviço">
                        <FormRow label="Nome" error={errors.nome}>
                            <input
                                type="text"
                                value={data.nome}
                                onChange={(e) => setData('nome', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: Cirurgia Geral"
                                required
                                autoFocus
                            />
                        </FormRow>

                        <FormRow label="Código" error={errors.codigo}>
                            <input
                                type="text"
                                value={data.codigo}
                                onChange={(e) => setData('codigo', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: CT001"
                                required
                            />
                        </FormRow>

                        <FormRow label="Descrição" error={errors.descricao}>
                            <textarea
                                value={data.descricao}
                                onChange={(e) => setData('descricao', e.target.value)}
                                className={textareaCls}
                                placeholder="Descrição do serviço"
                                rows={4}
                            />
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
                            {processing ? 'A guardar…' : 'Guardar Alterações'}
                        </button>
                        <Link href="/services" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/20">
                    <h3 className="mb-3 font-semibold text-red-900 dark:text-red-300">Zona de Perigo</h3>
                    <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                        Elimine este serviço permanentemente. Esta ação é irreversível.
                    </p>
                    <button
                        onClick={handleDelete}
                        type="button"
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Eliminar Serviço
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
