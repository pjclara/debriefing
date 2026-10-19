<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryDocument extends Model
{
    protected $fillable = [
        'category',
        'titulo',
        'descricao',
        'file_path',
        'file_name',
        'file_size',
        'uploaded_by',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public const CATEGORIES = [
        'instrucoes_trabalho' => 'Instruções de Trabalho',
        'manuais' => 'Manuais de Equipamento',
        'artigos_revisao' => 'Artigos de Revisão',
        'outros' => 'Outros Documentos',
    ];
}
