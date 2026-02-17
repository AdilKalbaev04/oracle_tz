/* ──────────────────────────────────────────────────────────
   Types — Credit Limit Management Module
   ────────────────────────────────────────────────────────── */

/** Статус заявки на изменение кредитного лимита */
export type ApplicationStatus = 'New' | 'Approved' | 'Rejected';

/** Причина изменения лимита */
export type ChangeReason =
    | 'Повышение дохода'
    | 'Хорошая кредитная история'
    | 'Запрос клиента'
    | 'Особый риск';

/** Стандартные причины (без «Особый риск») */
export const STANDARD_REASONS: ChangeReason[] = [
    'Повышение дохода',
    'Хорошая кредитная история',
    'Запрос клиента',
];

/** Все причины, включая «Особый риск» (для лимитов > 1 000 000) */
export const EXTENDED_REASONS: ChangeReason[] = [
    ...STANDARD_REASONS,
    'Особый риск',
];

/** Порог лимита, после которого обязательна причина и появляется «Особый риск» */
export const HIGH_LIMIT_THRESHOLD = 1_000_000;

/** Максимально допустимое значение лимита */
export const MAX_LIMIT = 10_000_000;

/** Минимально допустимое значение лимита */
export const MIN_LIMIT = 0;

/** Заявка на изменение кредитного лимита */
export interface Application {
    readonly id: string;
    name: string;
    account: string;
    currentLimit: number;
    requestedLimit: number;
    currency: string;
    status: ApplicationStatus;
}

/** Запись в журнале изменений за текущую сессию */
export interface ChangeLogEntry {
    readonly id: string;
    readonly timestamp: Date;
    readonly clientId: string;
    readonly clientName: string;
    readonly description: string;
}

/** Поля, которые может редактировать оператор */
export interface ApplicationUpdate {
    newLimit: number;
    reason: ChangeReason | null;
    status: ApplicationStatus;
}
