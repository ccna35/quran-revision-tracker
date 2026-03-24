import type { SortOption, TrackedSurah } from '@/types/surah';
import { getDaysSinceLastRevision } from '@/utils/surah-status';

function getSortableDays(surah: TrackedSurah, neverRevisedPosition: 'first' | 'last') {
    const days = getDaysSinceLastRevision(surah.lastRevisedAt);

    if (days === null) {
        return neverRevisedPosition === 'first' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    return days;
}

export function sortSurahs(trackedSurahs: TrackedSurah[], sortOption: SortOption) {
    return [...trackedSurahs].sort((left, right) => {
        switch (sortOption) {
            case 'days-asc':
                return (
                    getSortableDays(left, 'last') - getSortableDays(right, 'last') ||
                    left.name.localeCompare(right.name)
                );
            case 'days-desc':
                return (
                    getSortableDays(right, 'first') - getSortableDays(left, 'first') ||
                    left.name.localeCompare(right.name)
                );
            case 'name-desc':
                return right.name.localeCompare(left.name);
            case 'name-asc':
            default:
                return left.name.localeCompare(right.name);
        }
    });
}
