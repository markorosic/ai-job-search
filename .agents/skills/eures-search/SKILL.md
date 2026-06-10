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
cross-border employment service. Covers all EU member states via ISO-2 country codes.

## Commands

### Search jobs

```bash
bun run skills/eures-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--countries <code>` — repeatable ISO-2: `de`, `nl`, `pl`, `cz` (default: de nl)
- `--keywords <text>` — repeatable keyword search
- `--page <n>` — page number (1-indexed, default: 1)
- `--limit <n>` — cap results per page (default: 10)
- `--format json|table|plain` — output format (default: json)

### Full job detail

```bash
bun run skills/eures-search/cli/src/cli.ts detail <id> [--format json|plain]
```
