import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Input / Textarea / Select class strings ─────────────────────────────────

export const inputCls =
    'h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm transition-all duration-150 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white';

export const selectCls =
    'h-11 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white';

export const textareaCls =
    'w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-150 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white';

// ─── SectionCard ─────────────────────────────────────────────────────────────

export function SectionCard({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/60">
                {Icon && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-700">
                        <Icon size={16} className="text-blue-600 dark:text-blue-400" />
                    </span>
                )}
                <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
                    {description && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-6 p-6">{children}</div>
        </div>
    );
}

// ─── FormRow ─────────────────────────────────────────────────────────────────

export function FormRow({
    label,
    hint,
    error,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{label}</p>
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
            {children}
            {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ─── YesNo pill buttons ───────────────────────────────────────────────────────

export function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                type="button"
                onClick={() => onChange(true)}
                className={cn(
                    'flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150',
                    value === true
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-green-900/20',
                )}
            >
                <CheckCircle2 size={16} />
                Sim
            </button>
            <button
                type="button"
                onClick={() => onChange(false)}
                className={cn(
                    'flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150',
                    value === false
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/20',
                )}
            >
                <XCircle size={16} />
                Não
            </button>
        </div>
    );
}
