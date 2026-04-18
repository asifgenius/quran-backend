# Quran API

Small TypeScript backend for the Quran app.

## Stack

- Bun runtime
- Hono
- TypeScript

## Requirements

- Bun installed

## Run locally

```bash
bun install
bun run dev
```

The API starts on `http://localhost:4000` by default.

If you want auto-restart through nodemon instead:

```bash
bun run dev:nodemon
```

## Build and run

```bash
bun run build
bun run start
```

## Environment

This project does not need any required env vars for local development.

Optional values:

- `PORT` - overrides the default port `4000`

Copy the example file if you want to set a custom port:

```bash
cp .env.example .env
```

## Routes

- `GET /health`
- `GET /api/surahs`
- `GET /api/surahs/:id`
- `GET /api/search?q=mercy`

## Notes

- Quran JSON data is stored inside `src/data`
- The frontend expects this API to be reachable from the URL configured in its env
