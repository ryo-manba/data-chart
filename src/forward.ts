/**
 * Copy all data-anim-* attributes from the source table
 * to the generated container div.
 * data-chart does NOT interpret these — just copies them.
 */
export function forwardAnimAttributes(
  table: HTMLTableElement,
  container: HTMLDivElement,
): string[] {
  const forwarded: string[] = [];
  for (const attr of Array.from(table.attributes)) {
    if (attr.name.startsWith('data-anim')) {
      container.setAttribute(attr.name, attr.value);
      forwarded.push(attr.name);
    }
  }
  return forwarded;
}
