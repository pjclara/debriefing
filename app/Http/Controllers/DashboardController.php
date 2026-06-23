<?php

namespace App\Http\Controllers;

use App\Models\Briefing;
use App\Models\Debriefing;
use App\Models\StockMovimento;
use App\Models\Surgery;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $hoje = Carbon::today();
        $mes  = Carbon::now();

        // ── KPIs ─────────────────────────────────────────────────────────────
        $briefingsTotal = Briefing::query()->count('*');

        $briefingsSemana = Briefing::query()->whereBetween('data', [$hoje->copy()->startOfWeek(), $hoje->copy()->endOfWeek()], 'and')->count('*');

        $briefingsMes = Briefing::query()->whereYear('data', '=', $mes->year, 'and')
            ->whereMonth('data', '=', $mes->month, 'and')
            ->count('*');

        $cirurgiasTotal = Surgery::query()->count('*');

        $cirurgiasSemana = Surgery::query()->whereHas('briefing', function ($q) use ($hoje) {
            $q->whereBetween('data', [$hoje->copy()->startOfWeek(), $hoje->copy()->endOfWeek()], 'and');
        })->count('*');

        $cirurgiasMes = Surgery::query()->whereHas('briefing', function ($q) use ($mes) {
            $q->whereYear('data', '=', $mes->year, 'and')->whereMonth('data', '=', $mes->month, 'and');
        })->count('*');

        $debriefsEmFalta = Briefing::query()->whereDoesntHave('debriefing')
            ->where('data', '<=', $hoje, 'and')
            ->count('*');

        $complicacoesMes = Debriefing::query()->where('complicacoes', '=', true, 'and')
            ->whereHas('briefing', function ($q) use ($mes) {
                $q->whereYear('data', '=', $mes->year, 'and')->whereMonth('data', '=', $mes->month, 'and');
            })->count('*');

        $eventosAdversosMes = Debriefing::query()->where('evento_adverso', '=', true, 'and')
            ->whereHas('briefing', function ($q) use ($mes) {
                $q->whereYear('data', '=', $mes->year, 'and')->whereMonth('data', '=', $mes->month, 'and');
            })->count('*');

        // ── Briefings recentes (últimos 6) ────────────────────────────────────
        $recentBriefings = Briefing::withCount('surgeries')
            ->with('debriefing:id,briefing_id,complicacoes,evento_adverso')
            ->where('data', '<=', $hoje)
            ->orderByDesc('data')
            ->orderByDesc('hora')
            ->limit(6)
            ->get(['id', 'data', 'hora', 'especialidade', 'sala']);

        // ── Stock movimentos ───────────────────────────────────────────────────
        $semana = Carbon::now()->startOfWeek();

        $stockTotal = StockMovimento::query()->count('*');

        $stockMes = StockMovimento::query()->whereYear('created_at', '=', $mes->year, 'and')
            ->whereMonth('created_at', '=', $mes->month, 'and')
            ->count('*');

        $stockSemana = StockMovimento::query()->where('created_at', '>=', $semana, 'and')->count('*');

        $stockEntradaMes = StockMovimento::query()->whereIn('tipo_mov', StockMovimento::TIPOS_ENTRADA, 'and', false)
            ->whereYear('created_at', '=', $mes->year, 'and')
            ->whereMonth('created_at', '=', $mes->month, 'and')
            ->count('*');

        $stockSaidaMes = StockMovimento::query()->whereIn('tipo_mov', StockMovimento::TIPOS_SAIDA, 'and', false)
            ->whereYear('created_at', '=', $mes->year, 'and')
            ->whereMonth('created_at', '=', $mes->month, 'and')
            ->count('*');

        // ── Top gastos por tipo de consumível ────────────────────────────────
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

        // ── Próximos briefings ────────────────────────────────────────────────
        $proximosBriefings = Briefing::withCount('surgeries')
            ->where('data', '>', $hoje)
            ->orderBy('data')
            ->orderBy('hora')
            ->limit(4)
            ->get(['id', 'data', 'hora', 'especialidade', 'sala']);

        // ── cirurgias por departamentos ─────────────────────────────────────────────

        $cirurgiasPorDepartamento = Surgery::query()
            ->join('briefings', 'briefings.id', '=', 'surgeries.briefing_id', 'inner', false)
            ->select(
                'briefings.especialidade as departamento',
                DB::raw('COUNT(surgeries.id) as total')
            )
            ->groupBy('briefings.especialidade')
            ->orderByDesc('total')
            ->get();


        return Inertia::render('dashboard', [
            'stats' => [
                'briefingsTotal'      => $briefingsTotal,
                'briefingsSemana'    => $briefingsSemana,
                'briefingsMes'       => $briefingsMes,
                'cirurgiasTotal'     => $cirurgiasTotal,
                'cirurgiasSemana'    => $cirurgiasSemana,
                'cirurgiasMes'       => $cirurgiasMes,
                'debriefsEmFalta'    => $debriefsEmFalta,
                'complicacoesMes'    => $complicacoesMes,
                'eventosAdversosMes' => $eventosAdversosMes,
            ],
            'stock' => [
                'total'      => $stockTotal,
                'mes'        => $stockMes,
                'semana'     => $stockSemana,
                'entradaMes' => $stockEntradaMes,
                'saidaMes'   => $stockSaidaMes,
            ],
            'recentBriefings'   => $recentBriefings,
            'proximosBriefings' => $proximosBriefings,
            'topGastos'         => $topGastos,
            'cirurgiasPorDepartamento' => $cirurgiasPorDepartamento,
        ]);
    }
}
