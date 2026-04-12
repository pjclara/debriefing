import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function DarkModeToggle() {
    const { auth } = usePage().props;
    const user = auth?.user as any;
    const [isDark, setIsDark] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Inicializar darkmode baseado em localStorage ou preferência do utilizador
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        const isDarkMode = savedDarkMode !== null 
            ? JSON.parse(savedDarkMode) 
            : user?.dark_mode ?? false;
        
        setIsDark(isDarkMode);
        applyDarkMode(isDarkMode);
    }, [user?.dark_mode]);

    const applyDarkMode = (dark: boolean) => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const toggleDarkMode = async () => {
        try {
            setIsLoading(true);
            const newDarkMode = !isDark;
            
            // Guardar em localStorage
            localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
            
            // Aplicar mudança visual imediatamente
            applyDarkMode(newDarkMode);
            setIsDark(newDarkMode);
            
            // Se utilizador autenticado, guardar na BD
            if (user?.id) {
                await fetch('/api/user/dark-mode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ dark_mode: newDarkMode }),
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar modo escuro:', error);
            // Reverter se houver erro
            applyDarkMode(isDark);
            setIsDark(isDark);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleDarkMode}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md p-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 disabled:opacity-50 transition-colors"
            title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        >
            {isDark ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}
