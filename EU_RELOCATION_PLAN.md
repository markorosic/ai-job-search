# EU Relocation Job Search — Adaptation Plan

> **Status: PLAN ONLY.** No live config files were changed to produce this document.
> **Not legal/immigration advice.** Immigration rules change yearly. Every legal claim
> below is tagged ✅ verified (June 2026 web check) or ⚠️ verify against the official
> source before relying on it. Always confirm on the official government portal.

This plan adapts the repo (built Denmark-first) to a **multi-country EU search for a
non-EU candidate who needs visa sponsorship**. It has two halves:

1. **Strategy** — an immigration-aware country tiering for *your* specific profile.
2. **Adaptation roadmap** — exactly which files to change, layer by layer.

---

## 1. The inputs that drove this plan

| Input | Value | Why it matters |
|-------|-------|----------------|
| Work authorization | **Non-EU, needs sponsorship** | The single biggest filter. A perfect-fit role that won't sponsor is worth zero. |
| Languages | **English (fluent), Serbian + Croatian (native), Spanish (learning), French (basic)** | Native Croatian/Serbian unlocks Croatia & Slovenia; English-only limits DE/ES/IT to international employers. |
| Primary targets | Germany, Netherlands, Spain, Italy | Re-tiered below — for a non-EU candidate, ease-of-entry reshuffles this list. |
| Bridge targets | Slovenia, Malta, Croatia, Poland, Czechia | These move from "nice idea" to **core strategy**. |

---

## 2. Strategic reframe — why "bridge countries" are now the core

For an **EU citizen**, bridge countries are about language and cost of living.
For **you**, they're about *which countries will legally let you in first*, and which give
you a legal springboard into the harder primaries. Three mechanisms make the springboard real:

- **EU Blue Card intra-EU mobility** ✅ — after **12 months** legal residence in your first
  Blue Card country, you can move to a second member state under simplified rules (no labour-market
  test); you apply for a fresh Blue Card there. Rules vary slightly by destination state.
- **EU Long-Term Residence (LTR)** ⚠️ — after ~5 years of legal residence in one EU country you
  can obtain EU LTR status, which grants enhanced rights to move to and work in other member states.
- **Country-specific bilateral agreements** ✅ — e.g. the **Slovenia–Serbia employment agreement**
  gives Serbian nationals a streamlined work-permit route feeding into a single permit.

### Three macro-strategies (pursue in parallel)

- **Strategy A — Direct entry to a primary.** Germany is the strongest direct shot (Opportunity
  Card to job-hunt on the ground; shortage-occupation Blue Card threshold in your field).
- **Strategy B — Foothold-then-hop.** Land first in an easier country (Slovenia / Croatia / Malta /
  Poland / Czechia), then use Blue Card mobility (12 mo) or EU LTR (5 yr) to reach Germany/Netherlands.
- **Strategy C — Home-base pathway (Serbia).** Stay in Belgrade and join an international /
  EU-headquartered employer locally; reach the EU later via an **intra-company transfer (EU ICT
  permit)** or internal relocation. No work authorization needed to start — rank these roles by
  EU-pathway signal (international/EU-HQ employer) instead of the visa signal.

---

## 3. Re-tiered country list (immigration-aware, for your profile)

| Country | Tier for *you* | Key legal pathway | Language fit | Verify |
|---------|----------------|-------------------|--------------|--------|
| 🇩🇪 **Germany** | **Primary / direct** | Opportunity Card (Chancenkarte, points-based, 1-yr job hunt, B2 English qualifies); EU Blue Card **shortage threshold €45,934** for IT/eng/science | English tech market is large; German optional | ✅ |
| 🇳🇱 **Netherlands** | **Primary (sponsor-gated)** | Highly Skilled Migrant via **IND recognized sponsor** only; €4,357/mo (<30) / €5,942/mo (30+), reduced €3,122 (recent grad/orientation year) | Very English-friendly | ✅ |
| 🇲🇹 **Malta** | **Primary *and* bridge** | English is an **official language**; Single Permit / Key Employee Initiative; iGaming/fintech routinely sponsor | English-only works | ⚠️ |
| 🇸🇮 **Slovenia** | **Bridge (Serbia-specific, strong)** | **Slovenia–Serbia bilateral agreement** → work permit via Employment Service → single permit, 3-yr validity, **free labour-market access after year 1** | Serbian/Croatian close to Slovene | ✅ |
| 🇭🇷 **Croatia** | **Bridge (language, strong)** | EU + Schengen (2023); relatively open third-country work-permit regime | **Native Croatian** — huge edge | ⚠️ |
| 🇵🇱 **Poland** | **Bridge** | Accessible work permits; large IT sector; lower salary thresholds | English-first tech boards | ⚠️ |
| 🇨🇿 **Czechia** | **Bridge** | Employee Card / EU Blue Card; growing tech scene | English tech roles exist | ⚠️ |
| 🇪🇸 **Spain** | **Secondary** | Highly Qualified Professional permit / Startup Law visa; slower bureaucracy | Spanish (learning) helps a lot | ⚠️ |
| 🇷🇸 **Serbia** | **Tertiary (home base, Strategy C)** | No permit needed (citizen); EU path via **intra-company transfer (EU ICT permit)** from an international employer's Belgrade office | Native | ✅ |
| 🇮🇹 **Italy** | **Lowest priority** | Non-EU hiring largely gated by **Decreto Flussi quotas** (restrictive); Blue Card path exists but slow | Italian needed for most roles | ⚠️ |

**Takeaway:** Your gut ordering (DE/NL/ES/IT primary; SI/MT/HR/PL/CZ bridge) holds for Germany and
Netherlands, but **Malta, Slovenia and Croatia deserve promotion** — they're your *fastest legal
entry points* given English-official (Malta), the Serbia bilateral agreement (Slovenia), and native
language (Croatia). **Italy drops** — it's the hardest of your four "primaries" for a non-EU hire.

---

## 4. The layered adaptation map (what to change in the repo)

The repo isolates geography into a few layers. Effort and approach differ sharply per layer.

### Layer 1 — Profile & identity *(easy; markdown)*
**Files:** `CLAUDE.md`, `.claude/skills/job-application-assistant/01-candidate-profile.md`
- Fill location, status, and **languages** (English/Serbian/Croatian/Spanish-learning).
- Record **"requires visa sponsorship (non-EU)"** as a first-class profile fact, not a footnote —
  downstream evaluation and cover letters should know this.

### Layer 2 — Evaluation framework *(easy edit, big conceptual change)* ⭐ **do this first**
**File:** `.claude/skills/job-application-assistant/04-job-evaluation.md`
- **Invert the relocation deal-breaker.** Today line ~51 reads *"Requires relocation: FAIL
  (deal-breaker)."* That auto-rejects every job you actually want. Flip it: relocation to a
  **primary** = strategic bonus; to a **bridge** = conditional positive.
- **Add a gating dimension: "Visa / Sponsorship Feasibility (Pass / Flag / Fail)."** For a non-EU
  candidate this is arguably the *most* important filter. Signals to score:
  - Posting explicitly offers visa sponsorship / relocation → **Pass**.
  - Employer is a known sponsor (e.g. NL IND recognized sponsor, DE Blue Card sponsor) → **Pass**.
  - Silent on sponsorship → **Flag** (worth a pre-application email/call).
  - "Must already have EU work authorization" / "no sponsorship" → **Fail**.
- **Add "relocation strategic value"** to Career Alignment: a bridge-country role that builds toward
  Blue Card mobility / EU LTR scores higher than a dead-end role in the same place.
- **Add a language-realism note:** discount DE/ES/IT roles that require fluent local language;
  upgrade English-first (NL, Malta) and Croatian/Serbian-native (HR, SI) matches.

### Layer 3 — WebSearch scraper *(moderate; markdown)*
**Files:** `.claude/skills/job-scraper/SKILL.md`, `.claude/skills/job-scraper/search-queries.md`
- **SKILL.md:** drop "Danish" from the description; it currently says *"Scrapes Danish job sites."*
- **search-queries.md → Search Sites:** replace the Danish board list with three groups:
  - **Pan-EU / cross-border:** **EURES** (official EU job-mobility portal — *built for exactly your
    situation*), LinkedIn (per-country location filter), Indeed (per-country domain).
  - **Visa-sponsorship-focused boards:** **Relocate.me**, **Arbeitnow** (visa-sponsored DE jobs),
    **Honeypot** (DE/NL tech, relocation), **Landing.jobs** (Europe), **JustJoin.it** /
    **NoFluffJobs** (Poland, English-first, salary-transparent, many relocation), **Make-it-in-Germany**,
    the **IND recognized-sponsor register** (Netherlands).
  - **Per-country boards:** StepStone / arbeitsagentur.de (DE); NationaleVacaturebank / Magnet.me (NL);
    InfoJobs.net / Tecnoempleo (ES); InfoJobs.it (IT); Jobs.cz / StartupJobs.cz (CZ); Pracuj.pl (PL);
    MojeDelo (SI); MojPosao (HR); Keepmeposted / Castille (MT).
- **search-queries.md → query categories:** re-tier by country (primary → bridge) and **add a
  sponsorship qualifier** to queries, e.g. `"visa sponsorship"`, `"relocation"`, `"Blue Card"`,
  `"recognized sponsor"`.
- **search-queries.md → Location Filter:** replace the commute-minute tiers with **country tiers**
  (primary / bridge / secondary) from §3.

> 💡 **Shortcut:** Layers 1 & 3 are exactly what the existing **`/setup --section search`** flow
> regenerates. Re-running `/setup` with the new multi-country answers will rewrite `search-queries.md`
> and the profile **without hand-editing**. Layer 2 (the relocation-flip + sponsorship gate) is *not*
> something `/setup` does today — that one needs a manual edit or a framework tweak.

### Layer 4 — CLI portal scrapers *(hard; real code — disable or rebuild)*
**Dir:** `.agents/skills/{jobindex,jobnet,jobbank,jobdanmark}-search/`
These are TypeScript/Bun CLIs **bonded to Danish portal APIs** — there is no "country" flag; the
endpoint, response schema, and parser are all Denmark-specific. Two honest options:
- **Option A (recommended first): retire them.** Let Layer 3's WebSearch cover all countries via
  LinkedIn/Indeed/EURES/sponsorship boards. You can search *today* with zero new code.
- **Option B: rebuild equivalents** using the same `@bunli/core` pattern. **Best ROI: a single
  EURES CLI** — EURES is one pan-EU portal with an API, so one tool covers all target countries.
  After that, the highest-value per-country CLIs are **JustJoin.it / NoFluffJobs** (clean APIs,
  English, salary data) and **StepStone**. ⚠️ Confirm each portal's API/ToS before building.

### Layer 5 — Salary benchmark tool *(optional; data-driven)*
**File:** `salary_lookup.py` (+ `tools/`)
- It's generic but ships with **Danish** name-normalization (ø/æ/å, A/S suffix stripping) and needs
  a `salary_data.json` you supply. For multi-country, either **disable it** or feed per-country data.
- Better fits for EU comp benchmarking: **Levels.fyi**, **Glassdoor**, and the salary-transparent
  boards (**NoFluffJobs**, **JustJoin.it**) — these print salary ranges directly in postings.

### Layer 6 — CV & cover-letter templates *(light but real)*
**Dirs:** `cv/`, `cover_letters/`
- Add a **work-eligibility / relocation line** ("Open to relocation across the EU; require visa
  sponsorship") and a **languages line** (English C2, Serbian/Croatian native, Spanish A2…).
- Per-country tone: lead with English-fluency for NL/Malta; mention Croatian for HR/SI; note
  Spanish-in-progress for ES.
- The repo rule still applies: when referencing agentic coding / AI tooling, name **Claude Code**.

---

## 5. Recommended phasing

| Phase | Scope | Outcome |
|-------|-------|---------|
| **0 ✅ done (2026-06-05)** | Layer 2 (`04-job-evaluation.md`) | Engine stops auto-rejecting relocation; now **gates on sponsorship**. Layer 1 profile fill still pending. |
| **1 ✅ done (2026-06-05)** | Layer 3 — `job-scraper/SKILL.md` + `search-queries.md` | `/scrape` now searches pan-EU and sponsor-aware (boards retargeted, country tiers, Priority 0 sponsorship boards). Role/skill placeholders still need profile fill. |
| **2** *(optional)* | Layer 4 Option B — **EURES CLI only** | One reusable pan-EU structured-search tool. |
| **3** *(optional)* | Remaining per-country CLIs + salary data + CV/cover tweaks | Full parity with the Danish setup. |

**You can be searching after Phase 1 with no new code** — Phases 2–3 are polish.

---

## 6. Open questions to resolve before building (Phase 0)

- Age band (affects NL threshold: €4,357 under-30 vs €5,942 30+).
- Degree level (Blue Card generally needs a recognised university degree or equiv. experience).
- Years of professional experience (some Blue Card routes accept experience in lieu of a degree).
- Is remote-first (EU-based employer) acceptable as a stepping stone, or relocation-only?
- Appetite for Strategy B (bridge-first) vs holding out for a direct primary offer.

---

## 7. Caveats & official sources to verify against

Immigration policy is high-stakes and shifts yearly; **this is not legal advice.** Verify on:
- Germany — Make it in Germany; Opportunity Card portal (`make-it-in-germany.com`, `digital.diplo.de/chancenkarte`)
- Netherlands — IND (`ind.nl`), incl. the recognized-sponsor public register
- EU Blue Card — European Commission EU Immigration Portal (`home-affairs.ec.europa.eu`)
- Slovenia — Employment Service (`ess.gov.si`), `gov.si`
- Cross-border jobs — EURES (`eures.europa.eu`)
- Croatia / Malta / Spain / Italy / Poland / Czechia — each country's official migration authority

### Verification log (web check, June 2026)
- ✅ Germany Opportunity Card: points-based, 1-yr job search, ~€1,091/mo funds, B2 English qualifies.
- ✅ Germany EU Blue Card 2026: €50,700 standard / €45,934.20 shortage (IT, engineering, science, recent grads).
- ✅ EU Blue Card intra-EU mobility: move to a 2nd member state after 12 months, no labour-market test.
- ✅ Netherlands HSM 2026: recognized-sponsor required; €4,357 (<30) / €5,942 (30+) / €3,122 reduced.
- ✅ Slovenia–Serbia employment agreement: permit via Employment Service → single permit, 3-yr, free labour access after yr 1.
- ⚠️ Malta, Croatia, Spain, Italy, Poland, Czechia specifics: not independently verified in this pass — confirm before relying.

## Sources
- [Opportunity Card — Make it in Germany](https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/job-search)
- [Germany Opportunity Card points system 2026](https://www.mygermanuniversity.com/articles/opportunity-card-points-system)
- [EU Blue Card Germany 2026 salary thresholds](https://aldaglegal.com/en/eu-blue-card-germany-2026/)
- [EU Blue Card — European Commission](https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal/eu-blue-card_en)
- [EU Blue Card mobility after 12 months (2026)](https://www.jobbatical.com/blog/germany-eu-blue-card-mobility-other-eu-countries)
- [Netherlands HSM salary thresholds 2026](https://www.jobbatical.com/blog/netherlands-highly-skilled-migrant-salary-thresholds-2026)
- [IND required amounts](https://ind.nl/en/required-amounts-income-requirements)
- [Employment of nationals of Serbia — Slovenia ZRSZ](https://www.ess.gov.si/en/jobseekers/employment-of-non-eu-migrant-workers/work-in-slovenia/employment-of-nationals-of-serbia)
- [Employment of foreign nationals — GOV.SI](https://www.gov.si/en/topics/employment-and-work-of-foreign-nationals/)
