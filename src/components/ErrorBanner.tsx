/* ──────────────────────────────────────────────────────────
   ErrorBanner — баннер ошибки (с кнопкой «Закрыть»)
   ────────────────────────────────────────────────────────── */

import React from 'react';

interface ErrorBannerProps {
    message: string;
    onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
    return (
        <div className="error-banner" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="error-banner__text">{message}</span>
            <button className="error-banner__close" onClick={onDismiss} aria-label="Закрыть" type="button">
                ✕
            </button>
        </div>
    );
};
