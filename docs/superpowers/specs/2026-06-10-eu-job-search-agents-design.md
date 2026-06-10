# EU Job Search Agents — Design Spec

**Date:** 2026-06-10
**Status:** Approved

## Problem

The `.agents/skills/` directory contains four CLI tools targeting Danish job portals
(`jobbank-search`, `jobdanmark-search`, `jobindex-search`, `jobnet-search`). Denmark is not
in the target country list. The existing `job-scraper` skill uses `WebSearch`/`WebFetch` for
EU job discovery but has no structured CLI layer to call boards with good public APIs.

## Goals

1. Replace the Danish CLI tools with EU-targeted equivalents covering Germany, Netherlands,
   Poland, and Czechia.
2. Add two Claude agents to handle LinkedIn (guest API) and a WebSearch/WebFetch fallback.
3. Update the `job-scraper` skill to orchestrate the new tools in a defined execution order.
4. Remove stale artefacts from the repo.

## Out of Scope

- The application/CV/cover letter workflow (unchanged)
- Any authenticated LinkedIn access (account-ban risk unacceptable for an active job seeker)

---

## Architecture

### Deleted

```
.agents/skills/jobbank-search/       ← Denmark only; remove entirely
.agents/skills/jobdanmark-search/    ← Denmark only; remove entirely
.agents/skills/jobindex-search/      ← Denmark only; remove entirely
.agents/skills/jobnet-search/        ← Denmark only; remove entirely
```

### New CLI skills

```
.agents/skills/arbeitnow-search/
.agents/skills/nofluffjobs-search/
.agents/skills/eures-search/
.agents/skills/justjoin-search/
```

Each follows the same structure as the deleted skills:

```
<skill-name>/
  SKILL.md
  cli/
    package.json
    src/cli.ts
    src/helpers.ts
    tests/helpers.ts
```

### New Claude agents

```
.claude/agents/linkedin-jobs.md
.claude/agents/websearch-jobs.md
```

### Updated

```
.claude/skills/job-scraper/SKILL.md          ← revised execution order
.claude/skills/job-scraper/search-queries.md ← remove honeypot.io (shut down Jan 2025)
.gitignore                                   ← narrow .agents/ ignore to node_modules only
```

### Cleanup

```
applications/jetbrains/cover.cls             ← pre-Fira leftover; delete
applications/jetbrains/OpenFonts/            ← pre-Fira leftover; delete
cover_letters/*.synctex.gz                   ← stale LaTeX aux; delete
cover_letters/OpenFonts/                     ← old cover template dir; delete
```

---

## CLI Tool Designs

### `arbeitnow-search`

**Source:** `https://www.arbeitnow.com/api/job-board-api` (documented, public, no auth)
**Why:** Only board with a first-class `visa_sponsorship=true` filter. Germany-heavy;
aggregates Greenhouse, SmartRecruiters, TeamTailor, and other ATS sources.

**Commands:**

```bash
# Search
bun run skills/arbeitnow-search/cli/src/cli.ts search [flags]
  --visa              # maps to visa_sponsorship=true
  --remote            # maps to remote=true
  --location <text>   # client-side filter on location string (e.g. "Germany", "Berlin")
  --tags <tag>        # repeatable; e.g. --tags design --tags ux
  --page <n>          # server-side pagination
  --limit <n>         # client-side cap
  --format json|table|plain

# Detail
bun run skills/arbeitnow-search/cli/src/cli.ts detail <slug>
  --format json|plain
```

**Key output fields per job:** `slug`, `title`, `company_name`, `location`, `remote`,
`visa_sponsorship`, `tags`, `job_types`, `url`, `created_at`

---

### `nofluffjobs-search`

**Source:** `https://nofluffjobs.com/api/search/posting` (undocumented but stable REST)
**Why:** Best salary transparency (min/max/currency). Covers Poland, Czechia, Netherlands
(`region=pl|cz|nl`).

**Commands:**

```bash
# Search
bun run skills/nofluffjobs-search/cli/src/cli.ts search [flags]
  --region <code>     # repeatable: pl, cz, nl
  --category <name>   # backend, frontend, fullstack, devops, data, mobile, design, etc.
  --seniority <level> # repeatable: junior, mid, senior
  --limit <n>
  --format json|table|plain

# Detail
bun run skills/nofluffjobs-search/cli/src/cli.ts detail <slug>
  --format json|plain
```

**Key output fields per job:** `jobId`, `title`, `companyName`, `location`, `remote`,
`salaryMin`, `salaryMax`, `salaryCurrency`, `salaryPeriod`, `musts`, `nices`,
`postedDate`, `expiresDate`, `jobUrl`

---

### `eures-search`

**Source:** `https://europa.eu/eures/api` (POST endpoint; official EU portal; no auth)
**Why:** Broadest EU coverage; the only source that catches roles that don't flow through
commercial ATS aggregators. Country filtering via ISO-2 codes.
**Note:** No visa/work-permit filter exists — EURES is freedom-of-movement focused by design.

**Commands:**

```bash
# Search
bun run skills/eures-search/cli/src/cli.ts search [flags]
  --countries <code>  # repeatable ISO-2: de, nl, pl, cz
  --keywords <text>   # repeatable
  --page <n>
  --limit <n>
  --format json|table|plain

# Detail
bun run skills/eures-search/cli/src/cli.ts detail <id>
  --format json|plain
```

**Key output fields per job:** `id`, `title`, `employer`, `locationMap`, `creationDate`,
`positionScheduleCodes`, `positionOfferingCode`, `availableLanguages`

---

### `justjoin-search`

**Source:** `https://justjoin.it/api/offers` (uncertain post-2023; validated at startup)
**Why:** Covers Polish/Central-EU tech market; historically large dataset.
**Failure mode:** CLI probes the endpoint on startup and exits with a clear error if it
returns non-200 or empty data — no silent failure.
**Note:** No server-side filters; all filtering is client-side on the full dump.

**Commands:**

```bash
# Search
bun run skills/justjoin-search/cli/src/cli.ts search [flags]
  --title <text>      # substring match on title (case-insensitive)
  --city <text>       # substring match on city
  --country <text>    # substring match on country (e.g. "Poland")
  --remote            # remote=true only
  --limit <n>
  --format json|table|plain

# Detail
bun run skills/justjoin-search/cli/src/cli.ts detail <id>
  --format json|plain
```

**Key output fields per job:** `slug`, `title`, `companyName`, `city`, `country`, `remote`,
`salaryFrom`, `salaryTo`, `currency`, `skills`, `publishedAt`

---

## Agent Designs

### `linkedin-jobs.md`

**Method:** WebFetch against LinkedIn's unauthenticated guest API endpoint.
No credentials. No LinkedIn MCP. No personal-account session.

**Endpoint:**
```
GET https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search
  ?keywords=<url-encoded>
  &geoId=<id>
  &f_TPR=r1209600   (last 14 days)
  &start=0
```

**GeoId values:** Germany `101282230` · Netherlands `102890719` · Poland `105072130` · Czechia `104508036`

**Rate limiting:** 2–3 second delay between requests. On HTTP 429 or 999: stop, return
results collected so far, log how many pages were fetched before the block.

**Detail fetches:** For each promising result, WebFetch the public posting page
(`/jobs/view/<id>/`) for the full description.

**Returns:** title, company, location, url, posted-age, description snippet — same shape
as CLI tool output.

---

### `websearch-jobs.md`

**Method:** WebSearch with site-qualified queries + WebFetch for job detail pages.
Covers boards with no usable API: StepStone (stepstone.de), Indeed (.de/.nl), Glassdoor.

**Behaviour:**
- Accepts a query category (from `search-queries.md`) and optional target board
- Runs WebSearch with site-qualified queries and sponsorship qualifiers
- Pre-filters results by title/snippet before WebFetch (avoids burning fetches on noise)
- Applies the same sponsorship/gambling exclusion logic as the job-scraper skill
- Returns results in the same shape as CLI tool output

---

## Job-Scraper Execution Order

Updated `SKILL.md` Step 1 becomes:

```
Step 1a (CLIs):    arbeitnow-search → nofluffjobs-search → eures-search → justjoin-search
Step 1b (Agent):   linkedin-jobs (WebFetch guest API)
Step 1c (Agent):   websearch-jobs (StepStone, Indeed, Glassdoor)
Step 2:            Fetch & Parse (as before)
Step 3:            Quick Fit Assessment (as before)
Step 4:            Deduplicate & Store (as before)
Step 5:            Present Results (as before)
```

---

## `.gitignore` Change

**Before:**
```
# Agent usage logs
.agents/
```

**After:**
```
# Agent skill dependencies (node_modules only; bun.lock is tracked)
.agents/skills/*/cli/node_modules/
```

This ensures SKILL.md, package.json, bun.lock, src/, and tests/ are versioned, while
installed node_modules are not.

---

## Error Handling Conventions

All CLI tools follow the existing pattern from the Danish skills:
- Errors written to **stderr** as `{ "error": "...", "code": "..." }`
- Process exits with code `1` on error
- `justjoin-search` uses `"code": "API_UNAVAILABLE"` in the stderr JSON when the endpoint is dead

---

## Build Order

1. Delete Danish CLIs and stale artefacts
2. Update `.gitignore`
3. Build `arbeitnow-search` (simplest API; confirms the pattern)
4. Build `nofluffjobs-search`
5. Validate JustJoin.it endpoint live; build `justjoin-search` if working
6. Build `eures-search` (most complex: POST body, ESCO schema)
7. Write `linkedin-jobs.md` agent
8. Write `websearch-jobs.md` agent
9. Update `job-scraper` SKILL.md and `search-queries.md`
