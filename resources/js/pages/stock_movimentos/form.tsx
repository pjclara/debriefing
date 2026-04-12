import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls } from '@/components/form-ui';
import { TrendingUp } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Consumivel {
    id: number;
    designacao: string;
    categoria: string;
}

interface StockMovimento {
    id?: number;
    consumivel_id?: number;
    tipo_mov?: string;
    referencia?: string;
    codigo?: string;
    vidas_inicial?: number | string;
    vidas_atual?: number | string;
    data_entrada?: string;
    data_saida?: string;
    motivo?: string;
    observacoes?: string;
    consumivel?: Consumivel;
}

interface Props {
    movimento?: StockMovimento;
    consumiveis: Consumivel[];
    tiposMovLabel: Record<string, string>;
}

export default function StockMovimentoForm({ movimento, consumiveis, tiposMovLabel }: Props) {
    const isEdit = !!movimento?.id;
    
    // Definir data padrão como hoje
    const hoje = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, processing, errors } = useForm({
        consumivel_id: movimento?.consumivel_id ?? '',
        tipo_mov: movimento?.tipo_mov ?? 'entrada',
        referencia: movimento?.referencia ?? '',
        codigo: movimento?.codigo ?? '',
        vidas_inicial: movimento?.vidas_inicial ?? '',
        vidas_atual: movimento?.vidas_atual ?? movimento?.vidas_inicial ?? '',
        data_entrada: movimento?.data_entrada ?? hoje,
        data_saida: movimento?.data_saida ?? '',
        motivo: movimento?.motivo ?? '',
        observacoes: movimento?.observacoes ?? '',
    });

    // Obter categoria do consumível selecionado
    const consumivelSelecionado = consumiveis.find((c) => c.id === Number(data.consumivel_id));
    const isRoboticoVidas = consumivelSelecionado?.categoria === 'robotico_vidas';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Catálogo', href: '#' },
        { title: 'Movimentos de Stock', href: '/stock_movimentos' },
        { title: isEdit ? 'Editar' : 'Novo', href: '#' },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        // No create, garantir que tipo_mov=entrada, data_saida e motivo são null, vidas_atual=vidas_inicial
        const submitData = { ...data };
        if (!isEdit) {
            submitData.tipo_mov = 'entrada';
            submitData.data_saida = '';
            submitData.motivo = '';
            submitData.vidas_atual = submitData.vidas_inicial;
        }
        
        if (isEdit) {
            put(`/stock_movimentos/${movimento!.id}`, { data: submitData });
        } else {
            post('/stock_movimentos', { data: submitData });
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
                        <FormRow label="Consumível" error={errors.consumivel_id}>
                            <select
                                value={data.consumivel_id}
                                onChange={(e) => setData('consumivel_id', e.target.value ? Number(e.target.value) : '')}
                                className={selectCls}
                                required
                            >
                                <option value="">Seleccionar consumível...</option>
                                {consumiveis.map((consumivel) => (
                                    <option key={consumivel.id} value={consumivel.id}>
                                        {consumivel.designacao}
                                    </option>
                                ))}
                            </select>
                        </FormRow>

                        {isEdit && (
                            <FormRow label="Tipo de Movimento" error={errors.tipo_mov}>
                                <select value={data.tipo_mov} onChange={(e) => setData('tipo_mov', e.target.value)} className={selectCls} required>
                                    {Object.entries(tiposMovLabel).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </FormRow>
                        )}

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
                            <FormRow label="Vidas Iniciais" error={errors.vidas_inicial}>
                                <input
                                    type="number"
                                    value={data.vidas_inicial}
                                    onChange={(e) => setData('vidas_inicial', e.target.value ? Number(e.target.value) : '')}
                                    className={inputCls}
                                    placeholder="Ex: 10"
                                    min="1"
                                    required={isRoboticoVidas}
                                />
                            </FormRow>
                        )}

                        {isEdit && isRoboticoVidas && (
                            <FormRow label="Vidas Actuais" error={errors.vidas_atual}>
                                <input
                                    type="number"
                                    value={data.vidas_atual}
                                    onChange={(e) => setData('vidas_atual', e.target.value ? Number(e.target.value) : '')}
                                    className={inputCls}
                                    placeholder="Vidas após consumo"
                                    min="0"
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

                        {isEdit && (
                            <>
                                <FormRow label="Data de Saída" error={errors.data_saida}>
                                    <input
                                        type="date"
                                        value={data.data_saida}
                                        onChange={(e) => setData('data_saida', e.target.value)}
                                        className={inputCls}
                                    />
                                </FormRow>

                                <FormRow label="Motivo da Saída" error={errors.motivo}>
                                    <input
                                        type="text"
                                        value={data.motivo}
                                        onChange={(e) => setData('motivo', e.target.value)}
                                        className={inputCls}
                                        placeholder="Ex: Consumo em cirurgia, Devolução ao fornecedor"
                                    />
                                </FormRow>
                            </>
                        )}

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
