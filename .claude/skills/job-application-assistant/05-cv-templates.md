# CV Templates and Tailoring Guide

<!-- SETUP: Profile statements and section ordering are personalized by running /setup -->

## Template: Custom Fira Sans XeLaTeX (Single-Column)

All CVs use the custom single-column XeLaTeX `article` template with Fira Sans font and TikZ timeline asterisks with hairline connectors. Do **not** use moderncv or `main_example.tex` as a base — they use a different engine and class.

**Output file:** `applications/<company>/Marko_Rosic_CV.tex`
**Compile with:** **Tectonic** — XeTeX-based, auto-fetches packages, leaves no `.aux`/`.log` artifacts. Fira Sans must be installed as a system font (`brew install --cask font-fira-sans`).
**Canonical reference:** `cv/Marko_Rosic_CV_skyscanner.tex` — copy this as the starting point for every new tailored CV.

### Compile command

```bash
cd applications/<company> && tectonic Marko_Rosic_CV.tex
```

Expected output: a clean compile producing `Marko_Rosic_CV.pdf` (2 pages). Tectonic emits harmless "absolute path / not reproducible" font warnings — ignore them. Any page count other than 2 is a failure that must be fixed before presenting to the user.

## Document Structure

The template is a custom XeLaTeX `article` class — **not** moderncv. The canonical source is `cv/Marko_Rosic_CV_skyscanner.tex`. Copy it verbatim as the starting point, then tailor content only.

Key preamble settings (do not change without good reason):

```latex
% !TeX program = xelatex
\documentclass[a4paper,9.5pt]{article}
\usepackage{fontspec}
\setmainfont{Fira Sans}[
  BoldFont={Fira Sans Bold}, ItalicFont={Fira Sans Italic},
  BoldItalicFont={Fira Sans Bold Italic}
]
\usepackage[a4paper, top=1.5cm, bottom=1.4cm, left=1.8cm, right=1.8cm]{geometry}

% Column widths (keep in sync — \cvcontcol is derived automatically)
\newlength{\cvdatecol}  \setlength{\cvdatecol}{2.75cm}
\newlength{\cvsymcol}   \setlength{\cvsymcol}{0.5cm}
\newlength{\cvcontcol}  \setlength{\cvcontcol}{\dimexpr\textwidth-\cvdatecol-\cvsymcol\relax}

% Section spacing
\titlespacing*{\section}{0pt}{22pt}{12pt}
```

Entry macros — use `\cventry` for roles without a context note, `\cventrynote` when a parenthetical company explanation is needed:

```latex
\cventry{DATE}{TITLE}{COMPANY/LOCATION}
\cventrynote{DATE}{TITLE}{COMPANY/LOCATION}{Context note in italic gray}
```

Bullet lists inside entries use the `cvitems` environment:

```latex
\begin{cvitems}
  \item ...
\end{cvitems}
```

Skills use a two-column `minipage` layout with `\skillblock{Category}{Items}`.

### Spacing inside itemize lists (important)

**Do not place `\vspace{...}` between `\item` entries in a `cvitems` list.** It creates paragraph breaks that interact unpredictably with `\itemsep`, producing one oversized gap. Use the list's native `itemsep=3pt` uniform spacing instead.

### Spacing inside itemize lists (important)

**Do not place `\vspace{...}` between `\item` entries in an `itemize` list.** Even though the source looks symmetric, this pattern occasionally produces a noticeably oversized gap before a single item: the inter-item `\vspace` creates a paragraph break that interacts unpredictably with the list's internal `\itemsep`, so LaTeX renders one of the gaps wider than the rest. Remove the inter-item `\vspace` and let `itemize` use its native uniform spacing.

```latex
% WRONG - intermittently produces an oversized gap before one bullet
\begin{itemize}
\item \textbf{Foo}: ...
\vspace{1pt}
\item \textbf{Bar}: ...
\vspace{1pt}
\item \textbf{Baz}: ...
\end{itemize}

% RIGHT - uniform spacing using the list's native itemsep
\begin{itemize}
\item \textbf{Foo}: ...
\item \textbf{Bar}: ...
\item \textbf{Baz}: ...
\end{itemize}
```

Two related patterns are fine and should be kept:
- `\vspace{1pt}` immediately after `\section{...}` (between section heading and first item) - this is between the heading and the list, not between list items.
- `\vspace{3pt}` between top-level `\cventry` blocks in Professional Experience or Education - this gives breathing room between roles and renders consistently.

## Section-by-Section Tailoring

### Profile Statement / Elevator Pitch (Best Practice)
This is the most important section to customize. It appears right after `\makecvtitle`.

Write 5-7 lines that function as an "elevator pitch": a concise, compelling introduction explaining why you're qualified for *this specific role*. Focus on what the employer gains from hiring you.

**Create 2-3 profile statement templates for your main role types:**

<!-- SETUP: These are populated based on your background -->
**For Head of Design / Head of UX roles:**
> Product design leader with 15+ years scaling digital products at the intersection of design and engineering. I build company-level design systems that cut engineering overhead (dev time −30%, time-to-market −25%) and grow design teams that operate without hand-holding — most recently leading a cross-functional team of seven. I connect design infrastructure to business outcomes and operate comfortably at the design-engineering boundary, using AI (including Claude Code) to accelerate delivery. *[Tailor the domain/metric emphasis to the posting; lead with systems + leadership for Head roles.]*

**For Design Lead / Lead Product Designer roles:**
> Lead product designer and design-systems specialist with 15+ years across high-traffic, multi-market consumer web. I build scalable design systems and drive evidence-based design (research, analytics, A/B testing) into the product process, and I close the design-engineering gap directly through functional prototypes and Figma plugins. I bring hands-on craft plus the judgment to set direction and mentor a team. *[For IC-leaning Lead roles, foreground craft + systems over people management.]*

### Core Competencies / Skills Section (Best Practice)
Reorder and emphasize based on the role. Use bold category labels.

List **5-7 key competencies** in bullet format, tailored to the specific job. For each competency, briefly explain how it adds value to the position.

### Education
- Always include your highest degrees
- For senior roles, keep education brief (dates and titles only)
- Include thesis topics when relevant to the target role

### Professional Experience
- Rewrite bullet points to emphasize aspects most relevant to the target role
- Use 4-6 bullets for most recent role, 3-4 for previous, 2-3 for older
- **Emphasize measurable results** where possible: "Reduced processing time by X%", "Model adopted by the team"

### Handling Employment Gaps (Best Practice)
If there is a gap in your employment history:
- The gap should be explained matter-of-factly if needed
- Describe how professional development continued during the gap
- Frame as deliberate skill-building and career repositioning

### Publications
- Include Google Scholar link if applicable
- Select 3-4 most relevant publications (not always all of them)
- For non-academic roles, keep brief

### Honors and Awards
- Keep format brief, one line each

### References
- List 2-4 references with name, title, company, and contact
- End with: "More references are available upon request."
- **Do not attach reference letters** - employers typically contact references directly

## Compile-and-Inspect Loop (MANDATORY)

After writing the CV and before presenting to the user, always compile and visually inspect the PDF. Iterate until the layout is clean. Workflow:

1. Run `cd cv && tectonic Marko_Rosic_CV_<company>.tex`
2. Check the output page count: must be exactly 2
3. Read the PDF via the Read tool and visually inspect both pages
4. Check for **orphaned entries**: a `\cventry` title line must never sit alone at the bottom of page 1 with its bullets on page 2

### Fixing common page-break problems

**Problem: entry title on page 1, bullets orphaned to page 2**
Add `\needspace{5\baselineskip}` immediately before the problematic `\cventry`:
```latex
\needspace{5\baselineskip}
\item{\cventry{YEAR--YEAR}{Role Title}{Organization}{Location}{}{...}}
```
Include `\usepackage{needspace}` in the preamble.

**Problem: one trailing section spills to page 3 (e.g., References alone on page 3)**
Add `\enlargethispage{2-3\baselineskip}` before a late section (e.g., before `\section{Honors and Awards}`) to stretch page 2 by a few lines. This is the standard LaTeX rescue for near-miss overflows.

**Problem: 3 pages with significant content on page 3**
Cut content — do not compress geometry or `\vspace`. See "Relevance-weighted cutting" below for the rule.

**Problem: content finishes early on page 2 (feels thin)**
Restore the highest-relevance item that was previously cut — a CV that ends mid-page 2 looks incomplete.

## Page Budget - Hard 2-Page Limit

The CV **must** fit on exactly 2 pages when compiled. Use these content limits as a guide:

| Section | Max budget |
|---------|-----------|
| Profile statement | 3-4 lines |
| Skills | 5 items, each 1-2 lines |
| Most recent role | 4-5 bullets |
| Previous role | 2-3 bullets |
| Older roles | 2 bullets (1 line each) |
| Education | 2-3 entries |
| Publications | 2-3 entries |
| Awards | 3 entries, single line each |
| References | "Available upon request." (single line) |

**If in doubt, cut rather than squeeze.** Reducing `\vspace` or geometry scale to force-fit content makes the CV look cramped.

## Relevance-weighted cutting (the right way to shrink a CV)

**Cut by signal, not by section.** Static priority lists ("remove oldest education first, then shorten the earliest role...") are wrong when a relevant "lower-priority" item is competing with an irrelevant "higher-priority" item. An older-role bullet that speaks directly to the posting is worth more than a recent-role bullet that does not.

For every candidate line, score three things:

1. **Relevance to THIS posting** — does the line hit a named tool, keyword, or stated responsibility in the job ad?
2. **Uniqueness** — is it the only place this claim appears, or is it duplicated elsewhere in the CV?
3. **Narrative load** — does the cover letter depend on it? If cutting the line would force you to rewrite a cover-letter paragraph, it is load-bearing.

Cut the lowest-total-score line first, regardless of which section it sits in.

### Practical order of cuts (easiest → last resort)

1. **Redundancy.** If an achievement appears in both Core Competencies AND a role bullet, the Core Competencies version is usually the cleaner cut (the experience bullet is more concrete evidence).
2. **Profile-statement fluff.** A sentence that just restates what Publications or Skills will show. ("Peer-reviewed publications on X..." is already a Publications entry — profile can claim it once and stop.)
3. **Low-relevance experience bullets.** A bullet about work that does not touch posting keywords, wherever it sits. This cuts across sections before touching the structural list.
4. **Low-relevance supporting content.** An older-role bullet that does not speak to the target role. A certification that does not touch the posting's stack. A language entry that can be condensed to one line.
5. **Low-relevance publications.** Keep 1-2 publications that best match the posting. Cut the rest before touching experience bullets.
6. **Last-resort structural cuts.** Oldest education entry, tightening an older role to 2 bullets, collapsing Certifications into a single line. These only happen if the relevance-weighted cuts above have already been exhausted.

### Pitfalls to avoid

- Do not mechanically cut from the bottom of a static section list without checking relevance. "Cut the oldest role first" is wrong if that role is literally about the skill the posting asks for.
- Do not cut the one concrete example the cover letter leans on. Relevance is measured against the cover letter you wrote, not just the job posting — interviewers will have read both.
- Do not cut to fit if the fit is borderline (2.02 pages). Prefer `\enlargethispage{2-3\baselineskip}` on a late section for near-misses; reserve content cuts for genuine overflow (content on page 3 that is more than a single trailing section).

## Recommended Section Order

The section order varies by role type:

**For technical / data science / ML roles:**
1. Profile statement / elevator pitch
2. Core competencies / Skills
3. Professional Experience (reverse chronological)
4. Education (reverse chronological)
5. Languages
6. Publications & Awards
7. References

**For domain-specific / specialist roles:**
1. Profile statement / elevator pitch
2. Core competencies / Skills
3. Education (reverse chronological) - credentials are a key qualifier
4. Professional Experience (reverse chronological)
5. Publications & Awards
6. References
