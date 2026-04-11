import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls } from '@/components/form-ui';
import { TrendingUp } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: string;
}

interface StockMovimento {
    id?: number;
    consumivel_tipo_id?: number;
    tipo_mov?: string;
    referencia?: string;
    codigo?: string;
    vidas?: number | string;
    data_entrada?: string;
    observacoes?: string;
    tipo?: ConsumivelTipo;
}

interface Props {
    movimento?: StockMovimento;
    tipos: ConsumivelTipo[];
    tiposMovLabel: Record<string, string>;
}

export default function StockMovimentoForm({ movimento, tipos, tiposMovLabel }: Props) {
    const isEdit = !!movimento?.id;
    
    // Definir data padrão como hoje
    const hoje = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, processing, errors } = useForm({
        consumivel_tipo_id: movimento?.consumivel_tipo_id ?? '',
        tipo_mov: movimento?.tipo_mov ?? 'entrada',
        referencia: movimento?.referencia ?? '',
        codigo: movimento?.codigo ?? '',
        vidas: movimento?.vidas ?? '',
        data_entrada: movimento?.data_entrada ?? hoje,
        observacoes: movimento?.observacoes ?? '',
    });

    // Obter categoria do tipo selecionado
    const tipoSelecionado = tipos.find((t) => t.id === Number(data.consumivel_tipo_id));
    const isRoboticoVidas = tipoSelecionado?.categoria === 'robotico_vidas';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo', href: '#' },
        { title: 'Movimentos de Stock', href: '/stock_movimentos' },
        { title: isEdit ? 'Editar' : 'Novo', href: '#' },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/stock_movimentos/${movimento!.id}`);
        } else {
            post('/stock_movimentos');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar Movimento' : 'Novo Movimento'} />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    {isEdit ? 'Editar Movimento de Stock' : 'Novo Movimento de Stock'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <SectionCard icon={TrendingUp} title="Dados do Movimento">
                        <FormRow label="Tipo de Consumível" error={errors.consumivel_tipo_id}>
                            <select
                                value={data.consumivel_tipo_id}
                                onChange={(e) => setData('consumivel_tipo_id', e.target.value ? Number(e.target.value) : '')}
                                className={selectCls}
                                required
                            >
                                <option value="">Seleccionar tipo...</option>
                                {tipos.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Tipo de Movimento" error={errors.tipo_mov}>
                            <select value={data.tipo_mov} onChange={(e) => setData('tipo_mov', e.target.value)} className={selectCls} required>
                                {Object.entries(tiposMovLabel).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Referência" error={errors.referencia}>
                            <input
                                type="text"
                                value={data.referencia}
                                onChange={(e) => setData('referencia', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: PROGRASP-001"
                            />
                        </FormRow>

                        <FormRow label="Código" error={errors.codigo}>
                            <input
                                type="text"
                                value={data.codigo}
                                onChange={(e) => setData('codigo', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: 408414"
                            />
                        </FormRow>

                        {isRoboticoVidas && (
                            <FormRow label="Vidas" error={errors.vidas}>
                                <input
                                    type="number"
                                    value={data.vidas}
                                    onChange={(e) => setData('vidas', e.target.value ? Number(e.target.value) : '')}
                                    className={inputCls}
                                    placeholder="Ex: 10"
                                    min="1"
                                />
                            </FormRow>
                        )}

                        <FormRow label="Data de Entrada" error={errors.data_entrada}>
                            <input
                                type="date"
                                value={data.data_entrada}
                                onChange={(e) => setData('data_entrada', e.target.value)}
                                className={inputCls}
                                required
                            />
                        </FormRow>

                        <FormRow label="Observações" error={errors.observacoes}>
                            <textarea
                                value={data.observacoes}
                                onChange={(e) => setData('observacoes', e.target.value)}
                                className={inputCls}
                                rows={3}
                                placeholder="Notas adicionais..."
                            />
                        </FormRow>
                    </SectionCard>

                    <div className="mt-6 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing ? 'A guardar…' : isEdit ? 'Actualizar' : 'Registar Movimento'}
                        </button>
                        <Link href="/stock_movimentos" className="text-sm text-gray-500 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
