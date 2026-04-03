import { differenceInCalendarDays, isValid, parseISO } from 'date-fns';

import { getRubSegmentsForSurah } from '@/constants/surah-rub-metadata';
import type { RubRevisionRecord, SurahRubState, TrackedSurah } from '@/types/surah';

function sortAndFilterRevisionEvents(events: string[]) {
    return [...events]
        .map((iso) => ({ iso, parsed: parseISO(iso) }))
        .filter((entry) => isValid(entry.parsed))
        .sort((left, right) => left.parsed.getTime() - right.parsed.getTime())
        .map((entry) => entry.iso);
}

function getLegacyRevisionEvents(surah: TrackedSurah) {
    const revisionEvents = sortAndFilterRevisionEvents(surah.revisionEvents ?? []);

    if (revisionEvents.length > 0) {
        return revisionEvents;
    }

    return surah.lastRevisedAt ? sortAndFilterRevisionEvents([surah.lastRevisedAt]) : [];
}

function getNormalizedRubRevisions(surah: TrackedSurah): RubRevisionRecord[] {
    const segments = getRubSegmentsForSurah(surah.surahNumber);

    if (segments.length === 0) {
        return [];
    }

    const hasExplicitRubRevisions = (surah.rubRevisions?.length ?? 0) > 0;
    const rubRevisionMap = new Map(
        (surah.rubRevisions ?? []).map((record) => [
            record.rubId,
            sortAndFilterRevisionEvents(record.revisionEvents ?? []),
        ])
    );
    const legacyRevisionEvents = hasExplicitRubRevisions
        ? []
        : getLegacyRevisionEvents(surah);

    return segments.map((segment) => ({
        rubId: segment.id,
        revisionEvents: rubRevisionMap.get(segment.id) ?? legacyRevisionEvents,
    }));
}

export function getAggregatedRevisionEvents(rubRevisions: RubRevisionRecord[]) {
    return sortAndFilterRevisionEvents(
        Array.from(
            new Set(rubRevisions.flatMap((record) => record.revisionEvents ?? []))
        )
    );
}

export function getSurahRubStates(surah: TrackedSurah): SurahRubState[] {
    const segments = getRubSegmentsForSurah(surah.surahNumber);
    const rubRevisions = getNormalizedRubRevisions(surah);
    const rubRevisionMap = new Map(rubRevisions.map((record) => [record.rubId, record.revisionEvents]));

    return segments.map((segment) => {
        const revisionEvents = rubRevisionMap.get(segment.id) ?? [];
        const lastRevisedAt = revisionEvents.length > 0 ? revisionEvents[revisionEvents.length - 1] : null;

        return {
            ...segment,
            revisionEvents,
            lastRevisedAt,
            isRevised: lastRevisedAt !== null,
        };
    });
}

export function getSurahRubProgress(surah: TrackedSurah) {
    const rubStates = getSurahRubStates(surah);
    const totalRubCount = rubStates.length;
    const revisedRubCount = rubStates.filter((rub) => rub.isRevised).length;
    const progressPercentage = totalRubCount === 0
        ? 0
        : Math.round((revisedRubCount / totalRubCount) * 100);

    return {
        progressPercentage,
        revisedRubCount,
        rubStates,
        totalRubCount,
    };
}

export function getLatestSurahRevisionAt(surah: TrackedSurah) {
    const aggregatedRevisionEvents = getAggregatedRevisionEvents(getNormalizedRubRevisions(surah));

    if (aggregatedRevisionEvents.length > 0) {
        return aggregatedRevisionEvents[aggregatedRevisionEvents.length - 1];
    }

    return surah.lastRevisedAt;
}

export function hydrateTrackedSurah(surah: TrackedSurah): TrackedSurah {
    const rubRevisions = getNormalizedRubRevisions(surah);
    const revisionEvents = getAggregatedRevisionEvents(rubRevisions);

    return {
        ...surah,
        rubRevisions,
        revisionEvents,
        lastRevisedAt: revisionEvents.length > 0 ? revisionEvents[revisionEvents.length - 1] : null,
    };
}

export function getLongestRubRevisionGapDays(revisionEvents: string[]) {
    const events = sortAndFilterRevisionEvents(revisionEvents)
        .map((iso) => parseISO(iso))
        .filter((parsed) => isValid(parsed));

    if (events.length < 2) {
        return null;
    }

    return events.slice(1).reduce((maxGap, current, index) => {
        const gap = Math.max(0, differenceInCalendarDays(current, events[index]));

        return Math.max(maxGap, gap);
    }, 0);
}