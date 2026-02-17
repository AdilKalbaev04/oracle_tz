/* ──────────────────────────────────────────────────────────
   StatusBadge — бейдж статуса заявки
   ────────────────────────────────────────────────────────── */

import React from 'react';
import type { ApplicationStatus } from '../types/types';

interface StatusBadgeProps {
    status: ApplicationStatus;
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
    New: 'Новая',
    Approved: 'Одобрена',
    Rejected: 'Отклонена',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    return (
        <span className={`status-badge status-badge--${status.toLowerCase()}`}>
            <span className="status-badge__dot" />
            {STATUS_LABELS[status]}
        </span>
    );
};
