import { Query, APIBuilder } from "./test"

type Graph = { kind: "Graph" }
type BoundingBox = { kind: "boundingBox" }

/**
 * It should be possible to:
 * - Base options such as:
 *   - Base URL
 *   - Base Headers
 *
 * - Run a fetch request that does not return anything, thus not having to be parsed to json.
 * - Map function on the endpoint definition that can map the response into something else, affecting the return type.
 * - Custom error handling?
 *
 * Nice to have
 * - Response schema validation with Zod
 * - Split on mutations and queries, queries cant have bodies, mutations can.
 */

// Example options and response types
type GetGraphOptions = {
  id: string
  active: boolean
}

type GetGraphResponse = {
  id: string
}

// Query function definition
const getGraphById: Query<GetGraphOptions, GetGraphResponse> = (options) => ({
  route: `/graph/${options.id}`,
  searchParams: {
    active: options.active,
  },
})

const api = new APIBuilder()
  .useBaseUrl("https://api.example.com")
  .addResource("graph", {
    queries: {
      getById: getGraphById,
    },
  })
  .build()

const graph = api.graph.getById({ id: "", active: false })
