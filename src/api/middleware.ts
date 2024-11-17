export interface Middleware<TContext, TInput, TOutput> {
  (opts: {
    ctx: TContext
    input: TInput
    path: string
    next(): Promise<TOutput>
  }): Promise<TOutput>
}

export type AnyMiddleware = Middleware<any, any, any>
