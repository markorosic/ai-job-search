# Job Application Assistant for Marko Rosic

<!-- Profile populated via /setup (2026-06-05). Re-run /setup or /setup --section <name> to update. -->

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Marko Rosic, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

<!-- This section is auto-populated by /setup. You can also fill it in manually. -->

### Identity
- **Name:** Marko Rosic
- **Location:** Belgrade, Serbia (open to EU relocation)
- **Contact:** marko@rosic.net · +381 60 585 44 55 · portfolio: rosic.net
- **Languages:** English (fluent / professional), Serbian (native), French (intermediate)
- **Status:** Serbian citizen — **requires EU visa sponsorship (non-EU)**. Currently an independent design-leadership consultant; actively seeking an in-house Head/Lead design role in the EU.
- **LinkedIn headline:** "Head of Design | Design Systems | Product Strategy"

### Education
<!-- List your degrees, most recent first -->
- **BA in Economics** (2002-2008) - Faculty for Business Studies, Megatrend University, Belgrade
- **Industrial Design Technician** (1995-1999) - School for Design, Belgrade

### Professional Experience
<!-- List your roles, most recent first -->
- **Design Leadership Consultant** (May 2025 - Present) - **Beyond Clicks Studio** (Independent, Belgrade — remote)
  - Senior design lead across concurrent engagements: design systems, product strategy, design-engineering workflow
  - AI-orchestrated product & tooling work; builds functional prototypes and Figma plugins
- **Head of UX/UI** (Jul 2024 - May 2025) - **Gentoo Media** (Belgrade)
  - Built a company-level design system across multi-brand products; led a cross-functional team of 7 (incl. 2 team leads); cut feature time-to-market by 25%
- **Lead UX/UI Designer** (May 2021 - Jul 2024) - **Catena Media** (acquired by Gaming Innovation Group, 2023) (Belgrade)
  - Directed end-to-end UX for high-traffic, multi-market consumer web; built a design system that cut dev time 30%
- **Senior UX/UI Designer** (Oct 2018 - May 2021) - **Catena Media** (Belgrade)
  - Led flagship redesign (+20% mobile traffic, +15% retention); drove Sketch→Figma migration; shifted team to evidence-based design
- **Interaction Designer** (Dec 2013 - Oct 2018) - **Smith Micro Software** (Belgrade)
  - UX for carrier-branded Android apps (Sprint, T-Mobile); backend/device-management tooling
- *Earlier:* UI Designer (MySkin / youngculture, 2009-13); Co-founder & CEO (Mainstream ISP, 2005-08); web design/dev (2000-05)

### Technical Skills
- **Primary:** Design systems (token architecture, multi-brand component libraries), DesignOps, product strategy, design-team leadership & mentoring, UX research & usability testing
- **Secondary:** Interaction & visual design, conversion / A-B testing & analytics (GA, VWO, HotJar), roadmap & stakeholder management, AI-orchestrated product/tooling delivery
- **Domain:** High-traffic, multi-market / multi-brand consumer web products; the design-engineering boundary
- **Software:** Figma (+ plugin development), Axure RP, HTML/CSS, PHP, JavaScript; Jira, Asana, Linear, Notion

### Certifications
<!-- List relevant certifications with dates -->
- **User Research — Methods and Best Practices** - Interaction Design Foundation - completed Jul 2017

### Publications
<!-- List peer-reviewed publications, if any -->
- None (design / leadership career) - see portfolio at rosic.net

### Awards
<!-- List relevant awards, hackathons, competitions -->
- **Best of Swiss Apps - Gold (Entertainment)** - Swisscom TV Android tablet app (2013)

### Behavioral Profile
<!-- Your behavioral assessment results (PI, DISC, Myers-Briggs, or self-assessment) -->
- **Systematic & infrastructure-minded** - frames the right problems early, builds systems (design systems, processes) that hold up and scale *[inferred from LinkedIn About]*
- **Evidence-based** - drives decisions with research, analytics, and A/B testing *[inferred from LinkedIn About]*
- **Strengths:** analytical, dependable, high initiative, combined design + business perspective, collaborative team-builder *[inferred from reference letter]*
- **Growth areas:** pivoting out of a single domain (iGaming / affiliate) into broader product sectors; building local-language depth for some EU markets
- **Thrives in:** mature product orgs where design infrastructure is connected to business outcomes; autonomy plus close cross-functional work with engineering

### What Excites You
<!-- What motivates you professionally -->
- Building design systems and design-org infrastructure that scale across markets
- Working at the design-engineering boundary, using AI (e.g. **Claude Code**) to accelerate delivery

### Target Sectors
<!-- Industries and companies you're targeting -->
- Product / SaaS & developer tools: workflow-automation, dev-platform, and product companies (non-gambling)
- Fintech, media / streaming, e-commerce / marketplaces — any mature product org with real design infrastructure
- Geographic focus: EU, primarily Germany & Netherlands; Poland / Czechia as bridges (relocation + visa sponsorship required)

### Deal-breakers
<!-- Hard constraints on job search -->
- **Gambling / betting / casino industry** — pivoting out, despite prior iGaming-affiliate experience
- Roles with **no visa sponsorship** / requiring existing EU work authorization
- Pure-maintenance roles with no mandate to build design infrastructure or lead

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`
