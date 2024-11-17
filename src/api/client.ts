import { AnyRequest, InferRequestInput, InferRequestOutput } from "./request"
import { BuiltResource, ResourceRecord } from "./resource"

export type InitApiClient<TContext, TRecord extends ResourceRecord> = (
  ctx: TContext,
  opts?: ApiClientOptions
) => InitializedApiClient<TRecord>

export interface ApiClientOptions {
  baseUrl?: string
  baseHeaders?: HeadersInit
}

export type InitializedApiClient<TRecord extends ResourceRecord> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends AnyRequest
    ? DecoratedOperation<TRecord[TKey]>
    : TRecord[TKey] extends ResourceRecord
    ? InitializedApiClient<TRecord[TKey]>
    : never
}

type DecoratedOperation<TProcedure extends AnyRequest> = (
  input: InferRequestInput<TProcedure>
) => Promise<InferRequestOutput<TProcedure>>

// function isRequest

export function createInitializerFactory<TContext>() {
  return function createInitializer<TRecord extends ResourceRecord>(
    opts: BuiltResource<TRecord>
  ): InitApiClient<TContext, TRecord> {
    const _def = opts._def

    return function initClient(context: TContext, options?: ApiClientOptions) {
      const { baseUrl = "", baseHeaders = {} } = options || {}

      const createRequestHandler = (
        request: AnyRequest
      ): DecoratedOperation<typeof request> => {
        return async (input) => {
          const { method, path, searchParams, headers } = request({
            ctx: context,
            input,
          })

          const url = new URL(path, baseUrl)
          if (searchParams) {
            Object.entries(searchParams).forEach(([key, value]) => {
              url.searchParams.append(key, String(value))
            })
          }

          const executeRequest = async (): Promise<
            InferRequestOutput<typeof request>
          > => {
            const response = await fetch(url.toString(), {
              method,
              headers: {
                ...baseHeaders,
                ...(headers || {}),
              },
              body: method !== "GET" ? JSON.stringify(input) : undefined,
            })

            if (!response.ok) {
              throw new Error(
                `Request failed with status ${
                  response.status
                }: ${await response.text()}`
              )
            }

            return response.json()
          }

          const wrappedRequest = request._def.middleware.reduceRight(
            (next, middleware) => (opts) =>
              middleware({
                ctx: context,
                input,
                path,
                next: () => next(opts),
              }),
            executeRequest
          )

          return wrappedRequest({
            ctx: context,
            input,
            path,
            next: () => executeRequest(),
          })
        }
      }

      // Recursively initializes records
      const initializeRecord = (
        record: TRecord
      ): InitializedApiClient<TRecord> => {
        return Object.keys(record).reduce((client, key) => {
          const value = record[key]

          if ("request" in value._def) {
            ;(client as any)[key] = createRequestHandler(value as AnyRequest)
          } else if ("resource" in value._def) {
            ;(client as any)[key] = initializeRecord(
              (value as BuiltResource<TRecord>)._def.record
            )
          } else {
            throw new Error(`Invalid resource definition for key: ${key}`)
          }

          return client
        }, {} as InitializedApiClient<TRecord>)
      }

      return initializeRecord(_def.record)
    }
  }
}

export type InitializerFactory<TContext> = ReturnType<
  typeof createInitializerFactory<TContext>
>
