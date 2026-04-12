import React, { useState, useRef, useEffect } from 'react';

interface Option {
    id: number | string;
    nome: string;
    [key: string]: any;
}

interface SearchableMultiSelectProps {
    options: Option[];
    selectedIds: (number | string)[];
    onSelectionChange: (selectedIds: (number | string)[]) => void;
    placeholder?: string;
    className?: string;
    maxWidth?: string;
}

export default function SearchableMultiSelect({
    options,
    selectedIds,
    onSelectionChange,
    placeholder = 'Procurar...',
    className = '',
    maxWidth = 'max-w-md',
}: SearchableMultiSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filtrar options baseado no search term
    const filteredOptions = options.filter((option) =>
        option.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Objeto com items selecionados para fácil lookup
    const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: number | string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const handleRemove = (id: number | string, e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    };

    return (
        <div ref={containerRef} className={`relative w-full ${maxWidth} ${className}`}>
            {/* Campo de input com items selecionados como tags */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full min-h-12 px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-text flex flex-wrap gap-2 items-center hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
            >
                {/* Tags dos items selecionados */}
                {selectedOptions.map((option) => (
                    <div
                        key={option.id}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                        <span>{option.nome}</span>
                        <button
                            onClick={(e) => handleRemove(option.id, e)}
                            className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                            type="button"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {/* Input field */}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={selectedOptions.length === 0 ? placeholder : ''}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="flex-1 min-w-max outline-none bg-transparent text-sm"
                />
            </div>

            {/* Dropdown com opções filtradas */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                className={`w-full px-3 py-2 text-sm cursor-pointer transition-colors ${
                                    selectedIds.includes(option.id)
                                        ? 'bg-blue-50 border-l-4 border-blue-500'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(option.id)}
                                        onChange={() => {}}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span>{option.nome}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-sm text-gray-500 text-center">
                            Nenhum resultado encontrado
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
