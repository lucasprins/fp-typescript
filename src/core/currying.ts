export function curry<A, B, C>(f: (a: A, b: B) => C) {
  return (x: A) => {
    return (y: B): C => f(x, y)
  }
}

export function uncurry<A, B, C>(f: (a: A) => (b: B) => C) {
  return (x: A, y: B): C => f(x)(y)
}
