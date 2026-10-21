<?php

namespace App\Http\Controllers;

use App\Models\Briefing;
use App\Models\Debriefing;
use App\Models\Surgery;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EstatisticasController extends Controller
{
    /**
     * Página de estatísticas agregadas, sem qualquer dado identificativo de
     * doentes (sem nº de processo, sem ligações a briefings/cirurgias
     * individuais) — pensada para poder ser consultada por qualquer perfil,
     * incluindo o papel "visitante".
     */
    public function __invoke(): Response
    {
        $hoje = Carbon::today();
        $mes  = Carbon::now();

        $stats = [
            'briefingsTotal'      => Briefing::count(),
            'briefingsMes'        => Briefing::whereYear('data', $mes->year)->whereMonth('data', $mes->month)->count(),
            'cirurgiasTotal'      => Surgery::count(),
            'cirurgiasMes'        => Surgery::whereHas('briefing', function ($q) use ($mes) {
                $q->whereYear('data', $mes->year)->whereMonth('data', $mes->month);
            })->count(),
            'debriefsEmFalta'     => Briefing::whereDoesntHave('debriefing')->where('data', '<=', $hoje)->count(),
            'complicacoesMes'     => Debriefing::where('complicacoes', true)
                ->whereHas('briefing', fn ($q) => $q->whereYear('data', $mes->year)->whereMonth('data', $mes->month))
                ->count(),
            'eventosAdversosMes'  => Debriefing::where('evento_adverso', true)
                ->whereHas('briefing', fn ($q) => $q->whereYear('data', $mes->year)->whereMonth('data', $mes->month))
                ->count(),
        ];

        // ── Cirurgias por departamento ──────────────────────────────────────
        $cirurgiasPorDepartamento = Surgery::query()
            ->join('briefings', 'briefings.id', '=', 'surgeries.briefing_id')
            ->select('briefings.especialidade as departamento', DB::raw('COUNT(surgeries.id) as total'))
            ->groupBy('briefings.especialidade')
            ->orderByDesc('total')
            ->get();

        // ── Top consumíveis gastos ───────────────────────────────────────────
        $topGastos = DB::table('consumos')
            ->join('stock_movimentos', 'consumos.stock_movimento_id', '=', 'stock_movimentos.id')
            ->join('consumivel_tipos', 'stock_movimentos.consumivel_tipo_id', '=', 'consumivel_tipos.id')
            ->select(
                'consumivel_tipos.id',
                'consumivel_tipos.nome',
                'consumivel_tipos.categoria',
                DB::raw('SUM(consumos.quantidade) as total_quantidade'),
                DB::raw('COUNT(consumos.id) as total_usos'),
            )
            ->groupBy('consumivel_tipos.id', 'consumivel_tipos.nome', 'consumivel_tipos.categoria')
            ->orderByDesc('total_quantidade')
            ->limit(10)
            ->get();

        // ── Taxa de complicações / eventos adversos por mês (últimos 6) ──────
        $taxaMensal = Briefing::query()
            ->join('debriefings', 'debriefings.briefing_id', '=', 'briefings.id')
            ->where('briefings.data', '>=', $hoje->copy()->subMonths(5)->startOfMonth())
            ->select(
                DB::raw("DATE_FORMAT(briefings.data, '%Y-%m') as mes"),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(debriefings.complicacoes) as complicacoes'),
                DB::raw('SUM(debriefings.evento_adverso) as eventos_adversos'),
            )
            ->groupBy('mes')
            ->orderBy('mes')
            ->get()
            ->map(fn ($row) => [
                'mes'              => $row->mes,
                'total'            => (int) $row->total,
                'complicacoes'     => (int) $row->complicacoes,
                'eventos_adversos' => (int) $row->eventos_adversos,
            ]);

        // ── Tempos médios de cirurgia (globais) ──────────────────────────────
        // AVG() e TIMESTAMPDIFF() ignoram automaticamente valores nulos, mas
        // algumas cirurgias têm "fim" registado antes de "início" por erro de
        // introdução — essas diferenças negativas são também excluídas.
        $diffPrep    = 'CASE WHEN TIMESTAMPDIFF(MINUTE, prep_inicio, prep_fim) >= 0 THEN TIMESTAMPDIFF(MINUTE, prep_inicio, prep_fim) END';
        $diffConsola = 'CASE WHEN TIMESTAMPDIFF(MINUTE, consola_inicio, consola_fim) >= 0 THEN TIMESTAMPDIFF(MINUTE, consola_inicio, consola_fim) END';

        $temposGlobais = Surgery::query()
            ->selectRaw("AVG({$diffPrep}) as prep_media")
            ->selectRaw('AVG(docking) as docking_media')
            ->selectRaw("AVG({$diffConsola}) as consola_media")
            ->first();

        // ── Tempos médios de cirurgia por procedimento (top 8 por volume) ────
        $temposPorProcedimento = Surgery::query()
            ->select('procedimento')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("AVG({$diffPrep}) as prep_media")
            ->selectRaw('AVG(docking) as docking_media')
            ->selectRaw("AVG({$diffConsola}) as consola_media")
            ->groupBy('procedimento')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn ($row) => [
                'procedimento'  => $row->procedimento,
                'total'         => (int) $row->total,
                'prep_media'    => $row->prep_media !== null ? round($row->prep_media) : null,
                'docking_media' => $row->docking_media !== null ? round($row->docking_media) : null,
                'consola_media' => $row->consola_media !== null ? round($row->consola_media) : null,
            ]);

        return Inertia::render('estatisticas/index', [
            'stats'                    => $stats,
            'cirurgiasPorDepartamento' => $cirurgiasPorDepartamento,
            'topGastos'                => $topGastos,
            'taxaMensal'               => $taxaMensal,
            'temposGlobais'            => [
                'prep_media'    => $temposGlobais->prep_media !== null ? round($temposGlobais->prep_media) : null,
                'docking_media' => $temposGlobais->docking_media !== null ? round($temposGlobais->docking_media) : null,
                'consola_media' => $temposGlobais->consola_media !== null ? round($temposGlobais->consola_media) : null,
            ],
            'temposPorProcedimento' => $temposPorProcedimento,
        ]);
    }
}
