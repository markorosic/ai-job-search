# Ex-Yu Coverage (Serbia + Slovenia/Croatia) — Design Spec

**Date:** 2026-06-11
**Status:** Approved

## Problem

Two gaps in the job-scraper's geographic coverage:

1. **Slovenia and Croatia are configured but never queried.** They sit in the bridge tier
   of `search-queries.md` with per-country boards listed (mojedelo.com, mojposao.net), but
   the EURES CLI invocation only passes `de nl pl cz`, the `linkedin-jobs` agent has no
   geoIds for SI/HR, the `websearch-jobs` agent covers only German/Dutch boards, and the
   single SI/HR query lives in Priority 3 — outside the default run (Priorities 0–2).
   Result: zero SI/HR results, ever.
2. **Serbia is absent entirely.** As a Serbian citizen, Marko needs no work authorization
   at home — a role at an international/EU-headquartered company in Belgrade is a
   legitimate intermediary step (EU ICT permit / internal transfer later). The major
   Serbian boards (poslovi.infostud.com, helloworld.rs, poslovi.rs) are not searched.

## Decisions made during brainstorming

- **Serbian job relevance:** surface both EU-pathway roles and strong local design-lead
  roles, ranked — EU-pathway companies higher, each result tagged with an
  `EU pathway: yes/no/unknown` signal (replaces the visa signal, which is meaningless
  at home).
- **Run scope:** Serbia, Slovenia, and Croatia all join the **default** `/scrape` run.
- **Approach:** config fixes + a new `exyu-jobs` agent (Approach A). No HTML-scraping CLI —
  research confirmed neither Infostud nor HelloWorld exposes a public JSON API (both are
  server-rendered, ~500 KB pages behind Cloudflare; plain HTTP fetches do succeed).

## Out of Scope

- An `infostud-search`/`helloworld-search` structured CLI (HTML scraping is fragile and
  these boards are low-volume for Head/Lead design roles; revisit only if the agent
  proves too noisy)
- Changes to the application/CV/cover letter workflow
- Other ex-Yu countries (Bosnia, Montenegro, North Macedonia — no EU pathway value)

---

## Changes

### 1. `search-queries.md` — strategy & tiers

- **Target Countries:** add a new tier above the existing ones:
  `Home base: Serbia` — no work authorization needed; target international/EU-HQ
  companies in Belgrade where intra-company transfer (EU ICT permit) opens an EU path.
- Bridge tier note for SI/HR: ex-Yu advantage — employer-driven work-permit regimes that
  are routine for Serbian citizens, and no practical language barrier.
- **Group C boards:** add Serbia — `poslovi.infostud.com`, `helloworld.rs`, `poslovi.rs`.
- **Query categories:** add Slovenia/Croatia to the Priority 1 and 2 country lists so they
  run by default; add ex-Yu board queries (English + local terms: "Head of Design",
  "dizajner", "dizajn") to the default-run range.
- **Country & Relocation Filter:** Serbia-specific rules — no sponsorship gate; rank by
  EU-pathway signal; gambling exclusion still applies (Serbian iGaming presence is large).
- **Adapting Queries:** `/scrape exyu` scopes a run to RS + SI + HR.

### 2. Config fixes for SI/HR

- `job-scraper/SKILL.md` Step 1a: EURES calls gain `--countries si --countries hr`
  (the CLI passes ISO-2 codes straight through; EURES covers all member states).
- `linkedin-jobs` agent: add geoIds for Slovenia, Croatia, and Serbia. Look the IDs up
  during implementation and verify each against the guest endpoint with a live request.

### 3. New agent: `.claude/agents/exyu-jobs.md`

Modeled on `websearch-jobs`. Same model (sonnet), same no-fabrication and bounded-fetch
rules.

- **Boards:** poslovi.infostud.com, helloworld.rs, poslovi.rs (RS); mojedelo.com (SI);
  mojposao.net (HR).
- **Search method:** WebSearch `site:` queries plus direct WebFetch of board search/listing
  pages (verified server-rendered and fetchable). Query in English and local language.
- **Filtering:**
  - Serbian roles: tag `eu_pathway: yes` (international/EU-HQ employer), `no` (purely
    local), or `unknown`. Never gate on visa/sponsorship.
  - SI/HR roles: sponsorship-style signal retained but reported as "routine work permit"
    context, not a gate.
  - Gambling/betting/casino employers skipped everywhere.
- **Output:** JSON array matching the `websearch-jobs` shape, with an `eu_pathway` field
  added for Serbian results.

### 4. `job-scraper/SKILL.md` — orchestration

- New **Step 1d: ex-Yu agent** — invoke `exyu-jobs` in the default run (parallel with
  Step 1c).
- Step 3 (Quick Fit Assessment): for Serbian jobs, capture the EU-pathway signal instead
  of the sponsorship signal.
- Step 5 (Present Results): Visa column shows `🔁 EU path` / `🏠 local` for Serbian rows.

## Verification

1. Run the EURES CLI manually with `--countries si --countries hr` and a design keyword;
   confirm non-empty, correctly-located results.
2. Verify each new LinkedIn geoId with one live guest-endpoint request.
3. Invoke the `exyu-jobs` agent once; confirm real postings from at least one Serbian
   board with correct `eu_pathway` tagging.
4. One full default `/scrape`; confirm ex-Yu rows appear in the results table and dedupe
   against `seen_jobs.json` still works (no mechanism changes needed — same URL/key shape).
