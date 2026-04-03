import { Head, Link, useForm } from '@inertiajs/react';
import { UserCog } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls } from '@/components/form-ui';
import type { BreadcrumbItem } from '@/types';

interface User {
    id?: number;
    name?: string;
    email?: string;
}

interface Props {
    user?: User;
}

export default function UserForm({ user }: Props) {
    const isEdit = !!user?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        name:                  user?.name  ?? '',
        email:                 user?.email ?? '',
        password:              '',
        password_confirmation: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Utilizadores', href: '/users' },
        { title: isEdit ? 'Editar' : 'Novo', href: '#' },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/users/${user!.id}`);
        } else {
            post('/users');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Utilizador' : 'Novo Utilizador'} />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    {isEdit ? 'Editar Utilizador' : 'Novo Utilizador'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <SectionCard icon={UserCog} title="Dados do Utilizador">
                        <FormRow label="Nome completo" error={errors.name}>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={inputCls}
                                placeholder="Nome completo"
                                required
                                autoFocus
                            />
                        </FormRow>

                        <FormRow label="Endereço de email" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={inputCls}
                                placeholder="email@exemplo.com"
                                required
                                autoComplete="off"
                            />
                        </FormRow>

                        <FormRow
                            label={isEdit ? 'Nova palavra-passe' : 'Palavra-passe'}
                            error={errors.password}
                            hint={isEdit ? 'Deixe em branco para manter a actual' : undefined}
                        >
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className={inputCls}
                                placeholder={isEdit ? 'Nova palavra-passe (opcional)' : 'Palavra-passe'}
                                autoComplete="new-password"
                                required={!isEdit}
                            />
                        </FormRow>

                        <FormRow label="Confirmar palavra-passe" error={errors.password_confirmation}>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className={inputCls}
                                placeholder="Confirmar palavra-passe"
                                autoComplete="new-password"
                                required={!isEdit || data.password.length > 0}
                            />
                        </FormRow>
                    </SectionCard>

                    <div className="mt-6 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar' : 'Criar Utilizador'}
                        </button>
                        <Link href="/users" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
