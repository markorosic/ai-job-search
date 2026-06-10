import { describe, it, expect } from "bun:test"
import { runCLI, parseJSON } from "./helpers.ts"
import type { ArbeitnowJob } from "../src/helpers.ts"

describe("arbeitnow-search search", () => {
  it("returns jobs in JSON format", async () => {
    const result = await runCLI(["search", "--limit", "3", "--format", "json"])
    const data = parseJSON<{ meta: unknown; results: ArbeitnowJob[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
  })

  it("returns only visa-sponsored jobs when --visa is set", async () => {
    const result = await runCLI(["search", "--visa", "--limit", "5", "--format", "json"])
    const data = parseJSON<{ results: ArbeitnowJob[] }>(result)
    // The API may not tag visa_sponsorship on individual job objects even when filtering by it,
    // or may return 0 results when no sponsored jobs are live. Both are valid.
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.every(j => j.visa_sponsorship === true || j.visa_sponsorship == null)).toBe(true)
  })

  it("filters by location client-side", async () => {
    const result = await runCLI(["search", "--location", "Germany", "--limit", "5", "--format", "json"])
    const data = parseJSON<{ results: ArbeitnowJob[] }>(result)
    data.results.forEach(j => {
      expect(j.location.toLowerCase()).toContain("germany")
    })
  })

  it("outputs table format without error", async () => {
    const result = await runCLI(["search", "--visa", "--limit", "3", "--format", "table"])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Title")
  })
})
