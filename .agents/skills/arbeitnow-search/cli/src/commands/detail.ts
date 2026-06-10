import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { fetchHtml, writeError, stripHtml, BASE_URL } from "../helpers.js"

function extractJsonLd(html: string): Record<string, unknown> | null {
  const match = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)
  if (!match) return null
  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

export const detail = defineCommand({
  name: "detail",
  description: "Fetch full details for a job by slug",
  options: {
    format: option(z.enum(["json", "plain"]).default("plain"), { description: "Output format" }),
  },
  handler: async ({ flags, positionals }) => {
    const slug = positionals[0]
    if (!slug) {
      writeError("slug argument required", "MISSING_SLUG")
      process.exit(1)
    }
    try {
      const url = `${BASE_URL}/jobs/${slug}`
      const html = await fetchHtml(url)
      const ld = extractJsonLd(html)

      if (flags.format === "json") {
        console.log(JSON.stringify(ld ?? { slug, url, error: "no JSON-LD found" }, null, 2))
        return
      }

      if (ld) {
        const title = String(ld.title ?? "")
        const company = (ld.hiringOrganization as Record<string, unknown>)?.name ?? ""
        const location = (ld.jobLocation as Record<string, unknown>)?.address ?? ld.jobLocation ?? ""
        const description = ld.description ? stripHtml(String(ld.description)).slice(0, 1000) : ""
        const applyUrl = String(ld.url ?? ld.applicationContact ?? url)
        console.log(`${title}`)
        console.log(`Company: ${company}`)
        console.log(`Location: ${JSON.stringify(location)}`)
        console.log(`Apply: ${applyUrl}`)
        console.log()
        console.log(description)
      } else {
        console.log(`No structured data found for slug: ${slug}`)
        console.log(`URL: ${url}`)
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "DETAIL_ERROR")
      process.exit(1)
    }
  },
})
