export function compose<A, B, C>(f: (x: A) => B, g: (y: B) => C) {
  return (_: A) => g(f(_))
}
