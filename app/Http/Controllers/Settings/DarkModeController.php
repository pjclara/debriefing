<?php

namespace App\Http\Controllers\Settings;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DarkModeController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'dark_mode' => ['required', 'boolean'],
        ]);

        $request->user()->update([
            'dark_mode' => $request->input('dark_mode'),
        ]);

        return response()->json([
            'success' => true,
            'dark_mode' => $request->user()->dark_mode,
        ]);
    }
}
