export function calculateProgress(completed: number, total: number): number {
  return (completed / total) * 100;
}
