export type Query<Options, Response> = (options: Options) => {
  route: string
  searchParams: Record<PropertyKey, boolean | number | string>
}

///////////////
///////////////
///////////////
type GetGraphOptions = {
  id: string
  active: boolean
}

type GetGraphResponse = {
  id: string
}

export const getGraphById: Query<GetGraphOptions, GetGraphResponse> = (
  options
) => ({
  route: `/graph/${options.id}`,
  searchParams: {
    active: options.active,
  },
})
