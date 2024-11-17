import { createInitializerFactory, type InitializerFactory } from "./client"
import { createRequestBuilder, type RequestBuilder } from "./requestBuilder"
import { createResourceFactory, type ResourceFactory } from "./resource"

export interface ApiBuilder<TContext> {
  request: RequestBuilder<TContext>
  resource: ResourceFactory
  initializer: InitializerFactory<TContext>
}

export const initApiBuilder = function <
  TContext extends object
>(): ApiBuilder<TContext> {
  return {
    /**
     * Builder for defining operations
     */
    request: createRequestBuilder<TContext>(),

    /**
     * Create a resource containing operations
     */
    resource: createResourceFactory(),

    /**
     * Create the final api client that can be interacted with
     */
    initializer: createInitializerFactory<TContext>(),
  }
}
