/* ──────────────────────────────────────────────────────────
   App — корневой компонент приложения
   ────────────────────────────────────────────────────────── */

import { useEffect } from 'react';
import { useAppStore, useApplications, useChangeLog, useIsLoading, useError, useSelectedApplication } from './store/store';
import { useFilter } from './hooks/useFilter';
import { useDebounceSearch } from './hooks/useDebounceSearch';
import { StatusFilter } from './components/StatusFilter';
import { SearchInput } from './components/SearchInput';
import { ApplicationsTable } from './components/ApplicationsTable';
import { EditModal } from './components/EditModal';
import { ChangeLog } from './components/ChangeLog';
import { ErrorBanner } from './components/ErrorBanner';

function App() {
    const loadApplications = useAppStore((s) => s.loadApplications);
    const selectApplication = useAppStore((s) => s.selectApplication);
    const clearError = useAppStore((s) => s.clearError);

    const applications = useApplications();
    const changeLogEntries = useChangeLog();
    const isLoading = useIsLoading();
    const error = useError();
    const selectedApp = useSelectedApplication();

    const { statusFilter, setStatusFilter, filterApplications } = useFilter();
    const { searchTerm, setSearchTerm, searchApplications } = useDebounceSearch();

    /* Загрузка данных при монтировании */
    useEffect(() => {
        void loadApplications();
    }, [loadApplications]);

    /* Пайплайн фильтрации: статус → поиск */
    const filteredApps = searchApplications(filterApplications(applications));

    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div className="app-header__content">
                    <div className="app-header__brand">
                        <svg className="app-header__logo" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        <div>
                            <h1 className="app-header__title">Кредитные лимиты</h1>
                            <p className="app-header__subtitle">Internal CRM — Модуль управления заявками</p>
                        </div>
                    </div>
                    <div className="app-header__stats">
                        <div className="stat-card">
                            <span className="stat-card__value">{applications.length}</span>
                            <span className="stat-card__label">Всего заявок</span>
                        </div>
                        <div className="stat-card stat-card--accent">
                            <span className="stat-card__value">
                                {applications.filter((a) => a.status === 'New').length}
                            </span>
                            <span className="stat-card__label">Новые</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="app-main">
                {/* Error banner */}
                {error && <ErrorBanner message={error} onDismiss={clearError} />}

                {/* Toolbar */}
                <div className="toolbar">
                    <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                    <SearchInput value={searchTerm} onChange={setSearchTerm} />
                </div>

                {/* Table */}
                <ApplicationsTable
                    applications={filteredApps}
                    onRowClick={(id) => selectApplication(id)}
                    isLoading={isLoading && applications.length === 0}
                />

                {/* Change Log */}
                <ChangeLog entries={changeLogEntries} />

                {/* Edit Modal */}
                {selectedApp && (
                    <EditModal
                        application={selectedApp}
                        onClose={() => selectApplication(null)}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
