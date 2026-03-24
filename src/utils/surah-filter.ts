import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import type { TrackedSurah } from "@/types/surah";
import { normalizeSurahName } from "@/utils/normalize-surah-name";

export function filterSurahs(trackedSurahs: TrackedSurah[], query: string) {
    const normalizedQuery = normalizeSurahName(query);

    if (!normalizedQuery) {
        return trackedSurahs;
    }

    return trackedSurahs.filter((surah) => {
        const arabicName = getArabicSurahNameByNormalizedName(surah.normalizedName);
        const normalizedArabicName = arabicName ? normalizeSurahName(arabicName) : '';

        return (
            surah.normalizedName.includes(normalizedQuery) ||
            normalizedArabicName.includes(normalizedQuery)
        );
    });
}
