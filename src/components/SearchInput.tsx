/* ──────────────────────────────────────────────────────────
   SearchInput — поиск по ФИО с индикатором
   ────────────────────────────────────────────────────────── */

import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
    return (
        <div className="search-input">
            <svg
                className="search-input__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                id="search-name"
                type="text"
                className="search-input__field"
                placeholder="Поиск по ФИО…"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete="off"
            />
            {value && (
                <button
                    className="search-input__clear"
                    onClick={() => onChange('')}
                    aria-label="Очистить поиск"
                    type="button"
                >
                    ✕
                </button>
            )}
        </div>
    );
};
