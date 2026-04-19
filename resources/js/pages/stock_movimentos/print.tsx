import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: string;
}

interface StockMovimento {
    id: number;
    consumivel_tipo: ConsumivelTipo | null;
    tipo_mov: string;
    referencia: string | null;
    codigo: string | null;
    vidas_inicial: number | null;
    vidas_atual: number | null;
    unidades_inicial: number | null;
    unidades_atual: number | null;
    data_entrada: string;
    data_saida: string | null;
    motivo: string | null;
    observacoes: string | null;
}

interface Props {
    movimentos: StockMovimento[];
    tiposMovLabel: Record<string, string>;
    filters: { q?: string; tipo?: string; data_de?: string; data_ate?: string };
}

const tiposMovColors: Record<string, string> = {
    entrada:   '#dcfce7',
    saida:     '#fee2e2',
    ajuste:    '#fef9c3',
    encomenda: '#dbeafe',
    devolucao: '#f3e8ff',
};

const tiposMovTextColors: Record<string, string> = {
    entrada:   '#166534',
    saida:     '#991b1b',
    ajuste:    '#854d0e',
    encomenda: '#1e40af',
    devolucao: '#6b21a8',
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('pt-PT');
}

function buildFilterDesc(filters: Props['filters'], tiposMovLabel: Record<string, string>) {
    const parts: string[] = [];
    if (filters.q)       parts.push(`Pesquisa: "${filters.q}"`);
    if (filters.tipo)    parts.push(`Tipo: ${tiposMovLabel[filters.tipo] ?? filters.tipo}`);
    if (filters.data_de)  parts.push(`De: ${formatDate(filters.data_de)}`);
    if (filters.data_ate) parts.push(`Até: ${formatDate(filters.data_ate)}`);
    return parts.length > 0 ? parts.join(' · ') : 'Todos os movimentos';
}

export default function StockMovimentosPrint({ movimentos, tiposMovLabel, filters }: Props) {
    useEffect(() => {
        const t = setTimeout(() => window.print(), 400);
        return () => clearTimeout(t);
    }, []);

    const filterDesc = buildFilterDesc(filters, tiposMovLabel);
    const today = new Date().toLocaleDateString('pt-PT');

    return (
        <>
            <Head title="Movimentos de Stock – PDF" />

            <style>{`
                @page { size: A4 landscape; margin: 12mm 10mm; }
                body { font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: #111; background: #fff; margin: 0; }
                @media print { .no-print { display: none !important; } }
            `}</style>

            {/* Barra de impressão */}
            <div className="no-print" style={{ padding: '10px 20px', background: '#1d4ed8', display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                    onClick={() => window.print()}
                    style={{ background: '#fff', color: '#1d4ed8', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                    🖨 Imprimir / Guardar PDF
                </button>
                <button
                    onClick={() => window.close()}
                    style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}
                >
                    Fechar
                </button>
                <span style={{ color: '#93c5fd', fontSize: 12 }}>
                    {movimentos.length} movimento{movimentos.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div style={{ maxWidth: 1050, margin: '0 auto', padding: '14px 0' }}>

                {/* Cabeçalho */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #1d4ed8' }}>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: '#1d4ed8' }}>Movimentos de Stock</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{filterDesc}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 11, color: '#6b7280' }}>
                        <div>Gerado em {today}</div>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{movimentos.length} registo{movimentos.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>

                {movimentos.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>Nenhum movimento encontrado.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={th}>Tipo</th>
                                <th style={th}>Designação</th>
                                <th style={th}>Referência</th>
                                <th style={th}>Código</th>
                                <th style={{ ...th, textAlign: 'center' }}>Qtd.</th>
                                <th style={th}>Data Entrada</th>
                                <th style={th}>Data Saída</th>
                                <th style={th}>Motivo</th>
                                <th style={th}>Observações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimentos.map((mov, i) => {
                                const isVidas = mov.consumivel_tipo?.categoria === 'robotico_vidas';
                                const qty = isVidas
                                    ? (mov.vidas_atual !== null ? `${mov.vidas_atual}/${mov.vidas_inicial}x` : '—')
                                    : (mov.unidades_atual !== null ? `${mov.unidades_atual}/${mov.unidades_inicial} un.` : '—');
                                return (
                                    <tr key={mov.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                        <td style={td}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '2px 7px',
                                                borderRadius: 10,
                                                fontSize: 9,
                                                fontWeight: 600,
                                                background: tiposMovColors[mov.tipo_mov] ?? '#f3f4f6',
                                                color: tiposMovTextColors[mov.tipo_mov] ?? '#374151',
                                            }}>
                                                {tiposMovLabel[mov.tipo_mov] ?? mov.tipo_mov}
                                            </span>
                                        </td>
                                        <td style={{ ...td, fontWeight: 500 }}>{mov.consumivel_tipo?.nome ?? '—'}</td>
                                        <td style={{ ...td, color: '#6b7280' }}>{mov.referencia || '—'}</td>
                                        <td style={{ ...td, color: '#6b7280' }}>{isVidas ? (mov.codigo || '—') : '—'}</td>
                                        <td style={{ ...td, textAlign: 'center', fontWeight: 600 }}>{qty}</td>
                                        <td style={{ ...td, color: '#6b7280', whiteSpace: 'nowrap' }}>{formatDate(mov.data_entrada)}</td>
                                        <td style={{ ...td, color: '#6b7280', whiteSpace: 'nowrap' }}>{mov.data_saida ? formatDate(mov.data_saida) : '—'}</td>
                                        <td style={{ ...td, color: '#6b7280' }}>{mov.motivo || '—'}</td>
                                        <td style={{ ...td, color: '#6b7280' }}>{mov.observacoes || '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

const th: React.CSSProperties = {
    padding: '5px 8px',
    textAlign: 'left',
    fontSize: 9,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid #e5e7eb',
};

const td: React.CSSProperties = {
    padding: '5px 8px',
    fontSize: 10,
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'top',
};
