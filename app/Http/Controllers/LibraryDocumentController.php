<?php

namespace App\Http\Controllers;

use App\Http\Requests\LibraryDocumentRequest;
use App\Models\LibraryDocument;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LibraryDocumentController extends Controller
{
    public function index()
    {
        $documents = LibraryDocument::with('uploader')
            ->orderBy('titulo')
            ->get();

        return Inertia::render('library/index', [
            'documents' => $documents,
            'categories' => LibraryDocument::CATEGORIES,
        ]);
    }

    public function store(LibraryDocumentRequest $request)
    {
        $validated = $request->validated();

        $file = $request->file('file');
        $path = $file->store('library', 'local');

        LibraryDocument::create([
            'category' => $validated['category'],
            'titulo' => $validated['titulo'],
            'descricao' => $validated['descricao'] ?? null,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'uploaded_by' => $request->user()->id,
        ]);

        return redirect()->route('library.index')
            ->with('success', 'Documento adicionado com sucesso.');
    }

    public function update(LibraryDocumentRequest $request, LibraryDocument $library)
    {
        $validated = $request->validated();

        $library->update([
            'category' => $validated['category'],
            'titulo' => $validated['titulo'],
            'descricao' => $validated['descricao'] ?? null,
        ]);

        return redirect()->route('library.index')
            ->with('success', 'Documento atualizado com sucesso.');
    }

    public function destroy(LibraryDocument $library)
    {
        Storage::disk('local')->delete($library->file_path);
        $library->delete();

        return redirect()->route('library.index')
            ->with('success', 'Documento eliminado com sucesso.');
    }

    public function download(LibraryDocument $library)
    {
        return Storage::disk('local')->download($library->file_path, $library->file_name);
    }
}
