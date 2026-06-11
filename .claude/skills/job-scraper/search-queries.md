# Search Queries for Job Scraper

<!-- Configured for Marko Rosic: non-EU design leader seeking in-house Head/Lead roles in the EU
     with visa sponsorship. Industry: open, but NO gambling/betting/casino. Re-run
     /setup --section search to adjust roles, skills, or country tiers. -->

## Search Sites

The candidate is **non-EU and needs visa sponsorship**, searching across the EU. Prioritise
boards that surface sponsorship/relocation roles, then pan-EU aggregators, then per-country boards.

**Group A — Sponsorship & relocation-focused (search these first):**
- **eures.europa.eu** - official EU job-mobility portal (built for cross-border hiring)
- **relocate.me** - roles bundling relocation + visa support
- **arbeitnow.com** - visa-sponsored jobs (Germany-heavy)
- ~~honeypot.io~~ — shut down January 2025, no longer available
- **landing.jobs** - Europe-wide tech & product, relocation
- **justjoin.it** / **nofluffjobs.com** - Poland tech/product, English-first, salary-transparent, many relocation
- **make-it-in-germany.com** - official German skilled-worker portal
- Netherlands IND **recognized-sponsor register** - cross-check an NL employer can sponsor before applying

**Group B — Pan-EU aggregators (filter by country + a sponsorship qualifier):**
- **linkedin.com/jobs** - use the **guest job-search endpoint** (no login) — see "LinkedIn guest job-search" below. Do NOT use a logged-in LinkedIn scraper/MCP (personal-account ban risk).
- **indeed.com** and per-country domains (indeed.de, indeed.nl, indeed.es, indeed.it)
- **glassdoor.com** - listings plus employer reviews

**Group C — Per-country boards (when targeting a single country):**
- Germany: **stepstone.de**, **arbeitsagentur.de**, xing.com
- Netherlands: **nationalevacaturebank.nl**, **magnet.me**
- Spain: **infojobs.net**, **tecnoempleo.com**
- Italy: **infojobs.it**, monster.it
- Poland: **pracuj.pl** · Czechia: **jobs.cz**, **startupjobs.cz**
- Slovenia: **mojedelo.com** · Croatia: **moj-posao.net** · Malta: **keepmeposted.com.mt**, **castille.com**
- Serbia (home base): **poslovi.infostud.com**, **helloworld.rs** (IT, Infostud-owned), **poslovi.rs**

## LinkedIn guest job-search (unauthenticated — preferred for LinkedIn)

LinkedIn job *search* is normally login-gated, but the **guest endpoint** that powers the
logged-out page is open and returns job cards with no account attached — so the worst case is an
IP rate-limit, never a ban on a personal profile. This is exactly why we do NOT add a logged-in
LinkedIn scraper / MCP: it decouples discovery from the candidate's account.

**Two-step flow (uses WebFetch only — no new dependency):**

1. **Discover** — `WebFetch` the guest search endpoint (~10 cards/page: title, company, location, link, age):

   `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=<url-encoded>&location=<country|city>&f_TPR=r1209600&start=0`

2. **Detail** — `WebFetch` the public posting page `https://www.linkedin.com/jobs/view/<id>/` for the full description.

**Useful filter params** (append to the discover URL):
- `f_TPR=r604800` posted last 7 days · `r1209600` last 14 days
- `f_WT=1` on-site · `2` remote · `3` hybrid · `f_E=` seniority · `f_JT=` job type
- `start=0,10,20,...` pagination (~10 results per page)

**Caveats:** undocumented endpoint (may change); keep volume modest to avoid HTTP 429; it does
NOT surface the visa/sponsorship signal — pair with the Group A sponsor boards. For a fully
legitimate structured DE source, arbeitnow has a public JSON API: `https://www.arbeitnow.com/api/job-board-api`.

## Target Countries (search tiers)

Run **primary** countries first, then **bridge**, then **secondary**. Bridge countries are legal
footholds that open a path to the primaries (EU Blue Card intra-EU mobility after 12 months, or
EU Long-Term Residence after 5 years). See `EU_RELOCATION_PLAN.md` for the full rationale.

- **Primary:** Germany, Netherlands
- **Bridge:** Poland, Czechia, Slovenia, Croatia, Malta *(Malta's main pull was iGaming — weaker now given the no-gambling preference, but still viable for fintech/tech in English)*
  *Slovenia and Croatia carry an ex-Yu advantage: employer-driven work permits that are routine
  for Serbian citizens, and no practical language barrier.*
- **Home base:** Serbia — no work authorization needed. Target international / EU-headquartered
  companies in Belgrade where an intra-company transfer (EU ICT permit) or internal relocation
  opens an EU path later. Rank by EU-pathway signal, not visa signal.
- **Secondary:** Spain
- **Lowest priority:** Italy (restrictive non-EU quotas — Decreto Flussi)

## Query Categories

Two axes: **what** (role/skill, below) × **where** (country tier, above). Run primary countries
first and **always add a sponsorship qualifier** — `("visa sponsorship" OR relocation OR "Blue Card")`
— **except** Serbian home-base queries and SI/HR local-board queries (Priority 2.5): Serbia takes no
qualifier (rank by EU pathway instead) and SI/HR use routine employer-driven work permits.
**Exclude gambling** where a query is broad — append `-casino -gambling -betting -igaming`.
Language note: favour English-first roles in DE; NL is very English-friendly; English-first tech
boards (Honeypot, Landing.jobs, NoFluffJobs) suit DE/ES/IT where local-language depth is missing.

### Priority 0: Sponsorship & relocation boards (run first)

Hit the Group A boards directly — they pre-filter for sponsorship/relocation, so no qualifier needed.

```
site:relocate.me "Head of Design"
site:arbeitnow.com "design systems"
site:justjoin.it "product designer"
EURES "Head of Design" (Germany OR Netherlands)
```

### Priority 1: Design Leadership (Head / Lead, in-house)

Your primary direction — Head/Lead design roles. Run across each target country, primaries first.

```
site:linkedin.com/jobs "Head of Design" Germany ("visa sponsorship" OR relocation) -gambling -casino
site:linkedin.com/jobs "Head of UX" Netherlands "recognized sponsor"
site:stepstone.de ("Head of Design" OR "Design Lead") English
("Head of Design" OR "Design Lead") "design systems" "visa sponsorship" (Germany OR Netherlands) -casino -gambling -betting
("Head of Design" OR "Design Lead") (Slovenia OR Croatia OR Ljubljana OR Zagreb) -casino -gambling -betting
```

### Priority 2: Design Systems & DesignOps

Your distinctive specialism — often English-first and in demand at scaling product orgs.

```
site:linkedin.com/jobs "design systems" lead (Netherlands OR Poland OR Czechia) ("visa sponsorship" OR relocation)
site:linkedin.com/jobs "design systems" lead (Slovenia OR Croatia) -casino -gambling -betting
site:nofluffjobs.com "design system"
site:indeed.nl "DesignOps" English
EURES "design systems"
```

### Priority 2.5: Ex-Yu — Serbia home base + SI/HR local boards

Runs in the default scrape (executed by the **exyu-jobs** agent). Serbian queries take NO
sponsorship qualifier — rank by EU pathway instead. Local-language terms widen recall.

```
site:poslovi.infostud.com (dizajner OR "design lead" OR "head of design") -casino -gambling -betting -igaming
site:helloworld.rs (dizajn OR "product designer" OR "design lead") -casino -gambling -betting -igaming
site:poslovi.rs (dizajner OR "ux") -casino -gambling -betting -igaming
site:mojedelo.com (design OR oblikovalec) -casino -gambling -betting
site:moj-posao.net ("head of design" OR dizajner OR "voditelj dizajna") -casino -gambling -betting
```

### Priority 3: Product / UX Lead

Adjacent lead roles to widen the net — include bridge countries.

```
site:linkedin.com/jobs "Lead Product Designer" "design systems" (Germany OR Netherlands OR Poland) "visa sponsorship"
site:linkedin.com/jobs "UX Lead" "design systems" (Slovenia OR Croatia OR Czechia) -casino -gambling
```

### Priority 4: Broader / English-first remote-friendly

Wider net — include EU-based remote roles as possible stepping stones.

```
site:linkedin.com/jobs ("Head of Design" OR "Design Lead") "visa sponsorship" Europe -gambling -casino
site:landing.jobs "product designer"
("Head of Design" OR "Design Lead") (remote OR relocation) "visa sponsorship" Europe -gambling
site:glassdoor.com "Head of Design" (Germany OR Netherlands)
```

## Country & Relocation Filter

Relocation is the **goal**, not a disqualifier — never skip a role for requiring relocation.
Instead, rank results by country tier and sponsorship signal:

- **Keep & prioritise:** roles in primary/bridge countries that mention visa sponsorship or relocation
- **Keep & flag:** good-fit roles that are silent on sponsorship (confirm before applying)
- **Serbia (home base):** never filter Serbian roles by visa/sponsorship language — it does
  not apply. Rank by EU pathway: international/EU-HQ employer (🔁) above purely local (🏠),
  unknown in between. Gambling exclusion still applies (large iGaming presence in Belgrade).
- **Skip:** roles that explicitly require existing EU work authorization / state "no sponsorship"
- **Skip:** gambling / betting / casino / iGaming employers (candidate is pivoting out)
- **Deprioritise:** Italy (restrictive non-EU quotas) and roles requiring fluent local language the
  candidate lacks (German/Dutch/Spanish/Italian); English-workable roles rank higher

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area or a country, select matching queries and generate 2-3 custom ones:
- "/scrape [focus_area]" -> relevant role-category queries + custom focus-specific queries
- "/scrape germany" (or any country) -> run all role categories scoped to that country, with the sponsorship qualifier
- "/scrape bridge" -> scope to the bridge-country tier (Poland, Czechia, Slovenia, Croatia, Malta)
- "/scrape exyu" -> scope to Serbia + Slovenia + Croatia (home base + ex-Yu bridges), Priority 2.5 plus SI/HR queries from other categories
