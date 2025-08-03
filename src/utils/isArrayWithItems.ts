export function isArrayWithItems<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}
