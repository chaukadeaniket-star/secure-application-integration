export function sanitizeText(value) {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export function normalizeEmail(value) {
  return value.trim().toLowerCase();
}
