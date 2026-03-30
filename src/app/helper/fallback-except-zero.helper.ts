/**
 * Returns the fallback if value is falsy except for 0, otherwise returns value.
 */
export function fallbackExceptZero<T>(value: T, fallback: T): T {
  return value !== 0 && !value ? fallback : value;
}
