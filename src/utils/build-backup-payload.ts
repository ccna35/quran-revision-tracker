import type { BackupPayload, TrackedSurah } from '@/types/surah';
import { getProgressSummary } from '@/utils/surah-status';

export function buildBackupPayload(trackedSurahs: TrackedSurah[]): BackupPayload {
    const summary = getProgressSummary(trackedSurahs);

    return {
        exportedAt: new Date().toISOString(),
        trackedSurahs,
        metadata: {
            totalTrackedSurahs: summary.totalTrackedSurahs,
            revisedSurahs: summary.revisedSurahs,
            revisedRubCount: summary.revisedRubCount,
            appVersion: '1.0.0',
            totalRubCount: summary.totalRubCount,
        },
    };
}
