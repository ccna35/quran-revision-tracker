import {
    differenceInCalendarDays,
    format,
    isToday,
    isYesterday,
    parseISO,
} from 'date-fns';

import type { ProgressSummary, SurahComputedState, TrackedSurah } from '@/types/surah';

export function getDaysSinceLastRevision(lastRevisedAt: string | null, now = new Date()) {
    if (!lastRevisedAt) {
        return null;
    }

    return Math.max(0, differenceInCalendarDays(now, parseISO(lastRevisedAt)));
}

export function getSurahComputedState(
    surah: TrackedSurah,
    now = new Date()
): SurahComputedState {
    const daysSinceLastRevision = getDaysSinceLastRevision(surah.lastRevisedAt, now);

    if (daysSinceLastRevision === null) {
        return {
            daysSinceLastRevision,
            neverRevised: true,
            statusLabel: 'Never revised',
            lastRevisedLabel: 'Never revised',
            statusTone: 'neutral',
        };
    }

    const parsedDate = parseISO(surah.lastRevisedAt as string);
    const lastRevisedLabel = isToday(parsedDate)
        ? 'Last revised: Today'
        : isYesterday(parsedDate)
            ? 'Last revised: Yesterday'
            : `Last revised: ${format(parsedDate, 'MMM d, yyyy')}`;

    if (daysSinceLastRevision <= 1) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} day${daysSinceLastRevision === 1 ? '' : 's'}`,
            lastRevisedLabel,
            statusTone: 'fresh',
        };
    }

    if (daysSinceLastRevision <= 4) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} day${daysSinceLastRevision === 1 ? '' : 's'}`,
            lastRevisedLabel,
            statusTone: 'steady',
        };
    }

    if (daysSinceLastRevision <= 8) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} days`,
            lastRevisedLabel,
            statusTone: 'watch',
        };
    }

    if (daysSinceLastRevision <= 13) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} days`,
            lastRevisedLabel,
            statusTone: 'urgent',
        };
    }

    return {
        daysSinceLastRevision,
        neverRevised: false,
        statusLabel: `${daysSinceLastRevision}+ days`,
        lastRevisedLabel,
        statusTone: 'critical',
    };
}

export function getProgressSummary(trackedSurahs: TrackedSurah[]): ProgressSummary {
    const revisedSurahs = trackedSurahs.filter((surah) => surah.lastRevisedAt !== null).length;
    const totalTrackedSurahs = trackedSurahs.length;
    const neverRevisedSurahs = totalTrackedSurahs - revisedSurahs;
    const progressPercentage =
        totalTrackedSurahs === 0 ? 0 : Math.round((revisedSurahs / totalTrackedSurahs) * 100);

    return {
        totalTrackedSurahs,
        revisedSurahs,
        neverRevisedSurahs,
        progressPercentage,
    };
}
