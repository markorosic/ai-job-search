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
