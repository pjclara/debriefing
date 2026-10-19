import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { FormRow, inputCls, selectCls, textareaCls } from '@/components/form-ui';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    BookOpen,
    ClipboardList,
    FileText,
    Download,
    Pencil,
    Trash2,
    Plus,
    Newspaper,
    Folder,
} from 'lucide-react';
import type { Auth, BreadcrumbItem } from '@/types';

interface LibraryDocument {
    id: number;
    category: string;
    titulo: string;
    descricao: string | null;
    file_name: string;
    file_size: number;
    created_at: string;
    uploader: { id: number; name: string } | null;
}

interface Props {
    documents: LibraryDocument[];
    categories: Record<string, string>;
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Biblioteca', href: '/library' },
];

const categoryIcons: Record<string, typeof FileText> = {
    instrucoes_trabalho: ClipboardList,
    manuais: BookOpen,
    artigos_revisao: Newspaper,
    outros: Folder,
};

function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LibraryIndex({ documents, categories, flash }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.role === 'admin';

    const [uploadOpen, setUploadOpen] = useState(false);
    const [editing, setEditing] = useState<LibraryDocument | null>(null);

    const uploadForm = useForm({
        titulo: '',
        descricao: '',
        category: 'instrucoes_trabalho',
        file: null as File | null,
    });

    const editForm = useForm({
        titulo: '',
        descricao: '',
        category: 'instrucoes_trabalho',
    });

    function openEdit(doc: LibraryDocument) {
        setEditing(doc);
        editForm.setData({
            titulo: doc.titulo,
            descricao: doc.descricao ?? '',
            category: doc.category,
        });
    }

    function submitUpload(e: React.FormEvent) {
        e.preventDefault();
        uploadForm.post('/library', {
            forceFormData: true,
            onSuccess: () => {
                setUploadOpen(false);
                uploadForm.reset();
            },
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;
        editForm.put(`/library/${editing.id}`, {
            onSuccess: () => setEditing(null),
        });
    }

    function confirmDelete(doc: LibraryDocument) {
        if (confirm(`Eliminar o documento "${doc.titulo}"?`)) {
            router.delete(`/library/${doc.id}`);
        }
    }

    const grouped = Object.entries(categories).map(([key, label]) => ({
        key,
        label,
        docs: documents.filter((d) => d.category === key),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Biblioteca de Apoio" />
            <div className="mx-auto max-w-5xl p-6">
                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Biblioteca de Apoio aos Procedimentos Cirúrgicos</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Instruções de trabalho, manuais de equipamento e artigos de revisão
                        </p>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => setUploadOpen(true)} className="gap-2">
                            <Plus size={16} />
                            Novo Documento
                        </Button>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    {grouped.map(({ key, label, docs }) => {
                        const Icon = categoryIcons[key] ?? FileText;
                        return (
                            <div
                                key={key}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Icon size={18} className="text-gray-600 dark:text-gray-300" />
                                        <h2 className="font-semibold text-gray-900 dark:text-white">{label}</h2>
                                        <span className="ml-auto inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                            {docs.length}
                                        </span>
                                    </div>
                                </div>

                                {docs.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Nenhum documento nesta categoria
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {docs.map((doc) => (
                                            <li
                                                key={doc.id}
                                                className="flex items-center gap-4 px-6 py-4"
                                            >
                                                <FileText size={20} className="shrink-0 text-gray-400" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium text-gray-900 dark:text-white">
                                                        {doc.titulo}
                                                    </p>
                                                    {doc.descricao && (
                                                        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                                                            {doc.descricao}
                                                        </p>
                                                    )}
                                                    <p className="mt-0.5 text-xs text-gray-400">
                                                        {doc.file_name} · {formatSize(doc.file_size)}
                                                        {doc.uploader && ` · enviado por ${doc.uploader.name}`}
                                                    </p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1">
                                                    <a
                                                        href={`/library/${doc.id}/download`}
                                                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                        title="Descarregar"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                    {isAdmin && (
                                                        <>
                                                            <button
                                                                onClick={() => openEdit(doc)}
                                                                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                                title="Editar"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => confirmDelete(doc)}
                                                                className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upload modal */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Documento</DialogTitle>
                        <DialogDescription>
                            Apenas ficheiros PDF, até 20 MB.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitUpload} className="flex flex-col gap-4">
                        <FormRow label="Categoria" error={uploadForm.errors.category}>
                            <select
                                value={uploadForm.data.category}
                                onChange={(e) => uploadForm.setData('category', e.target.value)}
                                className={selectCls}
                                required
                            >
                                {Object.entries(categories).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Título" error={uploadForm.errors.titulo}>
                            <input
                                type="text"
                                value={uploadForm.data.titulo}
                                onChange={(e) => uploadForm.setData('titulo', e.target.value)}
                                className={inputCls}
                                placeholder="Ex: Manual do daVinci Xi"
                                required
                                autoFocus
                            />
                        </FormRow>

                        <FormRow label="Descrição" error={uploadForm.errors.descricao}>
                            <textarea
                                value={uploadForm.data.descricao}
                                onChange={(e) => uploadForm.setData('descricao', e.target.value)}
                                className={textareaCls}
                                rows={3}
                            />
                        </FormRow>

                        <FormRow label="Ficheiro (PDF)" error={uploadForm.errors.file}>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => uploadForm.setData('file', e.target.files?.[0] ?? null)}
                                className={inputCls}
                                required
                            />
                        </FormRow>

                        <DialogFooter>
                            <Button type="submit" disabled={uploadForm.processing}>
                                {uploadForm.processing ? 'A enviar...' : 'Enviar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit modal */}
            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Documento</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        <FormRow label="Categoria" error={editForm.errors.category}>
                            <select
                                value={editForm.data.category}
                                onChange={(e) => editForm.setData('category', e.target.value)}
                                className={selectCls}
                                required
                            >
                                {Object.entries(categories).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Título" error={editForm.errors.titulo}>
                            <input
                                type="text"
                                value={editForm.data.titulo}
                                onChange={(e) => editForm.setData('titulo', e.target.value)}
                                className={inputCls}
                                required
                            />
                        </FormRow>

                        <FormRow label="Descrição" error={editForm.errors.descricao}>
                            <textarea
                                value={editForm.data.descricao}
                                onChange={(e) => editForm.setData('descricao', e.target.value)}
                                className={textareaCls}
                                rows={3}
                            />
                        </FormRow>

                        <DialogFooter>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'A guardar...' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
