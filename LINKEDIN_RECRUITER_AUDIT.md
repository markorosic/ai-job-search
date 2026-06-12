# LinkedIn Recruiter-Visibility Audit — linkedin.com/in/roske

> **Audited:** 2026-06-11, against the live profile (logged-in view).
> **Lens:** how LinkedIn Recruiter / sourcing systems actually find and rank candidates —
> title filters, boolean keyword search, skills filters, open-to-work filters, location.
> **Strategy context:** seniority ladder (Head = stretch, **Lead = primary target**, Senior =
> acceptable at standout companies as EU entry) + EU relocation, see `EU_RELOCATION_PLAN.md`.
> **Baseline metric:** 24 search appearances / 7 days (re-check 2–3 weeks after applying fixes).

---

## 1. Verdict scorecard

| Question | Verdict | One-line reason |
|---|---|---|
| Is strategy involvement clear? | ⚠️ **Partial** | "Strategy" lives in skill tags and the About, but almost no experience bullet says you **defined or owned** strategy |
| Independent & senior in knowledge? | ✅ **Yes** | Strongest signal on the profile — About + Beyond Clicks entry both land it |
| Ready for Senior / Lead / Head? | ⚠️ **Mostly** | Title ladder shows it, but Open to Work titles miss the exact phrases recruiters filter on |
| Easy to find via keywords? | ⚠️ **Gaps** | Core terms covered; missing high-volume recruiter keywords, and zero AI signal |

---

## 2. What the recruiter system sees today

### How you get found (mechanics)
Recruiters don't read profiles first — they run filters, then skim whoever survives:
1. **Title filter** (current/past job titles + open-to-work titles) — exact-ish phrase matching
2. **Skills filter** — matches the Skills list only, not prose
3. **Keyword search** — matches headline, About, and experience descriptions
4. **Location / open-to-work / relocation filters**

A signal that exists only in prose helps in step 3; a signal in the Skills list and titles helps
in steps 1–2, which run first. That's why the same fact often needs to exist in **both** places.

### Current inventory

**Headline:** `Senior Product Designer | Head of Design | Design Systems | Product Strategy`
— covers Senior + Head + your two core specialisms. Missing: any "Lead" phrase, any AI signal.

**Open to Work** (recruiters-only):
- Titles: `User Experience Lead · Head of UX · VP of Product Design · Design Lead`
- Location types: On-site · Hybrid — **no Remote**
- Locations: Belgrade · **European Union** ✓
- Start: Immediately · Full-time / Part-time / Contract

**Skills (21 of 100 possible):** Product Road Mapping, Design Systems, Product Strategy, Team
Leadership, User Experience (UX), Product Design, Leadership, Analytical Skills, People
Development, Digital Strategy, DesignOps, Stakeholder Management, People Management, Agile
Methodologies, Product Planning, UX Research, CSS, PHP, JavaScript, Interaction Design, Figma.

**Title ladder (Catena onwards):** Senior UX Designer → UX Lead → User Experience Lead →
Head of UI/UX → Lead Product Designer. Clear upward arc; the current "Lead" title after a
"Head" title is explained by the consultancy framing in the description — good.

---

## 3. Question-by-question findings

### Q1 — Strategy involvement: ⚠️ partial

What works:
- About: *"I specialise in product strategy"*, *"streamline product road mapping"*
- Skill tags on roles: Product Strategy, Digital Strategy, Product Road Mapping

What fails the keyword test — the experience prose uses **execution and caretaker verbs**,
not strategy-ownership verbs:
- GiG (weakest entry): *"Maintained design system integrity… kept the team aligned…
  sustained delivery quality"* — reads as holding the fort during the acquisition, not steering it
- Gentoo: *"introducing structured UX practices"* — process, not strategy; the phrase
  "design strategy" appears **nowhere on the profile**
- Catena Senior: *"laid the groundwork"* — modest for what became the company's first design system

A recruiter boolean like `"design strategy" OR "UX strategy"` does **not** hit your profile today.

### Q2 — Independent & senior: ✅ yes

- Beyond Clicks: *"Engaged where senior design judgment is needed without a full-time hire"* —
  excellent; says senior + independent in one line
- About: *"selective guidance to founders and product teams"*, *"where senior-level design
  expertise is required"*, *"over 15 years of experience"*
- The closing line (*"Most product teams have more UX work than clarity. I bring a method to
  that."*) is a confident, memorable positioning statement

No changes needed here.

### Q3 — Ready for Senior / Lead / Head: ⚠️ mostly

Evidence present: held a Head title; led a team of 7; built company-level and multi-brand
design systems; progression is visible.

Three leaks:
1. **Open to Work titles miss the highest-volume phrases.** You list "Head of UX" but not
   **"Head of Design"** — the single most common head-level search. You list "Design Lead" but
   not **"Lead Product Designer"** (your own current title!) or **"Senior Product Designer"**
   (your new ladder explicitly accepts senior at standout companies) or **"Design Systems Lead"**
   (your differentiator).
2. **"Head of UI/UX"** as a past title matches "Head of UX"-ish searches but not the exact
   phrase "Head of Design".
3. **Numbers are missing.** The repo profile has them (25% faster time-to-market at Gentoo, 30%
   dev-time cut at Catena, +20% mobile traffic / +15% retention on the redesign, design system
   scaled across 10+ sites) but the LinkedIn entries say "reduced time-to-market" with no
   figure. Numbers are what makes a skimming recruiter believe the seniority claim.

### Q4 — Keywords: ⚠️ gaps

| Status | Keywords |
|---|---|
| ✅ Strong (titles/skills/prose) | Design Systems, Product Strategy, DesignOps, Figma, UX Research, Product Road Mapping, Stakeholder Management, Team Leadership, multi-brand |
| ⚠️ Prose-only (invisible to skills filters) | mentoring, evidence-based design, usability testing, design-to-development handoff, road mapping |
| ❌ Missing entirely | **Design Leadership, Design Strategy, UX Strategy, User Research** (more searched than "UX Research"), **Usability Testing, A/B Testing, Design Tokens, Accessibility/WCAG, Mentoring, Cross-functional Leadership** |
| ❌ Missing — biggest gap | **Any AI signal.** Zero AI keywords on the entire profile, while AI-orchestrated delivery with **Claude Code** is one of your two stated differentiators. Recruiters in 2026 actively search for design leaders who work with AI. (Compare: a "viewers also viewed" peer runs "AI-Augmented Workflows" in his headline.) |
| ⚠️ Counter-signal | Your three **most-endorsed** skills are CSS (21), JavaScript (12), PHP (10) — relics that skew your search ranking toward 2010-era developer. Can't delete the endorsements' history, but de-prioritise the skills. |

---

## 4. Fix list — apply top to bottom

### 🟢 Quick wins (15 minutes, settings only) — ✅ 4.1–4.3 applied 2026-06-11 · ✅ 4.4 applied 2026-06-12

**4.1 ✅ Open to Work → Job titles.** Replace the current four with (priority order):
```
Head of Design · Lead Product Designer · Design Lead · Head of UX · Design Systems Lead
```
If more slots are allowed, append: `Senior Product Designer · Head of Product Design`.
Drop "VP of Product Design" — no VP-level evidence on the profile, and it dilutes matching.

**4.2 ✅ Open to Work → Location types.** Add **Remote**. An EU-remote employer is an explicit
stepping stone in your strategy; today that filter excludes you.

**4.3 ✅ Open to Work → Locations.** Keep Belgrade + European Union, and add **Germany** and
**Netherlands** explicitly — some recruiters filter by country, and an explicit country match
is safer than relying on the EU region resolving correctly.

**4.4 ✅ Skills — add, and tag each one to specific roles. (applied 2026-06-12)**

Skills work in two layers. The **global list** (max 100) is what recruiter *skills filters*
match — a skill must exist there at all. The **per-role association** ("where did you use this
skill?") is what gives a skill provenance (*"Design Systems — 2 experiences at…"*), makes it
rank as evidence rather than a self-claim, and decides which two skills show in the teaser line
under each experience. Add each skill via *Skills → Add skill*, ticking the experiences below —
or from the experience side via *Edit experience → Skills*.

| New skill | Tag to roles | Evidence (already in your descriptions) |
|---|---|---|
| **Design Leadership** | Gentoo · GiG · Catena UX Lead · Beyond Clicks | Led team of 7; led UX through acquisition; built & mentored team |
| **Design Strategy** | Gentoo · Beyond Clicks · GiG | Multi-brand design system direction; advisory on design decisions |
| **Product Strategy** *(UX Strategy n/a on LinkedIn)* | GiG · Catena UX Lead | Owned UX direction across portfolio |
| **User Research** | Catena Senior · Catena UX Lead · Gentoo | "integrating user research"; "structured research practices"; feedback loops |
| **Usability Testing** | Catena Senior · Catena UX Lead | "usability testing into the product process" |
| **A/B Testing** | Catena Senior · Catena UX Lead | Evidence-based design era (GA / VWO / HotJar) |
| **Design Tokens** | Gentoo · Beyond Clicks | Company-level multi-brand system; design-system advisory |
| **Mentoring** | Gentoo · Catena UX Lead | "mentored a cross-functional team of 7"; "building and mentoring" |
| **Cross-functional Team Leadership** | Gentoo | Cross-functional team of 7 incl. 2 team leads |
| **Prototyping** | Beyond Clicks · Smith Micro | Functional prototypes; Axure-era interaction work |
| **Information Architecture** | Catena Senior · mySkin | Redesign groundwork; "maintaining IA" |
| **Accessibility** | *(only if you have real WCAG work to point at — otherwise skip)* | — |

**Also re-tag existing skills** — the provenance is thinner than the reality:
- **Design Systems** → add to **Gentoo**, **Catena UX Lead**, **Catena Senior**, **Beyond
  Clicks** (today it shows only ~2 experiences; you built or ran a design system in *five* roles —
  "5 experiences" provenance is your single strongest recruiter signal)
- **Figma** → add to **Catena Senior** (you *drove the Sketch→Figma migration* there; today
  Figma shows only Beyond Clicks)
- **DesignOps** → add to **Gentoo** (structured UX practices, design earlier in the lifecycle)

**Fix the teaser pair.** Every role since Catena displays *"Product Road Mapping, Stakeholder
Management and +N skills"* — your two most generic tags, repeated five times. The teaser shows
the first two skills in each experience's skill list, so re-order (or remove/re-add) per role
until the visible pair is the sharp one:
- Beyond Clicks → `Design Strategy, Design Systems`
- Gentoo → `Design Leadership, Design Systems`
- GiG → `Design Systems, Product Strategy`
- Catena UX Lead → `Design Systems, Mentoring`
- Catena Senior → `User Research, Figma`

Finally, **reorder the global list** so the top reads: Design Systems, Design Leadership,
Product Strategy, DesignOps, Design Strategy — and CSS/PHP/JavaScript sink to the bottom.

### 🟡 Headline — ✅ applied 2026-06-12 (option A chosen)

The headline is the heaviest-weighted keyword field. Two options:

**A ✅ (chosen + applied 2026-06-12):**
```
Head of Design / Lead Product Designer | Design Systems & DesignOps | Product Strategy | AI-augmented design delivery (Claude Code)
```

**B (conservative — minimal change, adds the missing "Lead"):**
```
Senior Product Designer | Design Lead | Head of Design | Design Systems | Product Strategy
```

### 🟠 Experience rewrites (verb surgery + numbers)

**4.5 Gentoo Media (Head of UI/UX)** — make strategy ownership explicit and restore the number:
> **Defined the design strategy** for a multi-brand product portfolio. Established and scaled a
> company-level design system that unified consistency across brands and reduced engineering
> overhead. Led and mentored a cross-functional team of 7 (incl. 2 team leads), **cutting
> feature time-to-market by 25%**. Used analytics and user feedback loops to continuously
> validate and iterate on product experience.

**4.6 Gaming Innovation Group (User Experience Lead)** — replace caretaker verbs with
ownership verbs (same facts, different agency):
> **Owned UX direction** across the affiliate media portfolio through the Catena Media
> acquisition. **Defended design system integrity** during organisational transition, kept
> multi-brand delivery quality high, and **set the evidence-based design standards** the
> merged team operated by.

**4.7 Catena Media (UX Lead)** — add the scale number:
> …Drove the design system initiative that scaled across **10+ websites and cut development
> time by ~30%**, introduced structured research and testing practices…

**4.8 Catena Media (Senior UX Designer)** — add outcomes:
> Led the redesign of the flagship product (**+20% mobile traffic, +15% retention**) and laid
> the groundwork for the company's first scalable design system…

**4.9 ✅ Beyond Clicks (current role) — full rewrite. (applied 2026-06-12)**

This entry is the umbrella for the current full-time design-leadership work (employer not named
publicly to keep distance from iGaming; products described generically — no casino / gambling /
betting / affiliate wording anywhere). It's also where the AI differentiator must live.

*Title — **decided: B, `Head of Design (Consulting)`** (chosen 2026-06-11):*
- A: `Fractional Head of Design` — not chosen
- **B ✅: `Head of Design (Consulting)`** — "Head of Design" exact phrase in the current title
  for recruiter title filters, conservative flavour
- C: keep `Lead Product Designer` — not chosen

*Description (finalised 2026-06-12):*
> Design leadership for startup engagements under NDA, owning design strategy from brand identity to shipped product, with AI-augmented delivery (Claude Code) as the operating model.
>
> • End-to-end design for a 0→1 consumer platform: brand identity, design language, and a token-based design system (tokens, variables, components) implemented as a block-based WordPress theme.
> • Built a Figma-to-development pipeline on Claude Code that turns design tokens and components into production templates, one source of truth shared by design and engineering.
> • Design lead for a second platform in the same portfolio, built end to end with AI-orchestrated workflows.
> • Rebuilt the product-process infrastructure: consolidated all design into Figma, introduced Shape Up-style cycles, and migrated project management from Trello to Asana, including building the migration tool myself.
> • UX direction for a US youth-sports startup connecting club staff, parents, and young athletes.

*Skills to tag on this role:* Design Strategy · Design Systems · Design Tokens · DesignOps ·
Design Leadership · Figma · Product Strategy · Prototyping

*Notes:*
- The old line "engaged where senior design judgment is needed without a full-time hire" is
  dropped — it contradicts the day-to-day ownership the new bullets describe.
- Second product described as "a second platform in the same portfolio" — no product-type naming (Marko flagged "data-intelligence platform" as too close to internal naming). Avoid "affiliate" — it signals the exact industry being pivoted away from.
- **Background-check awareness:** employment verification at offer stage will surface the real
  employer. The public framing is for discoverability and industry distance, not concealment —
  be ready to disclose the engagement privately in interviews ("current engagement under NDA,
  happy to walk through the work in conversation").

### 🔵 About section — ✅ applied 2026-06-12

The About is good prose but thin on searchable nouns. Append a final block — keyword searches
hit the About, and this is the cheapest way to cover phrases that fit nowhere else:
```
Focus areas: design leadership · design strategy · design systems & design tokens · DesignOps ·
multi-brand platforms · UX strategy · user research & usability testing · A/B testing ·
design-engineering workflow · AI-augmented delivery (Claude Code) · mentoring & team development

Open to Head of Design, Design Lead, and senior product design roles across the EU
(relocation-ready, Belgrade-based).
```

### ⚪ Optional polish
- **Featured section:** pin rosic.net and one design-system case study — recruiters who survive
  the skim click exactly one thing.
- **Recommendations:** you have a strong reference letter (per repo profile); ask 1–2 former
  colleagues (ideally the Gentoo team leads or a PM) to post a short recommendation that uses
  the words "design strategy" and "leadership".
- **Title normalisation (judgment call):** "Head of UI/UX" → "Head of Design (UI/UX)" at Gentoo
  would make the exact "Head of Design" phrase part of a past title. Defensible if your actual
  scope matches (it did — company-level design system, team of 7); skip it if you'd rather titles
  stay verbatim to what HR would confirm.

---

## 5. How to verify it worked

1. Note baseline: **24 search appearances / 7 days** (2026-06-11), 32 profile views.
2. Apply 🟢 + 🟡 fixes in one sitting; the 🟠 rewrites within the week.
3. Re-check *Analytics → Search appearances* after 2–3 weeks. Expect the number and the
   "what recruiters searched" terms to shift toward "Head of Design / design systems / lead".
4. Run the self-test: from a logged-out browser, search LinkedIn for
   `"design systems" "head of design" Belgrade` — you should appear; today you may not.
