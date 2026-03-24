export interface SampleSurahSeed {
    name: string;
    surahNumber: number;
    daysTracked: number;
    revisionDaysAgo: number[];
}

// Diverse revision patterns to exercise the 14-day status bands:
// fresh 0-1, steady 2-4, watch 5-8, urgent 9-13, critical 14+, plus never revised.
export const sampleSurahSeeds: SampleSurahSeed[] = [
    { name: 'Al-Fatihah', surahNumber: 1, daysTracked: 45, revisionDaysAgo: [0, 3, 7, 15, 30] },
    { name: 'Al-Baqarah', surahNumber: 2, daysTracked: 90, revisionDaysAgo: [1, 12, 27, 48, 70] },
    { name: "Ali 'Imran", surahNumber: 3, daysTracked: 70, revisionDaysAgo: [2, 8, 20, 35, 50] },
    { name: 'An-Nisa', surahNumber: 4, daysTracked: 75, revisionDaysAgo: [] },
    { name: "Al-Ma'idah", surahNumber: 5, daysTracked: 52, revisionDaysAgo: [4, 19, 33] },
    { name: "Al-An'am", surahNumber: 6, daysTracked: 38, revisionDaysAgo: [0, 1, 4, 10] },
    { name: 'Yusuf', surahNumber: 12, daysTracked: 61, revisionDaysAgo: [8, 29, 44, 58] },
    { name: 'Al-Kahf', surahNumber: 18, daysTracked: 120, revisionDaysAgo: [9, 13, 20, 27, 34, 41, 48] },
    { name: 'Maryam', surahNumber: 19, daysTracked: 42, revisionDaysAgo: [13, 25, 37] },
    { name: 'Ta-Ha', surahNumber: 20, daysTracked: 56, revisionDaysAgo: [] },
    { name: 'Al-Anbiya', surahNumber: 21, daysTracked: 47, revisionDaysAgo: [14, 18, 31, 45] },
    { name: 'An-Nur', surahNumber: 24, daysTracked: 64, revisionDaysAgo: [21, 43, 60] },
    { name: 'Ar-Rahman', surahNumber: 55, daysTracked: 34, revisionDaysAgo: [0, 2, 6, 11, 18, 26] },
    { name: "Al-Waqi'ah", surahNumber: 56, daysTracked: 29, revisionDaysAgo: [2, 15, 23] },
    { name: 'Al-Mulk', surahNumber: 67, daysTracked: 88, revisionDaysAgo: [8, 9, 17, 25, 39, 57, 73] },
    { name: 'Al-Insan', surahNumber: 76, daysTracked: 40, revisionDaysAgo: [9, 28] },
    { name: 'An-Naba', surahNumber: 78, daysTracked: 50, revisionDaysAgo: [14, 21, 35, 49] },
    { name: 'Ad-Duhaa', surahNumber: 93, daysTracked: 27, revisionDaysAgo: [] },
    { name: 'Al-Ikhlas', surahNumber: 112, daysTracked: 18, revisionDaysAgo: [1, 2, 5, 9, 14] },
    { name: 'An-Nas', surahNumber: 114, daysTracked: 22, revisionDaysAgo: [4, 10, 16] },
];
