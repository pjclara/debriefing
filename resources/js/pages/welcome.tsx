import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Shield, ClipboardList, PackageOpen, Activity, ChevronRight, CheckCircle2, ArrowDown } from 'lucide-react';

const features = [
    {
        icon: ClipboardList,
        title: 'Briefing Cirúrgico',
        desc: 'Registo estruturado pré-operatório com lista de verificação de segurança para cada cirurgia robótica.',
    },
    {
        icon: Activity,
        title: 'Debriefing',
        desc: 'Análise pós-operatória de complicações, falhas de sistema e eventos adversos para melhoria contínua.',
    },
    {
        icon: PackageOpen,
        title: 'Gestão de Consumíveis',
        desc: 'Controlo de stocks e movimentos de materiais utilizados no bloco operatório em tempo real.',
    },
    {
        icon: Shield,
        title: 'Segurança Reforçada',
        desc: 'Rastreabilidade completa de consumos por cirurgia e alertas automáticos de stock mínimo.',
    },
];

const checkItems = [
    'Lista de verificação cirúrgica integrada',
    'Sistema Da Vinci Xi — controlo de consumíveis robóticos',
    'Histórico de briefings e debriefings por sala',
    'Alertas de stock abaixo do mínimo',
    'Registo de complicações e eventos adversos',
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Segurança no Bloco Operatório" />
            <div className="flex min-h-screen flex-col bg-white text-gray-900">

                {/* NAV */}
                <header className="border-b border-gray-200 px-6 py-4">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                                <Shield size={20} className="text-white" />
                            </div>
                            <span className="font-semibold tracking-tight text-gray-900">Bloco Operatório</span>
                        </div>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-95"
                                >
                                    Dashboard <ChevronRight size={15} />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
                                    >
                                        Entrar
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-95"
                                        >
                                            Criar conta
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* HERO */}
                <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                        Sistema de Gestão Cirúrgica
                    </div>

                    <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Segurança no{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Bloco Operatório
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
                        Plataforma integrada de briefings cirúrgicos, controlo de consumíveis e
                        rastreabilidade de material robótico Da Vinci Xi.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 hover:ring-blue-600/30 active:scale-95"
                            >
                                Ir para o Dashboard
                                <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="group flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 hover:ring-blue-600/30 active:scale-95"
                                >
                                    Aceder ao Sistema
                                    <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Link>
                                {canRegister && (
                                    <a
                                        href="#features"
                                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md active:scale-95"
                                    >
                                        Saber mais
                                        <ArrowDown size={16} className="animate-bounce" />
                                    </a>
                                )}
                            </>
                        )}
                    </div>

                    <ul className="mt-10 flex flex-col items-start gap-2.5 text-sm text-gray-500 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:flex-wrap lg:justify-center">
                        {checkItems.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <CheckCircle2 size={15} className="shrink-0 text-green-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="mx-auto w-full max-w-6xl px-6">
                    <div className="h-px bg-gray-200" />
                </div>

                {/* FEATURES */}
                <section id="features" className="px-6 py-20">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">
                            Funcionalidades principais
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map(({ icon: Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="border-t border-gray-200 px-6 py-6">
                    <p className="text-center text-xs text-gray-400">
                        © {new Date().getFullYear()} Gestão de Bloco Operatório · Cirurgia Robótica Da Vinci Xi
                    </p>
                </footer>
            </div>
        </>
    );
}