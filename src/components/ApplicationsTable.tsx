/* ──────────────────────────────────────────────────────────
   ApplicationsTable — таблица заявок
   ────────────────────────────────────────────────────────── */

import React from 'react';
import type { Application } from '../types/types';
import { formatCurrency } from '../utils/format';
import { StatusBadge } from './StatusBadge';

interface ApplicationsTableProps {
    applications: Application[];
    onRowClick: (id: string) => void;
    isLoading: boolean;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
    applications,
    onRowClick,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="table-loading">
                <div className="spinner" />
                <p>Загрузка заявок…</p>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="table-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
                <p>Заявки не найдены</p>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="app-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ФИО клиента</th>
                        <th className="text-right">Текущий лимит</th>
                        <th className="text-right">Желаемый лимит</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => (
                        <tr
                            key={app.id}
                            className="app-table__row"
                            onClick={() => onRowClick(app.id)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onRowClick(app.id);
                                }
                            }}
                            role="button"
                            aria-label={`Открыть заявку ${app.name}`}
                        >
                            <td className="app-table__id">{app.id}</td>
                            <td className="app-table__name">{app.name}</td>
                            <td className="text-right">{formatCurrency(app.currentLimit, app.currency)}</td>
                            <td className="text-right">{formatCurrency(app.requestedLimit, app.currency)}</td>
                            <td>
                                <StatusBadge status={app.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
