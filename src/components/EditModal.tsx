/* ──────────────────────────────────────────────────────────
   EditModal — модальное окно редактирования заявки
   ────────────────────────────────────────────────────────── */

import React, { useEffect, useState, useCallback } from 'react';
import type { Application, ApplicationStatus, ChangeReason } from '../types/types';
import { useValidation } from '../hooks/useValidation';
import { useChangeLogger } from '../hooks/useChangeLog';
import { maskAccount, formatCurrency } from '../utils/format';
import { useAppStore } from '../store/store';

interface EditModalProps {
    application: Application;
    onClose: () => void;
}

const STATUS_OPTIONS: { label: string; value: ApplicationStatus }[] = [
    { label: 'Новая', value: 'New' },
    { label: 'Одобрена', value: 'Approved' },
    { label: 'Отклонена', value: 'Rejected' },
];

export const EditModal: React.FC<EditModalProps> = ({ application, onClose }) => {
    const patchApplication = useAppStore((s) => s.patchApplication);
    const isLoading = useAppStore((s) => s.isLoading);
    const { recordChanges } = useChangeLogger();

    const [newLimit, setNewLimit] = useState<number | ''>(application.currentLimit);
    const [reason, setReason] = useState<ChangeReason | null>(null);
    const [status, setStatus] = useState<ApplicationStatus>(application.status);
    const [touched, setTouched] = useState(false);

    const validation = useValidation(newLimit, reason);

    /* Сброс формы при смене заявки */
    useEffect(() => {
        setNewLimit(application.currentLimit);
        setReason(null);
        setStatus(application.status);
        setTouched(false);
    }, [application.id, application.currentLimit, application.status]);

    /* Закрытие по Escape */
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw === '') {
            setNewLimit('');
            return;
        }
        const num = Number(raw);
        if (!Number.isNaN(num)) {
            setNewLimit(num);
        }
    };

    const handleSubmit = useCallback(async () => {
        setTouched(true);
        if (!validation.isValid || newLimit === '') return;

        recordChanges(application, { newLimit, newStatus: status });

        await patchApplication(application.id, {
            currentLimit: newLimit,
            status,
        });

        onClose();
    }, [validation.isValid, newLimit, status, application, recordChanges, patchApplication, onClose]);

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal__header">
                    <div>
                        <h2 className="modal__title">Редактирование заявки</h2>
                        <p className="modal__subtitle">{application.name}</p>
                    </div>
                    <button className="modal__close" onClick={onClose} aria-label="Закрыть" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Info */}
                <div className="modal__info-grid">
                    <div className="modal__info-item">
                        <span className="modal__label">ID клиента</span>
                        <span className="modal__value">{application.id}</span>
                    </div>
                    <div className="modal__info-item">
                        <span className="modal__label">Счёт</span>
                        <span className="modal__value modal__value--mono">{maskAccount(application.account)}</span>
                    </div>
                    <div className="modal__info-item">
                        <span className="modal__label">Текущий лимит</span>
                        <span className="modal__value">{formatCurrency(application.currentLimit, application.currency)}</span>
                    </div>
                    <div className="modal__info-item">
                        <span className="modal__label">Желаемый лимит</span>
                        <span className="modal__value modal__value--highlight">
                            {formatCurrency(application.requestedLimit, application.currency)}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <div className="modal__form">
                    {/* Новый лимит */}
                    <div className={`form-group ${touched && validation.limitError ? 'form-group--error' : ''}`}>
                        <label className="form-group__label" htmlFor="edit-limit">
                            Новый лимит (₽)
                            <span className="form-group__required">*</span>
                        </label>
                        <input
                            id="edit-limit"
                            type="number"
                            className="form-group__input"
                            value={newLimit}
                            onChange={handleLimitChange}
                            min={0}
                            max={10_000_000}
                            step={1000}
                            disabled={isLoading}
                        />
                        {touched && validation.limitError && (
                            <span className="form-group__error">{validation.limitError}</span>
                        )}
                    </div>

                    {/* Причина */}
                    <div className={`form-group ${touched && validation.reasonError ? 'form-group--error' : ''}`}>
                        <label className="form-group__label" htmlFor="edit-reason">
                            Причина изменения
                            {validation.isReasonRequired && <span className="form-group__required">*</span>}
                        </label>
                        <select
                            id="edit-reason"
                            className="form-group__select"
                            value={reason ?? ''}
                            onChange={(e) => setReason((e.target.value || null) as ChangeReason | null)}
                            disabled={isLoading}
                        >
                            <option value="">— Выберите причину —</option>
                            {validation.availableReasons.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                        {touched && validation.reasonError && (
                            <span className="form-group__error">{validation.reasonError}</span>
                        )}
                        {validation.isReasonRequired && (
                            <span className="form-group__hint">
                                Обязательно при лимите свыше 1 000 000 ₽
                            </span>
                        )}
                    </div>

                    {/* Статус */}
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="edit-status">Статус</label>
                        <select
                            id="edit-status"
                            className="form-group__select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                            disabled={isLoading}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="modal__actions">
                    <button
                        className="btn btn--secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        type="button"
                    >
                        Отмена
                    </button>
                    <button
                        className="btn btn--primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        type="button"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner spinner--small" />
                                Сохранение…
                            </>
                        ) : (
                            'Сохранить'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
