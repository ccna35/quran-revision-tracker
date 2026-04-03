import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import * as hafs from "quran-meta/hafs";

const require = createRequire(import.meta.url);
const quran = require("quran-json/dist/quran.json");

const segmentsBySurah = {};

for (let surahNumber = 1; surahNumber <= 114; surahNumber += 1) {
  segmentsBySurah[surahNumber] = [];
}

for (
  let globalRubId = 1;
  globalRubId <= hafs.meta.numRubAlHizbs;
  globalRubId += 1
) {
  const rub = hafs.getRubAlHizbMeta(globalRubId);
  const [startSurah, startAyah] = rub.first;
  const [endSurah, endAyah] = rub.last;

  for (
    let surahNumber = startSurah;
    surahNumber <= endSurah;
    surahNumber += 1
  ) {
    const surah = quran[surahNumber - 1];
    const localStartAyah = surahNumber === startSurah ? startAyah : 1;
    const localEndAyah =
      surahNumber === endSurah ? endAyah : surah.total_verses;
    const localRubNumber = segmentsBySurah[surahNumber].length + 1;
    const snippet = surah.verses[localStartAyah - 1].text
      .split(/\s+/)
      .slice(0, 4)
      .join(" ");

    segmentsBySurah[surahNumber].push({
      id: `${surahNumber}:${localRubNumber}`,
      localRubNumber,
      globalRubId,
      startAyah: localStartAyah,
      endAyah: localEndAyah,
      snippet,
    });
  }
}

const content = `export interface RubMetadataSegment {
  id: string;
  localRubNumber: number;
  globalRubId: number;
  startAyah: number;
  endAyah: number;
  snippet: string;
}

// Generated from quran-meta (MIT) Rub al-Hizb boundaries and quran-json Arabic ayah text.
export const surahRubMetadata: Record<number, RubMetadataSegment[]> = ${JSON.stringify(segmentsBySurah, null, 2)};

export function getRubSegmentsForSurah(surahNumber?: number | null) {
  if (!surahNumber) {
    return [];
  }

  return surahRubMetadata[surahNumber] ?? [];
}
`;

const outputPath = path.join(
  process.cwd(),
  "src/constants/surah-rub-metadata.ts",
);
fs.writeFileSync(outputPath, content, "utf8");
console.log(`Wrote ${outputPath}`);
