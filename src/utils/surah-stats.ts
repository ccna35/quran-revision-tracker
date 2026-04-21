import { differenceInCalendarDays, format, isValid, parseISO, subDays } from 'date-fns';

import type { TrackedSurah } from '@/types/surah';
import { getLatestSurahRevisionAt, getSurahRubStates } from '@/utils/surah-rub';

function toValidDate(iso: string) {
    const parsed = parseISO(iso);

    return isValid(parsed) ? parsed : null;
}

export function getRevisionEvents(surah: TrackedSurah) {
    const fromRubHistory = getSurahRubStates(surah)
        .flatMap((rub) => rub.revisionEvents)
        .filter((iso, index, entries) => entries.indexOf(iso) === index)
        .map((iso) => ({ iso, parsed: toValidDate(iso) }))
        .filter((entry): entry is { iso: string; parsed: Date } => entry.parsed !== null)
        .sort((a, b) => a.parsed.getTime() - b.parsed.getTime())
        .map((entry) => entry.iso);

    if (fromRubHistory.length > 0) {
        return fromRubHistory;
    }

    return getLatestSurahRevisionAt(surah) ? [getLatestSurahRevisionAt(surah) as string] : [];
}

export function getRevisionCount(surah: TrackedSurah) {
    return getRevisionEvents(surah).length;
}

export function getDaysTracked(surah: TrackedSurah, now = new Date()) {
    const created = toValidDate(surah.createdAt);

    if (!created) {
        return null;
    }

    return Math.max(0, differenceInCalendarDays(now, created));
}

export function getAverageRevisionIntervalDays(surah: TrackedSurah) {
    const events = getRevisionEvents(surah)
        .map((iso) => toValidDate(iso))
        .filter((d): d is Date => d !== null);

    if (events.length < 2) {
        return null;
    }

    const totalDays = events.slice(1).reduce((sum, current, index) => {
        return sum + Math.max(0, differenceInCalendarDays(current, events[index]));
    }, 0);

    const average = totalDays / (events.length - 1);

    return Math.round(average * 10) / 10;
}

export function getLongestRevisionGapDays(surah: TrackedSurah) {
    const events = getRevisionEvents(surah)
        .map((iso) => toValidDate(iso))
        .filter((d): d is Date => d !== null);

    if (events.length < 2) {
        return null;
    }

    return events.slice(1).reduce((maxGap, current, index) => {
        const gap = Math.max(0, differenceInCalendarDays(current, events[index]));

        return Math.max(maxGap, gap);
    }, 0);
}

export interface DailyRevisionCount {
    date: Date;
    label: string;
    count: number;
}

export function getRevisionsPerDay(
    trackedSurahs: TrackedSurah[],
    days = 7,
    now = new Date(),
): DailyRevisionCount[] {
    const allEvents = trackedSurahs.flatMap((surah) => getRevisionEvents(surah));

    return Array.from({ length: days }, (_, i) => {
        const date = subDays(now, days - 1 - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const count = allEvents.filter((iso) => {
            const parsed = toValidDate(iso);

            return parsed !== null && format(parsed, 'yyyy-MM-dd') === dateStr;
        }).length;

        return { date, label: format(date, 'EEE'), count };
    });
}
