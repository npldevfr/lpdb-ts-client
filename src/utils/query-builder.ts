/**
 * Builds a query string from an object of parameters.
 * @param params
 * @returns The constructed query string, starting with '?' if there are parameters, otherwise an empty string.
 */
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}
