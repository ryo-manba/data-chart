export function setupObserver(renderFn: (table: HTMLTableElement) => void): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) {
          const tables: HTMLTableElement[] = node.matches?.('table[data-chart]')
            ? [node as HTMLTableElement]
            : Array.from(node.querySelectorAll?.('table[data-chart]') ?? []);
          for (const t of tables) {
            if (!t.classList.contains('data-chart-rendered')) {
              renderFn(t);
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}
