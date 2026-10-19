import { useEffect, useRef, useState } from 'react';

const SAVE_DEBOUNCE_MS = 600;
const DRAFT_PREFIX = 'draft:';

/**
 * Persiste os dados de um formulário no localStorage enquanto o utilizador
 * os preenche, e oferece restaurá-los caso a página seja fechada ou
 * interrompida antes de submeter (ex.: alguém mexeu no computador).
 *
 * `key` deve identificar univocamente o formulário (inclui o id em edição).
 */
export function useDraftForm<T extends object>(
    key: string,
    data: T,
    setData: (data: T) => void,
) {
    const storageKey = DRAFT_PREFIX + key;
    const hasRestoredRef = useRef(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

    // Restaurar rascunho guardado, uma única vez, ao montar o formulário.
    useEffect(() => {
        if (hasRestoredRef.current) return;
        hasRestoredRef.current = true;

        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return;

            const draft = JSON.parse(raw) as T;
            const shouldRestore = confirm(
                'Encontrámos dados não guardados de um preenchimento anterior deste formulário. Deseja recuperá-los?',
            );

            if (shouldRestore) {
                setData({ ...data, ...draft });
                setLastSavedAt(new Date());
            } else {
                localStorage.removeItem(storageKey);
            }
        } catch {
            // localStorage indisponível (modo privado, quota, etc.) — ignora.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    // Guardar o rascunho (com debounce) sempre que os dados mudam.
    useEffect(() => {
        const timeout = setTimeout(() => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(data));
                setLastSavedAt(new Date());
            } catch {
                // localStorage indisponível — falha silenciosamente.
            }
        }, SAVE_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey, JSON.stringify(data)]);

    function clearDraft() {
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // ignora
        }
    }

    return { lastSavedAt, clearDraft };
}
