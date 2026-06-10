import { describe, it, expect } from "bun:test"
import { runCLI, parseJSON } from "./helpers.ts"

interface SearchResult {
  id: string
  title: string
  companyName: string
  category: string
  seniority: string[]
  regions: string[]
  remote: boolean
  jobUrl: string
}

interface SearchOutput {
  totalFound: number
  results: SearchResult[]
}

describe("nofluffjobs-search search", () => {
  it("returns jobs for Poland region", async () => {
    const result = await runCLI(["search", "--region", "pl", "--limit", "3", "--format", "json"])
    const data = parseJSON<SearchOutput>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
    expect(data.results.every(j => j.regions.includes("pl"))).toBe(true)
  })

  it("ux category returns results", async () => {
    const result = await runCLI(["search", "--region", "pl", "--category", "ux", "--limit", "10", "--format", "json"])
    const data = parseJSON<SearchOutput>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.every(j => j.category === "ux")).toBe(true)
  })

  it("table format outputs without error", async () => {
    const result = await runCLI(["search", "--region", "pl", "--limit", "5", "--format", "table"])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Title")
  })
})
