export type ThemeMode = 'light' | 'dark' | 'system';

export type SortOption = 'days-desc' | 'days-asc' | 'name-asc' | 'name-desc';

export type BackupTrigger = 'manual' | 'auto';

export interface RubRevisionRecord {
    rubId: string;
    revisionEvents: string[];
}

export interface SurahRubState {
    id: string;
    localRubNumber: number;
    globalRubId: number;
    startAyah: number;
    endAyah: number;
    snippet: string;
    revisionEvents: string[];
    lastRevisedAt: string | null;
    isRevised: boolean;
}

export interface TrackedSurah {
    id: string;
    name: string;
    normalizedName: string;
    surahNumber?: number;
    rubRevisions?: RubRevisionRecord[];
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
    progressPercentage: number;
    revisedRubCount: number;
    statusLabel: string;
    lastRevisedLabel: string;
    statusTone: 'neutral' | 'fresh' | 'steady' | 'watch' | 'urgent' | 'critical';
    totalRubCount: number;
}

export interface ProgressSummary {
    totalTrackedSurahs: number;
    revisedSurahs: number;
    revisedRubCount: number;
    neverRevisedSurahs: number;
    progressPercentage: number;
    totalRubCount: number;
}

export interface BackupPayload {
    exportedAt: string;
    trackedSurahs: TrackedSurah[];
    metadata: {
        totalTrackedSurahs: number;
        revisedSurahs: number;
        revisedRubCount: number;
        appVersion: string;
        totalRubCount: number;
    };
}
