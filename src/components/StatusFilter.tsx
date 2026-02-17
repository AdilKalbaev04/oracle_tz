/* ──────────────────────────────────────────────────────────
   StatusFilter — фильтрация по статусу заявки
   ────────────────────────────────────────────────────────── */

import React from 'react';
import type { StatusFilterValue } from '../hooks/useFilter';

interface StatusFilterProps {
    value: StatusFilterValue;
    onChange: (value: StatusFilterValue) => void;
}

const FILTER_OPTIONS: { label: string; value: StatusFilterValue }[] = [
    { label: 'Все', value: 'All' },
    { label: 'Новые', value: 'New' },
    { label: 'Одобрены', value: 'Approved' },
    { label: 'Отклонены', value: 'Rejected' },
];

export const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
    return (
        <div className="status-filter" role="tablist" aria-label="Фильтры по статусу">
            {FILTER_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    role="tab"
                    aria-selected={value === opt.value}
                    className={`status-filter__btn ${value === opt.value ? 'status-filter__btn--active' : ''} ${opt.value !== 'All' ? `status-filter__btn--${opt.value.toLowerCase()}` : ''
                        }`}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
