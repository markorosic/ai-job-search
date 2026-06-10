---
name: nofluffjobs-search
version: 1.0.0
description: >
  Use this skill when the user wants to search for tech/product jobs in Poland,
  Czechia, Hungary, or Slovakia with transparent salary data. NoFluffJobs covers
  software, data, design, devops, and management roles — all listings include
  salary ranges. Trigger phrases: nofluffjobs, poland jobs, czechia jobs, hungary jobs,
  slovakia jobs, tech jobs poland, design jobs poland, ux poland, product designer poland,
  head of design poland, design systems poland, salary range jobs, transparent salary europe.
context: fork
allowed-tools: Bash(bun run skills/nofluffjobs-search/cli/src/cli.ts *)
---

# NoFluffJobs Search Skill

Search [NoFluffJobs](https://nofluffjobs.com) — Poland/Czechia tech job board
with transparent salary ranges on every listing.

## Commands

### Search jobs

```bash
bun run skills/nofluffjobs-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--region <code>` — repeatable: `pl`, `cz`, `hu`, `sk`
- `--category <name>` — `ux`, `backend`, `frontend`, `fullstack`, `devops`, `data`, `mobile`, `testing`, `security`, `productManagement`, `projectManager`, `artificialIntelligence`
- `--seniority <level>` — repeatable: `Junior`, `Mid`, `Senior`, `Expert`
- `--remote` — show only fully-remote jobs
- `--limit <n>` — cap results (default: 20)
- `--format json|table|plain` — output format (default: json)

### Full job detail

```bash
bun run skills/nofluffjobs-search/cli/src/cli.ts detail <slug> [--format json|plain]
```

## Usage examples

### UX/design jobs in Poland or Czechia

```bash
bun run skills/nofluffjobs-search/cli/src/cli.ts search \
  --region pl --region cz --category ux --format table
```
