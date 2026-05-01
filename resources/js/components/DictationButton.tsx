/**
 * DictationButton — botão reutilizável de ditado por voz (Web Speech API).
 *
 * Uso básico junto a um <input> ou <textarea>:
 *
 *   <div className="relative flex items-center gap-2">
 *     <input value={data.notas} onChange={e => setData('notas', e.target.value)} />
 *     <DictationButton onResult={(text) => setData('notas', data.notas + text)} />
 *   </div>
 *
 * Uso com substituição completa (append=false):
 *   <DictationButton onResult={(text) => setData('notas', text)} append={false} />
 *
 * Props:
 *   onResult  — callback com o texto reconhecido
 *   append    — se true (padrão) faz append; se false substitui
 *   lang      — locale do reconhecimento (padrão: 'pt-PT')
 *   disabled  — desativa o botão
 *   className — classes extra no botão
 */

import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface DictationButtonProps {
    onResult: (text: string) => void;
    append?: boolean;
    lang?: string;
    disabled?: boolean;
    className?: string;
}

// Tipo para a SpeechRecognition (não está em todos os lib.dom.d.ts)
type SpeechRecognitionInstance = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
    onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
};

declare global {
    interface Window {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    }
}

type State = 'idle' | 'listening' | 'processing' | 'unsupported';

export function DictationButton({
    onResult,
    append = true,
    lang = 'pt-PT',
    disabled = false,
    className = '',
}: DictationButtonProps) {
    const [state, setState] = useState<State>(() => {
        if (typeof window === 'undefined') return 'idle';
        return window.SpeechRecognition || window.webkitSpeechRecognition
            ? 'idle'
            : 'unsupported';
    });

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    const startListening = useCallback(() => {
        const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
        if (!SR) return;

        const recognition = new SR();
        recognition.lang = lang;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (e: SpeechRecognitionEvent) => {
            setState('processing');
            const transcript = Array.from(e.results)
                .map((r) => r[0].transcript)
                .join(' ')
                .trim();

            if (transcript) {
                onResult(append ? ' ' + transcript : transcript);
            }
        };

        recognition.onerror = () => {
            setState('idle');
        };

        recognition.onend = () => {
            setState('idle');
        };

        recognitionRef.current = recognition;
        recognition.start();
        setState('listening');
    }, [lang, onResult, append]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setState('idle');
    }, []);

    if (state === 'unsupported') {
        return (
            <span
                title="O seu browser não suporta reconhecimento de voz"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 ${className}`}
            >
                <MicOff className="h-4 w-4" />
            </span>
        );
    }

    const isListening = state === 'listening';
    const isProcessing = state === 'processing';

    return (
        <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={disabled || isProcessing}
            title={isListening ? 'Parar ditado' : 'Ditar por voz'}
            className={[
                'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all',
                isListening
                    ? 'animate-pulse bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400',
                'disabled:cursor-not-allowed disabled:opacity-40',
                className,
            ].join(' ')}
        >
            {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isListening ? (
                <MicOff className="h-4 w-4" />
            ) : (
                <Mic className="h-4 w-4" />
            )}
        </button>
    );
}

/**
 * DictationInput — wrapper de conveniência: <input> + botão de ditado incluído.
 *
 *   <DictationInput
 *       value={data.notas}
 *       onChange={v => setData('notas', v)}
 *       placeholder="Notas…"
 *   />
 */
interface DictationInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    lang?: string;
    inputClassName?: string;
}

export function DictationInput({
    value,
    onChange,
    lang = 'pt-PT',
    inputClassName = '',
    className = '',
    ...inputProps
}: DictationInputProps) {
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <input
                {...inputProps}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={
                    inputClassName ||
                    'h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                }
            />
            <DictationButton
                lang={lang}
                onResult={(text) => onChange(value + text)}
            />
        </div>
    );
}

/**
 * DictationTextarea — wrapper de conveniência: <textarea> + botão de ditado.
 *
 *   <DictationTextarea
 *       value={data.descricao}
 *       onChange={v => setData('descricao', v)}
 *       rows={4}
 *   />
 */
interface DictationTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    lang?: string;
    textareaClassName?: string;
}

export function DictationTextarea({
    value,
    onChange,
    lang = 'pt-PT',
    textareaClassName = '',
    className = '',
    ...textareaProps
}: DictationTextareaProps) {
    return (
        <div className={`flex items-start gap-1.5 ${className}`}>
            <textarea
                {...textareaProps}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={
                    textareaClassName ||
                    'w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                }
            />
            <DictationButton
                lang={lang}
                onResult={(text) => onChange(value + text)}
                className="mt-1"
            />
        </div>
    );
}
