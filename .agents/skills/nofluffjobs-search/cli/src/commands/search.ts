import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import {
  fetchJson,
  writeError,
  deduplicatePostings,
  applyFilters,
  jobUrl,
  type NoFluffJob,
  type NoFluffListingResponse,
  LISTING_URL,
} from "../helpers.js"

function formatSalary(job: NoFluffJob): string {
  if (!job.salary) return "not disclosed"
  const { from, to, currency } = job.salary
  return `${Math.round(from).toLocaleString()}–${Math.round(to).toLocaleString()} ${currency}`
}

function formatLocations(job: NoFluffJob): string {
  const cities = (job.location.places ?? []).slice(0, 2).map(p => p.city ?? "")
  const suffix = (job.location.places ?? []).length > 2 ? ` +${(job.location.places ?? []).length - 2}` : ""
  return cities.join(", ") + suffix
}

function formatTable(jobs: NoFluffJob[]): void {
  console.log(`${"Title".padEnd(45)} | ${"Company".padEnd(28)} | ${"Salary".padEnd(28)} | Remote`)
  console.log(`${"-".repeat(45)}-+-${"-".repeat(28)}-+-${"-".repeat(28)}-+-------`)
  for (const j of jobs) {
    const salary = formatSalary(j)
    const remote = j.location.fullyRemote ? "yes" : "no"
    console.log(
      `${j.title.slice(0, 45).padEnd(45)} | ${j.name.slice(0, 28).padEnd(28)} | ${salary.slice(0, 28).padEnd(28)} | ${remote}`
    )
  }
}

export const search = defineCommand({
  name: "search",
  description: "Search NoFluffJobs listings (Poland/Czechia tech jobs with salary data)",
  options: {
    region: option(z.array(z.string()).optional(), {
      description: "Region code: pl, cz, hu, sk (repeatable)",
      repeatable: true,
    }),
    category: option(z.string().optional(), {
      description: "Job category: ux, backend, frontend, fullstack, devops, data, mobile, testing, security, productManagement, projectManager, artificialIntelligence",
    }),
    seniority: option(z.array(z.string()).optional(), {
      description: "Seniority level: Junior, Mid, Senior, Expert (repeatable)",
      repeatable: true,
    }),
    remote: option(z.boolean().optional(), {
      description: "Show only fully-remote jobs",
      argumentKind: "flag",
    }),
    limit: option(z.coerce.number().default(20), { description: "Max results to display" }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), {
      description: "Output format",
    }),
  },
  handler: async ({ flags }) => {
    try {
      const data = await fetchJson<NoFluffListingResponse>(LISTING_URL)
      const unique = deduplicatePostings(data.postings ?? [])

      const regions = flags.region ?? []
      const seniorities = flags.seniority ?? []

      const filtered = applyFilters(unique, {
        regions,
        category: flags.category,
        seniorities,
        remote: flags.remote ?? false,
      })

      const jobs = filtered.slice(0, flags.limit)

      if (flags.format === "table") {
        console.log(`Found ${filtered.length} jobs (showing ${jobs.length})`)
        formatTable(jobs)
        return
      }

      if (flags.format === "plain") {
        for (const j of jobs) {
          const salary = formatSalary(j)
          const locations = formatLocations(j)
          console.log(`${j.title}`)
          console.log(`  Company:  ${j.name}`)
          console.log(`  Location: ${locations} | Remote: ${j.location.fullyRemote ? "yes" : "no"}`)
          console.log(`  Salary:   ${salary}`)
          console.log(`  Category: ${j.category} | Seniority: ${j.seniority.join(", ")}`)
          console.log(`  URL:      ${jobUrl(j.url)}`)
          console.log()
        }
        return
      }

      const results = jobs.map(j => ({
        id: j.id,
        title: j.title,
        companyName: j.name,
        category: j.category,
        seniority: j.seniority,
        regions: j.regions,
        remote: j.location.fullyRemote,
        locations: j.location.places.map(p => p.country ? `${p.city} (${p.country.code})` : p.city),
        salaryMin: j.salary?.from ?? null,
        salaryMax: j.salary?.to ?? null,
        salaryCurrency: j.salary?.currency ?? null,
        salaryType: j.salary?.type ?? null,
        postedAt: new Date(j.posted).toISOString().slice(0, 10),
        jobUrl: jobUrl(j.url),
      }))

      console.log(JSON.stringify({ totalFound: filtered.length, results }, null, 2))
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "SEARCH_ERROR")
      process.exit(1)
    }
  },
})
