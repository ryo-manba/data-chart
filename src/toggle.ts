export function createToggle(table: HTMLTableElement, container: HTMLDivElement): void {
  const tableId =
    table.id || `data-chart-table-${Math.random().toString(36).slice(2, 9)}`;
  if (!table.id) {
    table.id = tableId;
  }

  const button = document.createElement('button');
  button.className = 'data-chart-source-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', tableId);
  button.textContent = 'Show source table';

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    button.textContent = isExpanded ? 'Show source table' : 'Hide source table';

    if (isExpanded) {
      table.classList.remove('data-chart-source-visible');
    } else {
      table.classList.add('data-chart-source-visible');
    }
  });

  container.appendChild(button);
}
