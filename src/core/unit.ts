const __unitSymbol: unique symbol = Symbol.for("Unit")

/**
 * The `Unit` type is considered the `terminal object`
 */
export type Unit = typeof __unitSymbol

export const Unit = () => __unitSymbol
