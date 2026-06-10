import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchJson, writeError, jobUrl, BASE_URL } from "../helpers.js"

interface SkillItem {
  value: string
  type: string
}

interface DetailPosting {
  id: string
  title: string
  company: { name: string; url?: string }
  basics: { category: string; seniority: string[]; technology?: string }
  location: {
    places: Array<{ city: string; country?: { code: string } }>
    fullyRemote: boolean
  }
  essentials?: Array<{ value: string; type: string }>
  requirements?: { musts?: SkillItem[]; nices?: SkillItem[]; description?: string }
  specs?: { dailyTasks?: string[] }
  regions: string[]
  defaultUrl: string
  expiresAt?: string
  posted?: number
  salary?: { from: number; to: number; currency: string; type: string } | null
}

export const detail = defineCommand({
  name: "detail",
  description: "Fetch full details for a job by slug",
  options: {
    format: option(z.enum(["json", "plain"]).default("plain"), {
      description: "Output format",
    }),
  },
  handler: async ({ flags, positionals }) => {
    const slug = positionals[0]
    if (!slug) {
      writeError("slug argument required", "MISSING_SLUG")
      process.exit(1)
    }
    try {
      const data = await fetchJson<DetailPosting>(`${BASE_URL}/${slug}`)

      if (flags.format === "json") {
        console.log(JSON.stringify(data, null, 2))
        return
      }

      const salary = data.salary
        ? `${Math.round(data.salary.from).toLocaleString()}–${Math.round(data.salary.to).toLocaleString()} ${data.salary.currency} (${data.salary.type})`
        : "not disclosed"
      const cities = (data.location?.places ?? []).map(p => p.country ? `${p.city} (${p.country.code})` : p.city).join(", ")
      const remote = data.location?.fullyRemote ? "yes" : "no"

      console.log(`${data.title}`)
      console.log(`  Company:   ${data.company?.name ?? ""}`)
      console.log(`  Location:  ${cities} | Remote: ${remote}`)
      console.log(`  Salary:    ${salary}`)
      console.log(`  Category:  ${data.basics?.category ?? ""} | Seniority: ${(data.basics?.seniority ?? []).join(", ")}`)
      console.log(`  URL:       ${jobUrl(data.defaultUrl ?? slug)}`)

      const musts = (data.requirements?.musts ?? []).map(s => s.value)
      if (musts.length > 0) console.log(`\n  Required skills: ${musts.join(", ")}`)

      const nices = (data.requirements?.nices ?? []).map(s => s.value)
      if (nices.length > 0) console.log(`  Nice-to-have:    ${nices.join(", ")}`)

      const tasks = data.specs?.dailyTasks ?? []
      if (tasks.length > 0) {
        console.log(`\n  Daily tasks:`)
        for (const t of tasks.slice(0, 5)) {
          console.log(`    - ${t.trim()}`)
        }
      }

      if (data.requirements?.description) {
        console.log(`\n${String(data.requirements.description).slice(0, 800)}`)
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "DETAIL_ERROR")
      process.exit(1)
    }
  },
})
