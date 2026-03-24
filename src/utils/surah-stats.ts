import { differenceInCalendarDays, isValid, parseISO } from 'date-fns';

import type { TrackedSurah } from '@/types/surah';

function toValidDate(iso: string) {
    const parsed = parseISO(iso);

    return isValid(parsed) ? parsed : null;
}

export function getRevisionEvents(surah: TrackedSurah) {
    const fromHistory = (surah.revisionEvents ?? [])
        .map((iso) => ({ iso, parsed: toValidDate(iso) }))
        .filter((entry): entry is { iso: string; parsed: Date } => entry.parsed !== null)
        .sort((a, b) => a.parsed.getTime() - b.parsed.getTime())
        .map((entry) => entry.iso);

    if (fromHistory.length > 0) {
        return fromHistory;
    }

    return surah.lastRevisedAt ? [surah.lastRevisedAt] : [];
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
