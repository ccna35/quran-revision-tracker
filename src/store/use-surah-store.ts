import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sampleSurahSeeds } from '@/constants/sample-surahs';
import type { TrackedSurah } from '@/types/surah';
import { normalizeSurahName } from '@/utils/normalize-surah-name';
import { getSurahRubStates, hydrateTrackedSurah } from '@/utils/surah-rub';

interface AddSurahResult {
    error?: string;
    surah?: TrackedSurah;
}

interface SurahState {
    trackedSurahs: TrackedSurah[];
    addSurah: (name: string, surahNumber?: number) => AddSurahResult;
    markAsRevised: (id: string) => void;
    markEntireSurahAsRevised: (id: string) => void;
    markRubAsRevised: (surahId: string, rubId: string) => void;
    resetAll: () => void;
    loadSampleData: () => void;
}

function appendRevisionEvent(revisionEvents: string[], revisedAt: string) {
    return [...revisionEvents, revisedAt];
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
                    trackedSurahs: [hydrateTrackedSurah(surah), ...state.trackedSurahs],
                }));

                return { surah };
            },
            markAsRevised: (id) =>
                set((state) => {
                    const revisedAt = new Date().toISOString();

                    return {
                        trackedSurahs: state.trackedSurahs.map((surah) => {
                            if (surah.id !== id) {
                                return surah;
                            }

                            const hydratedSurah = hydrateTrackedSurah(surah);
                            const rubRevisions = getSurahRubStates(hydratedSurah).map((rub) => ({
                                rubId: rub.id,
                                revisionEvents: appendRevisionEvent(rub.revisionEvents, revisedAt),
                            }));

                            return hydrateTrackedSurah({
                                ...hydratedSurah,
                                rubRevisions,
                            });
                        }),
                    };
                }),
            markEntireSurahAsRevised: (id) =>
                set((state) => {
                    const revisedAt = new Date().toISOString();

                    return {
                        trackedSurahs: state.trackedSurahs.map((surah) => {
                            if (surah.id !== id) {
                                return surah;
                            }

                            const hydratedSurah = hydrateTrackedSurah(surah);
                            const rubRevisions = getSurahRubStates(hydratedSurah).map((rub) => ({
                                rubId: rub.id,
                                revisionEvents: appendRevisionEvent(rub.revisionEvents, revisedAt),
                            }));

                            return hydrateTrackedSurah({
                                ...hydratedSurah,
                                rubRevisions,
                            });
                        }),
                    };
                }),
            markRubAsRevised: (surahId, rubId) =>
                set((state) => {
                    const revisedAt = new Date().toISOString();

                    return {
                        trackedSurahs: state.trackedSurahs.map((surah) => {
                            if (surah.id !== surahId) {
                                return surah;
                            }

                            const hydratedSurah = hydrateTrackedSurah(surah);
                            const rubRevisions = getSurahRubStates(hydratedSurah).map((rub) => ({
                                rubId: rub.id,
                                revisionEvents: rub.id === rubId
                                    ? appendRevisionEvent(rub.revisionEvents, revisedAt)
                                    : rub.revisionEvents,
                            }));

                            return hydrateTrackedSurah({
                                ...hydratedSurah,
                                rubRevisions,
                            });
                        }),
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
                        })
                        .map(hydrateTrackedSurah);

                    return {
                        trackedSurahs: [...seededSurahs, ...state.trackedSurahs],
                    };
                }),
        }),
        {
            name: 'quran-revision-tracker-surahs',
            merge: (persistedState, currentState) => {
                const typedPersistedState = persistedState as Partial<SurahState> | undefined;

                return {
                    ...currentState,
                    ...typedPersistedState,
                    trackedSurahs: (typedPersistedState?.trackedSurahs ?? currentState.trackedSurahs)
                        .map(hydrateTrackedSurah),
                };
            },
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
