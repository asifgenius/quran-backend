import type { Context } from "hono";

import {
  getAllSurahs,
  getPaginatedDirectory,
  getSurahById,
  searchVersesByTranslation,
} from "../services/quran-service.js";

type SortOrder = "ascending" | "descending";
type DirectoryView = "surah" | "juz" | "revelation_order";

function getPageParam(context: Context, fallback: number) {
  const value = Number(context.req.query("page") ?? String(fallback));
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function getLimitParam(context: Context, fallback: number) {
  const value = Number(context.req.query("limit") ?? String(fallback));
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function getSortOrderParam(context: Context): SortOrder {
  return context.req.query("sort") === "descending"
    ? "descending"
    : "ascending";
}

function getDirectoryViewParam(context: Context): DirectoryView {
  const view = context.req.query("view");
  return view === "juz" || view === "revelation_order" ? view : "surah";
}

export function getHealth(context: Context) {
  return context.json({
    status: "ok",
    service: "quran-api",
  });
}

export function listSurahs(context: Context) {
  if (
    context.req.query("page") !== undefined ||
    context.req.query("limit") !== undefined ||
    context.req.query("view") !== undefined ||
    context.req.query("sort") !== undefined
  ) {
    return context.json(
      getPaginatedDirectory({
        page: getPageParam(context, 1),
        limit: getLimitParam(context, 114),
        sortOrder: getSortOrderParam(context),
        view: getDirectoryViewParam(context),
      }),
    );
  }

  const surahs = getAllSurahs();
  return context.json({
    total: surahs.length,
    surahs,
  });
}

export function getSurah(context: Context) {
  const id = Number(context.req.param("id"));

  if (!Number.isInteger(id) || id < 1 || id > 114) {
    return context.json({ error: "Invalid surah id." }, 400);
  }

  const surah = getSurahById(id);

  if (!surah) {
    return context.json({ error: "Surah not found." }, 404);
  }

  return context.json(surah);
}

export function searchAyahs(context: Context) {
  const query = context.req.query("q") ?? "";
  const limit = getLimitParam(context, 24);
  const results = searchVersesByTranslation(query, limit);

  return context.json({
    query,
    total: results.length,
    results,
  });
}
