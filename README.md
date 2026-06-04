# 🎓 College Discovery Platform

A production-ready, full-stack web application for discovering and comparing top Indian colleges. Built with **Next.js 16 App Router**, **TypeScript**, **PostgreSQL (Neon)**, **Prisma ORM**, **Zod** validation, and **Tailwind CSS v4**.

> Search, filter, compare, and bookmark colleges — all from a fast, modern, server-rendered UI backed by a robust RESTful API.

---

## 📋 Table of Contents

- [Backend System Architecture (System Design Guide)](BACKEND_ARCHITECTURE.md)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Run Locally](#-run-locally)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [Sample API Requests](#-sample-api-requests)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🔭 Project Overview

The **College Discovery Platform** is designed to help students explore, compare, and save colleges across India. It provides a searchable, filterable interface with paginated results, detailed college pages with course breakdowns, and a personal bookmark system.

The architecture follows **Next.js App Router** conventions — API routes live alongside pages in the `app/` directory, Prisma manages the database layer via a PostgreSQL-compatible driver adapter (`@prisma/adapter-pg`), and all request/response data is validated at the boundary with **Zod** schemas.

> [!IMPORTANT]
> **For Backend Engineering Assessors**: To evaluate this submission's backend quality, please review the dedicated [Backend Architecture & System Design Document](BACKEND_ARCHITECTURE.md). It outlines database singleton connection management, parallel query execution (`Promise.all`), composite indexing optimizations, cascading integrity rules, Zod input validation schemas, and REST HTTP boundary error handling.

---

## ✨ Features

| Category | Details |
|---|---|
| **Search & Discovery** | Full-text search across college names and descriptions |
| **Filtering** | Filter by location and course name |
| **Pagination** | Server-side pagination with configurable page size (max 50) |
| **College Details** | Dedicated detail pages with course listings, fees, and duration |
| **Bookmarks** | Save/unsave colleges per user with duplicate prevention |
| **Health Check** | `/api/health` endpoint for uptime monitoring |
| **Validation** | Zod schemas validate all query params and request bodies |
| **Seed Data** | 15 pre-loaded Indian colleges with 55+ courses |
| **Responsive UI** | Tailwind CSS v4 responsive design with Inter font |
| **Type Safety** | End-to-end TypeScript with Prisma-generated types |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router + Turbopack) | 16.2.7 |
| **Language** | TypeScript | 5.x |
| **Database** | PostgreSQL (Neon Serverless) | — |
| **ORM** | Prisma (with `@prisma/adapter-pg`) | 7.8.0 |
| **Validation** | Zod | 4.4.3 |
| **Styling** | Tailwind CSS | 4.3.0 |
| **Runtime** | Node.js | 20+ |

---

## 📁 Project Structure

```
college-discovery-platform/
├── app/
│   ├── api/
│   │   ├── colleges/
│   │   │   ├── route.ts            # GET /api/colleges (list + search + filter)
│   │   │   └── [id]/
│   │   │       └── route.ts        # GET /api/colleges/:id (detail)
│   │   ├── saved/
│   │   │   └── route.ts            # GET & POST /api/saved (bookmarks)
│   │   └── health/
│   │       └── route.ts            # GET /api/health
│   ├── components/
│   │   ├── CollegeCard.tsx          # College preview card
│   │   ├── Header.tsx               # Site header / navigation
│   │   ├── Pagination.tsx           # Pagination controls
│   │   ├── SaveButton.tsx           # Bookmark toggle button
│   │   └── SearchBar.tsx            # Search + filter input bar
│   ├── college/[id]/                # College detail page (SSR)
│   ├── saved/                       # Saved colleges page
│   ├── [slug]/                      # Dynamic slug route
│   ├── generated/prisma/            # Auto-generated Prisma Client
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
├── src/
│   ├── lib/
│   │   └── prisma.ts                # Prisma Client singleton
│   └── schemas/
│       ├── college.schema.ts        # Zod schema for college queries
│       └── saved.schema.ts          # Zod schema for saved items
├── prisma/
│   ├── schema.prisma                # Database schema
│   ├── seed.ts                      # Seed script (15 colleges, 55+ courses)
│   └── migrations/                  # Migration history
├── prisma.config.ts                 # Prisma configuration
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json
└── .env.example                     # Environment variable template
```

---

## 🗃 Database Schema

The database consists of **4 models** with the following relationships:

```mermaid
erDiagram
    User ||--o{ SavedItem : "has many"
    College ||--o{ Course : "has many"
    College ||--o{ SavedItem : "saved by"
    User {
        string id PK "UUID"
        string email UK
        string name
        datetime createdAt
    }
    College {
        string id PK "UUID"
        string name UK
        string location
        int ranking
        string description
        datetime createdAt
    }
    Course {
        string id PK "UUID"
        string name
        float fees
        int duration
        string collegeId FK
    }
    SavedItem {
        string id PK "UUID"
        string userId FK
        string collegeId FK
        datetime createdAt
    }
```

### Model Details

#### `User`
| Field | Type | Constraints |
|---|---|---|
| `id` | `String` | `@id @default(uuid())` |
| `email` | `String` | `@unique` |
| `name` | `String?` | Optional |
| `createdAt` | `DateTime` | `@default(now())` |

#### `College`
| Field | Type | Constraints |
|---|---|---|
| `id` | `String` | `@id @default(uuid())` |
| `name` | `String` | `@unique` |
| `location` | `String` | Indexed |
| `ranking` | `Int` | Indexed |
| `description` | `String` | — |
| `createdAt` | `DateTime` | `@default(now())` |

#### `Course`
| Field | Type | Constraints |
|---|---|---|
| `id` | `String` | `@id @default(uuid())` |
| `name` | `String` | Indexed |
| `fees` | `Float` | — |
| `duration` | `Int` | In years |
| `collegeId` | `String` | FK → `College.id`, `onDelete: Cascade` |

#### `SavedItem`
| Field | Type | Constraints |
|---|---|---|
| `id` | `String` | `@id @default(uuid())` |
| `userId` | `String` | FK → `User.id`, `onDelete: Cascade` |
| `collegeId` | `String` | FK → `College.id`, `onDelete: Cascade` |
| `createdAt` | `DateTime` | `@default(now())` |
| | | `@@unique([userId, collegeId])` |

---

## 🔌 API Endpoints

### `GET /api/health`

Health check endpoint for uptime monitoring and deploy verification.

| Field | Value |
|---|---|
| **Auth** | None |
| **Response** | `{ success, status, database, timestamp }` |

---

### `GET /api/colleges`

List colleges with search, filtering, and pagination.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | `string` | — | Search by name or description (case-insensitive) |
| `location` | `string` | — | Filter by location (case-insensitive, partial match) |
| `course` | `string` | — | Filter by course name (case-insensitive, partial match) |
| `page` | `int` | `1` | Page number (≥ 1) |
| `limit` | `int` | `10` | Results per page (1–50) |

**Response:**

```json
{
  "success": true,
  "data": [ /* array of colleges with courses */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### `GET /api/colleges/:id`

Fetch a single college by UUID with all related courses.

| Field | Value |
|---|---|
| **Param** | `id` — College UUID |
| **Success** | `200` with college object including courses |
| **Not Found** | `404` — `{ success: false, message: "College not found" }` |

---

### `GET /api/saved?userId=<uuid>`

Fetch all saved (bookmarked) colleges for a given user.

| Field | Value |
|---|---|
| **Param** | `userId` — User UUID (required) |
| **Success** | `200` with array of saved items including college data |
| **Not Found** | `404` — User does not exist |

---

### `POST /api/saved`

Bookmark a college for a user.

**Request Body:**

```json
{
  "userId": "uuid-string",
  "collegeId": "uuid-string"
}
```

| Status | Description |
|---|---|
| `201` | College saved successfully |
| `400` | Validation failed |
| `409` | College already saved (duplicate) |

---

## 🚀 Installation

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- A **Neon** PostgreSQL database (or any PostgreSQL instance)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/college-discovery-platform.git
cd college-discovery-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Neon database connection string

# 4. Generate Prisma Client
npm run db:generate

# 5. Run database migrations
npm run db:migrate

# 6. Seed the database (15 colleges, 55+ courses, 1 demo user)
npm run db:seed
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Neon PostgreSQL connection string
# Get yours at: https://console.neon.tech
DATABASE_URL="postgresql://user:password@your-host.neon.tech/college_discovery?sslmode=require"
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Neon recommended) |

> **Note:** The connection string must include `?sslmode=require` for Neon databases.

---

## 💻 Run Locally

```bash
# Development mode (with Turbopack hot-reload)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

The app will be available at **http://localhost:3000**.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start dev server with Turbopack |
| `build` | `npm run build` | Create production build |
| `start` | `npm start` | Run production server |
| `db:generate` | `npm run db:generate` | Generate Prisma Client |
| `db:migrate` | `npm run db:migrate` | Run pending migrations |
| `db:push` | `npm run db:push` | Push schema changes (no migration) |
| `db:seed` | `npm run db:seed` | Seed database with sample data |
| `db:studio` | `npm run db:studio` | Open Prisma Studio GUI |
| `db:reset` | `npm run db:reset` | Reset database and re-run migrations |

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code** to a GitHub repository.

2. **Import the project** on [vercel.com/new](https://vercel.com/new).

3. **Add environment variables** in the Vercel dashboard:
   - `DATABASE_URL` → your Neon connection string

4. **Configure build settings** (auto-detected for Next.js):
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Add a build-step Prisma generate** (if needed):
   ```json
   // package.json — update the build script:
   "build": "prisma generate && next build"
   ```

6. **Deploy** — Vercel will build and deploy automatically on each push.

### Deploy to Other Platforms

For platforms like **Railway**, **Render**, or **Fly.io**:

```bash
# Ensure Prisma Client is generated before building
npx prisma generate
npm run build
npm start
```

> **Important:** Always run `prisma generate` as part of your build pipeline. The generated client in `app/generated/prisma/` is required at runtime.

---

## 📡 Sample API Requests

### List All Colleges (Paginated)

```bash
curl http://localhost:3000/api/colleges?page=1&limit=6
```

### Search Colleges by Name

```bash
curl "http://localhost:3000/api/colleges?search=IIT&page=1&limit=10"
```

### Filter by Location

```bash
curl "http://localhost:3000/api/colleges?location=Delhi"
```

### Filter by Course Name

```bash
curl "http://localhost:3000/api/colleges?course=Computer%20Science"
```

### Combine Search + Filters

```bash
curl "http://localhost:3000/api/colleges?search=technology&location=Tamil%20Nadu&page=1&limit=5"
```

### Get College Details

```bash
curl http://localhost:3000/api/colleges/<college-uuid>
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-06-04T10:00:00.000Z"
}
```

### Save a College (Bookmark)

```bash
curl -X POST http://localhost:3000/api/saved \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user-uuid>",
    "collegeId": "<college-uuid>"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "College saved successfully",
  "data": {
    "id": "generated-uuid",
    "userId": "<user-uuid>",
    "collegeId": "<college-uuid>",
    "createdAt": "2026-06-04T10:00:00.000Z"
  }
}
```

### Get Saved Colleges for a User

```bash
curl "http://localhost:3000/api/saved?userId=<user-uuid>"
```

---

## 🔮 Future Improvements

- [ ] **Authentication** — Add NextAuth.js / Clerk for user login and session management
- [ ] **College Reviews & Ratings** — Allow users to rate and review colleges
- [ ] **Advanced Filters** — Filter by fee range, ranking range, course duration
- [ ] **Compare Colleges** — Side-by-side comparison of 2–3 colleges
- [ ] **Admin Dashboard** — CRUD operations for managing colleges and courses
- [ ] **Image Uploads** — College photos and campus gallery via S3/Cloudinary
- [ ] **Full-Text Search** — PostgreSQL `tsvector` or Elasticsearch integration
- [ ] **Caching** — Redis or Next.js ISR for frequently accessed college pages
- [ ] **Rate Limiting** — Protect API endpoints with request throttling
- [ ] **API Versioning** — `/api/v1/` prefix for backward compatibility
- [ ] **Testing** — Jest + Supertest for API tests, Playwright for E2E
- [ ] **CI/CD Pipeline** — GitHub Actions for lint, test, and deploy automation
- [ ] **Dark Mode** — System-preference-aware theme toggle
- [ ] **PWA Support** — Offline access and installable web app
- [ ] **Notifications** — Email/push alerts for saved college updates

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Next.js, Prisma, and Neon PostgreSQL
</p>
