// Query type as provided
export type Query<Options, _Response> = (options: Options) => {
  route: string
  searchParams: Record<string, string | number | boolean>
}

export type ExtractQueryResponse<T> = T extends Query<
  infer _Options,
  infer Response
>
  ? Response
  : never

export type Resource<Queries extends Record<string, Query<unknown, unknown>>> =
  {
    [K in keyof Queries]: (
      options: Parameters<Queries[K]>[0]
    ) => Promise<ExtractQueryResponse<Queries[K]>>
  }

type API<TResources extends Record<string, Resource<any>>> = TResources

export interface APIBuilder {
  // Method to set the base URL (chainable)
  useBaseUrl(url: string): this

  // Method to add a resource with name and config, where config has queries and mutations
  addResource<TQueries extends Record<string, Query<unknown, unknown>>>(
    name: string,
    config: {
      queries: TQueries
      // You can extend this with mutations or other properties if needed
    }
  ): this
}

// APIBuilder class definition with dynamic typing for resources
export class APIBuilder<TResources extends Record<string, Resource<any>> = {}>
  implements APIBuilder<TResources>
{
  baseUrl: string = ""
  resources: TResources = {} as TResources

  /**
   * Set's the baseURL for all queries and mutations
   */
  useBaseUrl(url: string): this {
    this.baseUrl = url
    return this
  }

  // Method to add a resource to the APIBuilder, dynamically adds methods to `this`
  addResource<
    Name extends string,
    TQueries extends Record<string, Query<any, any>>
  >(
    name: Name,
    config: { queries: TQueries }
  ): APIBuilder<TResources & { [K in Name]: Resource<TQueries> }> {
    const resource: any = {}

    // for (const [key, queryFn] of Object.entries(config.queries)) {
    //   resource[key] = async (options: any) => {
    //     const { route, searchParams } = queryFn(options)
    //     const url = `${this.baseUrl}${route}.toString()}`

    //     console.log(`Fetching from: ${url}`)
    //     return {} as ReturnType<typeof queryFn> // Replace with actual API call logic
    //   }
    // }

    // Dynamically add the resource to the resources object

    return Object.assign(this, { [name]: resource })
  }

  build(): API<TResources> {
    return Object.freeze(this.resources)
  }
}
