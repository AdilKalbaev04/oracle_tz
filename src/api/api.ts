/* ──────────────────────────────────────────────────────────
   Mock API — имитация асинхронных запросов к серверу
   ────────────────────────────────────────────────────────── */

import type { Application } from '../types/types';

/** Имитация задержки сети (500–1000 мс) */
const simulateLatency = (): Promise<void> =>
    new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 500),
    );

/** Уникальный генератор ID */
let counter = 100;
const nextId = (): string => {
    counter += 1;
    return `mock-${counter}`;
};

/** Начальные данные (mock) */
const initialData: Application[] = [
    {
        id: '7b2f-4a12',
        name: 'Иванов Иван Иванович',
        account: '40817810500000001234',
        currentLimit: 50_000,
        requestedLimit: 150_000,
        currency: 'RUB',
        status: 'New',
    },
    {
        id: '1c9d-8b34',
        name: 'Константинопольский Александр Владимирович',
        account: '40817810500000005678',
        currentLimit: 1_500_000,
        requestedLimit: 2_000_000,
        currency: 'RUB',
        status: 'Approved',
    },
    {
        id: '9a5e-2f11',
        name: 'Сидорова Анна Сергеевна',
        account: '40817840300000009999',
        currentLimit: 5_000,
        requestedLimit: 10_000,
        currency: 'RUB',
        status: 'Rejected',
    },
    {
        id: nextId(),
        name: 'Петров Дмитрий Александрович',
        account: '40817810900000004567',
        currentLimit: 300_000,
        requestedLimit: 800_000,
        currency: 'RUB',
        status: 'New',
    },
    {
        id: nextId(),
        name: 'Козлова Мария Павловна',
        account: '40817810200000007890',
        currentLimit: 100_000,
        requestedLimit: 500_000,
        currency: 'RUB',
        status: 'New',
    },
];

/** In-memory хранилище (имитация БД) */
let dataStore: Application[] = structuredClone(initialData);

/** Получение списка заявок */
export const fetchApplications = async (): Promise<Application[]> => {
    await simulateLatency();
    return structuredClone(dataStore);
};

/** Обновление заявки */
export const updateApplication = async (
    id: string,
    patch: Partial<Pick<Application, 'currentLimit' | 'requestedLimit' | 'status'>>,
): Promise<Application> => {
    await simulateLatency();

    const index = dataStore.findIndex((a) => a.id === id);
    if (index === -1) {
        throw new Error(`Application ${id} not found`);
    }

    const updated: Application = { ...dataStore[index]!, ...patch };
    dataStore[index] = updated;
    return structuredClone(updated);
};

/** Сброс до начального состояния (для тестов) */
export const resetData = (): void => {
    dataStore = structuredClone(initialData);
};
