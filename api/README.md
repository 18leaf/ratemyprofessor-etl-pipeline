# API (Next.js) — RMP × Courses Query Layer

This folder contains the Next.js application that serves as the **query/serving layer** for the ETL pipeline.

- **Primary data source:** the SQLite database produced by the ETL `load/` stage (RateMyProfessor-derived tables).
- **Secondary data source:** a **course metadata CSV** (school-specific). This is intentionally not the centerpiece of the ETL story; it’s used by the app to provide course/program lookup.

This README briefly explains the capabilities and usage of the RMPxCourses API.

---

## Where the real API usage guide lives (do not modify)

The canonical, detailed usage guide (including example requests/responses and DTOs) is already written here:

- `Automatic-Schedule-Planner/src/rmpxcourseap.md`

That document includes:
- the demo page: `http://localhost:3000/tests`
- example fetch calls for:
  - teachers by course code
  - teachers by department
  - tags for a teacher
  - teacher by name
  - courses by program
- expected TypeScript DTO shapes
- minimal frontend usage example
- output from the API test runner route (`/tests`) that exercises the endpoints

This top-level README is simply a “promoted pointer” so reviewers can find it immediately.

---

## Quick reviewer path (recommended reading order)

1. **Usage + examples:**  
   Read `Automatic-Schedule-Planner/src/rmpxcourseap.md`

2. **API routes / test runner:**  
   Open the Next.js demo page: `http://localhost:3000/tests`  
   (It’s designed to show the available test cases and example outputs via a “slug” style—no header/request-body required.)

3. **Implementation details:**  
   Browse the API route implementations and related logic under:
   - `Automatic-Schedule-Planner/src/`

---

## What the API demonstrates (for ETL / data engineering)

Even if you don’t run it, this API is a strong “downstream consumer” example showing:

- how a curated relational model (SQLite) can be queried in a read-optimized way
- practical filtering and lookup patterns:
  - course → teachers
  - department → teachers
  - teacher → tags
  - name → teacher lookup
  - program → courses (CSV-backed)
- a simple test harness route (`/tests`) that produces deterministic example outputs for a reviewer

This is the “Serve” step in the broader pipeline:
Extract → Transform → Load (SQLite) → Serve (Next.js API).

---

## Optional: running locally (if someone *does* run it)

From `api/Automatic-Schedule-Planner/`:

- install deps: `npm install`
- run dev server: `npm run dev`
- visit: `http://localhost:3000/tests`

> Note: the API expects access to:
> - a SQLite database file produced by the ETL load step, and
> - a course metadata CSV file.
>
> If those aren’t present, some endpoints may return empty results or error depending on how the app is currently configured.

---

## Files of interest (quick map)

- `Automatic-Schedule-Planner/src/rmpxcourseap.md` — **minimal usage guide + examples (canonical)**
- `Automatic-Schedule-Planner/src/` — implementation (API routes, libs, DTO types)
- `/tests` route — interactive/test-runner style showcase page for endpoints

---
