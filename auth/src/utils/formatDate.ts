export function formatDate(dateIso: string): string {
  const d = new Date(dateIso);
  return d.toLocaleDateString();
}



