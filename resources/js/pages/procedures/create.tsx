import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, textareaCls, selectCls } from '@/components/form-ui';
import { Syringe, ArrowLeft } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Department {
    id: number;
    nome: string;
}

interface Props {
    departments: Department[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Procedimentos', href: '/procedures' },
    { title: 'Novo Procedimento', href: '#' },
];

export default function CreateProcedure({ departments }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        nome: '',
        descricao: '',
        codigo: '',
        department_id: '',
        ativo: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/procedures');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novo Procedimento" />
            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Novo Procedimento</h1>
                    <Link
                        href="/procedures"
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <SectionCard icon={Syringe} title="Dados do Procedimento">
                        <FormRow label="Departamento" error={errors.department_id}>
                            <select
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                                className={selectCls}
                                required
                            >
                                <option value="">Selecione um departamento</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.nome}
                                    </option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Nome" error={errors.nome}>
                            <input
                                type="text"
                                value={data.nome}
                                onChange={(e) => setData('nome', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: Apendicectomia"
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
                                placeholder="Ex: PROC_APENDICECTOMIA"
                                required
                            />
                        </FormRow>

                        <FormRow label="Descrição" error={errors.descricao}>
                            <textarea
                                value={data.descricao}
                                onChange={(e) => setData('descricao', e.target.value)}
                                className={textareaCls}
                                placeholder="Descrição do procedimento"
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
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${!data.ativo ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-700 dark:bg-gray-800'}`}
                                >
                                    Inativo
                                </button>
                            </div>
                        </FormRow>
                    </SectionCard>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Criando...' : 'Criar Procedimento'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
