export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}
