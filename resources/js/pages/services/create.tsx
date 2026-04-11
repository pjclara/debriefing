import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, textareaCls } from '@/components/form-ui';
import { Wrench, ArrowLeft } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Props {
    // departments?: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Serviços', href: '/services' },
    { title: 'Novo Serviço', href: '#' },
];

export default function CreateService({}: Props) {
    const { data, setData, post, errors, processing } = useForm({
        nome: '',
        descricao: '',
        codigo: '',
        ativo: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/services');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novo Serviço" />
            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Novo Serviço</h1>
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
                                placeholder="Ex: CIRURGIA_GERAL"
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
                            {processing ? 'A guardar…' : 'Criar Serviço'}
                        </button>
                        <Link href="/services" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
