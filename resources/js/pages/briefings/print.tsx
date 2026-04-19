import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface Consumo {
    id: number;
    designacao: string;
    referencia?: string;
    quantidade: number;
    unidade: string;
    observacoes?: string;
    consumivel?: { designacao: string; categoria: string };
}

interface Surgery {
    id: number;
    processo: string;
    procedimento: string;
    destino: string;
    prep_inicio?: string;
    prep_fim?: string;
    docking?: number;
    consola_inicio?: string;
    consola_fim?: string;
    antecedentes_relevantes: boolean | null;
    descricao_antecedentes?: string;
    comorbidades: boolean | null;
    descricao_comorbidades?: string;
    variacoes_tecnicas: boolean | null;
    descricao_variacoes?: string;
    passos_criticos: boolean | null;
    descricao_passos?: string;
    consentimento: boolean | null;
    lateralidade: string;
    medicacao_suspensa: boolean | null;
    antibiotico?: string;
    profilaxia: boolean | null;
    perdas_estimadas?: number;
    reserva_ativa: boolean | null;
    reserva_unidades?: number;
    trocares?: number;
    otica?: string;
    monopolar_coag_watts?: number;
    monopolar_coag_tipo?: string;
    monopolar_cut_watts?: number;
    monopolar_cut_tipo?: string;
    bipolar_coag_watts?: number;
    bipolar_coag_tipo?: string;
    b1?: number[];
    b2?: number[];
    b3?: number[];
    b4?: number[];
    equipamento_extra?: string;
    consumos?: Consumo[];
}

interface Debriefing {
    complicacoes: boolean | null;
    falha_sistema: boolean | null;
    falha_solucionada?: boolean | null;
    falha_reportada?: boolean | null;
    inicio_a_horas: boolean | null;
    fim_a_horas: boolean | null;
    evento_adverso: boolean | null;
    correu_bem?: string;
    melhorar?: string;
    falha_comunicacao?: string;
}

interface Briefing {
    id: number;
    data: string;
    hora: string;
    especialidade: string;
    sala: string;
    equipa_segura: boolean | null;
    alteracao_equipa: boolean | null;
    descricao_alteracao_equipa?: string;
    problemas_sala: boolean | null;
    descricao_problemas?: string;
    equipamento_ok: boolean | null;
    descricao_equipamento?: string;
    mesa_emparelhada: boolean | null;
    ordem_mantida: boolean | null;
    descricao_ordem?: string;
    surgeries: Surgery[];
    debriefing?: Debriefing | null;
}

function formatDate(d: string) {
    const [y, m, day] = d.substring(0, 10).split('-');
    return `${day}/${m}/${y}`;
}

function Yn({ value }: { value: boolean | null }) {
    if (value === null || value === undefined) {
        return <span style={{ color: '#9ca3af', fontWeight: 500 }}>—</span>;
    }
    return (
        <span style={{ color: value ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
            {value ? 'Sim' : 'Não'}
        </span>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <tr>
            <td style={{ width: '52%', padding: '4px 8px', color: '#6b7280', fontSize: 11, verticalAlign: 'top', borderBottom: '1px solid #f3f4f6' }}>{label}</td>
            <td style={{ padding: '4px 8px', fontSize: 11, fontWeight: 500, verticalAlign: 'top', borderBottom: '1px solid #f3f4f6' }}>{value}</td>
        </tr>
    );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ background: color, color: '#fff', padding: '5px 10px', borderRadius: '6px 6px 0 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {title}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 6px 6px', background: '#fff' }}>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export default function BriefingPrint({ briefing }: { briefing: Briefing }) {
    useEffect(() => {
        // Auto-print após render
        const timer = setTimeout(() => window.print(), 400);
        return () => clearTimeout(timer);
    }, []);

    const formatDateTime = (dt: string | undefined) => {
        if (!dt) return '—';
        const date = new Date(dt);
        return date.toLocaleString('pt-PT', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatInstruments = (s: Surgery) => {
        const parts = [];
        
        if (s.monopolar_coag_watts !== null && s.monopolar_coag_watts !== undefined) {
            parts.push(`Mono Coag: ${s.monopolar_coag_watts}W ${s.monopolar_coag_tipo || ''}`);
        }
        if (s.monopolar_cut_watts !== null && s.monopolar_cut_watts !== undefined) {
            parts.push(`Mono Cut: ${s.monopolar_cut_watts}W ${s.monopolar_cut_tipo || ''}`);
        }
        if (s.bipolar_coag_watts !== null && s.bipolar_coag_watts !== undefined) {
            parts.push(`Bipolar: ${s.bipolar_coag_watts}W ${s.bipolar_coag_tipo || ''}`);
        }
        
        return parts.length > 0 ? parts.join(' · ') : '—';
    };

    const formatPincas = (arr: number[] | undefined) => {
        if (!arr || arr.length === 0) return '—';
        return arr.join(', ');
    };

    return (
        <>
            <Head title={`Briefing ${formatDate(briefing.data)} – Sala ${briefing.sala}`} />

            <style>{`
                @page { size: A4; margin: 14mm 12mm; }
                body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #111; background: #fff; margin: 0; }
                @media print { .no-print { display: none !important; } }
            `}</style>

            {/* Botão de impressão — oculto no print */}
            <div className="no-print" style={{ padding: '12px 20px', background: '#1d4ed8', display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                    onClick={() => window.print()}
                    style={{ background: '#fff', color: '#1d4ed8', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                    🖨 Imprimir / Guardar PDF
                </button>
                <button
                    onClick={() => window.close()}
                    style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}
                >
                    Fechar
                </button>
                <span style={{ color: '#93c5fd', fontSize: 12 }}>
                    Briefing {formatDate(briefing.data)} – {briefing.hora} · {briefing.especialidade} · Sala {briefing.sala}
                </span>
            </div>

            <div style={{ maxWidth: 780, margin: '0 auto', padding: '16px 0' }}>

                {/* Cabeçalho */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #1d4ed8' }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#1d4ed8' }}>Briefing Cirúrgico</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                            {briefing.especialidade} · Sala {briefing.sala}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{formatDate(briefing.data)}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{briefing.hora}</div>
                    </div>
                </div>

                {/* ── SECÇÃO 1: BRIEFING ── */}
                <Section title="1 · Checklist da Sala" color="#1d4ed8">
                    <Row label="Dotação segura" value={<Yn value={briefing.equipa_segura} />} />
                    <Row label="Alteração de equipa" value={<Yn value={briefing.alteracao_equipa} />} />
                    {briefing.descricao_alteracao_equipa && <Row label="Desc. alteração equipa" value={briefing.descricao_alteracao_equipa} />}
                    <Row label="Problemas identificados na sala" value={<Yn value={briefing.problemas_sala} />} />
                    {briefing.descricao_problemas && <Row label="Desc. problemas" value={briefing.descricao_problemas} />}
                    <Row label="Equipamento, instrumental e consumíveis OK" value={<Yn value={briefing.equipamento_ok} />} />
                    {briefing.descricao_equipamento && <Row label="Desc. equipamento" value={briefing.descricao_equipamento} />}
                    <Row label="Mesa operatória emparelhada" value={<Yn value={briefing.mesa_emparelhada} />} />
                    <Row label="Ordem de doentes mantida" value={<Yn value={briefing.ordem_mantida} />} />
                    {briefing.descricao_ordem && <Row label="Alterações à ordem" value={briefing.descricao_ordem} />}
                </Section>

                {/* ── SECÇÃO 2: CIRURGIAS ── */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ background: '#7c3aed', color: '#fff', padding: '5px 10px', borderRadius: '6px 6px 0 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        2 · Cirurgias ({briefing.surgeries.length})
                    </div>
                    {briefing.surgeries.length === 0 ? (
                        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderTop: 'none', color: '#9ca3af', fontSize: 11 }}>
                            Nenhuma cirurgia registada.
                        </div>
                    ) : (
                        briefing.surgeries.map((s, i) => (
                            <div key={s.id} style={{ border: '1px solid #e5e7eb', borderTop: i === 0 ? 'none' : '1px solid #e5e7eb', padding: '10px 12px', background: i % 2 === 0 ? '#fff' : '#fafafa', pageBreakInside: 'avoid' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}. {s.procedimento}</span>
                                    <span style={{ fontSize: 11, color: '#6b7280' }}>Proc. {s.processo} · {s.destino}</span>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <Row label="Consentimento" value={<Yn value={s.consentimento} />} />
                                        <Row label="Lateralidade" value={s.lateralidade} />
                                        <Row label="Medicação suspensa" value={<Yn value={s.medicacao_suspensa} />} />
                                        {s.antibiotico && <Row label="Antibiótico" value={s.antibiotico} />}
                                        <Row label="Profilaxia" value={<Yn value={s.profilaxia} />} />
                                        {s.perdas_estimadas != null && <Row label="Perdas estimadas (mL)" value={s.perdas_estimadas} />}
                                        <Row label="Reserva activa" value={<Yn value={s.reserva_ativa} />} />
                                        {s.reserva_unidades != null && <Row label="Reserva (unidades)" value={s.reserva_unidades} />}
                                        {s.trocares != null && <Row label="Trócares" value={s.trocares} />}
                                        {s.otica && <Row label="Ótica" value={`${s.otica}°`} />}
                                        {s.prep_inicio && <Row label="Prep. Início" value={formatDateTime(s.prep_inicio)} />}
                                        {s.prep_fim && <Row label="Prep. Fim" value={formatDateTime(s.prep_fim)} />}
                                        {s.docking != null && <Row label="Docking (min)" value={s.docking} />}
                                        {s.consola_inicio && <Row label="Consola Início" value={formatDateTime(s.consola_inicio)} />}
                                        {s.consola_fim && <Row label="Consola Fim" value={formatDateTime(s.consola_fim)} />}
                                        <Row label="Instrumental robótico" value={formatInstruments(s)} />
                                        {s.b1 && s.b1.length > 0 && <Row label="B1 - Pinças" value={formatPincas(s.b1)} />}
                                        {s.b2 && s.b2.length > 0 && <Row label="B2 - Pinças" value={formatPincas(s.b2)} />}
                                        {s.b3 && s.b3.length > 0 && <Row label="B3 - Pinças" value={formatPincas(s.b3)} />}
                                        {s.b4 && s.b4.length > 0 && <Row label="B4 - Pinças" value={formatPincas(s.b4)} />}
                                        {s.equipamento_extra && <Row label="Equipamento extra" value={s.equipamento_extra} />}
                                    </tbody>
                                </table>

                                {/* Consumíveis utilizados */}
                                {s.consumos && s.consumos.length > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                                            Consumíveis utilizados
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                                            <thead>
                                                <tr style={{ background: '#f5f3ff' }}>
                                                    <th style={{ padding: '3px 6px', textAlign: 'left', borderBottom: '1px solid #ddd6fe', color: '#6d28d9' }}>Designação</th>
                                                    <th style={{ padding: '3px 6px', textAlign: 'left', borderBottom: '1px solid #ddd6fe', color: '#6d28d9' }}>Ref.</th>
                                                    <th style={{ padding: '3px 6px', textAlign: 'center', borderBottom: '1px solid #ddd6fe', color: '#6d28d9' }}>Qtd.</th>
                                                    <th style={{ padding: '3px 6px', textAlign: 'left', borderBottom: '1px solid #ddd6fe', color: '#6d28d9' }}>Un.</th>
                                                    <th style={{ padding: '3px 6px', textAlign: 'left', borderBottom: '1px solid #ddd6fe', color: '#6d28d9' }}>Obs.</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {s.consumos.map((c, ci) => (
                                                    <tr key={c.id} style={{ background: ci % 2 === 0 ? '#fff' : '#faf5ff' }}>
                                                        <td style={{ padding: '3px 6px', borderBottom: '1px solid #f3f4f6' }}>{c.consumivel?.designacao ?? c.designacao}</td>
                                                        <td style={{ padding: '3px 6px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{c.referencia ?? '—'}</td>
                                                        <td style={{ padding: '3px 6px', borderBottom: '1px solid #f3f4f6', textAlign: 'center', fontWeight: 600 }}>{c.quantidade}</td>
                                                        <td style={{ padding: '3px 6px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{c.unidade}</td>
                                                        <td style={{ padding: '3px 6px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{c.observacoes ?? '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Indicadores clínicos */}
                                {[
                                    { flag: s.antecedentes_relevantes, label: 'Antecedentes de relevo', desc: s.descricao_antecedentes },
                                    { flag: s.comorbidades, label: 'Comorbidades', desc: s.descricao_comorbidades },
                                    { flag: s.variacoes_tecnicas, label: 'Variações técnicas', desc: s.descricao_variacoes },
                                    { flag: s.passos_criticos, label: 'Passos críticos', desc: s.descricao_passos },
                        ].filter(f => f.flag === true).length > 0 && (
                                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {[
                                            { flag: s.antecedentes_relevantes, label: 'Antecedentes de relevo', desc: s.descricao_antecedentes },
                                            { flag: s.comorbidades, label: 'Comorbidades', desc: s.descricao_comorbidades },
                                            { flag: s.variacoes_tecnicas, label: 'Variações técnicas', desc: s.descricao_variacoes },
                                            { flag: s.passos_criticos, label: 'Passos críticos', desc: s.descricao_passos },
                                        ].filter(f => f.flag === true).map(f => (
                                            <div key={f.label} style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 4, padding: '4px 8px', fontSize: 11 }}>
                                                <strong>⚠ {f.label}:</strong>{f.desc ? ' ' + f.desc : ' Sim'}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* ── SECÇÃO 3: DEBRIEFING ── */}
                {briefing.debriefing ? (
                    <Section title="3 · Debriefing" color="#059669">
                        <Row label="Complicações intra-operatórias" value={<Yn value={briefing.debriefing.complicacoes} />} />
                        <Row label="Falha no sistema Da Vinci Xi" value={<Yn value={briefing.debriefing.falha_sistema} />} />
                        {briefing.debriefing.falha_solucionada !== undefined && briefing.debriefing.falha_solucionada !== null && <Row label="Falha solucionada" value={<Yn value={briefing.debriefing.falha_solucionada} />} />}
                        {briefing.debriefing.falha_reportada !== undefined && briefing.debriefing.falha_reportada !== null && <Row label="Falha reportada" value={<Yn value={briefing.debriefing.falha_reportada} />} />}
                        <Row label="Lista operatória – Iniciou a horas" value={<Yn value={briefing.debriefing.inicio_a_horas} />} />
                        <Row label="Lista operatória – Finalizou a horas" value={<Yn value={briefing.debriefing.fim_a_horas} />} />
                        <Row label="Evento adverso notificado" value={<Yn value={briefing.debriefing.evento_adverso} />} />
                        {briefing.debriefing.correu_bem && <Row label="O que correu bem" value={briefing.debriefing.correu_bem} />}
                        {briefing.debriefing.melhorar && <Row label="O que podia melhorar" value={briefing.debriefing.melhorar} />}
                        {briefing.debriefing.falha_comunicacao && <Row label="Falha de comunicação" value={briefing.debriefing.falha_comunicacao} />}
                    </Section>
                ) : (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 12px', fontSize: 11, color: '#b91c1c' }}>
                        ⚠ Debriefing ainda não registado.
                    </div>
                )}

                {/* Rodapé */}
                <div style={{ marginTop: 24, paddingTop: 8, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af' }}>
                    <span>Gestão de Bloco Operatório</span>
                    <span>Gerado em {new Date().toLocaleString('pt-PT')}</span>
                </div>

            </div>
        </>
    );
}
