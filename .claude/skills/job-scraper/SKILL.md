# Job Scraper

**name:** job-scraper
**description:** Scrapes EU job sites for new positions matching your profile. Deduplicates across runs. Triggers on: job scrape, find jobs, search jobs, new jobs, job search, scrape jobs, /scrape
**allowed-tools:** Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, Agent, AskUserQuestion

---

## How It Works

This skill searches multiple EU job sites using targeted queries based on your profile, deduplicates against previously seen jobs and the application tracker, and presents new matches with a quick fit assessment.

## Invocation

The user triggers this skill by saying things like:
- "Find new jobs"
- "Scrape for jobs"
- "Any new positions?"
- "/scrape"

Optional arguments:
- A focus area, e.g. "/scrape data science" or "/scrape geophysics"
- "broad" to run all search categories, e.g. "/scrape broad"

---

## Execution Steps

### Step 0: Load State

1. Read `job_scraper/seen_jobs.json` (create if missing - start with `{"seen": {}}`)
2. Read `job_search_tracker.csv` to extract already-applied companies+roles
3. Read `search-queries.md` (this directory) for the search strategy

### Step 1: Search

Run searches across all available tools in priority order. By default, cover Priority 0–2 categories from `search-queries.md`. If the user said "broad", run all categories.

#### Step 1a: CLI tools (structured APIs — run in parallel)

Use the Agent tool to run these in parallel:

- **arbeitnow-search**: `bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search --visa --location Germany --limit 20 --format json` (and a second call with `--location Netherlands`)
- **nofluffjobs-search**: `bun run .agents/skills/nofluffjobs-search/cli/src/cli.ts search --region pl --region cz --category ux --format json`
- **eures-search**: `bun run .agents/skills/eures-search/cli/src/cli.ts search --countries de --countries nl --countries pl --countries cz --keywords "Head of Design" --limit 20 --format json` (and a second call with `--keywords "design systems"`)
- **justjoin-search**: skip — API endpoint unavailable (stub only)

Adjust keywords to match the current search category and user focus area.

#### Step 1b: LinkedIn agent

Invoke the `linkedin-jobs` agent. Pass the target role keywords and countries from `search-queries.md` Priority 1 and 2 categories.

#### Step 1c: WebSearch fallback agent

Invoke the `websearch-jobs` agent. Pass the current search category and target countries. This covers StepStone, Indeed, and Glassdoor.

### Step 2: Fetch & Parse

For each promising result from Step 1:
- Use `WebFetch` to retrieve the job posting page
- Extract: **job title**, **company**, **location**, **posting date** (or "recent"), **URL**, **key requirements** (brief), **application deadline** (if listed)
- Skip if the URL or company+title combo already exists in `seen_jobs.json`
- Skip if the company+role already appears in `job_search_tracker.csv`

### Step 3: Quick Fit Assessment

For each new job, do a rapid fit check (NOT the full evaluation from `04-job-evaluation.md` - just a quick signal):

- **High match**: Role directly involves your core skills
- **Medium match**: Role is adjacent to your experience
- **Low match**: Role requires significant skills you lack

Also capture the **sponsorship signal** (the gating filter from `04-job-evaluation.md`):
✅ offers visa sponsorship / relocation · ⚠️ silent (confirm before applying) · ❌ requires existing EU work authorization.

### Step 4: Deduplicate & Store

1. Add ALL fetched jobs (new and skipped) to `seen_jobs.json` with structure:
```json
{
  "seen": {
    "<url_or_company_title_key>": {
      "title": "...",
      "company": "...",
      "url": "...",
      "first_seen": "YYYY-MM-DD",
      "fit": "high/medium/low",
      "status": "new/skipped/evaluated"
    }
  }
}
```
2. Only present jobs NOT already in the seen list or tracker.

### Step 5: Present Results

Present new jobs in a table sorted by fit (high first):

```
## New Job Matches - YYYY-MM-DD

Found X new positions (Y high, Z medium, W low match).

| # | Fit | Visa | Title | Company | Location | Deadline | URL |
|---|-----|------|-------|---------|----------|----------|-----|
| 1 | High | ✅ | ... | ... | ... | ... | [Link](...) |

### High-Match Highlights
For each high-match job, add 2-3 bullet points:
- Why it matches your profile
- Key requirements to check
- Any red flags
```

After presenting, ask:
> "Want me to evaluate any of these in detail? Just give me the number(s)."

If the user picks a number, invoke the **job-application-assistant** skill workflow (fit evaluation first, then CV + cover letter if approved).

### Step 6: Update Tracker (Optional)

If the user decides to apply to any job, add a row to `job_search_tracker.csv`.

---

## Important Rules

1. **Never fabricate job postings.** Only present jobs found via actual WebSearch/WebFetch results.
2. **Respect deduplication.** Always check seen_jobs.json AND job_search_tracker.csv before presenting.
3. **Relocation is the goal, not a filter.** Focus on the configured target countries (primaries first, then bridges). Do NOT skip roles for requiring relocation; skip only roles that explicitly require existing EU work authorization or state "no sponsorship".
4. **Only open positions.** Skip postings with expired deadlines or those marked as closed.
5. **Be efficient with WebFetch.** Don't fetch every search result - use titles and snippets to pre-filter before fetching.
6. **Parallel searches.** Use the Agent tool or parallel WebSearch calls to speed up the search phase.
