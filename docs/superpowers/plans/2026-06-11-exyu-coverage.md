# Ex-Yu Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Serbia as a home-base search tier (Infostud/HelloWorld/poslovi.rs via a new `exyu-jobs` agent) and wire Slovenia/Croatia into the default job-scraper run.

**Architecture:** Pure configuration/markdown changes — no application code. Two existing markdown configs (`search-queries.md`, `job-scraper/SKILL.md`) and one agent (`linkedin-jobs.md`) are edited; one new agent file (`exyu-jobs.md`) is created. Verification is live (CLI smoke tests + one agent invocation), since there is no unit-testable code.

**Tech Stack:** Claude Code skills/agents (markdown), existing `eures-search` Bun CLI, LinkedIn guest endpoint, WebSearch/WebFetch.

**Spec:** `docs/superpowers/specs/2026-06-11-exyu-coverage-design.md`

**Facts already verified during planning (do not re-research):**
- EURES CLI accepts `si`/`hr`: `--countries si --countries hr --keywords design` returned 37 results with correct SI/HR locations.
- LinkedIn guest endpoint works with `location=Slovenia|Croatia|Serbia` text param (returns correctly-located jobs) — **no geoIds needed**.
- Neither poslovi.infostud.com nor helloworld.rs has a public JSON API; both are server-rendered HTML, fetchable with plain HTTP (200 OK through Cloudflare).

---

### Task 1: search-queries.md — tiers, boards, queries, filter rules

**Files:**
- Modify: `.claude/skills/job-scraper/search-queries.md`

- [ ] **Step 1: Add Serbian boards to Group C**

In the "Group C — Per-country boards" list, after the line

```markdown
- Slovenia: **mojedelo.com** · Croatia: **mojposao.net** · Malta: **keepmeposted.com.mt**, **castille.com**
```

add:

```markdown
- Serbia (home base): **poslovi.infostud.com**, **helloworld.rs** (IT, Infostud-owned), **poslovi.rs**
```

- [ ] **Step 2: Add the home-base tier and ex-Yu bridge note to "Target Countries"**

Replace:

```markdown
- **Primary:** Germany, Netherlands
- **Bridge:** Poland, Czechia, Slovenia, Croatia, Malta *(Malta's main pull was iGaming — weaker now given the no-gambling preference, but still viable for fintech/tech in English)*
```

with:

```markdown
- **Primary:** Germany, Netherlands
- **Bridge:** Poland, Czechia, Slovenia, Croatia, Malta *(Malta's main pull was iGaming — weaker now given the no-gambling preference, but still viable for fintech/tech in English)*
  *Slovenia and Croatia carry an ex-Yu advantage: employer-driven work permits that are routine
  for Serbian citizens, and no practical language barrier.*
- **Home base:** Serbia — no work authorization needed. Target international / EU-headquartered
  companies in Belgrade where an intra-company transfer (EU ICT permit) or internal relocation
  opens an EU path later. Rank by EU-pathway signal, not visa signal.
```

- [ ] **Step 3: Add Slovenia/Croatia to the Priority 1 and 2 query country lists**

In "Priority 1: Design Leadership", replace:

```
("Head of Design" OR "Design Lead") "design systems" "visa sponsorship" (Germany OR Netherlands) -casino -gambling -betting
```

with:

```
("Head of Design" OR "Design Lead") "design systems" "visa sponsorship" (Germany OR Netherlands) -casino -gambling -betting
("Head of Design" OR "Design Lead") (Slovenia OR Croatia OR Ljubljana OR Zagreb) -casino -gambling -betting
```

In "Priority 2: Design Systems & DesignOps", replace:

```
site:linkedin.com/jobs "design systems" lead (Netherlands OR Poland OR Czechia) ("visa sponsorship" OR relocation)
```

with:

```
site:linkedin.com/jobs "design systems" lead (Netherlands OR Poland OR Czechia OR Slovenia OR Croatia) ("visa sponsorship" OR relocation)
```

- [ ] **Step 4: Add the new Priority 2.5 ex-Yu category**

Insert between the "Priority 2" and "Priority 3" sections:

````markdown
### Priority 2.5: Ex-Yu — Serbia home base + SI/HR local boards

Runs in the default scrape (executed by the **exyu-jobs** agent). Serbian queries take NO
sponsorship qualifier — rank by EU pathway instead. Local-language terms widen recall.

```
site:poslovi.infostud.com (dizajner OR "design lead" OR "head of design")
site:helloworld.rs (dizajn OR "product designer" OR "design lead")
site:poslovi.rs (dizajner OR "ux")
site:mojedelo.com (design OR oblikovalec)
site:mojposao.net ("head of design" OR dizajner OR "voditelj dizajna")
```
````

- [ ] **Step 5: Add Serbia rules to "Country & Relocation Filter"**

After the bullet `- **Keep & flag:** good-fit roles that are silent on sponsorship (confirm before applying)`, add:

```markdown
- **Serbia (home base):** never filter Serbian roles by visa/sponsorship language — it does
  not apply. Rank by EU pathway: international/EU-HQ employer (🔁) above purely local (🏠),
  unknown in between. Gambling exclusion still applies (large iGaming presence in Belgrade).
```

- [ ] **Step 6: Add `/scrape exyu` to "Adapting Queries"**

After the `- "/scrape bridge" ...` line, add:

```markdown
- "/scrape exyu" -> scope to Serbia + Slovenia + Croatia (home base + ex-Yu bridges), Priority 2.5 plus SI/HR queries from other categories
```

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/job-scraper/search-queries.md
git commit -m "feat: add Serbia home-base tier and ex-Yu queries to search strategy"
```

---

### Task 2: linkedin-jobs agent — SI/HR/RS location support

**Files:**
- Modify: `.claude/agents/linkedin-jobs.md` (GeoId reference section, around line 9–15)

- [ ] **Step 1: Add location guidance for the three countries**

In the "## GeoId reference" section, after the `- Remote/Worldwide: \`92000000\`` line, add:

```markdown
- Slovenia / Croatia / Serbia: no geoId needed — use the `location=<country>` text param
  instead of `geoId`, e.g. `...search?keywords=design&location=Serbia`. Verified to return
  correctly-located jobs for all three.
```

- [ ] **Step 2: Verify the claim still holds with one live request**

Run:

```bash
curl -s -m 20 "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=design&location=Croatia&start=0" | grep -A1 'job-search-card__location' | grep -vE 'job-search-card__location|^--' | sed 's/^ *//' | head -3
```

Expected: locations containing `Croatia` / `Zagreb`. (If HTTP 429, wait and retry once — do not change the plan.)

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/linkedin-jobs.md
git commit -m "feat: add Slovenia/Croatia/Serbia location support to linkedin-jobs agent"
```

---

### Task 3: New exyu-jobs agent

**Files:**
- Create: `.claude/agents/exyu-jobs.md`

- [ ] **Step 1: Create the agent file with exactly this content**

````markdown
---
name: exyu-jobs
description: Job search agent for ex-Yu boards — Serbia (poslovi.infostud.com, helloworld.rs, poslovi.rs), Slovenia (mojedelo.com), and Croatia (mojposao.net) — via WebSearch and WebFetch. Invoke during the job-scraper run to cover the Serbia home base and the SI/HR bridge countries. Tags Serbian results with an EU-pathway signal instead of a visa signal.
model: sonnet
---

You are an ex-Yugoslavia job search agent. You find design-leadership jobs on Serbian,
Slovenian, and Croatian job boards using WebSearch queries and selective WebFetch. These
boards have no public APIs — they are server-rendered HTML pages, which WebFetch reads fine.

## Boards you cover

- **poslovi.infostud.com** — Serbia's largest general board (listing pages like
  `https://poslovi.infostud.com/oglasi-za-posao-dizajner` — keyword in the URL path)
- **helloworld.rs** — Serbia's IT board, Infostud-owned (listings at
  `https://www.helloworld.rs/oglasi-za-posao`, tag pages like `/oglasi-za-posao/<tag>`)
- **poslovi.rs** — Serbian general board
- **mojedelo.com** — Slovenia
- **mojposao.net** — Croatia

## Search approach

### Step 1: WebSearch with site-qualified queries

Run 1–2 queries per board, in English AND the local language. Role terms to combine:
"Head of Design", "Design Lead", "Lead Product Designer", "design systems",
dizajner, dizajn, "voditelj dizajna" (HR), oblikovalec (SI).

```
site:poslovi.infostud.com (dizajner OR "design lead" OR "head of design")
site:helloworld.rs (dizajn OR "product designer" OR "design lead")
site:poslovi.rs (dizajner OR "ux")
site:mojedelo.com (design OR oblikovalec)
site:mojposao.net ("head of design" OR dizajner OR "voditelj dizajna")
```

For Serbian boards, do NOT add a visa/sponsorship qualifier — it does not apply (the
candidate is a Serbian citizen). Always exclude gambling: append `-casino -gambling -betting -igaming`
to broad queries, and skip any result from a gambling/betting/casino employer.

### Step 2: Direct board fetch (supplement)

If WebSearch returns little, WebFetch the board listing pages directly (URLs above) and
read the job cards out of the HTML.

### Step 3: Pre-filter before fetching detail pages

Skip junior/intern roles, non-design roles, and gambling employers based on title/snippet.
Fetch only the top 3–5 most promising postings per board. Maximum 12 WebFetch calls total.

### Step 4: Classify and output

For each job extract: title, company, location, posting date (or "recent"), URL, and
2–3 key requirements.

**Serbian jobs — EU-pathway signal (instead of the visa signal):**
- `"eu_pathway": "yes"` — international or EU-headquartered employer with offices in the
  EU (an intra-company transfer / EU ICT permit is plausible later)
- `"eu_pathway": "no"` — purely local employer
- `"eu_pathway": "unknown"` — cannot tell from the posting

**Slovenian/Croatian jobs — sponsorship signal with ex-Yu context:**
- `"sponsorship": "routine-permit"` — posting is silent on permits; for Serbian citizens
  the SI/HR employer-driven work permit is routine, so treat as workable, not gating
- `"sponsorship": "sponsors"` — posting explicitly mentions visa/relocation support
- `"sponsorship": "excluded"` — posting explicitly requires existing EU work authorization

Return results as a JSON array, one object per job:

```json
{
  "title": "Head of Design",
  "company": "Example d.o.o.",
  "location": "Belgrade, Serbia",
  "url": "https://poslovi.infostud.com/...",
  "posted": "2026-06-09",
  "source": "poslovi.infostud.com",
  "eu_pathway": "yes",
  "key_requirements": ["7+ years product design", "design systems", "English"]
}
```

(SI/HR objects carry `"sponsorship"` instead of `"eu_pathway"`.)

## Rules

- Never fabricate job listings. Only report what WebSearch and WebFetch actually return.
- Skip postings with expired deadlines.
- Skip gambling/betting/casino/iGaming employers — no exceptions.
- If a board returns nothing for a query, move on — do not retry the same query.
- Serbian/Croatian/Slovenian-language postings are fine — translate the key facts into
  English in your output.
````

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/exyu-jobs.md
git commit -m "feat: add exyu-jobs agent for Serbian and SI/HR job boards"
```

---

### Task 4: job-scraper SKILL.md — orchestration wiring

**Files:**
- Modify: `.claude/skills/job-scraper/SKILL.md`

- [ ] **Step 1: Widen the default priority range in Step 1**

Replace:

```markdown
Run searches across all available tools in priority order. By default, cover Priority 0–2 categories from `search-queries.md`. If the user said "broad", run all categories.
```

with:

```markdown
Run searches across all available tools in priority order. By default, cover Priority 0–2.5 categories from `search-queries.md` (2.5 is the ex-Yu category — Serbia home base + SI/HR). If the user said "broad", run all categories.
```

- [ ] **Step 2: Add si/hr to the EURES CLI call in Step 1a**

Replace:

```markdown
- **eures-search**: `bun run .agents/skills/eures-search/cli/src/cli.ts search --countries de --countries nl --countries pl --countries cz --keywords "Head of Design" --limit 20 --format json` (and a second call with `--keywords "design systems"`)
```

with:

```markdown
- **eures-search**: `bun run .agents/skills/eures-search/cli/src/cli.ts search --countries de --countries nl --countries pl --countries cz --countries si --countries hr --keywords "Head of Design" --limit 20 --format json` (and a second call with `--keywords "design systems"`)
```

- [ ] **Step 3: Add Step 1d after the Step 1c block**

After the "#### Step 1c: WebSearch fallback agent" paragraph, add:

```markdown
#### Step 1d: Ex-Yu agent

Invoke the `exyu-jobs` agent (in parallel with Step 1c). It covers the Serbian boards
(poslovi.infostud.com, helloworld.rs, poslovi.rs) plus mojedelo.com (SI) and
mojposao.net (HR), and returns Serbian results tagged with an `eu_pathway` signal
instead of a visa signal.
```

- [ ] **Step 4: Extend the sponsorship signal in Step 3 (Quick Fit Assessment)**

Replace:

```markdown
Also capture the **sponsorship signal** (the gating filter from `04-job-evaluation.md`):
✅ offers visa sponsorship / relocation · ⚠️ silent (confirm before applying) · ❌ requires existing EU work authorization.
```

with:

```markdown
Also capture the **sponsorship signal** (the gating filter from `04-job-evaluation.md`):
✅ offers visa sponsorship / relocation · ⚠️ silent (confirm before applying) · ❌ requires existing EU work authorization.

**Exception — Serbian jobs:** the visa signal does not apply at home. Capture the
**EU-pathway signal** instead: 🔁 international/EU-HQ employer (transfer path plausible) ·
🏠 purely local · ❓ unknown.
```

- [ ] **Step 5: Note the Serbian icons in the Step 5 results table**

After the results-table code block's `### High-Match Highlights` section (i.e. immediately after the closing triple-backtick of the presentation block), add:

```markdown
For Serbian jobs, the Visa column shows the EU-pathway signal (🔁 EU path / 🏠 local / ❓ unknown) instead of the sponsorship icon.
```

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/job-scraper/SKILL.md
git commit -m "feat: wire ex-Yu coverage into job-scraper execution order"
```

---

### Task 5: Live verification

**Files:** none modified — smoke tests only.

- [ ] **Step 1: EURES regression with si/hr**

Run:

```bash
bun run .agents/skills/eures-search/cli/src/cli.ts search --countries si --countries hr --keywords design --limit 5 --format table
```

Expected: `Found N total` with N > 0 and Country column values `SI` / `HR`.
(Planning-time run returned 37 results.)

- [ ] **Step 2: Smoke-test the exyu-jobs agent**

Invoke the `exyu-jobs` agent once via the Agent tool with prompt:
"Search for design leadership roles. Focus terms: Head of Design, Design Lead, design systems. Return the JSON array."

Expected: a JSON array with ≥1 real posting from at least one of the five boards, Serbian
entries carrying `eu_pathway`, SI/HR entries carrying `sponsorship`. Spot-check one URL
with WebFetch to confirm the posting exists.

- [ ] **Step 3: Confirm dedupe shape unchanged**

Read `job_scraper/seen_jobs.json` (if present) and confirm the agent output keys
(`url`, `title`, `company`) map onto the existing seen-list key scheme — no code change
expected; this is a read-only sanity check.

- [ ] **Step 4: Report results**

Present the smoke-test evidence (EURES output line, sample agent JSON) to the user as a
pass/fail list. If any step failed, fix before declaring done.
