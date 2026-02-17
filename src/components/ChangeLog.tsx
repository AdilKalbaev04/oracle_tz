/* ──────────────────────────────────────────────────────────
   ChangeLog — журнал изменений за текущую сессию
   ────────────────────────────────────────────────────────── */

import React from 'react';
import type { ChangeLogEntry } from '../types/types';
import { formatTimestamp } from '../utils/format';

interface ChangeLogProps {
    entries: ChangeLogEntry[];
}

export const ChangeLog: React.FC<ChangeLogProps> = ({ entries }) => {
    if (entries.length === 0) {
        return (
            <div className="changelog changelog--empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="12 8 12 12 14 14" />
                    <circle cx="12" cy="12" r="10" />
                </svg>
                <p>Нет действий за текущую сессию</p>
            </div>
        );
    }

    return (
        <div className="changelog">
            <div className="changelog__header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="12 8 12 12 14 14" />
                    <circle cx="12" cy="12" r="10" />
                </svg>
                <h3 className="changelog__title">Журнал изменений</h3>
                <span className="changelog__count">{entries.length}</span>
            </div>
            <ul className="changelog__list">
                {entries.map((entry) => (
                    <li key={entry.id} className="changelog__item">
                        <span className="changelog__time">{formatTimestamp(entry.timestamp)}</span>
                        <span className="changelog__desc">{entry.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
