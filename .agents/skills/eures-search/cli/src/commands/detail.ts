import { defineCommand, option } from "@bunli/core"
import { z } from "zod"
import { getDetail, writeError, stripHtml } from "../helpers.js"

export const detail = defineCommand({
  name: "detail",
  description: "Fetch full details for a vacancy by ID",
  options: {
    format: option(z.enum(["json", "plain"]).default("plain"), {
      description: "Output format",
    }),
    lang: option(z.string().default("en"), {
      description: "Preferred language for the vacancy (ISO-2, default: en)",
    }),
  },
  handler: async ({ flags, positional }) => {
    const id = positional[0]
    if (!id) {
      writeError("id argument required", "MISSING_ID")
      process.exit(1)
    }
    try {
      const data = await getDetail(id, flags.lang)

      if (flags.format === "json") {
        console.log(JSON.stringify(data, null, 2))
        return
      }

      // Plain text rendering using the preferred (or first available) jvProfile
      const jvProfiles = data.jvProfiles as Record<string, Record<string, unknown>> | undefined
      const langKey =
        jvProfiles && flags.lang in jvProfiles
          ? flags.lang
          : jvProfiles
            ? Object.keys(jvProfiles)[0]
            : undefined

      const profile = langKey && jvProfiles ? jvProfiles[langKey] : undefined

      const title = String(profile?.title ?? data.id ?? id)
      const employer = (profile?.employer as Record<string, unknown>)?.name ?? ""
      const locations = profile?.locations as Array<Record<string, unknown>> | undefined
      const locationStr = locations
        ? locations
          .map(l => [l.cityName, l.countryCode].filter(Boolean).join(", "))
          .join(" / ")
        : ""

      console.log(title)
      if (employer) console.log(`  Employer: ${employer}`)
      if (locationStr) console.log(`  Location: ${locationStr}`)

      const desc = profile?.description
      if (desc) {
        console.log()
        console.log(stripHtml(String(desc)).slice(0, 800))
      }
    } catch (err) {
      writeError(err instanceof Error ? err.message : String(err), "DETAIL_ERROR")
      process.exit(1)
    }
  },
})
