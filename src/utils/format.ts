/* ──────────────────────────────────────────────────────────
   Утилиты — маскирование счёта, форматирование
   ────────────────────────────────────────────────────────── */

/**
 * Маскирование номера счёта.
 * «40817810500000001234» → «40817 **** 1234»
 */
export const maskAccount = (account: string): string => {
    if (account.length < 9) return account;
    const prefix = account.slice(0, 5);
    const suffix = account.slice(-4);
    return `${prefix} **** ${suffix}`;
};

/** Форматирование суммы в рублях */
export const formatCurrency = (
    value: number,
    currency: string = 'RUB',
): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

/** Форматирование даты / времени для лога */
export const formatTimestamp = (date: Date): string => {
    return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
};
