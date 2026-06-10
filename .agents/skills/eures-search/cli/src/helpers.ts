export const SEARCH_URL = "https://europa.eu/eures/api/jv-searchengine/public/jv-search/search"
export const DETAIL_BASE_URL = "https://europa.eu/eures/api/jv-searchengine/public/jv/id"

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

// Each keyword is an object with a keyword string and a search scope code.
// The API's specificSearchCode must be "EVERYWHERE", "TITLE", or "DESCRIPTION".
export interface EuresKeyword {
  keyword: string
  specificSearchCode: "EVERYWHERE" | "TITLE" | "DESCRIPTION"
}

// locationMap keys are uppercase ISO-2 country codes (e.g. "DE", "NL").
// Values are arrays of NUTS region codes.
export interface EuresVacancy {
  id: string
  title: string
  description: string
  employer: { name: string; website?: string } | null
  locationMap: Record<string, string[]>
  creationDate: number
  lastModificationDate: number
  positionScheduleCodes?: string[]
  positionOfferingCode?: string
  numberOfPosts?: number
  euresFlag?: boolean
  availableLanguages?: string[]
}

export interface EuresSearchResponse {
  numberRecords: number
  jvs: EuresVacancy[]
  facets: Record<string, unknown> | null
}

export interface EuresSearchBody {
  keywords?: EuresKeyword[]
  locationCodes?: string[]
  resultsPerPage?: number
  page?: number
}

async function withRetry<T>(fn: () => Promise<Response>): Promise<T> {
  const maxAttempts = 4
  let delay = 500
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fn()
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

export async function postSearch(body: EuresSearchBody): Promise<EuresSearchResponse> {
  return withRetry<EuresSearchResponse>(() =>
    fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    })
  )
}

export async function getDetail(id: string, lang = "en"): Promise<Record<string, unknown>> {
  const maxAttempts = 4
  let delay = 500
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(
      `${DETAIL_BASE_URL}/${encodeURIComponent(id)}?requestLang=${lang}&preferredLang=${lang}`,
      { headers: { "Accept": "application/json" } }
    )
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxAttempts - 1) throw new Error(`Request failed: ${response.status}`)
      await new Promise(r => setTimeout(r, delay + Math.floor(Math.random() * 500)))
      delay = Math.min(delay * 2, 5000)
      continue
    }
    if (response.status === 404) throw new Error(`Vacancy ${id} not found`)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json() as Promise<Record<string, unknown>>
  }
  throw new Error("Request failed after max retries")
}
