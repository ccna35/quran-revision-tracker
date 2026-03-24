export type ThemeMode = 'light' | 'dark' | 'system';

export type SortOption = 'days-desc' | 'days-asc' | 'name-asc' | 'name-desc';

export type BackupTrigger = 'manual' | 'auto';

export interface TrackedSurah {
    id: string;
    name: string;
    normalizedName: string;
    surahNumber?: number;
    revisionEvents?: string[];
    createdAt: string;
    lastRevisedAt: string | null;
}

export interface BackupRecord {
    path: string | null;
    savedAt: string;
    trigger: BackupTrigger;
}

export interface BackupState {
    autoBackupEnabled: boolean;
    lastBackup: BackupRecord | null;
    lastError: string | null;
    status: 'idle' | 'running' | 'success' | 'error';
}

export interface SurahComputedState {
    daysSinceLastRevision: number | null;
    neverRevised: boolean;
    statusLabel: string;
    lastRevisedLabel: string;
    statusTone: 'neutral' | 'fresh' | 'steady' | 'watch' | 'urgent' | 'critical';
}

export interface ProgressSummary {
    totalTrackedSurahs: number;
    revisedSurahs: number;
    neverRevisedSurahs: number;
    progressPercentage: number;
}

export interface BackupPayload {
    exportedAt: string;
    trackedSurahs: TrackedSurah[];
    metadata: {
        totalTrackedSurahs: number;
        revisedSurahs: number;
        appVersion: string;
    };
}
