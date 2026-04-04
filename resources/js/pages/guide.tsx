import { Head, Link } from '@inertiajs/react';
import {
    Shield,
    LogIn,
    ClipboardList,
    PlusCircle,
    Stethoscope,
    PackageOpen,
    Activity,
    FileText,
    Users,
    FlaskConical,
    ChevronRight,
    CheckCircle2,
} from 'lucide-react';
import { login } from '@/routes';

interface Step {
    number: number;
    icon: React.ElementType;
    title: string;
    role: 'todos' | 'admin';
    description: string;
    details: string[];
}

const steps: Step[] = [
    {
        number: 1,
        icon: LogIn,
        title: 'Iniciar sessão',
        role: 'todos',
        description: 'Aceda \u00e0 plataforma com as credenciais fornecidas pelo administrador.',
        details: [
            'V\u00e1 \u00e0 p\u00e1gina de login e introduza o email e palavra-passe atribu\u00eddos pelo administrador.',
            'N\u00e3o existe auto-registo — as contas s\u00e3o criadas exclusivamente pelo administrador do sistema.',
            'Existem dois perfis: Utilizador (acesso b\u00e1sico) e Administrador (acesso total).',
            'Em caso de esquecimento da palavra-passe, contacte o administrador.',
        ],
    },
    {
        number: 2,
        icon: ClipboardList,
        title: 'Criar um Briefing',
        role: 'todos',
        description: 'Registe a sessão operatória antes de cada cirurgia.',
        details: [
            'Vá a "Briefings Cirúrgicos" no menu lateral.',
            'Clique em "+ Novo Briefing" e preencha data, hora, sala e especialidade.',
            'Responda à lista de verificação de segurança (dotação, equipamento, mesa emparelhada, etc.).',
            'Guarde o briefing — ficará visível na listagem.',
        ],
    },
    {
        number: 3,
        icon: PlusCircle,
        title: 'Adicionar Cirurgias ao Briefing',
        role: 'todos',
        description: 'Associe as cirurgias previstas para essa sessão.',
        details: [
            'Dentro do briefing, clique em "+ Adicionar" na coluna Cirurgias.',
            'Preencha o nº de processo, procedimento e destino do doente.',
            'Indique se existem antecedentes relevantes, comorbidades, variações técnicas ou passos críticos.',
            'Pode adicionar várias cirurgias à mesma sessão.',
        ],
    },
    {
        number: 4,
        icon: PackageOpen,
        title: 'Registar Consumíveis por Cirurgia',
        role: 'todos',
        description: 'Associe os materiais usados directamente em cada cirurgia.',
        details: [
            'Na card de cada cirurgia, expanda a secção "Consumíveis".',
            'Seleccione um consumível do catálogo (auto-preenche designação e unidade) ou introduza manualmente.',
            'Indique a quantidade utilizada e a referência, se aplicável.',
            'Os consumos ficam ligados à cirurgia e actualizam o stock automaticamente.',
        ],
    },
    {
        number: 5,
        icon: Activity,
        title: 'Registar o Debriefing',
        role: 'todos',
        description: 'Após a sessão, preencha a análise pós-operatória.',
        details: [
            'Na coluna Debriefing do briefing, clique em "Registar Debriefing".',
            'Indique se houve complicações, falha de sistema, eventos adversos.',
            'Registe se a cirurgia iniciou e terminou a horas.',
            'Adicione observações sobre o que correu bem e o que pode melhorar.',
        ],
    },
    {
        number: 6,
        icon: FileText,
        title: 'Gerar PDF / Imprimir',
        role: 'todos',
        description: 'Exporte o briefing completo para arquivo ou impressão.',
        details: [
            'Dentro de qualquer briefing, clique no botão "🖨 PDF" no canto superior direito.',
            'A página abre em modo de impressão com briefing, cirurgias, consumíveis e debriefing.',
            'Utilize Ctrl+P para imprimir ou guardar como PDF.',
        ],
    },
    {
        number: 7,
        icon: FlaskConical,
        title: 'Gerir Catálogo de Consumíveis',
        role: 'admin',
        description: 'Mantenha actualizado o catálogo de materiais disponíveis.',
        details: [
            'Aceda a "Catálogo de Consumíveis" no menu lateral (apenas admins).',
            'Crie novos consumíveis com designação, referência, categoria, unidade e stock mínimo.',
            'Categorias disponíveis: Itens Robóticos com Vidas, Consumíveis Robóticos Descartáveis, Extras.',
            'Os consumíveis activos ficam disponíveis para selecção nos registos de cirurgia.',
        ],
    },
    {
        number: 8,
        icon: Stethoscope,
        title: 'Controlo de Stock',
        role: 'admin',
        description: 'Monitorize e ajuste os movimentos de stock.',
        details: [
            'Em cada consumível do catálogo, aceda ao detalhe de stock.',
            'Adicione entradas manuais (recepção de encomenda) ou saídas avulsas.',
            'O stock disponível é recalculado automaticamente com base nos consumos registados.',
            'Consumíveis abaixo do stock mínimo são sinalizados com alerta.',
        ],
    },
    {
        number: 9,
        icon: Users,
        title: 'Gerir Utilizadores',
        role: 'admin',
        description: 'Crie e administre as contas de acesso ao sistema.',
        details: [
            'Aceda a "Utilizadores" no menu lateral (apenas admins).',
            'Crie novos utilizadores com nome, email, palavra-passe e perfil (Utilizador ou Administrador).',            'N\u00e3o existe registo p\u00fablico — todas as contas s\u00e3o geridas exclusivamente pelo administrador.',            'Os utilizadores com perfil "Utilizador" podem criar e editar briefings mas não têm acesso ao catálogo, stock ou gestão de utilizadores.',
            'Os administradores têm acesso total, incluindo eliminação de registos.',
        ],
    },
];

export default function Guide() {
    return (
        <>
            <Head title="Guia de Utilização" />
            <div className="flex min-h-screen flex-col bg-white text-gray-900">

                {/* NAV */}
                <header className="border-b border-gray-200 px-6 py-4">
                    <div className="mx-auto flex max-w-5xl items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                                <Shield size={20} className="text-white" />
                            </div>
                            <span className="font-semibold tracking-tight text-gray-900">Bloco Operatório</span>
                        </Link>
                        <Link
                            href={login()}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Entrar <ChevronRight size={14} />
                        </Link>
                    </div>
                </header>

                {/* HERO */}
                <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50 to-white px-6 py-16 text-center">
                    <div className="mx-auto max-w-2xl">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Guia de Utilização
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Como utilizar a plataforma
                        </h1>
                        <p className="mt-4 text-base text-gray-500">
                            Siga os passos abaixo para registar briefings cirúrgicos, gerir consumíveis e gerar relatórios.
                        </p>
                    </div>
                </section>

                {/* LEGEND */}
                <div className="mx-auto mt-8 flex items-center gap-6 px-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700">Todos</span>
                        Disponível para todos os utilizadores
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 font-medium text-purple-700">Admin</span>
                        Exclusivo para administradores
                    </span>
                </div>

                {/* STEPS */}
                <main className="mx-auto w-full max-w-5xl px-6 py-12">
                    <div className="relative">
                        {/* vertical line */}
                        <div className="absolute left-6 top-0 h-full w-px bg-gray-200 sm:left-8" />

                        <div className="flex flex-col gap-10">
                            {steps.map((step) => {
                                const Icon = step.icon;
                                const isAdmin = step.role === 'admin';
                                return (
                                    <div key={step.number} className="relative flex gap-6 sm:gap-8">
                                        {/* circle */}
                                        <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-sm sm:h-16 sm:w-16 ${
                                            isAdmin
                                                ? 'border-purple-200 bg-purple-50'
                                                : 'border-blue-200 bg-blue-50'
                                        }`}>
                                            <Icon size={22} className={isAdmin ? 'text-purple-600' : 'text-blue-600'} />
                                        </div>

                                        {/* content */}
                                        <div className="flex-1 pb-2">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-medium text-gray-400">
                                                    Passo {step.number}
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    isAdmin
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {isAdmin ? 'Admin' : 'Todos'}
                                                </span>
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-900">{step.title}</h2>
                                            <p className="mt-1 text-sm text-gray-500">{step.description}</p>

                                            <ul className="mt-3 flex flex-col gap-2">
                                                {step.details.map((d, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${isAdmin ? 'text-purple-400' : 'text-blue-400'}`} />
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>

                {/* CTA */}
                <section className="border-t border-gray-100 bg-blue-50 px-6 py-14 text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Pronto para começar?</h2>
                    <p className="mt-2 text-sm text-gray-500">Inicie sessão com as credenciais fornecidas pelo administrador.</p>
                    <Link
                        href={login()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-300/40 transition hover:bg-blue-700"
                    >
                        Aceder ao Sistema <ChevronRight size={16} />
                    </Link>
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
