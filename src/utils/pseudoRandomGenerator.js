export function* pseudoRandomGenerator(seed) {
  let val = seed
  while (1) {
    val = Math.imul(48271, val) | 0 % 2147483647
    yield (val & 2147483647) / 2147483648
  }
}
