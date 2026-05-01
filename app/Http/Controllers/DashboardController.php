<?php

namespace App\Http\Controllers;

use App\Models\Briefing;
use App\Models\Consumo;
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
        $briefingsHoje = Briefing::whereDate('data', $hoje)->count();

        $briefingsSemana = Briefing::whereBetween('data', [$hoje->copy()->startOfWeek(), $hoje->copy()->endOfWeek()])->count();

        $briefingsMes = Briefing::whereYear('data', $mes->year)
            ->whereMonth('data', $mes->month)
            ->count();

        $cirurgiasMes = Surgery::whereHas('briefing', function ($q) use ($mes) {
            $q->whereYear('data', $mes->year)->whereMonth('data', $mes->month);
        })->count();

        $debriefsEmFalta = Briefing::whereDoesntHave('debriefing')
            ->where('data', '<=', $hoje)
            ->count();

        $complicacoesMes = Debriefing::where('complicacoes', true)
            ->whereHas('briefing', function ($q) use ($mes) {
                $q->whereYear('data', $mes->year)->whereMonth('data', $mes->month);
            })->count();

        $eventosAdversosMes = Debriefing::where('evento_adverso', true)
            ->whereHas('briefing', function ($q) use ($mes) {
                $q->whereYear('data', $mes->year)->whereMonth('data', $mes->month);
            })->count();

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

        $stockTotal = StockMovimento::count();

        $stockMes = StockMovimento::whereYear('created_at', $mes->year)
            ->whereMonth('created_at', $mes->month)
            ->count();

        $stockSemana = StockMovimento::where('created_at', '>=', $semana)->count();

        $stockEntradaMes = StockMovimento::whereIn('tipo_mov', StockMovimento::TIPOS_ENTRADA)
            ->whereYear('created_at', $mes->year)
            ->whereMonth('created_at', $mes->month)
            ->count();

        $stockSaidaMes = StockMovimento::whereIn('tipo_mov', StockMovimento::TIPOS_SAIDA)
            ->whereYear('created_at', $mes->year)
            ->whereMonth('created_at', $mes->month)
            ->count();

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

        return Inertia::render('dashboard', [
            'stats' => [
                'briefingsHoje'      => $briefingsHoje,
                'briefingsSemana'    => $briefingsSemana,
                'briefingsMes'       => $briefingsMes,
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
        ]);
    }
}
