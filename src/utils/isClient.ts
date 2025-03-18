/**
 * Check is the instance that is rendering component client (not SSR)
 */
export default function isClient() {
  return typeof window !== 'undefined';
}
