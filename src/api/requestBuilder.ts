import { AnyMiddleware, Middleware } from "./middleware"
import { BuiltRequestDefinition, Request } from "./request"

interface RequestResolverOptions<TContext, TInput> {
  ctx: TContext
  input: TInput
}

type RequestResolver<
  TContext,
  TInput,
  TOperationDefinition extends BuiltRequestDefinition
> = (opts: RequestResolverOptions<TContext, TInput>) => TOperationDefinition

class RequestBuilder<TContext, TInput = unknown, TOutput = unknown> {
  middleware: AnyMiddleware[]

  constructor(middleware?: AnyMiddleware[]) {
    this.middleware = middleware || []
  }

  input<TNewInput>(): RequestBuilder<TContext, TNewInput, TOutput> {
    return new RequestBuilder<TContext, TNewInput, TOutput>(this.middleware)
  }

  output<TNewOutput>(): RequestBuilder<TContext, TInput, TNewOutput> {
    return new RequestBuilder<TContext, TInput, TNewOutput>(this.middleware)
  }

  use(
    middleware: Middleware<TContext, TInput, TOutput>
  ): RequestBuilder<TContext, TInput, TOutput> {
    return new RequestBuilder<TContext, TInput, TOutput>([
      ...this.middleware,
      middleware,
    ])
  }

  request(
    resolver: RequestResolver<TContext, TInput, BuiltRequestDefinition>
  ): Request<BuiltRequestDefinition, TInput, TOutput, TContext> {
    const _def: Request<
      BuiltRequestDefinition,
      TInput,
      TOutput,
      TContext
    >["_def"] = {
      request: true,
      middleware: this.middleware,
      $types: { input: {} as TInput, output: {} as TOutput },
    } as const

    return Object.assign(resolver, { _def })
  }
}

export function createRequestBuilder<TContext>() {
  return new RequestBuilder<TContext>()
}

export type { RequestBuilder }
