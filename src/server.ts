import { Hono } from "hono";

import { quranRoutes } from "./routes/quran-routes.js";

const PORT = Number(process.env.PORT || 4000);
const app = new Hono();

app.use("*", async (context, next) => {
  context.header("Access-Control-Allow-Origin", "*");
  context.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  context.header("Access-Control-Allow-Headers", "Content-Type");

  if (context.req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  await next();
});

app.route("/", quranRoutes);

Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

console.log(`Quran API listening on http://localhost:${PORT}`);
