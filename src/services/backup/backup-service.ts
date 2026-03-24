import type { BackupPayload, BackupRecord } from '@/types/surah';

export interface BackupService {
    runBackup(payload: BackupPayload, trigger: 'manual' | 'auto'): Promise<BackupRecord>;
    isBackupDue(lastBackupAt: string | null, now?: Date): boolean;
}
