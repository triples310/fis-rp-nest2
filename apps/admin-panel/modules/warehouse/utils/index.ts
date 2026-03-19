export function calculateUtilization(current: number, capacity: number): number {
  return (current / capacity) * 100;
}
