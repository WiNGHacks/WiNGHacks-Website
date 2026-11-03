export function isEduEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+edu$/i.test(value.trim());
}
