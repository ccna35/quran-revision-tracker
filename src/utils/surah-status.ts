import {
    differenceInCalendarDays,
    format,
    isToday,
    isValid,
    isYesterday,
    parseISO,
} from 'date-fns';
import { ar } from 'date-fns/locale';

import type { ProgressSummary, SurahComputedState, TrackedSurah } from '@/types/surah';
import { getLatestSurahRevisionAt, getSurahRubProgress, getSurahRubStates } from '@/utils/surah-rub';

export function getRevisionTimingState(lastRevisedAt: string | null, now = new Date()) {
    const daysSinceLastRevision = getDaysSinceLastRevision(lastRevisedAt, now);

    if (daysSinceLastRevision === null) {
        return {
            daysSinceLastRevision,
            neverRevised: true,
            statusLabel: 'غير مراجع',
            lastRevisedLabel: 'غير مراجع',
            statusTone: 'neutral' as const,
        };
    }

    const parsedDate = parseISO(lastRevisedAt as string);
    const formattedDate = format(parsedDate, 'd MMM yyyy', { locale: ar });
    const lastRevisedLabel = isToday(parsedDate)
        ? 'آخر مراجعة: اليوم'
        : isYesterday(parsedDate)
            ? 'آخر مراجعة: أمس'
            : `آخر مراجعة: ${formattedDate}`;

    if (daysSinceLastRevision <= 1) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} يوم`,
            lastRevisedLabel,
            statusTone: 'fresh' as const,
        };
    }

    if (daysSinceLastRevision <= 4) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} يوم`,
            lastRevisedLabel,
            statusTone: 'steady' as const,
        };
    }

    if (daysSinceLastRevision <= 8) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} يوم`,
            lastRevisedLabel,
            statusTone: 'watch' as const,
        };
    }

    if (daysSinceLastRevision <= 13) {
        return {
            daysSinceLastRevision,
            neverRevised: false,
            statusLabel: `${daysSinceLastRevision} يوم`,
            lastRevisedLabel,
            statusTone: 'urgent' as const,
        };
    }

    return {
        daysSinceLastRevision,
        neverRevised: false,
        statusLabel: `${daysSinceLastRevision}+ يوم`,
        lastRevisedLabel,
        statusTone: 'critical' as const,
    };
}

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
    const { progressPercentage, revisedRubCount, totalRubCount } = getSurahRubProgress(surah);
    const lastRevisedAt = getLatestSurahRevisionAt(surah);
    const revisionTiming = getRevisionTimingState(lastRevisedAt, now);

    return {
        ...revisionTiming,
        progressPercentage,
        revisedRubCount,
        totalRubCount,
    };
}

export function getProgressSummary(trackedSurahs: TrackedSurah[]): ProgressSummary {
    const totalTrackedSurahs = trackedSurahs.length;
    const computedStates = trackedSurahs.map((surah) => getSurahComputedState(surah));
    const revisedSurahs = computedStates.filter((surah) => !surah.neverRevised).length;
    const revisedRubCount = computedStates.reduce((sum, surah) => sum + surah.revisedRubCount, 0);
    const revisedRubTodayCount = trackedSurahs.reduce((sum, surah) => {
        const revisedTodayInSurah = getSurahRubStates(surah).filter((rub) =>
            rub.revisionEvents.some((event) => {
                const parsed = parseISO(event);

                return isValid(parsed) && isToday(parsed);
            })
        ).length;

        return sum + revisedTodayInSurah;
    }, 0);
    const neverRevisedSurahs = totalTrackedSurahs - revisedSurahs;
    const totalRubCount = computedStates.reduce((sum, surah) => sum + surah.totalRubCount, 0);
    const progressPercentage =
        totalRubCount === 0 ? 0 : Math.round((revisedRubCount / totalRubCount) * 100);

    return {
        totalTrackedSurahs,
        revisedSurahs,
        revisedRubCount,
        revisedRubTodayCount,
        neverRevisedSurahs,
        progressPercentage,
        totalRubCount,
    };
}
