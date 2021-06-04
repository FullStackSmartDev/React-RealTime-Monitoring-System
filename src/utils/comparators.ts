export function compareAsUniqueArrays<T>(a: Array<T>, b: Array<T>) {
  const setA = new Set(Object.keys(a));
  const setB = new Set(Object.keys(b));
  return setA.size === setB.size && Array.from(setA).every(key => setB.has(key));
}
