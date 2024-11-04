/**
 * The `Void` type is considered the `initial object`
 * 
 * TypeScript's `never` is specifically designed to represent unreachable code paths or functions that never return.
 */
export type Void = never

/**
 * @example
 *
 * ```ts
 * function f(value: "A" | "B"): string {
 *   switch (value) {
 *     case "A":
 *       return "Handled A";
 *     case "B":
 *       return "Handled B";
 *     default:
 *       // `value` here has type `never`, meaning it should never occur
 *       return absurd(value);
 *   }
 * }
 */
export function absurd<A>(_: Void): A {
  throw new Error()
}
