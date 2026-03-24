import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sampleSurahSeeds } from '@/constants/sample-surahs';
import type { TrackedSurah } from '@/types/surah';
import { normalizeSurahName } from '@/utils/normalize-surah-name';

interface AddSurahResult {
    error?: string;
    surah?: TrackedSurah;
}

interface SurahState {
    trackedSurahs: TrackedSurah[];
    addSurah: (name: string, surahNumber?: number) => AddSurahResult;
    markAsRevised: (id: string) => void;
    resetAll: () => void;
    loadSampleData: () => void;
}

function createTrackedSurah(name: string, surahNumber?: number): TrackedSurah {
    const trimmedName = name.trim().replace(/\s+/g, ' ');

    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        name: trimmedName,
        normalizedName: normalizeSurahName(trimmedName),
        surahNumber,
        revisionEvents: [],
        createdAt: new Date().toISOString(),
        lastRevisedAt: null,
    };
}

export const useSurahStore = create<SurahState>()(
    persist(
        (set, get) => ({
            trackedSurahs: [],
            addSurah: (name, surahNumber) => {
                const trimmedName = name.trim();
                const normalizedName = normalizeSurahName(trimmedName);

                if (!normalizedName) {
                    return { error: 'Enter a Surah name before saving.' };
                }

                const duplicate = get().trackedSurahs.some(
                    (surah) => surah.normalizedName === normalizedName
                );

                if (duplicate) {
                    return { error: 'That Surah is already being tracked.' };
                }

                const surah = createTrackedSurah(trimmedName, surahNumber);

                set((state) => ({
                    trackedSurahs: [surah, ...state.trackedSurahs],
                }));

                return { surah };
            },
            markAsRevised: (id) =>
                set((state) => {
                    const revisedAt = new Date().toISOString();

                    return {
                        trackedSurahs: state.trackedSurahs.map((surah) =>
                            surah.id === id
                                ? {
                                    ...surah,
                                    lastRevisedAt: revisedAt,
                                    revisionEvents: [...(surah.revisionEvents ?? []), revisedAt],
                                }
                                : surah
                        ),
                    };
                }),
            resetAll: () => set({ trackedSurahs: [] }),
            loadSampleData: () =>
                set((state) => {
                    const now = Date.now();
                    const existingNames = new Set(state.trackedSurahs.map((surah) => surah.normalizedName));
                    const seededSurahs = sampleSurahSeeds
                        .filter((seed) => !existingNames.has(normalizeSurahName(seed.name)))
                        .map((seed) => {
                            const createdAt = new Date(
                                now - seed.daysTracked * 24 * 60 * 60 * 1000
                            ).toISOString();

                            const revisionEvents = [...seed.revisionDaysAgo]
                                .sort((a, b) => b - a)
                                .map((daysAgo) =>
                                    new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString()
                                );

                            const lastRevisedAt = revisionEvents.length > 0 ? revisionEvents[revisionEvents.length - 1] : null;

                            return {
                                ...createTrackedSurah(seed.name, seed.surahNumber),
                                createdAt,
                                lastRevisedAt,
                                revisionEvents,
                            };
                        });

                    return {
                        trackedSurahs: [...seededSurahs, ...state.trackedSurahs],
                    };
                }),
        }),
        {
            name: 'quran-revision-tracker-surahs',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
