export const BASE_URL = "https://www.arbeitnow.com"
export const API_URL = `${BASE_URL}/api/job-board-api`

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
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

export async function fetchHtml(url: string): Promise<string> {
  const maxAttempts = 4
  let delay = 500
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; arbeitnow-cli/1.0)" },
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxAttempts - 1) throw new Error(`Request failed: ${response.status}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (response.status === 404) throw new Error("Job not found")
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

export interface ArbeitnowJob {
  slug: string
  company_name: string
  title: string
  description: string
  remote: boolean
  url: string
  tags: string[]
  job_types: string[]
  location: string
  created_at: number
  visa_sponsorship: boolean
}

export interface ArbeitnowResponse {
  data: ArbeitnowJob[]
  links: { first: string; last: string; prev: string | null; next: string | null }
  meta: { current_page: number; per_page: number; from: number; to: number }
}
