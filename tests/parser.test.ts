import { describe, it, expect } from "vitest";
import { parseTable, parseValue } from "../src/parser";

describe("parseValue", () => {
  it("parses plain numbers", () => {
    expect(parseValue("123")).toBe(123);
  });

  it("parses numbers with commas", () => {
    expect(parseValue("1,234")).toBe(1234);
  });

  it("parses percentage values", () => {
    expect(parseValue("85%")).toBe(85);
  });

  it("parses yen currency", () => {
    expect(parseValue("¥1,200")).toBe(1200);
  });

  it("parses dollar currency", () => {
    expect(parseValue("$3.50")).toBe(3.5);
  });

  it("parses euro currency", () => {
    expect(parseValue("€99")).toBe(99);
  });

  it("returns 0 for empty string", () => {
    expect(parseValue("")).toBe(0);
  });

  it("returns 0 for non-numeric string", () => {
    expect(parseValue("N/A")).toBe(0);
  });

  it("parses negative numbers", () => {
    expect(parseValue("-42")).toBe(-42);
  });

  it("trims whitespace", () => {
    expect(parseValue("  100  ")).toBe(100);
  });
});

function createTable(html: string): HTMLTableElement {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.querySelector("table") as HTMLTableElement;
}

describe("parseTable", () => {
  it("parses a basic table with thead and tbody", () => {
    const table = createTable(`
      <table data-chart="bar">
        <thead><tr><th>Month</th><th>Sales</th></tr></thead>
        <tbody>
          <tr><td>Jan</td><td>100</td></tr>
          <tr><td>Feb</td><td>200</td></tr>
        </tbody>
      </table>
    `);

    const result = parseTable(table);
    expect(result.headers).toEqual(["Sales"]);
    expect(result.labels).toEqual(["Jan", "Feb"]);
    expect(result.datasets).toEqual([[100, 200]]);
  });

  it("parses multi-series table", () => {
    const table = createTable(`
      <table data-chart="bar">
        <thead><tr><th>Month</th><th>A</th><th>B</th></tr></thead>
        <tbody>
          <tr><td>Jan</td><td>10</td><td>20</td></tr>
          <tr><td>Feb</td><td>30</td><td>40</td></tr>
        </tbody>
      </table>
    `);

    const result = parseTable(table);
    expect(result.headers).toEqual(["A", "B"]);
    expect(result.datasets).toEqual([
      [10, 30],
      [20, 40],
    ]);
  });

  it("uses tbody first row as header when thead is missing", () => {
    const table = createTable(`
      <table data-chart="bar">
        <tbody>
          <tr><td>Category</td><td>Value</td></tr>
          <tr><td>A</td><td>50</td></tr>
        </tbody>
      </table>
    `);

    const result = parseTable(table);
    expect(result.headers).toEqual(["Value"]);
    expect(result.labels).toEqual(["A"]);
    expect(result.datasets).toEqual([[50]]);
  });

  it("captures caption text", () => {
    const table = createTable(`
      <table data-chart="bar">
        <caption>Sales Data</caption>
        <thead><tr><th>Month</th><th>Sales</th></tr></thead>
        <tbody><tr><td>Jan</td><td>100</td></tr></tbody>
      </table>
    `);

    const result = parseTable(table);
    expect(result.caption).toBe("Sales Data");
  });

  it("ignores tfoot", () => {
    const table = createTable(`
      <table data-chart="bar">
        <thead><tr><th>Month</th><th>Sales</th></tr></thead>
        <tbody><tr><td>Jan</td><td>100</td></tr></tbody>
        <tfoot><tr><td>Total</td><td>100</td></tr></tfoot>
      </table>
    `);

    const result = parseTable(table);
    expect(result.labels).toEqual(["Jan"]);
    expect(result.datasets).toEqual([[100]]);
  });

  it("throws NO_DATA when tbody has no rows", () => {
    const table = createTable(`
      <table data-chart="bar">
        <thead><tr><th>Month</th><th>Sales</th></tr></thead>
        <tbody></tbody>
      </table>
    `);

    expect(() => parseTable(table)).toThrow("NO_DATA");
  });

  it("throws NO_DATA when tbody is missing", () => {
    const table = createTable(`
      <table data-chart="bar">
        <thead><tr><th>Month</th><th>Sales</th></tr></thead>
      </table>
    `);

    expect(() => parseTable(table)).toThrow("NO_DATA");
  });

  it("handles currency and comma values in cells", () => {
    const table = createTable(`
      <table data-chart="bar">
        <thead><tr><th>Item</th><th>Price</th></tr></thead>
        <tbody>
          <tr><td>A</td><td>$1,250</td></tr>
          <tr><td>B</td><td>¥3,000</td></tr>
        </tbody>
      </table>
    `);

    const result = parseTable(table);
    expect(result.datasets).toEqual([[1250, 3000]]);
  });

  it("handles empty cells as 0", () => {
    const table = createTable(`
      <table data-chart="bar">
        <thead><tr><th>Month</th><th>A</th><th>B</th></tr></thead>
        <tbody>
          <tr><td>Jan</td><td>10</td><td></td></tr>
        </tbody>
      </table>
    `);

    const result = parseTable(table);
    expect(result.datasets).toEqual([[10], [0]]);
  });
});
