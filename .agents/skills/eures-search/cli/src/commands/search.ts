import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import {
  postSearch,
  writeError,
  type EuresVacancy,
  type EuresKeyword,
} from "../helpers.js"

function locationString(v: EuresVacancy): string {
  const countries = Object.keys(v.locationMap ?? {})
  return countries.join(", ")
}

function formatTable(vacancies: EuresVacancy[]): void {
  console.log(`${"Title".padEnd(50)} | ${"Employer".padEnd(30)} | Country`)
  console.log(`${"-".repeat(50)}-+-${"-".repeat(30)}-+--------`)
  for (const v of vacancies) {
    const employer = v.employer?.name ?? "(unknown)"
    const loc = locationString(v)
    console.log(
      `${v.title.slice(0, 50).padEnd(50)} | ${employer.slice(0, 30).padEnd(30)} | ${loc}`
    )
  }
}

export const search = defineCommand({
  name: "search",
  description: "Search EURES EU job portal",
  options: {
    countries: option(z.array(z.string()).optional(), {
      description: "ISO-2 country codes: de, nl, pl, cz (repeatable)",
      repeatable: true,
    }),
    keywords: option(z.array(z.string()).optional(), {
      description: "Keyword search (repeatable)",
      repeatable: true,
    }),
    page: option(z.coerce.number().default(1), { description: "Page number (1-indexed)" }),
    limit: option(z.coerce.number().default(10), { description: "Results per page" }),
    format: option(z.enum(["json", "table", "plain"]).default("json"), {
      description: "Output format",
    }),
  },
  handler: async ({ flags }) => {
    try {
      const countries = flags.countries ?? ["de", "nl"]
      const keywordList: string[] = flags.keywords
        ? Array.isArray(flags.keywords)
          ? flags.keywords
          : [flags.keywords]
        : []

      const keywords: EuresKeyword[] = keywordList.map(kw => ({
        keyword: kw,
        specificSearchCode: "EVERYWHERE",
      }))

      const body = {
        ...(keywords.length > 0 ? { keywords } : {}),
        locationCodes: countries,
        resultsPerPage: flags.limit,
        page: flags.page,
      }

      const resp = await postSearch(body)
      const vacancies = resp.jvs ?? []

      if (flags.format === "table") {
        console.log(`Found ${resp.numberRecords} total (showing ${vacancies.length})`)
        formatTable(vacancies)
      } else if (flags.format === "plain") {
        for (const v of vacancies) {
          const loc = locationString(v)
          const employer = v.employer?.name ?? "(unknown)"
          const posted = v.creationDate
            ? new Date(v.creationDate).toISOString().slice(0, 10)
            : "unknown"
          console.log(v.title)
          console.log(`  Employer: ${employer}`)
          console.log(`  Location: ${loc}`)
          console.log(`  ID: ${v.id} | Posted: ${posted}`)
          console.log()
        }
      } else {
        console.log(
          JSON.stringify({ total: resp.numberRecords, results: vacancies }, null, 2)
        )
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "SEARCH_ERROR")
      process.exit(1)
    }
  },
})
