# data-chart

**Chart your tables. No JavaScript to write.**

[![npm version](https://img.shields.io/npm/v/data-chart)](https://www.npmjs.com/package/data-chart)
[![bundle size](https://img.shields.io/bundlephobia/minzip/data-chart)](https://bundlephobia.com/package/data-chart)
[![license](https://img.shields.io/npm/l/data-chart)](https://github.com/ryo-manba/data-chart/blob/main/LICENSE)

[日本語](./README.ja.md)

A zero-dependency JavaScript library that converts HTML `<table>` elements into SVG charts using data attributes. Part of the `data-*` ecosystem.

## Install

### CDN

```html
<script src="https://unpkg.com/data-chart" defer></script>
```

### Package Manager

```bash
pnpm add data-chart
```

```js
import "data-chart";
```

## Quick Start

Add `data-chart` to any `<table>` element. The library converts it into an SVG chart automatically on page load.

```html
<table data-chart="bar">
  <caption>Monthly Sales</caption>
  <thead>
    <tr><th></th><th>Jan</th><th>Feb</th><th>Mar</th></tr>
  </thead>
  <tbody>
    <tr><th>Revenue</th><td>120</td><td>150</td><td>180</td></tr>
    <tr><th>Cost</th><td>80</td><td>90</td><td>100</td></tr>
  </tbody>
</table>
```

The table remains accessible as a fallback when JavaScript is unavailable.

## Chart Types

| Value | Description |
| --- | --- |
| `bar` | Vertical bar chart |
| `bar` + `data-chart-horizontal` | Horizontal bar chart |
| `bar` + `data-chart-stacked` | Stacked bar chart |
| `line` | Line chart |
| `area` | Area chart |
| `pie` | Pie chart |
| `donut` | Donut chart |

## Data Attributes

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `data-chart` | `bar` `line` `area` `pie` `donut` | -- | Chart type (required) |
| `data-chart-height` | Number (px) | `300` | Chart height |
| `data-chart-colors` | Comma-separated hex/named colors | Built-in palette | Custom color palette |
| `data-chart-grid` | `y` `x` `both` `none` | `y` | Grid lines |
| `data-chart-legend` | `top` `bottom` `none` | `bottom` | Legend position |
| `data-chart-radius` | Number (px) | `0` | Bar corner radius |
| `data-chart-horizontal` | (boolean attribute) | -- | Horizontal bars |
| `data-chart-stacked` | (boolean attribute) | -- | Stacked bars |
| `data-chart-source` | (boolean attribute) | -- | Show toggle to view source table |
| `data-chart-debug` | (boolean attribute) | -- | Enable debug logging |

```html
<table data-chart="bar"
       data-chart-height="400"
       data-chart-colors="#3b82f6,#ef4444,#10b981"
       data-chart-grid="both"
       data-chart-legend="top"
       data-chart-radius="4"
       data-chart-source>
  ...
</table>
```

## Dark Mode

data-chart automatically adapts to dark mode via `prefers-color-scheme`. Colors, grid lines, and text adjust without any configuration. You can also override styles using CSS custom properties prefixed with `--dc-`.

## Integration with data-anim

[data-anim](https://github.com/ryo-manba/data-anim) adds declarative animations to any DOM element. data-chart forwards `data-anim-*` attributes from the source table to the generated chart container so data-anim can pick them up.

```html
<script src="https://unpkg.com/data-chart" defer></script>
<script src="https://unpkg.com/data-anim" defer></script>

<table data-chart="bar"
       data-anim-name="fade-in"
       data-anim-duration="0.5s">
  ...
</table>
```

data-anim is entirely optional. data-chart works perfectly on its own.

## JavaScript API

The library exposes `window.dataChart` for programmatic use.

```js
// Re-initialize all tables with data-chart attribute
dataChart.init();

// Render a specific table
const svg = dataChart.render(tableElement);

// Re-render after table data changes
const svg = dataChart.refresh(tableElement);

// Remove chart(s) and restore original table(s)
dataChart.destroy();           // all charts
dataChart.destroy(tableElement); // specific chart

// Library version
console.log(dataChart.version);
```

## Browser Support

| Browser | Version |
| --- | --- |
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

## License

[MIT](./LICENSE)
