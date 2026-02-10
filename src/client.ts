import type { paths } from './types/openapi/generated'
import type { EndpointPath, TypedApiResponse } from './types/endpoints'
import { buildQueryString } from './utils/query-builder'
import type { Wiki } from './types/wikis'

const DEFAULT_BASE_URL = 'https://api.liquipedia.net/api/v3'

export interface LPDBClientOptions {
  apiKey: string
  baseUrl?: string
}

// Extract query parameters type for an endpoint
type QueryParams<T extends EndpointPath> = paths[T]['get']['parameters']['query']

// Check if a key exists in the query params for an endpoint
type HasParam<T extends EndpointPath, K extends string> = K extends keyof QueryParams<T>
  ? true
  : false

// Builder class for constructing API queries
export class QueryBuilder<T extends EndpointPath> {
  private client: LPDBClient
  private readonly path: T
  private params: Record<string, string | number | undefined> = {}

  constructor(client: LPDBClient, path: T) {
    this.client = client
    this.path = path
  }

  // Common parameters available on most endpoints
  wiki(value: Wiki): this {
    this.params.wiki = value
    return this
  }

  wikis(value: Wiki[]): this {
    this.params.wikis = value.join('|')
    return this
  }

  // Standard query parameters (available on most endpoints)
  conditions(value: string): HasParam<T, 'conditions'> extends true ? this : never {
    this.params.conditions = value
    return this as HasParam<T, 'conditions'> extends true ? this : never
  }

  query(value: string): HasParam<T, 'query'> extends true ? this : never {
    this.params.query = value
    return this as HasParam<T, 'query'> extends true ? this : never
  }

  limit(value: number): HasParam<T, 'limit'> extends true ? this : never {
    this.params.limit = value
    return this as HasParam<T, 'limit'> extends true ? this : never
  }

  offset(value: number): HasParam<T, 'offset'> extends true ? this : never {
    this.params.offset = value
    return this as HasParam<T, 'offset'> extends true ? this : never
  }

  order(value: string): HasParam<T, 'order'> extends true ? this : never {
    this.params.order = value
    return this as HasParam<T, 'order'> extends true ? this : never
  }

  groupby(value: string): HasParam<T, 'groupby'> extends true ? this : never {
    this.params.groupby = value
    return this as HasParam<T, 'groupby'> extends true ? this : never
  }

  // Match-specific parameters
  rawstreams(value: 'true' | 'false'): HasParam<T, 'rawstreams'> extends true ? this : never {
    this.params.rawstreams = value
    return this as HasParam<T, 'rawstreams'> extends true ? this : never
  }

  streamurls(value: 'true' | 'false'): HasParam<T, 'streamurls'> extends true ? this : never {
    this.params.streamurls = value
    return this as HasParam<T, 'streamurls'> extends true ? this : never
  }

  // TeamTemplate-specific parameters
  template(value: string): HasParam<T, 'template'> extends true ? this : never {
    this.params.template = value
    return this as HasParam<T, 'template'> extends true ? this : never
  }

  date(value: string): HasParam<T, 'date'> extends true ? this : never {
    this.params.date = value
    return this as HasParam<T, 'date'> extends true ? this : never
  }

  // TeamTemplateList-specific parameters
  pagination(value: number): HasParam<T, 'pagination'> extends true ? this : never {
    this.params.pagination = value
    return this as HasParam<T, 'pagination'> extends true ? this : never
  }

  // Execute the query and return results
  async execute<R = Record<string, unknown>>(): Promise<TypedApiResponse<R>> {
    return this.client.executeQuery<R>(this.path, this.params)
  }

  build(): { path: T; params: Record<string, string | number | undefined> } {
    return { path: this.path, params: this.params }
  }
}

// Main client class
export class LPDBClient {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(options: LPDBClientOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  }

  // Create a query builder for the specified endpoint
  endpoint<T extends EndpointPath>(path: T): QueryBuilder<T> {
    return new QueryBuilder<T>(this, path)
  }

  // Execute a query (called by QueryBuilder)
  async executeQuery<R = Record<string, unknown>>(
    path: EndpointPath,
    params: Record<string, string | number | undefined>
  ): Promise<TypedApiResponse<R>> {
    const queryString = buildQueryString(params)
    const url = `${this.baseUrl}${path}${queryString}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Apikey ${this.apiKey}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new LPDBError(
        `API request failed with status ${response.status}`,
        response.status,
        errorData
      )
    }

    return response.json() as Promise<TypedApiResponse<R>>
  }
}

export class LPDBError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'LPDBError'
    this.status = status
    this.data = data
  }
}
