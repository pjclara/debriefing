import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, textareaCls, selectCls } from '@/components/form-ui';
import { Building2, ArrowLeft } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';

interface Service {
    id: number;
    nome: string;
}

interface Department {
    id: number;
    nome: string;
    descricao: string | null;
    codigo: string | null;
    service_id: number;
    ativo: boolean;
}

interface Props {
    department: Department;
    services: Service[];
}

export default function EditDepartment({ department, services }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Departamentos', href: '/departments' },
        { title: 'Editar Departamento', href: '#' },
    ];

    const { data, setData, put, errors, processing } = useForm({
        nome: department.nome,
        descricao: department.descricao || '',
        codigo: department.codigo || '',
        service_id: department.service_id,
        ativo: department.ativo,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/departments/${department.id}`);
    };

    const handleDelete = () => {
        if (confirm('Tem a certeza que pretende eliminar este departamento?')) {
            router.delete(`/departments/${department.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${department.nome}`} />
            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar Departamento</h1>
                    <Link
                        href="/departments"
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <SectionCard icon={Building2} title="Dados do Departamento">
                        <FormRow label="Serviço" error={errors.service_id}>
                            <select
                                value={data.service_id}
                                onChange={(e) => setData('service_id', parseInt(e.target.value))}
                                className={selectCls}
                                required
                            >
                                <option value="">Selecione um serviço</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.nome}
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
                                placeholder="Ex: CG001"
                            />
                        </FormRow>

                        <FormRow label="Descrição" error={errors.descricao}>
                            <textarea
                                value={data.descricao}
                                onChange={(e) => setData('descricao', e.target.value)}
                                className={textareaCls}
                                placeholder="Descrição do departamento"
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
                        <Link href="/departments" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/20">
                    <h3 className="mb-3 font-semibold text-red-900 dark:text-red-300">Zona de Perigo</h3>
                    <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                        Elimine este departamento permanentemente. Esta ação é irreversível.
                    </p>
                    <button
                        onClick={handleDelete}
                        type="button"
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Eliminar Departamento
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
