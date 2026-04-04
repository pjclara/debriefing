import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

export default function Register() {
    return (
        <AuthLayout
            title="Registo desactivado"
            description="O registo publico nao esta disponivel."
        >
            <Head title="Registar" />
            <p className="text-center text-sm text-gray-500">
                As contas sao criadas pelo administrador do sistema.{' '}
                <Link href={login()} className="text-blue-600 hover:underline">
                    Voltar ao login
                </Link>
            </p>
        </AuthLayout>
    );
}
