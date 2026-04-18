import { Hono } from "hono";

import {
  getHealth,
  getSurah,
  listSurahs,
  searchAyahs,
} from "../controllers/quran-controller.js";

export const quranRoutes = new Hono();

quranRoutes.get("/health", (context) => getHealth(context));
quranRoutes.get("/api/surahs", (context) => listSurahs(context));
quranRoutes.get("/api/surahs/:id", (context) => getSurah(context));
quranRoutes.get("/api/search", (context) => searchAyahs(context));
