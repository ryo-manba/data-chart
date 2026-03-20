<div align="center">

<a href="https://ryo-manba.github.io/data-chart/ja/"><img src="https://raw.githubusercontent.com/ryo-manba/data-chart/main/docs/public/og-image.png" alt="data-chart" width="100%" /></a>

  <h1>data-chart</h1>

<a href="https://www.npmjs.com/package/data-chart"><img alt="NPM version" src="https://img.shields.io/npm/v/data-chart.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://bundlephobia.com/package/data-chart"><img alt="gzip size" src="https://img.shields.io/bundlephobia/minzip/data-chart?style=for-the-badge&labelColor=000000&label=gzip"></a>
<a href="https://github.com/ryo-manba/data-chart/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/data-chart.svg?style=for-the-badge&labelColor=000000"></a>

</div>

[English](./README.md)

## Getting Started

スクリプトタグを追加して、属性を書くだけ。テーブルがチャートに変わります。依存関係ゼロ、gzip で 7KB 未満。

### npm

```bash
npm install data-chart
```

```js
import 'data-chart';
```

### CDN

```html
<script src="https://unpkg.com/data-chart" defer></script>
```

### Usage

```html
<table data-chart="bar">
  <caption>月別売上</caption>
  <thead>
    <tr><th></th><th>1月</th><th>2月</th><th>3月</th></tr>
  </thead>
  <tbody>
    <tr><th>売上</th><td>120</td><td>150</td><td>180</td></tr>
  </tbody>
</table>
```

- [ドキュメント](https://ryo-manba.github.io/data-chart/ja/docs/getting-started/)で完全な API リファレンスをご覧ください。
- [Playground](https://ryo-manba.github.io/data-chart/ja/playground/) でチャートをインタラクティブに試せます。

## Contributing

data-chart への貢献を歓迎します。始める前に[コントリビューションガイドライン](CONTRIBUTING.md)をご確認ください。

## License

[MIT](LICENSE)
