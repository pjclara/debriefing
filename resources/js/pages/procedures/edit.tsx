import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, textareaCls, selectCls } from '@/components/form-ui';
import { Syringe, ArrowLeft, AlertCircle } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';

interface Department {
    id: number;
    nome: string;
}

interface Procedure {
    id: number;
    nome: string;
    descricao: string | null;
    department_id: number;
    ativo: boolean;
}

interface Props {
    procedure: Procedure;
    departments: Department[];
}

export default function EditProcedure({ procedure, departments }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Procedimentos', href: '/procedures' },
        { title: 'Editar Procedimento', href: '#' },
    ];

    const { data, setData, put, errors, processing } = useForm({
        nome: procedure.nome,
        descricao: procedure.descricao || '',
        department_id: procedure.department_id,
        ativo: procedure.ativo,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/procedures/${procedure.id}`);
    };

    const handleDelete = () => {
        if (confirm('Tem a certeza que pretende eliminar este procedimento?')) {
            router.delete(`/procedures/${procedure.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${procedure.nome}`} />
            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar Procedimento</h1>
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
                                onChange={(e) => setData('department_id', parseInt(e.target.value))}
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
                        {processing ? 'Atualizando...' : 'Atualizar Procedimento'}
                    </button>
                </form>

                <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                        <h3 className="font-semibold text-red-900 dark:text-red-300">Zona de Risco</h3>
                    </div>
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                        Eliminar este procedimento é uma ação permanente e não pode ser desfeita.
                    </p>
                    <button
                        onClick={handleDelete}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Eliminar Procedimento
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
