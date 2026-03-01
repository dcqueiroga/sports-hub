# Sports Hub

Sports events aggregator for Brazil, consolidating daily schedules and broadcast services from Folha, Estadão, and SofaScore.

## Stack

- Frontend: Expo + React Native + React Native Web
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma

## Quick Start

1. Start PostgreSQL:
   - `docker compose up -d postgres`
2. Configure backend environment:
   - `cp backend/.env.example backend/.env`
3. Run Prisma setup:
   - `cd backend`
   - `npm run prisma:generate`
   - `npm run prisma:push`
4. Run backend:
   - `npm run dev`
5. In another terminal, run frontend:
   - `cd frontend`
   - `npm run web` (or `npm run android` / `npm run ios`)

## API

- `GET /api/events?date=YYYY-MM-DD`
- `GET /api/events?date=YYYY-MM-DD&sport=futebol`
- `GET /api/events?date=YYYY-MM-DD&service=disney-plus`
- `GET /api/services`
- `GET /api/sports`
- `GET /api/status`
- `POST /admin/scrape`
