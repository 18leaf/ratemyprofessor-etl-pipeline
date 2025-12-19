# RMP ETL Pipeline

A small, end-to-end **ETL pipeline** that takes semi-structured RateMyProfessor-derived data, **normalizes it into a relational model**, loads it into **SQLite**, and exposes a **Next.js API** as a downstream “query layer” demo.

This repository is primarily to showcase my work on this project; some modules may not function as displayed due to various incongruities with the live code.

---

## Start Here

- **API usage + example outputs:** `/api-usage.md` (application integration docs)
- **Next.js app (API implementation):** `api/Automatic-Schedule-Planner/src/` {`lib/`, `types/`, `app/api`, `app/tests`}
- **Extractor :** `extract/index.ts` (data extraction) `extract/rmp-extended.ts` (library extension)
- **Transformer (normalization):** `transform/data_clean.py`
- **Loader (SQLite schema + bulk load):** `load/to_sqlite.py`


---

## What it does

### Data flow
- **Extract:** scrape/collect source data (JSON) from RateMyProfessor.
- **Transform:** normalize ids/types, dedupe, and reshape semi-structured records into relational-shaped tables using Python pandas.
- **Load:** create SQLite schema + indexes, then bulk load a snapshot.
- **Serve:** Next.js API reads the SQLite DB and returns JSON for common query patterns.

### Downstream App
The Next.js app is a **user-facing webapp** that matches students' schedules with rate my professor reviews. It also reads a **course metadata CSV** (school-specific) used for program/course lookup; however, that CSV is school-specific and not the focus for this pipeline.

---

## Repo layout (minimal map)

- `extract/` — TypeScript scraper; extended from an existing package `rate-my-professor-api-ts`
- `transform/` — Python normalization / shaping (`data_clean.py`)
- `load/` — Python SQLite schema + loader (`to_sqlite.py`)
- `api/` — Next.js webapp API fork (`Automatic-Schedule-Planner/`)


---

## SQLite data model

The loader produces a SQLite snapshot with these main tables:

- `teachers`
  - **PK:** `teacher_id`
  - **Purpose:** one row per teacher with summary metrics (rating, difficulty, etc.)

- `teacher_courses`
  - **PK:** (`teacher_id`, `class_code`)
  - **FK:** `teacher_id` → `teachers.teacher_id`
  - **Purpose:** per-teacher per-course aggregates

- `teacher_tag_counts`
  - **PK:** (`teacher_id`, `tag`)
  - **FK:** `teacher_id` → `teachers.teacher_id`
  - **Purpose:** per-teacher tag frequencies

- `teacher_course_tag_counts`
  - **PK:** (`teacher_id`, `class_code`, `tag`)
  - **FK:** `teacher_id` → `teachers.teacher_id`
  - **Purpose:** per-teacher per-course tag frequencies

Extra, Optional table:
- `ratings_raw` — comment-level rows (disabled by default in the loader; useful for deeper analysis/debugging)

**Indexes** are created for common access patterns (course → teachers, teacher → courses/tags, teacher+course → tags).

---

## What the API demonstrates (why it matters for ETL)

The API is a practical downstream consumer that shows the model supports real queries like:
- course code → teachers
- department → teachers
- teacher → tags
- teacher name lookup → teacher id
- program → courses (CSV-backed)

See:
- `/api-usage.md` for concrete request/response examples and the `api/Automatic-Schedule-Planner/src/app/tests` demo route.
