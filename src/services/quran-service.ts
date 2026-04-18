import chapters from "../data/chapters_en.json" with { type: "json" };
import quran from "../data/quran_en.json" with { type: "json" };

import { juzSummaries, revelationOrder } from "../constants.js";
import type { SearchResult, Surah, SurahSummary } from "../types.js";

const surahSummaries = chapters as SurahSummary[];
const surahs = quran as Surah[];

export function getAllSurahs(): SurahSummary[] {
  return surahSummaries.map(({ link, ...surah }) => surah);
}

export function getPaginatedSurahs({
  page,
  limit,
  sortOrder,
  view,
}: {
  page: number;
  limit: number;
  sortOrder: "ascending" | "descending";
  view: "surah" | "revelation_order";
}) {
  const nextSurahs = getAllSurahs();

  if (view === "revelation_order") {
    const rankMap = new Map(
      revelationOrder.map((surahId, index) => [surahId, index + 1]),
    );

    nextSurahs.sort((a, b) => {
      const aRank = rankMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bRank = rankMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return sortOrder === "ascending" ? aRank - bRank : bRank - aRank;
    });
  } else {
    nextSurahs.sort((a, b) =>
      sortOrder === "ascending" ? a.id - b.id : b.id - a.id,
    );
  }

  const total = nextSurahs.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * limit;

  return {
    total,
    page: safePage,
    limit,
    totalPages,
    items: nextSurahs.slice(startIndex, startIndex + limit),
  };
}

export function getPaginatedDirectory({
  page,
  limit,
  sortOrder,
  view,
}: {
  page: number;
  limit: number;
  sortOrder: "ascending" | "descending";
  view: "surah" | "juz" | "revelation_order";
}) {
  if (view === "juz") {
    const items = [...juzSummaries].sort((a, b) =>
      sortOrder === "ascending" ? a.id - b.id : b.id - a.id,
    );
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * limit;

    return {
      total,
      page: safePage,
      limit,
      totalPages,
      items: items.slice(startIndex, startIndex + limit),
    };
  }

  return getPaginatedSurahs({ page, limit, sortOrder, view });
}

export function getSurahById(id: number): Surah | null {
  return surahs.find((surah) => surah.id === id) ?? null;
}

export function searchVersesByTranslation(
  query: string,
  limit = 24,
): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const matches: SearchResult[] = [];

  for (const surah of surahs) {
    for (const verse of surah.verses) {
      if (!verse.translation.toLowerCase().includes(normalizedQuery)) {
        continue;
      }

      matches.push({
        surahId: surah.id,
        surahName: surah.name,
        surahTransliteration: surah.transliteration,
        surahTranslation: surah.translation,
        verseId: verse.id,
        arabicText: verse.text,
        translationText: verse.translation,
      });

      if (matches.length >= limit) {
        return matches;
      }
    }
  }

  return matches;
}
