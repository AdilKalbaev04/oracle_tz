/* ──────────────────────────────────────────────────────────
   useChangeLog — построение описаний изменений
   ────────────────────────────────────────────────────────── */

import { useCallback } from 'react';
import { useAppStore } from '../store/store';
import type { Application, ApplicationStatus } from '../types/types';

interface UseChangeLogReturn {
    /** Сравнить и записать изменения в лог */
    recordChanges: (
        original: Application,
        updates: {
            newLimit: number;
            newStatus: ApplicationStatus;
        },
    ) => void;
}

/** Форматирование числа для лога */
const fmtNum = (n: number): string =>
    n.toLocaleString('ru-RU');

export const useChangeLogger = (): UseChangeLogReturn => {
    const addLogEntry = useAppStore((s) => s.addLogEntry);

    const recordChanges = useCallback(
        (
            original: Application,
            updates: { newLimit: number; newStatus: ApplicationStatus },
        ) => {
            const descriptions: string[] = [];

            if (updates.newLimit !== original.currentLimit) {
                descriptions.push(
                    `лимит изменён с ${fmtNum(original.currentLimit)} на ${fmtNum(updates.newLimit)}`,
                );
            }

            if (updates.newStatus !== original.status) {
                descriptions.push(`статус изменён на ${updates.newStatus}`);
            }

            if (descriptions.length > 0) {
                addLogEntry({
                    clientId: original.id,
                    clientName: original.name,
                    description: `Для клиента ${original.name}: ${descriptions.join('; ')}`,
                });
            }
        },
        [addLogEntry],
    );

    return { recordChanges };
};
