import { ApiClientOptions } from "./api/client"
import { initApiBuilder } from "./api/init"
import { Middleware } from "./api/middleware"

export * from "./core/composition"
export * from "./core/currying"
export * from "./core/identity"
export * from "./core/unit"
export * from "./core/void"

type User = {
  accessToken: string
}

type ApiContext = {
  user?: User
}

/**
 *
 */
function createApiContext(opts: { user?: User }): ApiContext {
  return {
    user: opts.user,
  }
}

/**
 *
 */
export const apiBuilder = initApiBuilder<ApiContext>()

/**
 *
 */
export const createApiResource = apiBuilder.resource

/**
 *
 */
export const createApiInitializer = apiBuilder.initializer

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

/**
 * @todo - middleware factory that is exposed from the apiBuilder to fix issues with types.
 */
const timingMiddleware: Middleware<
  ReturnType<typeof createApiContext>,
  any,
  any
> = async (opts) => {
  console.log("[TimingMiddleware] opts", opts)

  const start = Date.now()
  const result = await opts.next()
  const duration = Date.now() - start
  console.log(`[API Request] ${opts.path} took ${duration}ms`)
  return result
}

const authMiddleware: Middleware<
  ReturnType<typeof createApiContext>,
  any,
  any
> = async (opts) => {
  console.log("[AuthMiddleware] opts", opts)

  console.log("auth", opts.ctx)

  if (!opts.ctx.user) {
    throw new Error("Unauthenticated!")
  }

  return opts.next()
}

const publicApiRequest = apiBuilder.request.use(timingMiddleware)

const authenticatedApiRequest = apiBuilder.request
  .use(timingMiddleware)
  .use(authMiddleware)

const todoResource = createApiResource({
  get: authenticatedApiRequest
    .input<{ id: number }>()
    .output<{ userId: number; id: number; title: string; completed: boolean }>()
    .request(({ ctx, input }) => {
      return {
        method: "GET",
        path: `/todos/${input.id}`,
      }
    }),
})

/**
 *
 *
 *
 *
 *
 *
 *
 *
 * Create the resource and initializer
 */

/**
 * The merged resources for the application api
 *
 * All resources created in /api/resources should be added here
 */
const appResources = createApiResource({
  todo: todoResource,
})

export type AppResources = typeof appResources

/**
 * Create an initializer that can be used to create the client by passing the context and options
 */
const initApiClient = createApiInitializer(appResources)

const apiClientOptions: ApiClientOptions = {
  baseUrl: "https://jsonplaceholder.typicode.com",
  baseHeaders: {},
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 * Build the API (can be done in plain JavaScript, or from a ReactContext, and exposed through there)
 */
const api = initApiClient(
  createApiContext({ user: { accessToken: "123" } }),
  apiClientOptions
)

api.todo
  .get({ id: 1 })
  .then(console.log)
  .catch((e) => (e instanceof Error ? console.log(e.message) : console.log(e)))

/**
 * @todo - allow custom fetch function that gets access to the request data
 */
