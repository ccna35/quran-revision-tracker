import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BackupRecord, BackupState, ThemeMode } from '@/types/surah';

interface AppPreferencesState {
    backup: BackupState;
    themeMode: ThemeMode;
    setThemeMode: (themeMode: ThemeMode) => void;
    setBackupRunning: () => void;
    recordBackupSuccess: (record: BackupRecord) => void;
    recordBackupFailure: (message: string) => void;
    setAutoBackupEnabled: (enabled: boolean) => void;
}

export const useAppPreferencesStore = create<AppPreferencesState>()(
    persist(
        (set) => ({
            backup: {
                autoBackupEnabled: true,
                lastBackup: null,
                lastError: null,
                status: 'idle',
            },
            themeMode: 'system',
            setThemeMode: (themeMode) => set({ themeMode }),
            setBackupRunning: () =>
                set((state) => ({
                    backup: {
                        ...state.backup,
                        lastError: null,
                        status: 'running',
                    },
                })),
            recordBackupSuccess: (record) =>
                set({
                    backup: {
                        autoBackupEnabled: true,
                        lastBackup: record,
                        lastError: null,
                        status: 'success',
                    },
                }),
            recordBackupFailure: (message) =>
                set((state) => ({
                    backup: {
                        ...state.backup,
                        lastError: message,
                        status: 'error',
                    },
                })),
            setAutoBackupEnabled: (enabled) =>
                set((state) => ({
                    backup: {
                        ...state.backup,
                        autoBackupEnabled: enabled,
                    },
                })),
        }),
        {
            name: 'quran-revision-tracker-preferences',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
