import { describe, it, expect } from "bun:test"
import { runCLI, parseJSON } from "./helpers.ts"
import type { EuresVacancy } from "../src/helpers.ts"

describe("eures-search search", () => {
  it("returns vacancies for Germany", async () => {
    const result = await runCLI(["search", "--countries", "de", "--limit", "3", "--format", "json"])
    const data = parseJSON<{ total: number; results: EuresVacancy[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
    expect(typeof data.total).toBe("number")
    expect(data.total).toBeGreaterThan(0)
  })

  it("keyword filter returns results", async () => {
    const result = await runCLI([
      "search",
      "--countries", "de",
      "--countries", "nl",
      "--keywords", "design",
      "--limit", "5",
      "--format", "json",
    ])
    const data = parseJSON<{ total: number; results: EuresVacancy[] }>(result)
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.total).toBeGreaterThan(0)
  })

  it("table format outputs without error", async () => {
    const result = await runCLI(["search", "--countries", "de", "--limit", "3", "--format", "table"])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("Title")
  })
})
