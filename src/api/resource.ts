import { AnyRequest } from "./request"

export interface ResourceRecord {
  [key: string]: AnyRequest | ResourceRecord
}

export type Resource<TRecord extends ResourceRecord> = {
  _def: {
    resource: true
    record: TRecord
  }
}

export type AnyResource = Resource<any>

export type BuiltResource<TDefinition extends ResourceRecord> =
  Resource<TDefinition> & TDefinition

export interface MergeResourceOptions {
  [key: string]: AnyResource
}

export type DecorateMergeResourceOptions<
  TRouterOptions extends MergeResourceOptions
> = {
  [K in keyof TRouterOptions]: TRouterOptions[K] extends infer Value
    ? Value extends Resource<infer TRecord>
      ? TRecord
      : never
    : never
}

export function createResourceFactory() {
  function createResourceFactoryInner<TInput extends ResourceRecord>(
    input: TInput
  ): BuiltResource<TInput>

  function createResourceFactoryInner<TInput extends MergeResourceOptions>(
    input: TInput
  ): BuiltResource<DecorateMergeResourceOptions<TInput>>

  function createResourceFactoryInner<TInput extends ResourceRecord>(
    input: TInput
  ): BuiltResource<TInput> {
    return {
      ...input,
      _def: {
        resource: true,
        record: input,
      },
    }
  }

  return createResourceFactoryInner
}

export type ResourceFactory = ReturnType<typeof createResourceFactory>
