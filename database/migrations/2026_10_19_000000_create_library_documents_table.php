<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('library_documents', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['instrucoes_trabalho', 'manuais', 'artigos_revisao', 'outros']);
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size');
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('library_documents');
    }
};
