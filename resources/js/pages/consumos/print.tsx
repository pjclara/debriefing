import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface ConsumivelTipo {
    id: number;
    nome: string;
    categoria: 'robotico_vidas' | 'robotico_descartavel' | 'extra';
}

interface StockMovimento {
    id: number;
    referencia?: string;
    codigo?: string;
    consumivel_tipo?: ConsumivelTipo;
}

interface Briefing {
    id: number;
    data: string;
    sala: string;
    especialidade: string;
}

interface Surgery {
    id: number;
    processo: string;
    procedimento: string;
    briefing: Briefing;
}

interface Consumo {
    id: number;
    quantidade: number;
    observacoes?: string;
    created_at: string;
    surgery: Surgery;
    stock_movimento?: StockMovimento;
}

interface Props {
    consumos: Consumo[];
}

const categoriaLabel: Record<string, string> = {
    robotico_vidas:       'Robótico (vidas)',
    robotico_descartavel: 'Robótico (descartável)',
    extra:                'Extra',
};

function formatDate(d: string) {
    const [y, m, day] = d.substring(0, 10).split('-');
    return `${day}/${m}/${y}`;
}

function formatDateTime(d: string) {
    const dt = new Date(d);
    return dt.toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ConsumosPrint({ consumos }: Props) {
    useEffect(() => {
        const t = setTimeout(() => window.print(), 400);
        return () => clearTimeout(t);
    }, []);

    const today = new Date().toLocaleDateString('pt-PT');

    return (
        <>
            <Head title="Histórico de Consumos – PDF" />

            <style>{`
                @page { size: A4 landscape; margin: 12mm 10mm; }
                body { font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: #111; background: #fff; margin: 0; }
                @media print { .no-print { display: none !important; } }
            `}</style>

            {/* Barra de impressão */}
            <div className="no-print" style={{ padding: '10px 20px', background: '#7c3aed', display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                    onClick={() => window.print()}
                    style={{ background: '#fff', color: '#7c3aed', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                    🖨 Imprimir / Guardar PDF
                </button>
                <button
                    onClick={() => window.close()}
                    style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}
                >
                    Fechar
                </button>
                <span style={{ color: '#e9d5ff', fontSize: 12 }}>
                    {consumos.length} registo{consumos.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div style={{ maxWidth: 1050, margin: '0 auto', padding: '14px 0' }}>

                {/* Cabeçalho */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #7c3aed' }}>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: '#7c3aed' }}>Histórico de Consumos</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Todos os consumos registados</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 11, color: '#6b7280' }}>
                        <div>Gerado em {today}</div>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{consumos.length} registo{consumos.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>

                {consumos.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>Nenhum consumo registado.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={th}>Data</th>
                                <th style={th}>Cirurgia</th>
                                <th style={th}>Sala</th>
                                <th style={th}>Consumível</th>
                                <th style={th}>Categoria</th>
                                <th style={th}>Referência</th>
                                <th style={th}>Código</th>
                                <th style={{ ...th, textAlign: 'center' }}>Qtd.</th>
                                <th style={th}>Observações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consumos.map((c, i) => {
                                const tipo = c.stock_movimento?.consumivel_tipo;
                                const cat  = tipo?.categoria ?? '';
                                return (
                                    <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                        <td style={{ ...td, whiteSpace: 'nowrap', color: '#6b7280' }}>{formatDateTime(c.created_at)}</td>
                                        <td style={td}>
                                            <div style={{ fontWeight: 500 }}>{c.surgery.processo}</div>
                                            <div style={{ color: '#6b7280', fontSize: 9 }}>{c.surgery.procedimento}</div>
                                        </td>
                                        <td style={{ ...td, whiteSpace: 'nowrap', color: '#6b7280' }}>
                                            {c.surgery.briefing
                                                ? `Sala ${c.surgery.briefing.sala} · ${formatDate(c.surgery.briefing.data)}`
                                                : '—'}
                                        </td>
                                        <td style={{ ...td, fontWeight: 500 }}>{tipo?.nome ?? '—'}</td>
                                        <td style={td}>{cat ? (categoriaLabel[cat] ?? cat) : '—'}</td>
                                        <td style={{ ...td, color: '#6b7280' }}>{c.stock_movimento?.referencia ?? '—'}</td>
                                        <td style={{ ...td, color: '#6b7280' }}>
                                            {cat === 'robotico_vidas' ? (c.stock_movimento?.codigo ?? '—') : '—'}
                                        </td>
                                        <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{c.quantidade}</td>
                                        <td style={{ ...td, color: '#6b7280' }}>{c.observacoes || '—'}</td>
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
