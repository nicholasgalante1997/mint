export function titleCase(str: string) {
  return str
    .split(/[\s\-]/)
    .map((substr) => substr.slice(0, 1).toUpperCase() + substr.slice(1).toLowerCase())
    .join(' ');
}
