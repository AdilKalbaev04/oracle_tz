/* ──────────────────────────────────────────────────────────
   Zustand Store — единое хранилище приложения
   ────────────────────────────────────────────────────────── */

import { create } from 'zustand';
import type { Application, ChangeLogEntry } from '../types/types';
import { fetchApplications, updateApplication } from '../api/api';

/* ── Интерфейс хранилища ──────────────────────────────── */

interface AppState {
    /** Список заявок */
    applications: Application[];
    /** Журнал изменений за текущую сессию */
    changeLog: ChangeLogEntry[];
    /** Флаг загрузки */
    isLoading: boolean;
    /** Текст ошибки */
    error: string | null;
    /** ID выбранной заявки (для модального окна) */
    selectedId: string | null;

    /** Загрузить заявки с сервера */
    loadApplications: () => Promise<void>;
    /** Обновить заявку */
    patchApplication: (
        id: string,
        patch: Partial<Pick<Application, 'currentLimit' | 'requestedLimit' | 'status'>>,
    ) => Promise<void>;
    /** Добавить запись в журнал */
    addLogEntry: (entry: Omit<ChangeLogEntry, 'id' | 'timestamp'>) => void;
    /** Выбрать заявку для редактирования */
    selectApplication: (id: string | null) => void;
    /** Очистить ошибку */
    clearError: () => void;
}

/* ── Генератор уникальных ID для лога ─────────────────── */

let logCounter = 0;
const nextLogId = (): string => {
    logCounter += 1;
    return `log-${Date.now()}-${logCounter}`;
};

/* ── Создание хранилища ────────────────────────────────── */

export const useAppStore = create<AppState>((set) => ({
    applications: [],
    changeLog: [],
    isLoading: false,
    error: null,
    selectedId: null,

    loadApplications: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchApplications();
            set({ applications: data, isLoading: false });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
            set({ error: message, isLoading: false });
        }
    },

    patchApplication: async (id, patch) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await updateApplication(id, patch);
            set((state) => ({
                applications: state.applications.map((app) =>
                    app.id === id ? updated : app,
                ),
                isLoading: false,
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Ошибка при обновлении';
            set({ error: message, isLoading: false });
        }
    },

    addLogEntry: (entry) => {
        const logEntry: ChangeLogEntry = {
            ...entry,
            id: nextLogId(),
            timestamp: new Date(),
        };
        set((state) => ({
            changeLog: [logEntry, ...state.changeLog],
        }));
    },

    selectApplication: (id) => {
        set({ selectedId: id });
    },

    clearError: () => {
        set({ error: null });
    },
}));

/* ── Селекторы (для удобства компонентов) ──────────────── */

export const useApplications = (): Application[] =>
    useAppStore((s) => s.applications);

export const useChangeLog = (): ChangeLogEntry[] =>
    useAppStore((s) => s.changeLog);

export const useIsLoading = (): boolean =>
    useAppStore((s) => s.isLoading);

export const useError = (): string | null =>
    useAppStore((s) => s.error);

export const useSelectedApplication = (): Application | undefined =>
    useAppStore((s) =>
        s.applications.find((a) => a.id === s.selectedId),
    );
