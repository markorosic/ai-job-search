export const BASE_URL = "https://nofluffjobs.com/api/posting"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const maxAttempts = 4
  let delay = 500
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(url, init)
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxAttempts - 1) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return response.json() as Promise<T>
  }
  throw new Error("Request failed after max retries")
}

export interface NoFluffJobSalary {
  from: number
  to: number
  type: string
  currency: string
  disclosedAt: string
  flexibleUpperBound: boolean
}

export interface NoFluffJobLocation {
  places: Array<{ city: string; country?: { code: string } }>
  fullyRemote: boolean
}

export interface NoFluffJob {
  id: string
  name: string
  title: string
  category: string
  seniority: string[]
  regions: string[]
  salary: NoFluffJobSalary | null
  location: NoFluffJobLocation
  posted: number
  url: string
}

export interface NoFluffListingResponse {
  postings: NoFluffJob[]
  totalCount: number
  totalUniqueCount: number
}

/**
 * Build the job URL from a posting slug (url field).
 */
export function jobUrl(slug: string): string {
  return `https://nofluffjobs.com/job/${slug}`
}

/**
 * Deduplicate postings: NoFluffJobs returns one entry per office city.
 * Keep the first occurrence for each (title, company) pair.
 */
export function deduplicatePostings(postings: NoFluffJob[]): NoFluffJob[] {
  const seen = new Set<string>()
  const result: NoFluffJob[] = []
  for (const p of postings) {
    const key = `${p.title}|${p.name}`
    if (!seen.has(key)) {
      seen.add(key)
      result.push(p)
    }
  }
  return result
}

export interface SearchFilters {
  regions: string[]
  category?: string
  seniorities: string[]
  remote: boolean
}

/**
 * Filter deduplicated postings client-side (all server-side query params are ignored).
 */
export function applyFilters(postings: NoFluffJob[], filters: SearchFilters): NoFluffJob[] {
  return postings.filter(p => {
    if (filters.regions.length > 0) {
      const hasRegion = p.regions.some(r => filters.regions.includes(r))
      if (!hasRegion) return false
    }
    if (filters.category && p.category !== filters.category) return false
    if (filters.seniorities.length > 0) {
      const hasSeniority = p.seniority.some(s => filters.seniorities.includes(s))
      if (!hasSeniority) return false
    }
    if (filters.remote && !p.location.fullyRemote) return false
    return true
  })
}
