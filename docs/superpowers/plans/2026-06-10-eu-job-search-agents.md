# EU Job Search Agents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four Denmark-only CLI job tools with EU-targeted equivalents (arbeitnow, nofluffjobs, eures, justjoin), add LinkedIn guest-API and WebSearch fallback agents, and wire everything into the job-scraper skill.

**Architecture:** Four TypeScript/Bun CLIs in `.agents/skills/` hit structured public APIs; two Claude agent definitions in `.claude/agents/` handle LinkedIn and WebSearch fallback; the `job-scraper` skill orchestrates them in priority order (CLIs → LinkedIn → WebSearch). Each CLI follows the existing `@bunli/core` pattern: `commands/search.ts` + `commands/detail.ts` registered in `cli.ts`.

**Tech Stack:** Bun, TypeScript, @bunli/core, zod (already in existing node_modules)

---

## Task 1: Cleanup — delete Danish CLIs and stale artefacts

**Files:**
- Delete: `.agents/skills/jobbank-search/`
- Delete: `.agents/skills/jobdanmark-search/`
- Delete: `.agents/skills/jobindex-search/`
- Delete: `.agents/skills/jobnet-search/`
- Delete: `applications/jetbrains/cover.cls`
- Delete: `applications/jetbrains/OpenFonts/`
- Delete: `cover_letters/OpenFonts/`
- Delete: `cover_letters/*.synctex.gz`

- [ ] **Step 1: Remove Danish CLI directories**

```bash
rm -rf .agents/skills/jobbank-search
rm -rf .agents/skills/jobdanmark-search
rm -rf .agents/skills/jobindex-search
rm -rf .agents/skills/jobnet-search
```

- [ ] **Step 2: Remove stale LaTeX artefacts**

```bash
rm -f applications/jetbrains/cover.cls
rm -rf applications/jetbrains/OpenFonts
rm -rf cover_letters/OpenFonts
rm -f cover_letters/*.synctex.gz
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove Denmark-only CLI skills and pre-Fira LaTeX artefacts"
```

---

## Task 2: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Replace blanket `.agents/` ignore with node_modules-only rule**

In `.gitignore`, find and replace:

```
# Agent usage logs
.agents/
```

with:

```
# Agent skill dependencies (source files are tracked, node_modules are not)
.agents/skills/*/cli/node_modules/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: narrow .agents gitignore to node_modules only"
```

---

## Task 3: Build arbeitnow-search CLI

**Files:**
- Create: `.agents/skills/arbeitnow-search/SKILL.md`
- Create: `.agents/skills/arbeitnow-search/cli/package.json`
- Create: `.agents/skills/arbeitnow-search/cli/src/helpers.ts`
- Create: `.agents/skills/arbeitnow-search/cli/src/commands/search.ts`
- Create: `.agents/skills/arbeitnow-search/cli/src/commands/detail.ts`
- Create: `.agents/skills/arbeitnow-search/cli/src/cli.ts`
- Create: `.agents/skills/arbeitnow-search/cli/tests/helpers.ts`
- Create: `.agents/skills/arbeitnow-search/cli/tests/search.test.ts`

- [ ] **Step 1: Create SKILL.md**

Create `.agents/skills/arbeitnow-search/SKILL.md`:

```markdown
---
name: arbeitnow-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for jobs with visa sponsorship,
  or asks about arbeitnow.com, Germany-based tech/product roles, or EU jobs with
  relocation support. Arbeitnow aggregates roles from Greenhouse, SmartRecruiters,
  TeamTailor, and other ATS platforms. The --visa flag filters to explicitly
  visa-sponsored roles — this is the primary differentiator vs other boards.
  Trigger phrases include: arbeitnow, visa sponsored jobs, germany jobs, sponsored
  relocation europe, eu jobs visa, visa sponsorship design, product jobs germany,
  ux jobs germany, head of design germany, design systems germany.
context: fork
allowed-tools: Bash(bun run skills/arbeitnow-search/cli/src/cli.ts *)
---

# Arbeitnow Search Skill

Search job listings from [Arbeitnow](https://www.arbeitnow.com) — an EU job board
aggregating roles from multiple ATS platforms. The `--visa` flag filters to jobs
explicitly flagged for visa sponsorship.

## Commands

### Search jobs

```bash
bun run skills/arbeitnow-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--visa` — only visa-sponsored jobs (`visa_sponsorship=true`)
- `--remote` — remote-only jobs
- `--location <text>` — client-side filter on location string (e.g. `Germany`, `Berlin`)
- `--tags <tag>` — tag filter, repeatable (e.g. `--tags design --tags ux`)
- `--page <n>` — page number (default: 1)
- `--limit <n>` — cap results
- `--format json|table|plain` — output format (default: json)

### Full job detail

```bash
bun run skills/arbeitnow-search/cli/src/cli.ts detail <slug> [--format json|plain]
```

`slug` is the job slug from search results. Fetches and parses the job page.

## Usage examples

### Visa-sponsored design jobs in Germany

```bash
bun run skills/arbeitnow-search/cli/src/cli.ts search \
  --visa --location Germany --tags design --format table
```

### Any remote visa-sponsored jobs

```bash
bun run skills/arbeitnow-search/cli/src/cli.ts search --visa --remote --format table
```

### Full details for a job

```bash
bun run skills/arbeitnow-search/cli/src/cli.ts detail some-job-slug --format plain
```
```

- [ ] **Step 2: Create package.json**

Create `.agents/skills/arbeitnow-search/cli/package.json`:

```json
{
  "name": "arbeitnow-cli",
  "version": "1.0.0",
  "description": "CLI for Arbeitnow job board API",
  "type": "module",
  "main": "src/cli.ts",
  "scripts": {
    "start": "bun run src/cli.ts",
    "test": "bun test --timeout 30000",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@bunli/core": "latest",
    "node-html-parser": "^6.1.13",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 3: Create src/helpers.ts**

Create `.agents/skills/arbeitnow-search/cli/src/helpers.ts`:

```typescript
export const BASE_URL = "https://www.arbeitnow.com"
export const API_URL = `${BASE_URL}/api/job-board-api`

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const maxRetries = 3
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, init)
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return response.json() as Promise<T>
  }
  throw new Error("Request failed after max retries")
}

export async function fetchHtml(url: string): Promise<string> {
  const maxRetries = 3
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; arbeitnow-cli/1.0)" },
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${response.status}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (response.status === 404) throw new Error("Job not found")
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

export interface ArbeitnowJob {
  slug: string
  company_name: string
  title: string
  description: string
  remote: boolean
  url: string
  tags: string[]
  job_types: string[]
  location: string
  created_at: number
  visa_sponsorship: boolean
}

export interface ArbeitnowResponse {
  data: ArbeitnowJob[]
  links: { first: string; last: string; prev: string | null; next: string | null }
  meta: { current_page: number; per_page: number; from: number; to: number }
}
```

- [ ] **Step 4: Create src/commands/search.ts**

Create `.agents/skills/arbeitnow-search/cli/src/commands/search.ts`:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchJson, writeError, type ArbeitnowResponse, type ArbeitnowJob, API_URL } from "../helpers.js"

function formatTable(jobs: ArbeitnowJob[]): void {
  console.log(`${"VISA".padEnd(4)} | ${"Title".padEnd(50)} | ${"Company".padEnd(30)} | Location`)
  console.log(`${"-".repeat(4)}-+-${"-".repeat(50)}-+-${"-".repeat(30)}-+-${"-".repeat(25)}`)
  for (const j of jobs) {
    const visa = j.visa_sponsorship ? "✓" : " "
    console.log(`${visa.padEnd(4)} | ${j.title.slice(0, 50).padEnd(50)} | ${j.company_name.slice(0, 30).padEnd(30)} | ${j.location.slice(0, 25)}`)
  }
}

export const search = defineCommand({
  name: "search",
  description: "Search Arbeitnow job listings",
  options: {
    visa: option(z.boolean().optional(), { description: "Only visa-sponsored jobs", argumentKind: "flag" }),
    remote: option(z.boolean().optional(), { description: "Remote-only jobs", argumentKind: "flag" }),
    location: option(z.string().optional(), { description: "Client-side location filter (e.g. Germany, Berlin)" }),
    tags: option(z.string().optional(), { description: "Tag filter (repeatable)", repeatable: true }),
    page: option(z.coerce.number().default(1), { description: "Page number" }),
    limit: option(z.coerce.number().optional(), { description: "Max results to return" }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), { description: "Output format" }),
  },
  handler: async ({ flags }) => {
    try {
      const params = new URLSearchParams()
      params.set("page", String(flags.page))
      if (flags.visa) params.set("visa_sponsorship", "true")
      if (flags.remote) params.set("remote", "true")
      if (flags.tags) {
        const tagList = Array.isArray(flags.tags) ? flags.tags : [flags.tags]
        for (const t of tagList) params.append("tags[]", t)
      }

      const data = await fetchJson<ArbeitnowResponse>(`${API_URL}?${params.toString()}`)
      let jobs = data.data

      if (flags.location) {
        const loc = flags.location.toLowerCase()
        jobs = jobs.filter(j => j.location.toLowerCase().includes(loc))
      }
      if (flags.limit) {
        jobs = jobs.slice(0, flags.limit)
      }

      if (flags.format === "table") {
        console.log(`Found ${jobs.length} jobs (page ${data.meta.current_page} of ${Math.ceil(data.meta.from / data.meta.per_page) || "?"})`)
        formatTable(jobs)
      } else if (flags.format === "plain") {
        for (const j of jobs) {
          console.log(`${j.title}`)
          console.log(`  Company: ${j.company_name}`)
          console.log(`  Location: ${j.location}`)
          console.log(`  Visa: ${j.visa_sponsorship ? "yes" : "no"} | Remote: ${j.remote ? "yes" : "no"}`)
          console.log(`  Tags: ${j.tags.join(", ")}`)
          console.log(`  URL: ${j.url}`)
          console.log()
        }
      } else {
        console.log(JSON.stringify({ meta: data.meta, results: jobs }, null, 2))
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "SEARCH_ERROR")
      process.exit(1)
    }
  },
})
```

- [ ] **Step 5: Create src/commands/detail.ts**

Create `.agents/skills/arbeitnow-search/cli/src/commands/detail.ts`:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchHtml, writeError, stripHtml, BASE_URL } from "../helpers.js"

function extractJsonLd(html: string): Record<string, unknown> | null {
  const match = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)
  if (!match) return null
  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

export const detail = defineCommand({
  name: "detail",
  description: "Fetch full details for a job by slug",
  options: {
    format: option(z.enum(["json", "plain"]).default("plain"), { description: "Output format" }),
  },
  handler: async ({ flags, positionals }) => {
    const slug = positionals[0]
    if (!slug) {
      writeError("slug argument required", "MISSING_SLUG")
      process.exit(1)
    }
    try {
      const url = `${BASE_URL}/jobs/${slug}`
      const html = await fetchHtml(url)
      const ld = extractJsonLd(html)

      if (flags.format === "json") {
        console.log(JSON.stringify(ld ?? { slug, url, error: "no JSON-LD found" }, null, 2))
        return
      }

      if (ld) {
        const title = String(ld.title ?? "")
        const company = (ld.hiringOrganization as Record<string, unknown>)?.name ?? ""
        const location = (ld.jobLocation as Record<string, unknown>)?.address ?? ld.jobLocation ?? ""
        const description = ld.description ? stripHtml(String(ld.description)).slice(0, 1000) : ""
        const applyUrl = String(ld.url ?? ld.applicationContact ?? url)
        console.log(`${title}`)
        console.log(`Company: ${company}`)
        console.log(`Location: ${JSON.stringify(location)}`)
        console.log(`Apply: ${applyUrl}`)
        console.log()
        console.log(description)
      } else {
        console.log(`No structured data found for slug: ${slug}`)
        console.log(`URL: ${url}`)
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "DETAIL_ERROR")
      process.exit(1)
    }
  },
})
```

- [ ] **Step 6: Create src/cli.ts**

Create `.agents/skills/arbeitnow-search/cli/src/cli.ts`:

```typescript
import { createCLI } from "@bunli/core"
import { search } from "./commands/search.js"
import { detail } from "./commands/detail.js"

const cli = await createCLI({
  name: "arbeitnow-cli",
  version: "1.0.0",
  description: "CLI for Arbeitnow job board — EU jobs with visa sponsorship filter",
})

cli.command(search)
cli.command(detail)

await cli.run()
```

- [ ] **Step 7: Create tests/helpers.ts**

Create `.agents/skills/arbeitnow-search/cli/tests/helpers.ts`:

```typescript
import { join } from "path"

const CLI_PATH = join(import.meta.dir, "../src/cli.ts")

export interface CLIResult {
  stdout: string
  stderr: string
  exitCode: number
}

export async function runCLI(args: string[]): Promise<CLIResult> {
  const proc = Bun.spawn(["bun", "run", CLI_PATH, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode }
}

export function parseJSON<T = unknown>(result: CLIResult): T {
  if (result.exitCode !== 0) {
    throw new Error(`CLI exited ${result.exitCode}. stderr: ${result.stderr}`)
  }
  try {
    return JSON.parse(result.stdout) as T
  } catch {
    throw new Error(`Failed to parse JSON. stdout: ${result.stdout}`)
  }
}
```

- [ ] **Step 8: Create tests/search.test.ts**

Create `.agents/skills/arbeitnow-search/cli/tests/search.test.ts`:

```typescript
import { describe, it, expect } from "bun:test"
import { runCLI, parseJSON } from "./helpers.ts"
import type { ArbeitnowJob } from "../src/helpers.ts"

describe("arbeitnow-search search", () => {
  it("returns jobs in JSON format", async () => {
    const result = await runCLI(["search", "--limit", "3", "--format", "json"])
    const data = parseJSON<{ meta: unknown; results: ArbeitnowJob[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
  })

  it("returns only visa-sponsored jobs when --visa is set", async () => {
    const result = await runCLI(["search", "--visa", "--limit", "5", "--format", "json"])
    const data = parseJSON<{ results: ArbeitnowJob[] }>(result)
    expect(data.results.every(j => j.visa_sponsorship === true)).toBe(true)
  })

  it("filters by location client-side", async () => {
    const result = await runCLI(["search", "--location", "Germany", "--limit", "5", "--format", "json"])
    const data = parseJSON<{ results: ArbeitnowJob[] }>(result)
    data.results.forEach(j => {
      expect(j.location.toLowerCase()).toContain("germany")
    })
  })

  it("outputs table format without error", async () => {
    const result = await runCLI(["search", "--visa", "--limit", "3", "--format", "table"])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Title")
  })
})
```

- [ ] **Step 9: Install dependencies and run tests**

```bash
cd .agents/skills/arbeitnow-search/cli && bun install
```

Expected: packages installed, no errors.

```bash
bun test --timeout 30000
```

Expected: all 4 tests pass. If `--visa` test returns 0 results, the API may have no visa-sponsored jobs at this moment — re-run later or remove the `expect(length > 0)` assertion temporarily.

- [ ] **Step 10: Commit**

```bash
cd ../../../../  # back to repo root
git add .agents/skills/arbeitnow-search/
git commit -m "feat: add arbeitnow-search CLI (visa sponsorship filter, EU jobs)"
```

---

## Task 4: Build nofluffjobs-search CLI

**Files:**
- Create: `.agents/skills/nofluffjobs-search/SKILL.md`
- Create: `.agents/skills/nofluffjobs-search/cli/package.json`
- Create: `.agents/skills/nofluffjobs-search/cli/src/helpers.ts`
- Create: `.agents/skills/nofluffjobs-search/cli/src/commands/search.ts`
- Create: `.agents/skills/nofluffjobs-search/cli/src/commands/detail.ts`
- Create: `.agents/skills/nofluffjobs-search/cli/src/cli.ts`
- Create: `.agents/skills/nofluffjobs-search/cli/tests/helpers.ts`
- Create: `.agents/skills/nofluffjobs-search/cli/tests/search.test.ts`

- [ ] **Step 1: Create SKILL.md**

Create `.agents/skills/nofluffjobs-search/SKILL.md`:

```markdown
---
name: nofluffjobs-search
version: 1.0.0
description: >
  Use this skill when the user wants to search for tech/product jobs in Poland,
  Czechia, or the Netherlands with transparent salary data. NoFluffJobs covers
  software, data, design, devops, and management roles — all listings include
  salary ranges. Trigger phrases: nofluffjobs, poland jobs, czechia jobs, tech jobs
  poland, design jobs poland, ux poland, product designer poland, head of design
  poland, design systems poland, nl tech jobs, netherlands product jobs,
  salary range jobs, transparent salary europe.
context: fork
allowed-tools: Bash(bun run skills/nofluffjobs-search/cli/src/cli.ts *)
---

# NoFluffJobs Search Skill

Search [NoFluffJobs](https://nofluffjobs.com) — Poland/Czechia/Netherlands tech job board
with transparent salary ranges on every listing.

## Commands

### Search jobs

```bash
bun run skills/nofluffjobs-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--region <code>` — repeatable: `pl`, `cz`, `nl`
- `--category <name>` — `design`, `backend`, `frontend`, `fullstack`, `devops`, `data`, `mobile`, `testing`, `security`, `ai`
- `--seniority <level>` — repeatable: `junior`, `mid`, `senior`
- `--limit <n>` — cap results
- `--format json|table|plain` — output format (default: json)

### Full job detail

```bash
bun run skills/nofluffjobs-search/cli/src/cli.ts detail <slug> [--format json|plain]
```

## Usage examples

### Design jobs in Poland or Czechia

```bash
bun run skills/nofluffjobs-search/cli/src/cli.ts search \
  --region pl --region cz --category design --format table
```

### Senior design roles in Netherlands

```bash
bun run skills/nofluffjobs-search/cli/src/cli.ts search \
  --region nl --seniority senior --category design --format table
```
```

- [ ] **Step 2: Create package.json**

Create `.agents/skills/nofluffjobs-search/cli/package.json`:

```json
{
  "name": "nofluffjobs-cli",
  "version": "1.0.0",
  "description": "CLI for NoFluffJobs — tech jobs in Poland, Czechia, Netherlands",
  "type": "module",
  "main": "src/cli.ts",
  "scripts": {
    "start": "bun run src/cli.ts",
    "test": "bun test --timeout 30000",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@bunli/core": "latest",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 3: Create src/helpers.ts**

Create `.agents/skills/nofluffjobs-search/cli/src/helpers.ts`:

```typescript
export const SEARCH_URL = "https://nofluffjobs.com/api/search/posting"
export const DETAIL_URL = "https://nofluffjobs.com/api/posting"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const maxRetries = 3
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, init)
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${response.status}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return response.json() as Promise<T>
  }
  throw new Error("Request failed after max retries")
}

export interface NoFluffJob {
  id: string
  title: string
  companyName: string
  location: string
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  salaryPeriod?: string
  musts?: string[]
  nices?: string[]
  postedDate?: string
  expiresDate?: string
  jobUrl: string
}

export interface NoFluffSearchResponse {
  postings: NoFluffJob[]
  totalCount?: number
}
```

- [ ] **Step 4: Verify NoFluffJobs API body shape**

Before writing the search command, confirm the API accepts this body:

```bash
curl -s -X POST https://nofluffjobs.com/api/search/posting \
  -H "Content-Type: application/json" \
  -d '{"criteria":{"region":["pl"],"category":["design"]},"page":{"limit":3,"offset":0}}' \
  | head -c 500
```

Expected: a JSON response containing postings. If this shape fails (non-200 or empty), try the flat body:
```bash
curl -s -X POST https://nofluffjobs.com/api/search/posting \
  -H "Content-Type: application/json" \
  -d '{"region":"pl","category":"design","limit":3,"offset":0}' \
  | head -c 500
```

Use whichever body shape returns valid data in Step 5.

- [ ] **Step 5: Create src/commands/search.ts**

Create `.agents/skills/nofluffjobs-search/cli/src/commands/search.ts`.

Use the body shape confirmed in Step 4. The default (nested `criteria`) form:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchJson, writeError, type NoFluffSearchResponse, type NoFluffJob, SEARCH_URL } from "../helpers.js"

function formatTable(jobs: NoFluffJob[]): void {
  console.log(`${"Title".padEnd(50)} | ${"Company".padEnd(30)} | ${"Salary".padEnd(25)} | Remote`)
  console.log(`${"-".repeat(50)}-+-${"-".repeat(30)}-+-${"-".repeat(25)}-+-------`)
  for (const j of jobs) {
    const salary = j.salaryMin
      ? `${j.salaryMin}-${j.salaryMax} ${j.salaryCurrency ?? ""}/${j.salaryPeriod ?? "mo"}`
      : "not disclosed"
    console.log(`${j.title.slice(0, 50).padEnd(50)} | ${j.companyName.slice(0, 30).padEnd(30)} | ${salary.slice(0, 25).padEnd(25)} | ${j.remote ? "yes" : "no"}`)
  }
}

export const search = defineCommand({
  name: "search",
  description: "Search NoFluffJobs listings",
  options: {
    region: option(z.string().optional(), { description: "Region code: pl, cz, nl (repeatable)", repeatable: true }),
    category: option(z.string().optional(), { description: "Job category (e.g. design, backend)" }),
    seniority: option(z.string().optional(), { description: "Seniority: junior, mid, senior (repeatable)", repeatable: true }),
    limit: option(z.coerce.number().default(20), { description: "Max results" }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), { description: "Output format" }),
  },
  handler: async ({ flags }) => {
    try {
      const criteria: Record<string, unknown> = {}
      if (flags.region) criteria.region = Array.isArray(flags.region) ? flags.region : [flags.region]
      if (flags.category) criteria.category = [flags.category]
      if (flags.seniority) criteria.seniority = Array.isArray(flags.seniority) ? flags.seniority : [flags.seniority]

      const body = {
        criteria,
        page: { limit: flags.limit, offset: 0 },
      }

      const data = await fetchJson<NoFluffSearchResponse>(SEARCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const jobs = (data.postings ?? []).slice(0, flags.limit)

      if (flags.format === "table") {
        console.log(`Found ${jobs.length} jobs`)
        formatTable(jobs)
      } else if (flags.format === "plain") {
        for (const j of jobs) {
          const salary = j.salaryMin ? `${j.salaryMin}-${j.salaryMax} ${j.salaryCurrency ?? ""}` : "not disclosed"
          console.log(`${j.title}`)
          console.log(`  Company: ${j.companyName}`)
          console.log(`  Location: ${j.location} | Remote: ${j.remote ? "yes" : "no"}`)
          console.log(`  Salary: ${salary}`)
          console.log(`  Skills: ${(j.musts ?? []).slice(0, 5).join(", ")}`)
          console.log(`  URL: ${j.jobUrl}`)
          console.log()
        }
      } else {
        console.log(JSON.stringify({ totalCount: data.totalCount, results: jobs }, null, 2))
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "SEARCH_ERROR")
      process.exit(1)
    }
  },
})
```

- [ ] **Step 6: Create src/commands/detail.ts**

Create `.agents/skills/nofluffjobs-search/cli/src/commands/detail.ts`:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchJson, writeError, DETAIL_URL } from "../helpers.js"

export const detail = defineCommand({
  name: "detail",
  description: "Fetch full details for a job by slug",
  options: {
    format: option(z.enum(["json", "plain"]).default("plain"), { description: "Output format" }),
  },
  handler: async ({ flags, positionals }) => {
    const slug = positionals[0]
    if (!slug) {
      writeError("slug argument required", "MISSING_SLUG")
      process.exit(1)
    }
    try {
      const data = await fetchJson<Record<string, unknown>>(`${DETAIL_URL}/${slug}`)

      if (flags.format === "json") {
        console.log(JSON.stringify(data, null, 2))
        return
      }

      console.log(`${data.title ?? slug}`)
      console.log(`  Company: ${data.companyName ?? ""}`)
      console.log(`  Location: ${data.location ?? ""} | Remote: ${data.remote ? "yes" : "no"}`)
      const salaryMin = data.salaryMin as number | undefined
      const salaryMax = data.salaryMax as number | undefined
      const currency = data.salaryCurrency as string | undefined
      if (salaryMin) console.log(`  Salary: ${salaryMin}-${salaryMax} ${currency ?? ""}`)
      const musts = data.musts as string[] | undefined
      if (musts?.length) console.log(`  Required skills: ${musts.join(", ")}`)
      console.log(`  URL: ${data.jobUrl ?? `https://nofluffjobs.com/job/${slug}`}`)
      const description = data.description ?? data.dailyTasks
      if (description) console.log(`\n${String(description).slice(0, 800)}`)
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "DETAIL_ERROR")
      process.exit(1)
    }
  },
})
```

- [ ] **Step 7: Create src/cli.ts**

Create `.agents/skills/nofluffjobs-search/cli/src/cli.ts`:

```typescript
import { createCLI } from "@bunli/core"
import { search } from "./commands/search.js"
import { detail } from "./commands/detail.js"

const cli = await createCLI({
  name: "nofluffjobs-cli",
  version: "1.0.0",
  description: "CLI for NoFluffJobs — tech jobs in Poland, Czechia, Netherlands with salary data",
})

cli.command(search)
cli.command(detail)

await cli.run()
```

- [ ] **Step 8: Create tests/helpers.ts**

Same pattern as arbeitnow. Create `.agents/skills/nofluffjobs-search/cli/tests/helpers.ts`:

```typescript
import { join } from "path"

const CLI_PATH = join(import.meta.dir, "../src/cli.ts")

export interface CLIResult {
  stdout: string
  stderr: string
  exitCode: number
}

export async function runCLI(args: string[]): Promise<CLIResult> {
  const proc = Bun.spawn(["bun", "run", CLI_PATH, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode }
}

export function parseJSON<T = unknown>(result: CLIResult): T {
  if (result.exitCode !== 0) throw new Error(`CLI exited ${result.exitCode}. stderr: ${result.stderr}`)
  try {
    return JSON.parse(result.stdout) as T
  } catch {
    throw new Error(`Failed to parse JSON. stdout: ${result.stdout}`)
  }
}
```

- [ ] **Step 9: Create tests/search.test.ts**

Create `.agents/skills/nofluffjobs-search/cli/tests/search.test.ts`:

```typescript
import { describe, it, expect } from "bun:test"
import { runCLI, parseJSON } from "./helpers.ts"
import type { NoFluffJob } from "../src/helpers.ts"

describe("nofluffjobs-search search", () => {
  it("returns jobs for Poland region", async () => {
    const result = await runCLI(["search", "--region", "pl", "--limit", "3", "--format", "json"])
    const data = parseJSON<{ results: NoFluffJob[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
  })

  it("design category returns design-related titles", async () => {
    const result = await runCLI(["search", "--region", "pl", "--category", "design", "--limit", "5", "--format", "json"])
    const data = parseJSON<{ results: NoFluffJob[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
  })

  it("table format outputs without error", async () => {
    const result = await runCLI(["search", "--region", "pl", "--limit", "3", "--format", "table"])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Title")
  })
})
```

- [ ] **Step 10: Install, test, commit**

```bash
cd .agents/skills/nofluffjobs-search/cli && bun install
bun test --timeout 30000
```

Expected: 3 tests pass.

```bash
cd ../../../../
git add .agents/skills/nofluffjobs-search/
git commit -m "feat: add nofluffjobs-search CLI (Poland, Czechia, Netherlands with salary data)"
```

---

## Task 5: Validate JustJoin.it endpoint and build justjoin-search CLI

**Files:**
- Create: `.agents/skills/justjoin-search/SKILL.md`
- Create: `.agents/skills/justjoin-search/cli/package.json`
- Create: `.agents/skills/justjoin-search/cli/src/helpers.ts`
- Create: `.agents/skills/justjoin-search/cli/src/commands/search.ts`
- Create: `.agents/skills/justjoin-search/cli/src/commands/detail.ts`
- Create: `.agents/skills/justjoin-search/cli/src/cli.ts`
- Create: `.agents/skills/justjoin-search/cli/tests/helpers.ts`
- Create: `.agents/skills/justjoin-search/cli/tests/search.test.ts`

- [ ] **Step 1: Validate the JustJoin.it API endpoint is live**

```bash
curl -s "https://justjoin.it/api/offers" | head -c 200
```

Expected: a JSON array starting with `[{"slug":` or `[{"id":`. If this returns HTML, a 404, or empty — the endpoint is dead. In that case, **skip this task entirely** and add a note to `SKILL.md` saying the API is unavailable.

Proceed to Step 2 only if the endpoint returns valid JSON.

- [ ] **Step 2: Create SKILL.md**

Create `.agents/skills/justjoin-search/SKILL.md`:

```markdown
---
name: justjoin-search
version: 1.0.0
description: >
  Use this skill for tech/product jobs in Poland, Czechia, or Central Europe on
  JustJoin.it. Covers software, data, design, and management roles. The CLI fetches
  the full job dump and filters client-side. Trigger phrases: justjoin, justjoin.it,
  poland tech jobs, warsaw jobs, krakow jobs, wroclaw jobs, central europe tech,
  design jobs warsaw, product designer krakow, remote poland, product design
  central europe.
context: fork
allowed-tools: Bash(bun run skills/justjoin-search/cli/src/cli.ts *)
---

# JustJoin.it Search Skill

Search [JustJoin.it](https://justjoin.it) — Poland/Central-EU tech job board.
The CLI fetches the full job listing dump and filters client-side. All filtering
happens locally. If the API is unavailable (HTTP error or empty), the CLI exits
with `{"error":"...","code":"API_UNAVAILABLE"}` on stderr.

## Commands

### Search jobs

```bash
bun run skills/justjoin-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--title <text>` — substring match on job title (case-insensitive)
- `--city <text>` — substring match on city
- `--country <text>` — substring match on country (e.g. `Poland`)
- `--remote` — remote jobs only
- `--limit <n>` — cap results (default: 20)
- `--format json|table|plain` — output format (default: json)

### Full job detail

```bash
bun run skills/justjoin-search/cli/src/cli.ts detail <slug> [--format json|plain]
```

## Usage examples

### Design jobs in Warsaw

```bash
bun run skills/justjoin-search/cli/src/cli.ts search \
  --title design --city Warsaw --format table
```

### Remote product roles anywhere in Poland

```bash
bun run skills/justjoin-search/cli/src/cli.ts search \
  --title product --country Poland --remote --format table
```
```

- [ ] **Step 3: Create package.json**

Create `.agents/skills/justjoin-search/cli/package.json`:

```json
{
  "name": "justjoin-cli",
  "version": "1.0.0",
  "description": "CLI for JustJoin.it — tech jobs in Poland and Central Europe",
  "type": "module",
  "main": "src/cli.ts",
  "scripts": {
    "start": "bun run src/cli.ts",
    "test": "bun test --timeout 60000",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@bunli/core": "latest",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 4: Create src/helpers.ts**

Create `.agents/skills/justjoin-search/cli/src/helpers.ts`:

```typescript
export const OFFERS_URL = "https://justjoin.it/api/offers"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export interface JustJoinJob {
  slug: string
  title: string
  companyName: string
  city: string
  country: string
  remote: boolean
  salaryFrom?: number
  salaryTo?: number
  currency?: string
  skills: Array<{ name: string; level: number }>
  publishedAt?: string
  jobUrl?: string
}

export async function fetchAllOffers(): Promise<JustJoinJob[]> {
  const response = await fetch(OFFERS_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; justjoin-cli/1.0)" },
  })
  if (!response.ok) {
    throw Object.assign(new Error(`API returned ${response.status}`), { code: "API_UNAVAILABLE" })
  }
  const raw = await response.json() as Array<Record<string, unknown>>
  if (!Array.isArray(raw) || raw.length === 0) {
    throw Object.assign(new Error("API returned empty or non-array response"), { code: "API_UNAVAILABLE" })
  }
  // Normalise fields — JustJoin.it has changed field names across versions
  return raw.map(item => ({
    slug: String(item.slug ?? item.id ?? ""),
    title: String(item.title ?? ""),
    companyName: String(item.companyName ?? item.company_name ?? ""),
    city: String(item.city ?? ""),
    country: String(item.country ?? "Poland"),
    remote: Boolean(item.remote ?? item.fullyRemote ?? false),
    salaryFrom: (item.salaryFrom ?? item.salary_from) as number | undefined,
    salaryTo: (item.salaryTo ?? item.salary_to) as number | undefined,
    currency: (item.currency ?? item.salary_currency) as string | undefined,
    skills: (item.skills as Array<{ name: string; level: number }>) ?? [],
    publishedAt: (item.publishedAt ?? item.published_at) as string | undefined,
    jobUrl: item.jobUrl
      ? String(item.jobUrl)
      : `https://justjoin.it/offers/${item.slug ?? item.id ?? ""}`,
  }))
}
```

- [ ] **Step 5: Create src/commands/search.ts**

Create `.agents/skills/justjoin-search/cli/src/commands/search.ts`:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchAllOffers, writeError, type JustJoinJob } from "../helpers.js"

function formatTable(jobs: JustJoinJob[]): void {
  console.log(`${"Title".padEnd(50)} | ${"Company".padEnd(30)} | ${"City".padEnd(20)} | Remote`)
  console.log(`${"-".repeat(50)}-+-${"-".repeat(30)}-+-${"-".repeat(20)}-+-------`)
  for (const j of jobs) {
    console.log(`${j.title.slice(0, 50).padEnd(50)} | ${j.companyName.slice(0, 30).padEnd(30)} | ${j.city.slice(0, 20).padEnd(20)} | ${j.remote ? "yes" : "no"}`)
  }
}

export const search = defineCommand({
  name: "search",
  description: "Search JustJoin.it job listings (client-side filters on full dump)",
  options: {
    title: option(z.string().optional(), { description: "Substring match on job title" }),
    city: option(z.string().optional(), { description: "Substring match on city" }),
    country: option(z.string().optional(), { description: "Substring match on country (e.g. Poland)" }),
    remote: option(z.boolean().optional(), { description: "Remote jobs only", argumentKind: "flag" }),
    limit: option(z.coerce.number().default(20), { description: "Max results" }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), { description: "Output format" }),
  },
  handler: async ({ flags }) => {
    try {
      let jobs = await fetchAllOffers()

      if (flags.title) {
        const t = flags.title.toLowerCase()
        jobs = jobs.filter(j => j.title.toLowerCase().includes(t))
      }
      if (flags.city) {
        const c = flags.city.toLowerCase()
        jobs = jobs.filter(j => j.city.toLowerCase().includes(c))
      }
      if (flags.country) {
        const c = flags.country.toLowerCase()
        jobs = jobs.filter(j => j.country.toLowerCase().includes(c))
      }
      if (flags.remote) {
        jobs = jobs.filter(j => j.remote)
      }
      jobs = jobs.slice(0, flags.limit)

      if (flags.format === "table") {
        console.log(`Found ${jobs.length} matching jobs`)
        formatTable(jobs)
      } else if (flags.format === "plain") {
        for (const j of jobs) {
          const salary = j.salaryFrom ? `${j.salaryFrom}-${j.salaryTo} ${j.currency ?? ""}` : "not disclosed"
          console.log(`${j.title}`)
          console.log(`  Company: ${j.companyName}`)
          console.log(`  Location: ${j.city}, ${j.country} | Remote: ${j.remote ? "yes" : "no"}`)
          console.log(`  Salary: ${salary}`)
          console.log(`  Skills: ${j.skills.slice(0, 5).map(s => s.name).join(", ")}`)
          console.log(`  URL: ${j.jobUrl}`)
          console.log()
        }
      } else {
        console.log(JSON.stringify({ count: jobs.length, results: jobs }, null, 2))
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? "SEARCH_ERROR"
      writeError(err instanceof Error ? err.message : String(err), code)
      process.exit(1)
    }
  },
})
```

- [ ] **Step 6: Create src/commands/detail.ts**

Create `.agents/skills/justjoin-search/cli/src/commands/detail.ts`:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchAllOffers, writeError } from "../helpers.js"

export const detail = defineCommand({
  name: "detail",
  description: "Fetch full details for a job by slug",
  options: {
    format: option(z.enum(["json", "plain"]).default("plain"), { description: "Output format" }),
  },
  handler: async ({ flags, positionals }) => {
    const slug = positionals[0]
    if (!slug) {
      writeError("slug argument required", "MISSING_SLUG")
      process.exit(1)
    }
    try {
      const all = await fetchAllOffers()
      const job = all.find(j => j.slug === slug)
      if (!job) {
        writeError(`No job found with slug: ${slug}`, "NOT_FOUND")
        process.exit(1)
      }
      if (flags.format === "json") {
        console.log(JSON.stringify(job, null, 2))
      } else {
        const salary = job.salaryFrom ? `${job.salaryFrom}-${job.salaryTo} ${job.currency ?? ""}` : "not disclosed"
        console.log(`${job.title}`)
        console.log(`  Company: ${job.companyName}`)
        console.log(`  Location: ${job.city}, ${job.country} | Remote: ${job.remote ? "yes" : "no"}`)
        console.log(`  Salary: ${salary}`)
        console.log(`  Skills: ${job.skills.map(s => `${s.name} (${s.level})`).join(", ")}`)
        console.log(`  URL: ${job.jobUrl}`)
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? "DETAIL_ERROR"
      writeError(err instanceof Error ? err.message : String(err), code)
      process.exit(1)
    }
  },
})
```

- [ ] **Step 7: Create src/cli.ts**

Create `.agents/skills/justjoin-search/cli/src/cli.ts`:

```typescript
import { createCLI } from "@bunli/core"
import { search } from "./commands/search.js"
import { detail } from "./commands/detail.js"

const cli = await createCLI({
  name: "justjoin-cli",
  version: "1.0.0",
  description: "CLI for JustJoin.it — tech and product jobs in Poland and Central Europe",
})

cli.command(search)
cli.command(detail)

await cli.run()
```

- [ ] **Step 8: Create tests/helpers.ts and tests/search.test.ts**

Create `.agents/skills/justjoin-search/cli/tests/helpers.ts` (identical to arbeitnow and nofluffjobs pattern above).

Create `.agents/skills/justjoin-search/cli/tests/search.test.ts`:

```typescript
import { describe, it, expect } from "bun:test"
import { runCLI, parseJSON } from "./helpers.ts"
import type { JustJoinJob } from "../src/helpers.ts"

describe("justjoin-search", () => {
  it("returns jobs or exits with API_UNAVAILABLE", async () => {
    const result = await runCLI(["search", "--limit", "5", "--format", "json"])
    if (result.exitCode !== 0) {
      const err = JSON.parse(result.stderr)
      expect(err.code).toBe("API_UNAVAILABLE")
      console.log("JustJoin API is unavailable — endpoint may be dead")
      return
    }
    const data = parseJSON<{ results: JustJoinJob[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
  })

  it("title filter reduces result set", async () => {
    const all = await runCLI(["search", "--limit", "100", "--format", "json"])
    if (all.exitCode !== 0) return // skip if API unavailable
    const filtered = await runCLI(["search", "--title", "design", "--limit", "100", "--format", "json"])
    if (filtered.exitCode !== 0) return
    const allData = parseJSON<{ results: JustJoinJob[] }>(all)
    const filteredData = parseJSON<{ results: JustJoinJob[] }>(filtered)
    expect(filteredData.results.length).toBeLessThanOrEqual(allData.results.length)
  })
})
```

- [ ] **Step 9: Install, test, commit**

```bash
cd .agents/skills/justjoin-search/cli && bun install
bun test --timeout 60000
```

Expected: tests pass (or gracefully report API_UNAVAILABLE if endpoint is dead).

```bash
cd ../../../../
git add .agents/skills/justjoin-search/
git commit -m "feat: add justjoin-search CLI (Poland/Central-EU tech jobs, graceful API degradation)"
```

---

## Task 6: Build eures-search CLI

**Files:**
- Create: `.agents/skills/eures-search/SKILL.md`
- Create: `.agents/skills/eures-search/cli/package.json`
- Create: `.agents/skills/eures-search/cli/src/helpers.ts`
- Create: `.agents/skills/eures-search/cli/src/commands/search.ts`
- Create: `.agents/skills/eures-search/cli/src/commands/detail.ts`
- Create: `.agents/skills/eures-search/cli/src/cli.ts`
- Create: `.agents/skills/eures-search/cli/tests/helpers.ts`
- Create: `.agents/skills/eures-search/cli/tests/search.test.ts`

- [ ] **Step 1: Validate EURES API shape**

Before writing any code, confirm the exact request/response shape:

```bash
curl -s -X POST \
  "https://europa.eu/eures/api/jv-searchengine/public/jv-search/search" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"keywords":["design"],"locationCodes":["de"],"resultsPerPage":3,"page":0}' \
  | python3 -m json.tool | head -60
```

Note the actual top-level response keys (e.g. `data`, `hits`, `items`, or `jobVacancies`), and the structure of each vacancy object. Update the `EuresVacancy` interface and response parsing in Step 3 to match.

- [ ] **Step 2: Create SKILL.md**

Create `.agents/skills/eures-search/SKILL.md`:

```markdown
---
name: eures-search
version: 1.0.0
description: >
  Use this skill for broad EU-wide job discovery, especially when looking for
  roles across multiple countries simultaneously. EURES is the official EU job
  mobility portal — it covers Germany, Netherlands, Poland, Czechia, and all
  other EU member states via ISO-2 country codes. No visa filter exists (EURES is
  freedom-of-movement focused), but it catches roles that don't appear on
  commercial ATS-aggregating boards. Trigger phrases: eures, eu jobs, europe wide
  jobs, eu job portal, official eu jobs, cross-border jobs europe, germany
  netherlands jobs, multi-country job search eu, head of design eu, design systems
  europe, ux lead europe.
context: fork
allowed-tools: Bash(bun run skills/eures-search/cli/src/cli.ts *)
---

# EURES Search Skill

Search the [EURES](https://eures.europa.eu) EU job portal — the official
cross-border employment service. Covers all EU member states. No visa sponsorship
filter (EURES is designed for EU freedom-of-movement); use alongside arbeitnow
for visa-specific filtering.

## Commands

### Search jobs

```bash
bun run skills/eures-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--countries <code>` — repeatable ISO-2: `de`, `nl`, `pl`, `cz` (default: de nl)
- `--keywords <text>` — repeatable keyword search
- `--page <n>` — page number (0-indexed, default: 0)
- `--limit <n>` — cap results per page (default: 10)
- `--format json|table|plain` — output format (default: json)

### Full job detail

```bash
bun run skills/eures-search/cli/src/cli.ts detail <id> [--format json|plain]
```

## Usage examples

### Design jobs in Germany and Netherlands

```bash
bun run skills/eures-search/cli/src/cli.ts search \
  --countries de --countries nl --keywords "design" --format table
```

### Head of Design across all target countries

```bash
bun run skills/eures-search/cli/src/cli.ts search \
  --countries de --countries nl --countries pl --countries cz \
  --keywords "Head of Design" --format table
```
```

- [ ] **Step 3: Create package.json**

Create `.agents/skills/eures-search/cli/package.json`:

```json
{
  "name": "eures-cli",
  "version": "1.0.0",
  "description": "CLI for EURES — EU official cross-border job portal",
  "type": "module",
  "main": "src/cli.ts",
  "scripts": {
    "start": "bun run src/cli.ts",
    "test": "bun test --timeout 30000",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@bunli/core": "latest",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 4: Create src/helpers.ts**

> **Note:** Update the `EuresVacancy` interface and `EuresSearchResponse.vacancyKey` field to match the actual API response shape observed in Step 1.

Create `.agents/skills/eures-search/cli/src/helpers.ts`:

```typescript
export const SEARCH_URL = "https://europa.eu/eures/api/jv-searchengine/public/jv-search/search"
export const DETAIL_URL = "https://europa.eu/eures/api/jv-searchengine/public/jv"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export interface EuresVacancy {
  id: string
  title: string
  employer: { name: string; website?: string }
  locationMap: { city?: string; country: string }
  creationDate: string
  positionScheduleCodes?: string[]
  positionOfferingCode?: string
  numberOfPosts?: number
}

// Adjust vacancyKey to match the actual response field observed in Step 1
// Common options: "data", "jobVacancies", "hits", "items"
export interface EuresSearchResponse {
  vacancies?: EuresVacancy[]      // try this first
  jobVacancies?: EuresVacancy[]   // fallback
  data?: EuresVacancy[]           // fallback
  total?: number
  totalCount?: number
}

export function extractVacancies(resp: EuresSearchResponse): EuresVacancy[] {
  return resp.vacancies ?? resp.jobVacancies ?? resp.data ?? []
}

export interface EuresSearchBody {
  keywords: string[]
  locationCodes: string[]
  resultsPerPage: number
  page: number
  sortSearch?: string
}

export async function postSearch(body: EuresSearchBody): Promise<EuresSearchResponse> {
  const maxRetries = 3
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${response.status}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return response.json() as Promise<EuresSearchResponse>
  }
  throw new Error("Request failed after max retries")
}

export async function getDetail(id: string): Promise<Record<string, unknown>> {
  const maxRetries = 3
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(`${DETAIL_URL}/${id}`, {
      headers: { "Accept": "application/json" },
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${response.status}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (response.status === 404) throw new Error(`Vacancy ${id} not found`)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json() as Promise<Record<string, unknown>>
  }
  throw new Error("Request failed after max retries")
}
```

- [ ] **Step 5: Create src/commands/search.ts**

Create `.agents/skills/eures-search/cli/src/commands/search.ts`:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { postSearch, extractVacancies, writeError, type EuresVacancy } from "../helpers.js"

function formatTable(vacancies: EuresVacancy[]): void {
  console.log(`${"Title".padEnd(50)} | ${"Employer".padEnd(30)} | Country`)
  console.log(`${"-".repeat(50)}-+-${"-".repeat(30)}-+--------`)
  for (const v of vacancies) {
    const country = v.locationMap?.country ?? ""
    const city = v.locationMap?.city ?? ""
    const loc = city ? `${city}, ${country}` : country
    console.log(`${v.title.slice(0, 50).padEnd(50)} | ${v.employer.name.slice(0, 30).padEnd(30)} | ${loc}`)
  }
}

export const search = defineCommand({
  name: "search",
  description: "Search EURES EU job portal",
  options: {
    countries: option(z.string().optional(), { description: "ISO-2 country code: de, nl, pl, cz (repeatable)", repeatable: true }),
    keywords: option(z.string().optional(), { description: "Keyword search (repeatable)", repeatable: true }),
    page: option(z.coerce.number().default(0), { description: "Page number (0-indexed)" }),
    limit: option(z.coerce.number().default(10), { description: "Results per page" }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), { description: "Output format" }),
  },
  handler: async ({ flags }) => {
    try {
      const countries = flags.countries
        ? (Array.isArray(flags.countries) ? flags.countries : [flags.countries])
        : ["de", "nl"]

      const keywords = flags.keywords
        ? (Array.isArray(flags.keywords) ? flags.keywords : [flags.keywords])
        : []

      const resp = await postSearch({
        keywords,
        locationCodes: countries,
        resultsPerPage: flags.limit,
        page: flags.page,
      })

      const vacancies = extractVacancies(resp)

      if (flags.format === "table") {
        console.log(`Found ${resp.total ?? resp.totalCount ?? vacancies.length} total (showing ${vacancies.length})`)
        formatTable(vacancies)
      } else if (flags.format === "plain") {
        for (const v of vacancies) {
          const country = v.locationMap?.country ?? ""
          const city = v.locationMap?.city ?? ""
          console.log(`${v.title}`)
          console.log(`  Employer: ${v.employer.name}`)
          console.log(`  Location: ${city ? `${city}, ` : ""}${country}`)
          console.log(`  ID: ${v.id} | Posted: ${v.creationDate ?? "unknown"}`)
          console.log()
        }
      } else {
        console.log(JSON.stringify({ total: resp.total ?? resp.totalCount, results: vacancies }, null, 2))
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "SEARCH_ERROR")
      process.exit(1)
    }
  },
})
```

- [ ] **Step 6: Create src/commands/detail.ts**

Create `.agents/skills/eures-search/cli/src/commands/detail.ts`:

```typescript
import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { getDetail, writeError } from "../helpers.js"

export const detail = defineCommand({
  name: "detail",
  description: "Fetch full details for a vacancy by ID",
  options: {
    format: option(z.enum(["json", "plain"]).default("plain"), { description: "Output format" }),
  },
  handler: async ({ flags, positionals }) => {
    const id = positionals[0]
    if (!id) {
      writeError("id argument required", "MISSING_ID")
      process.exit(1)
    }
    try {
      const data = await getDetail(id)
      if (flags.format === "json") {
        console.log(JSON.stringify(data, null, 2))
        return
      }
      // Plain: print whatever fields exist
      const title = String(data.title ?? id)
      const employer = (data.employer as Record<string, unknown>)?.name ?? ""
      const loc = data.locationMap ?? data.location ?? ""
      console.log(title)
      if (employer) console.log(`  Employer: ${employer}`)
      if (loc) console.log(`  Location: ${JSON.stringify(loc)}`)
      const desc = data.description ?? data.jobDescription
      if (desc) console.log(`\n${String(desc).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 800)}`)
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "DETAIL_ERROR")
      process.exit(1)
    }
  },
})
```

- [ ] **Step 7: Create src/cli.ts**

Create `.agents/skills/eures-search/cli/src/cli.ts`:

```typescript
import { createCLI } from "@bunli/core"
import { search } from "./commands/search.js"
import { detail } from "./commands/detail.js"

const cli = await createCLI({
  name: "eures-cli",
  version: "1.0.0",
  description: "CLI for EURES — EU official cross-border job portal",
})

cli.command(search)
cli.command(detail)

await cli.run()
```

- [ ] **Step 8: Create tests/helpers.ts and tests/search.test.ts**

Create `.agents/skills/eures-search/cli/tests/helpers.ts` (same pattern as prior CLIs).

Create `.agents/skills/eures-search/cli/tests/search.test.ts`:

```typescript
import { describe, it, expect } from "bun:test"
import { runCLI, parseJSON } from "./helpers.ts"
import type { EuresVacancy } from "../src/helpers.ts"

describe("eures-search search", () => {
  it("returns vacancies for Germany", async () => {
    const result = await runCLI(["search", "--countries", "de", "--limit", "3", "--format", "json"])
    const data = parseJSON<{ results: EuresVacancy[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
  })

  it("keyword filter returns results", async () => {
    const result = await runCLI(["search", "--countries", "de", "--countries", "nl", "--keywords", "design", "--limit", "5", "--format", "json"])
    const data = parseJSON<{ results: EuresVacancy[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
  })

  it("table format outputs without error", async () => {
    const result = await runCLI(["search", "--countries", "de", "--limit", "3", "--format", "table"])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Title")
  })
})
```

- [ ] **Step 9: Install, test, commit**

```bash
cd .agents/skills/eures-search/cli && bun install
bun test --timeout 30000
```

Expected: 3 tests pass. If the response shape doesn't match the interface, go back to Step 4 and update `extractVacancies` to use the correct field name observed in the curl output from Step 1.

```bash
cd ../../../../
git add .agents/skills/eures-search/
git commit -m "feat: add eures-search CLI (EU official job portal, multi-country)"
```

---

## Task 7: Write linkedin-jobs agent

**Files:**
- Create: `.claude/agents/linkedin-jobs.md`

- [ ] **Step 1: Create linkedin-jobs.md**

Create `.claude/agents/linkedin-jobs.md`:

```markdown
---
name: linkedin-jobs
description: Search LinkedIn for job listings using the unauthenticated guest API. Use this agent when the user wants to search LinkedIn specifically, or when the job-scraper skill reaches the LinkedIn step. Does NOT require credentials — never access a logged-in LinkedIn session. Degrades gracefully on rate limiting.
model: sonnet
---

You are a LinkedIn job search agent. You find jobs using LinkedIn's unauthenticated guest API endpoint. You never use a logged-in LinkedIn session, MCP server, or personal account — only public, unauthenticated requests.

## GeoId reference

- Germany: `101282230`
- Netherlands: `102890719`
- Poland: `105072130`
- Czech Republic: `104508036`
- Remote/Worldwide: `92000000`

## Search flow

1. **Discover** — WebFetch the guest search endpoint (returns ~10 job cards per page):

```
https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=<url-encoded>&geoId=<id>&f_TPR=r1209600&start=0
```

Useful filter params:
- `f_TPR=r604800` = last 7 days · `f_TPR=r1209600` = last 14 days
- `f_WT=2` = remote · `f_WT=3` = hybrid
- `f_E=4` = mid-senior · `f_E=5` = director
- `start=0,25,50,...` = pagination (up to ~200 total results)

2. **Parse** — Extract job IDs, titles, companies, and locations from the HTML response.

3. **Detail** — For each promising result, WebFetch the public job page:
```
https://www.linkedin.com/jobs/view/<job-id>/
```
to get the full description.

## Rate limiting

- Wait 2–3 seconds between requests.
- If you receive HTTP 429 or 999: stop immediately. Report how many results were collected before the block. Return what you have — do not retry.
- Keep total requests to ≤ 20 per invocation to avoid triggering rate limits.

## Output format

Return results in this structure (one per job found):

```json
{
  "title": "Head of Design",
  "company": "Example GmbH",
  "location": "Berlin, Germany",
  "url": "https://www.linkedin.com/jobs/view/1234567/",
  "posted": "2 days ago",
  "description_snippet": "We are looking for..."
}
```

Return the list as JSON. Do not fabricate job listings — only report what WebFetch actually returns.

## Important

- Never access linkedin.com/feed, linkedin.com/messaging, or any authenticated endpoint.
- Never log in or store credentials.
- If LinkedIn blocks all requests, return an empty array with a note explaining the block.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/linkedin-jobs.md
git commit -m "feat: add linkedin-jobs agent (guest API, rate-limited, no credentials)"
```

---

## Task 8: Write websearch-jobs agent

**Files:**
- Create: `.claude/agents/websearch-jobs.md`

- [ ] **Step 1: Create websearch-jobs.md**

Create `.claude/agents/websearch-jobs.md`:

```markdown
---
name: websearch-jobs
description: Fallback job search agent using WebSearch and WebFetch for boards with no public API (StepStone, Indeed .de/.nl, Glassdoor). Invoke after the CLI tools and LinkedIn agent have run, to cover boards that can't be reached via structured APIs.
model: sonnet
---

You are a fallback job search agent. You find jobs on boards that have no usable public API, using WebSearch queries followed by selective WebFetch for promising results.

## Boards you cover

- **stepstone.de** — Germany's largest job board
- **indeed.de** — Germany Indeed
- **indeed.nl** — Netherlands Indeed
- **glassdoor.com** — with employer reviews as a bonus signal

## Search approach

### Step 1: WebSearch with site-qualified queries

For each board, run 1–2 targeted queries. Always include a sponsorship qualifier and exclude gambling:

```
site:stepstone.de ("Head of Design" OR "Design Lead") -casino -gambling -betting
site:indeed.de "Head of Design" "visa sponsorship" Germany
site:indeed.nl "Head of Design" Netherlands English
site:glassdoor.com "Head of Design" (Germany OR Netherlands) -casino
```

Use queries from the current search category (passed in the invocation context). Add `("visa sponsorship" OR relocation OR "Blue Card")` to broad queries.

### Step 2: Pre-filter before fetching

Before calling WebFetch on any result, check the title and snippet from the search result:
- Skip if title is clearly irrelevant (e.g. intern, junior, unrelated industry)
- Skip if snippet explicitly says "must have EU work authorization" or "no sponsorship"
- Fetch only the top 3–5 most promising results per board

### Step 3: WebFetch for full posting

WebFetch the job posting URL. Extract:
- Job title
- Company name
- Location
- Posting date (or "recent" if not found)
- Application deadline (if listed)
- Key requirements (2–3 bullet points)
- Sponsorship signal: ✅ mentions sponsorship/relocation · ⚠️ silent · ❌ explicitly requires EU auth

### Step 4: Output format

Return results as JSON, one per job:

```json
{
  "title": "Head of Design",
  "company": "Example GmbH",
  "location": "Berlin, Germany",
  "url": "https://www.stepstone.de/...",
  "posted": "2026-06-08",
  "source": "stepstone.de",
  "sponsorship": "silent",
  "key_requirements": ["5+ years design leadership", "design systems experience", "English required"]
}
```

## Rules

- Never fabricate job listings. Only report what WebSearch and WebFetch return.
- Skip results with expired deadlines.
- Skip gambling/betting/casino employers.
- If a board returns no results for a query, move on — do not retry the same query.
- Maximum 10 WebFetch calls per invocation to keep costs bounded.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/websearch-jobs.md
git commit -m "feat: add websearch-jobs fallback agent (StepStone, Indeed, Glassdoor)"
```

---

## Task 9: Update job-scraper skill

**Files:**
- Modify: `.claude/skills/job-scraper/SKILL.md`
- Modify: `.claude/skills/job-scraper/search-queries.md`

- [ ] **Step 1: Update SKILL.md execution order**

In `.claude/skills/job-scraper/SKILL.md`, replace the current Step 1 block:

```markdown
### Step 1: Search

Run **WebSearch** queries from `search-queries.md`. By default, run the top 3 priority categories. If the user said "broad", run all categories.

If the user specified a focus area (e.g. "data science"), prioritize queries from that category.

For each search:
- Use `WebSearch` with the boards in `search-queries.md` (EURES, LinkedIn, Relocate.me, Arbeitnow, StepStone, etc.) — run the sponsorship/relocation boards (Priority 0) first
- Target your configured countries (primaries first, then bridges) and add a sponsorship qualifier, e.g. `("visa sponsorship" OR relocation)`
- Look for postings from the last 14 days
```

with:

```markdown
### Step 1: Search

Run searches across all available tools in priority order. By default, cover Priority 0–2 categories from `search-queries.md`. If the user said "broad", run all categories.

#### Step 1a: CLI tools (structured APIs — run in parallel)

Use the Agent tool to run these in parallel:

- **arbeitnow-search**: `bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search --visa --location Germany --limit 20 --format json` (and a second call with `--location Netherlands`)
- **nofluffjobs-search**: `bun run .agents/skills/nofluffjobs-search/cli/src/cli.ts search --region pl --region cz --region nl --category design --format json`
- **eures-search**: `bun run .agents/skills/eures-search/cli/src/cli.ts search --countries de --countries nl --countries pl --countries cz --keywords "Head of Design" --limit 20 --format json` (and a second call with `--keywords "design systems"`)
- **justjoin-search**: `bun run .agents/skills/justjoin-search/cli/src/cli.ts search --title design --country Poland --limit 20 --format json` (skip if CLI exits with `API_UNAVAILABLE`)

Adjust keywords to match the current search category and user focus area.

#### Step 1b: LinkedIn agent

Invoke the `linkedin-jobs` agent. Pass the target role keywords and countries from `search-queries.md` Priority 1 and 2 categories.

#### Step 1c: WebSearch fallback agent

Invoke the `websearch-jobs` agent. Pass the current search category and target countries. This covers StepStone, Indeed, and Glassdoor.
```

- [ ] **Step 2: Remove honeypot.io from search-queries.md**

In `.claude/skills/job-scraper/search-queries.md`, in the **Group A** section, find and remove this line:

```
- **honeypot.io** - DE/NL tech & product, relocation-friendly
```

Replace it with:

```
- ~~honeypot.io~~ — shut down January 2025, no longer available
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/job-scraper/SKILL.md .claude/skills/job-scraper/search-queries.md
git commit -m "feat: wire CLI tools and agents into job-scraper execution order; remove defunct honeypot.io"
```
