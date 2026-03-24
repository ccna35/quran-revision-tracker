import { differenceInCalendarDays, parseISO } from 'date-fns';
import * as FileSystem from 'expo-file-system/legacy';

import type { BackupService } from '@/services/backup/backup-service';
import type { BackupPayload, BackupRecord } from '@/types/surah';

const BACKUP_DIRECTORY = `${FileSystem.documentDirectory ?? ''}quran-revision-tracker/backups`;

class LocalBackupService implements BackupService {
    async runBackup(payload: BackupPayload, trigger: 'manual' | 'auto'): Promise<BackupRecord> {
        if (!FileSystem.documentDirectory) {
            throw new Error('Local backup is unavailable on this platform.');
        }

        await FileSystem.makeDirectoryAsync(BACKUP_DIRECTORY, { intermediates: true });

        const timestamp = new Date().toISOString();
        const fileName = `backup-${timestamp.replace(/[:.]/g, '-')}.json`;
        const path = `${BACKUP_DIRECTORY}/${fileName}`;

        await FileSystem.writeAsStringAsync(path, JSON.stringify(payload, null, 2), {
            encoding: FileSystem.EncodingType.UTF8,
        });

        return {
            path,
            savedAt: timestamp,
            trigger,
        };
    }

    isBackupDue(lastBackupAt: string | null, now = new Date()) {
        if (!lastBackupAt) {
            return true;
        }

        return differenceInCalendarDays(now, parseISO(lastBackupAt)) >= 1;
    }
}

export const localBackupService = new LocalBackupService();
