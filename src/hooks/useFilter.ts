/* ──────────────────────────────────────────────────────────
   useFilter — фильтрация заявок по статусу
   ────────────────────────────────────────────────────────── */

import { useMemo, useState } from 'react';
import type { Application, ApplicationStatus } from '../types/types';

export type StatusFilterValue = ApplicationStatus | 'All';

interface UseFilterReturn {
    /** Текущий выбранный фильтр */
    statusFilter: StatusFilterValue;
    /** Установить фильтр */
    setStatusFilter: (value: StatusFilterValue) => void;
    /** Применить фильтр к списку заявок */
    filterApplications: (apps: Application[]) => Application[];
}

export const useFilter = (): UseFilterReturn => {
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('All');

    const filterApplications = useMemo(() => {
        return (apps: Application[]): Application[] => {
            if (statusFilter === 'All') return apps;
            return apps.filter((app) => app.status === statusFilter);
        };
    }, [statusFilter]);

    return { statusFilter, setStatusFilter, filterApplications };
};
