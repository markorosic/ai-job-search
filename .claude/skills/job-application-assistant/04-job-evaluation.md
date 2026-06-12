# Job Evaluation Framework

<!-- SETUP: Skill match areas and career goals are personalized by running /setup -->

## Scoring Dimensions

Evaluate each job posting against these five dimensions:

### 1. Technical Skills Match (0-100)
How well do the required/preferred skills align with the candidate's capabilities?

| Score | Meaning |
|-------|---------|
| 80-100 | Core requirements are primary skills |
| 60-79 | Most requirements match, 1-2 gaps that are learnable |
| 40-59 | Partial match, significant upskilling needed |
| 0-39 | Fundamental mismatch |

**Strong match areas:** Design systems & DesignOps, design leadership / team management, product strategy, UX research & usability testing, interaction & visual design, design-engineering collaboration, A/B testing & analytics, Figma (+ plugin development)
**Moderate match areas:** Front-end (HTML/CSS, JS, PHP), prototyping (Axure), AI-orchestrated delivery, roadmap & stakeholder management, 0→1 product work
**Weak match areas:** Native-level local languages (German, Dutch, Spanish, Italian); pure IC visual/brand design with no leadership remit; non-design engineering roles

### 2. Experience Match (0-100)
Does work history align with what they're looking for?

| Score | Meaning |
|-------|---------|
| 80-100 | Direct experience in the same domain and role type |
| 60-79 | Related experience, transferable skills clear |
| 40-59 | Adjacent experience, would need to make the case |
| 0-39 | Unrelated experience |

**Strong:** Head/Lead design roles at high-traffic, multi-brand / multi-market consumer web companies; design-system build-outs; scaling and leading design teams
**Moderate:** Product/UX leadership in adjacent sectors (SaaS, dev-tools, fintech, media, e-commerce) — transferable, but a domain shift from affiliate media
**Entry-level / stretch:** Very large-org VP/Director of Design; heavy research-ops or hardware/industrial-design roles

### 3. Behavioral/Culture Fit (0-100)
Does the role and company culture match the behavioral profile?

| Score | Meaning |
|-------|---------|
| 80-100 | Culture strongly matches behavioral preferences |
| 60-79 | Mixed signals but mostly compatible |
| 40-59 | Some friction areas |
| 0-39 | Significant culture mismatch |

**Red flags to research:** Department disorganization, work dominated by maintenance over development, poor chemistry with leadership, culture mismatches. Check reviews, media coverage, LinkedIn connections, and network contacts for insider perspective.

### 4. Visa / Sponsorship Feasibility (Pass / Flag / Fail) — gating

The candidate is **non-EU and requires visa sponsorship**. This is the single most
important filter: a perfect-fit role that will not sponsor is worth zero. Score the signal:

- Posting explicitly offers visa sponsorship / relocation support: **PASS**
- Employer is a known sponsor (e.g. NL IND recognized sponsor, registered DE Blue Card
  employer, Malta iGaming/fintech): **PASS**
- Posting is silent on sponsorship: **FLAG** — worth a pre-application email/call to ask
- Posting requires existing EU work authorization / states "no sponsorship": **FAIL**

A **FAIL** here overrides the weighted score — skip the role regardless of fit, unless the
candidate is pursuing a self-driven route (e.g. arriving on Germany's Opportunity Card and
applying on the ground, where the employer does not need to sponsor entry).

### 5. Location & Relocation Fit (Notes + tier — not a gate)

Relocation is the **goal**, not a disqualifier. Never fail a role for requiring relocation.
Instead, note the destination's strategic tier and language realism:

- **Primary (direct targets):** Germany, Netherlands — score relocation here as a strong positive.
- **Bridge (footholds → primaries):** Malta, Slovenia, Croatia, Poland, Czechia — score as a
  positive *stepping stone*; a bridge role that builds toward EU Blue Card intra-EU mobility
  (12 months) or EU Long-Term Residence (5 years) is strategically valuable.
- **Secondary:** Spain — conditional (Spanish improving).
- **Tertiary (home base, Strategy C):** Serbia — no permit needed; an international / EU-HQ
  employer in Belgrade counts as an EU pathway (intra-company transfer / internal relocation).
  Rank by EU-pathway signal, not the sponsorship gate (dimension 4 does not apply to Serbian roles).
- **Lowest:** Italy — hardest non-EU entry (Decreto Flussi quotas).

**Language realism:** discount roles requiring fluent German/Spanish/Italian; upgrade
English-first markets (Netherlands, Malta, English-first tech boards) and Croatian/Serbian-native
markets (Croatia, Slovenia). **Remote (EU-based employer):** note as a possible stepping stone.
Frequent international travel: note, don't fail. See `EU_RELOCATION_PLAN.md` for full rationale.

### 6. Career Alignment & Motivation (0-100)
Does this role advance career goals and contain tasks that energize? For this candidate,
also factor in **relocation strategic value**: a bridge-country foothold that opens a legal
path to a primary target (via Blue Card mobility or EU Long-Term Residence) scores higher than
an otherwise-similar role with no onward path. See the destination tiers in dimension 5.

| Score | Meaning |
|-------|---------|
| 80-100 | Strongly aligned with career direction, clear growth path |
| 60-79 | Good role but only partially aligned with long-term goals |
| 40-59 | Decent job but doesn't build toward career goals |
| 0-39 | Dead end or backwards step |

**Career goals:**
- Return to an in-house **Head/Lead design** seat at a mature product company in the EU (relocation + visa sponsorship)
- Own and scale design-systems and design-org infrastructure that connects to business outcomes
- Deepen work at the design-engineering boundary with AI-accelerated delivery; pivot out of gambling/affiliate into broader product sectors

**Seniority ladder (calibrate the score, don't gate):**
- **Head of Design** — ideal, but realistically hard to land without referrals at EU companies; score normally and flag as stretch
- **Lead** — the realistic primary target; full score when other dimensions fit
- **Senior IC** — acceptable **only at really good companies or on great projects**: it's an EU
  entry the candidate can grow from (move up internally or switch companies once in the EU).
  Do **not** score a senior title at a standout company as a "backwards step" — weigh company
  quality and EU-entry value instead. A senior role at an unremarkable company *is* a step down — score it low.

**Motivation filter:** Evaluate not just whether you *can* do the tasks, but whether the tasks will *energize* you. Consider:
- Tasks that energize: building design systems/infrastructure, leading & mentoring designers, problem framing, design-engineering collaboration, AI-orchestrated prototyping, evidence-based iteration
- Tasks that drain: pure-maintenance work with no infrastructure mandate, decorative/brand-only briefs, environments that ignore research and data
- Non-task factors: leadership style, department culture, company values, degree of autonomy

**Life situation alignment:** Consider personal constraints:
- **Security**: Needs a role that sponsors EU relocation; the stability of an in-house seat is preferred over continued independent consulting
- **Flexibility**: Currently remote-based in Belgrade; open to relocation and to hybrid/on-site in the target country
- **Professional development**: Growth into broader product sectors and larger design-org leadership; staying at the design + AI frontier

### 7. Salary Benchmark (Optional)

If the salary lookup tool is configured (`salary_data.json` exists), look up the company:
```
python salary_lookup.py "<Company Name>" --json
```

If a city is known from the posting, add `--city "<City>"` to narrow results.

Present findings as:
```
### Salary Benchmark
| Metric | Value |
|--------|-------|
| [Category] index | XX.X (+/-X.X% vs baseline) |
| Overall index | XX.X (+/-X.X% vs baseline) |
```

Interpret results relative to the baseline defined in the data file's metadata. For index-based data, higher typically means above-market compensation.

If the salary tool is not configured, skip this section.

## Output Format

Present the evaluation as:

```
## Job Fit Evaluation: [Role] at [Company]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical Skills | XX/100 | [brief note] |
| Experience Match | XX/100 | [brief note] |
| Behavioral Fit | XX/100 | [brief note] |
| Visa / Sponsorship | PASS/FLAG/FAIL | [sponsorship signal] |
| Location & Relocation | [tier] | [destination tier + language note] |
| Career Alignment | XX/100 | [brief note] |

**Overall Score: XX/100** (weighted average of scored dimensions)

### Verdict: [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

### Key Strengths for This Role
- [bullet points]

### Gaps to Address
- [bullet points]

### Recommendation
[1-2 sentences: apply/skip/apply with caveats]

### Company Research Checklist
- [ ] Checked company website (mission, values, recent news)
- [ ] Checked review sites (Glassdoor, Jobindex, etc.)
- [ ] Checked LinkedIn for team size, recent hires, connections
- [ ] Checked media for restructuring, growth, or workplace issues
- [ ] Identified network contacts who may know the team/manager
```

## Weighting
- Technical Skills: 30%
- Experience Match: 25%
- Behavioral Fit: 15%
- Career Alignment: 30%

(Visa / Sponsorship is a gate — a FAIL overrides the weighted score. Location & Relocation is
contextual, not weighted; it feeds Career Alignment.)

## Thresholds
- **Strong Fit** (75+): Definitely apply, tailor everything
- **Good Fit** (60-74): Apply, address gaps in cover letter
- **Moderate Fit** (45-59): Consider carefully, discuss with user
- **Weak Fit** (30-44): Probably skip unless strategic reasons
- **Poor Fit** (<30): Skip

**Visa gate override:** Regardless of the band above, a **FAIL** on Visa / Sponsorship
Feasibility means skip — unless pursuing an on-the-ground route (e.g. Germany Opportunity Card).
A **FLAG** means apply, but prioritize confirming sponsorship early (pre-application call/email).

## Pre-Application: Call the Employer (Best Practice)

Before writing the application, consider whether the candidate should call the contact person listed in the posting. **Only call if there are substantive questions** - never call just to "be remembered."

### When to Suggest Calling
- The posting has unclear or ambiguous requirements
- It's unclear which competencies are essential vs. nice-to-have
- The role description is vague about day-to-day tasks
- There's a named contact person who invites questions

### Good Questions to Ask
- "What are the primary challenges in this role?"
- "How is time typically divided across the listed responsibilities?"
- "Which competencies are most critical for success in this position?"
- "What does success look like in the first 6-12 months?"

### Rules for the Call
- Prepare a 30-second "elevator pitch" about your background in case they ask
- The call's purpose is **gathering information**, not delivering a pitch
- Take notes - use what you learn to tailor the application
- Reference the conversation naturally in the cover letter ("After speaking with [name], I was especially drawn to...")
