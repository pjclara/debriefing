import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SectionCard, FormRow, inputCls, selectCls } from '@/components/form-ui';
import { TrendingUp } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
}

interface StockMovimento {
    id?: number;
    consumivel_tipo_id?: number | string;
    tipo_mov?: string;
    referencia?: string;
    codigo?: string;
    vidas_inicial?: number | string;
    vidas_atual?: number | string;
    unidades_inicial?: number | string;
    unidades_atual?: number | string;
    data_entrada?: string;
    data_saida?: string;
    motivo?: string;
    observacoes?: string;
}

interface Props {
    movimento?: StockMovimento;
    tiposMovLabel: Record<string, string>;
    tipos: ConsumivelTipo[];
}

export default function StockMovimentoForm({ movimento, tiposMovLabel, tipos }: Props) {
    const isEdit = !!movimento?.id;
    
    // Definir data padrão como hoje
    const hoje = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, processing, errors } = useForm({
        consumivel_tipo_id: movimento?.consumivel_tipo_id ?? '',
        tipo_mov: movimento?.tipo_mov ?? 'entrada',
        referencia: movimento?.referencia ?? '',
        codigo: movimento?.codigo ?? '',
        vidas_inicial: movimento?.vidas_inicial ?? '',
        vidas_atual: movimento?.vidas_atual ?? movimento?.vidas_inicial ?? '',
        unidades_inicial: movimento?.unidades_inicial ?? '',
        unidades_atual: movimento?.unidades_atual ?? movimento?.unidades_inicial ?? '',
        data_entrada: movimento?.data_entrada ?? hoje,
        data_saida: movimento?.data_saida ?? '',
        motivo: movimento?.motivo ?? '',
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
        
        // No create, garantir que tipo_mov=entrada, data_saida e motivo são null, vidas_atual=vidas_inicial
        const submitData = { ...data };
        if (!isEdit) {
            submitData.tipo_mov = 'entrada';
            submitData.data_saida = '';
            submitData.motivo = '';
            if (isRoboticoVidas) {
                submitData.vidas_atual = submitData.vidas_inicial;
                submitData.unidades_inicial = '';
                submitData.unidades_atual = '';
                submitData.codigo = '';
            } else {
                submitData.vidas_inicial = '';
                submitData.vidas_atual = '';
                submitData.unidades_atual = submitData.unidades_inicial;
                submitData.codigo = '';
            }
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
                        <FormRow label="Tipo de Consumível" error={errors.consumivel_tipo_id}>
                            <select
                                value={data.consumivel_tipo_id}
                                onChange={(e) => setData('consumivel_tipo_id', e.target.value)}
                                className={selectCls}
                                required
                            >
                                <option value="">Selecionar tipo…</option>
                                {tipos.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.nome}
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

                        {isRoboticoVidas && (
                            <FormRow label="Código" error={errors.codigo}>
                                <input
                                    type="text"
                                    value={data.codigo}
                                    onChange={(e) => setData('codigo', e.target.value)}
                                    className={inputCls}
                                    placeholder="Ex: 408414"
                                />
                            </FormRow>
                        )}

                        {!isRoboticoVidas && tipoSelecionado && (
                            <FormRow label="Unidades Iniciais" error={errors.unidades_inicial}>
                                <input
                                    type="number"
                                    value={data.unidades_inicial}
                                    onChange={(e) => setData('unidades_inicial', e.target.value ? Number(e.target.value) : '')}
                                    className={inputCls}
                                    placeholder="Ex: 5"
                                    min="0"
                                    required
                                />
                            </FormRow>
                        )}

                        {isEdit && !isRoboticoVidas && tipoSelecionado && (
                            <FormRow label="Unidades Actuais" error={errors.unidades_atual}>
                                <input
                                    type="number"
                                    value={data.unidades_atual}
                                    onChange={(e) => setData('unidades_atual', e.target.value ? Number(e.target.value) : '')}
                                    className={inputCls}
                                    placeholder="Unidades após consumo"
                                    min="0"
                                />
                            </FormRow>
                        )}

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
                                    <select
                                        value={data.motivo}
                                        onChange={(e) => setData('motivo', e.target.value)}
                                        className={selectCls}
                                    >
                                        <option value="">— Sem motivo —</option>
                                        <option value="consumo">Consumo</option>
                                        <option value="dano">Dano</option>
                                        <option value="outro">Outro</option>
                                    </select>
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
