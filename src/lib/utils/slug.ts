export function createSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createSlugCandidate(baseSlug: string, sequence: number) {
  return sequence === 1 ? baseSlug : `${baseSlug}-${sequence}`;
}
