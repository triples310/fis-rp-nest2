export function calculateOrderTotal(items: any[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}
