import { Middleware } from "./middleware"

export interface RequestOptions {
  context?: Record<string, unknown>
}

export interface BuiltRequestDefinition {
  method: string
  path: string
  searchParams?: Record<string, string | number | boolean>
  headers?: HeadersInit
}

export interface Request<
  TDefinition extends BuiltRequestDefinition,
  TInput,
  TOutput,
  TContext
> {
  _def: {
    request: true
    middleware: Middleware<TContext, TInput, TOutput>[]
    $types: {
      input: TInput
      output: TOutput
    }
  }

  (opts: RequestCallOptions<TContext, TInput>): TDefinition
}

export interface RequestCallOptions<TContext, TInput> {
  ctx: TContext
  input: TInput
}

export type AnyRequest = Request<any, any, any, any>

export type InferRequestInput<TProcedure extends AnyRequest> =
  undefined extends InferRequestParams<TProcedure>["$types"]["input"]
    ? void | InferRequestParams<TProcedure>["$types"]["input"]
    : InferRequestParams<TProcedure>["$types"]["input"]

export type InferRequestParams<TProcedure> = TProcedure extends AnyRequest
  ? TProcedure["_def"]
  : never

export type InferRequestOutput<TProcedure> =
  InferRequestParams<TProcedure>["$types"]["output"]
