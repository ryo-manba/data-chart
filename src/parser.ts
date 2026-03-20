import type { ParsedData } from "./types";

export function parseValue(raw: string): number {
  const n = parseFloat(
    raw
      .trim()
      .replace(/^[¥$€£₩]/, "")
      .replace(/,/g, "")
      .replace(/%$/, ""),
  );
  return Number.isNaN(n) ? 0 : n;
}

function trs(el: Element): HTMLTableRowElement[] {
  return Array.from(el.children).filter((c): c is HTMLTableRowElement => c.tagName === "TR");
}

function cells(row: Element): HTMLTableCellElement[] {
  return Array.from(row.children).filter(
    (c): c is HTMLTableCellElement => c.tagName === "TH" || c.tagName === "TD",
  );
}

export function parseTable(table: HTMLTableElement): ParsedData {
  const caption = table.querySelector("caption")?.textContent?.trim();
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if (!tbody) throw new Error("NO_DATA");

  const rows = trs(tbody);
  let hr: HTMLTableRowElement | undefined;
  let dr: HTMLTableRowElement[];

  if (thead) {
    hr = trs(thead)[0];
    dr = rows;
  } else if (rows.length) {
    hr = rows[0];
    dr = rows.slice(1);
  } else throw new Error("NO_THEAD");

  if (!hr) throw new Error("NO_THEAD");
  if (!dr.length) throw new Error("NO_DATA");

  const hc = cells(hr).slice(1);
  const headers = hc.map((c) => c.textContent?.trim() ?? "");
  const labels: string[] = [];
  const datasets: number[][] = headers.map(() => []);

  for (const row of dr) {
    const cs = cells(row);
    labels.push(cs[0]?.textContent?.trim() ?? "");
    for (let i = 0; i < headers.length; i++)
      datasets[i]?.push(parseValue(cs[i + 1]?.textContent?.trim() ?? ""));
  }

  return { headers, labels, datasets, ...(caption ? { caption } : {}) };
}
