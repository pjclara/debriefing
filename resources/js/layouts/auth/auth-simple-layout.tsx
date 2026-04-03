import { Link } from '@inertiajs/react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const highlights = [
    'Briefings cirúrgicos estruturados',
    'Controlo de consumíveis robóticos',
    'Debriefing e registo de eventos adversos',
    'Alertas automáticos de stock mínimo',
];

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh bg-white text-gray-900">

            {/* ── Painel esquerdo ── */}
            <div className="hidden w-[420px] shrink-0 flex-col justify-between border-r border-gray-200 bg-blue-600 p-10 text-white lg:flex">
                <div>
                    <Link href={home()} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                            <Shield size={20} className="text-white" />
                        </div>
                        <span className="font-semibold text-white">Bloco Operatório</span>
                    </Link>

                    <div className="mt-16">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">Sistema de Gestão Cirúrgica</p>
                        <h2 className="text-2xl font-bold leading-snug text-white">
                            Segurança no<br />
                            <span className="text-blue-200">
                                Bloco Operatório
                            </span>
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-blue-100">
                            Plataforma de controlo para equipas de cirurgia robótica Da Vinci Xi.
                        </p>
                    </div>

                    <ul className="mt-10 flex flex-col gap-3">
                        {highlights.map((h) => (
                            <li key={h} className="flex items-center gap-2.5 text-sm text-blue-100">
                                <CheckCircle2 size={15} className="shrink-0 text-blue-200" />
                                {h}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-xs text-blue-300">
                    © {new Date().getFullYear()} Gestão de Bloco Operatório
                </p>
            </div>

            {/* ── Formulário ── */}
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4 lg:hidden">
                            <Link href={home()} className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                                    <Shield size={20} className="text-white" />
                                </div>
                            </Link>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
