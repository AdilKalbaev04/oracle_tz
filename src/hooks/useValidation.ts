/* ──────────────────────────────────────────────────────────
   useValidation — валидация формы редактирования лимита
   ────────────────────────────────────────────────────────── */

import { useMemo } from 'react';
import type { ChangeReason } from '../types/types';
import {
    MIN_LIMIT,
    MAX_LIMIT,
    HIGH_LIMIT_THRESHOLD,
    STANDARD_REASONS,
    EXTENDED_REASONS,
} from '../types/types';

interface ValidationResult {
    /** Есть ли ошибки */
    isValid: boolean;
    /** Текст ошибки для поля «Новый лимит» */
    limitError: string | null;
    /** Текст ошибки для поля «Причина» */
    reasonError: string | null;
    /** Требуется ли причина обязательно */
    isReasonRequired: boolean;
    /** Список доступных причин */
    availableReasons: ChangeReason[];
}

export const useValidation = (
    newLimit: number | '',
    reason: ChangeReason | null,
): ValidationResult => {
    return useMemo(() => {
        const numericLimit = newLimit === '' ? 0 : newLimit;
        const isHighLimit = numericLimit > HIGH_LIMIT_THRESHOLD;

        let limitError: string | null = null;
        if (newLimit === '') {
            limitError = 'Введите значение лимита';
        } else if (numericLimit < MIN_LIMIT) {
            limitError = `Лимит не может быть меньше ${MIN_LIMIT.toLocaleString('ru-RU')} ₽`;
        } else if (numericLimit > MAX_LIMIT) {
            limitError = `Лимит не может превышать ${MAX_LIMIT.toLocaleString('ru-RU')} ₽`;
        }

        let reasonError: string | null = null;
        if (isHighLimit && !reason) {
            reasonError = 'Для лимита свыше 1 000 000 ₽ укажите причину';
        }

        const availableReasons = isHighLimit
            ? EXTENDED_REASONS
            : STANDARD_REASONS;

        const isValid = limitError === null && reasonError === null;

        return { isValid, limitError, reasonError, isReasonRequired: isHighLimit, availableReasons };
    }, [newLimit, reason]);
};
