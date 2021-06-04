export default function mergeIds(
  firstArray: ReadonlyArray<any> | null = [],
  secondArray: ReadonlyArray<any> | null = [],
) {
  return Array.from(new Set([...(firstArray || []), ...(secondArray || [])]));
}
