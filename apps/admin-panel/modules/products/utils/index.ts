/**
 * Products Module Utils
 */

export function formatPrice(price: number): string {
  return `NT$${price.toLocaleString()}`;
}

export function validateSku(sku: string): boolean {
  return /^[A-Z0-9-]+$/.test(sku);
}
