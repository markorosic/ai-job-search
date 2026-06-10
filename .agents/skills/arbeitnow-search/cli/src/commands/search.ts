import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchJson, writeError, type ArbeitnowResponse, type ArbeitnowJob, API_URL } from "../helpers.js"

function formatTable(jobs: ArbeitnowJob[]): void {
  console.log(`${"VISA".padEnd(4)} | ${"Title".padEnd(50)} | ${"Company".padEnd(30)} | Location`)
  console.log(`${"-".repeat(4)}-+-${"-".repeat(50)}-+-${"-".repeat(30)}-+-${"-".repeat(25)}`)
  for (const j of jobs) {
    const visa = j.visa_sponsorship ? "✓" : " "
    console.log(`${visa.padEnd(4)} | ${j.title.slice(0, 50).padEnd(50)} | ${j.company_name.slice(0, 30).padEnd(30)} | ${j.location.slice(0, 25)}`)
  }
}

export const search = defineCommand({
  name: "search",
  description: "Search Arbeitnow job listings",
  options: {
    visa: option(z.boolean().optional(), { description: "Only visa-sponsored jobs", argumentKind: "flag" }),
    remote: option(z.boolean().optional(), { description: "Remote-only jobs", argumentKind: "flag" }),
    location: option(z.string().optional(), { description: "Client-side location filter (e.g. Germany, Berlin)" }),
    tags: option(z.string().optional(), { description: "Tag filter (repeatable)", repeatable: true }),
    page: option(z.coerce.number().default(1), { description: "Page number" }),
    limit: option(z.coerce.number().optional(), { description: "Max results to return" }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), { description: "Output format" }),
  },
  handler: async ({ flags }) => {
    try {
      const params = new URLSearchParams()
      params.set("page", String(flags.page))
      if (flags.visa) params.set("visa_sponsorship", "true")
      if (flags.remote) params.set("remote", "true")
      if (flags.tags) {
        const tagList = Array.isArray(flags.tags) ? flags.tags : [flags.tags]
        for (const t of tagList) params.append("tags[]", t)
      }

      const data = await fetchJson<ArbeitnowResponse>(`${API_URL}?${params.toString()}`)
      let jobs = data.data

      if (flags.location) {
        const loc = flags.location.toLowerCase()
        jobs = jobs.filter(j => j.location.toLowerCase().includes(loc))
      }
      if (flags.limit) {
        jobs = jobs.slice(0, flags.limit)
      }

      if (flags.format === "table") {
        console.log(`Found ${jobs.length} jobs (page ${data.meta.current_page})`)
        formatTable(jobs)
      } else if (flags.format === "plain") {
        for (const j of jobs) {
          console.log(`${j.title}`)
          console.log(`  Company: ${j.company_name}`)
          console.log(`  Location: ${j.location}`)
          console.log(`  Visa: ${j.visa_sponsorship ? "yes" : "no"} | Remote: ${j.remote ? "yes" : "no"}`)
          console.log(`  Tags: ${j.tags.join(", ")}`)
          console.log(`  URL: ${j.url}`)
          console.log()
        }
      } else {
        console.log(JSON.stringify({ meta: data.meta, results: jobs }, null, 2))
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "SEARCH_ERROR")
      process.exit(1)
    }
  },
})
