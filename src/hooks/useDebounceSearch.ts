/* ──────────────────────────────────────────────────────────
   useDebounceSearch — поиск по ФИО с debounce
   ────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Application } from '../types/types';

const DEBOUNCE_DELAY = 300;

interface UseDebounceSearchReturn {
    /** Значение в поле ввода (мгновенное) */
    searchTerm: string;
    /** Обработчик изменения ввода */
    setSearchTerm: (value: string) => void;
    /** Применить поиск к списку заявок */
    searchApplications: (apps: Application[]) => Application[];
}

export const useDebounceSearch = (): UseDebounceSearchReturn => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, DEBOUNCE_DELAY);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [searchTerm]);

    const searchApplications = useCallback(
        (apps: Application[]): Application[] => {
            if (!debouncedTerm.trim()) return apps;
            const lower = debouncedTerm.toLowerCase();
            return apps.filter((app) =>
                app.name.toLowerCase().includes(lower),
            );
        },
        [debouncedTerm],
    );

    return { searchTerm, setSearchTerm, searchApplications };
};
