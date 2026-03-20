# data-chart

**テーブルをチャートに。書くJavaScriptはゼロ。**

[![npm version](https://img.shields.io/npm/v/data-chart)](https://www.npmjs.com/package/data-chart)
[![bundle size](https://img.shields.io/bundlephobia/minzip/data-chart)](https://bundlephobia.com/package/data-chart)
[![license](https://img.shields.io/npm/l/data-chart)](https://github.com/ryo-manba/data-chart/blob/main/LICENSE)

[English](./README.md)

HTML `<table>` 要素をデータ属性を使ってSVGチャートに変換する、依存関係ゼロのJavaScriptライブラリです。`data-*` エコシステムの一部です。

## インストール

### CDN

```html
<script src="https://unpkg.com/data-chart" defer></script>
```

### パッケージマネージャー

```bash
pnpm add data-chart
```

```js
import "data-chart";
```

## クイックスタート

任意の `<table>` 要素に `data-chart` を追加するだけで、ページ読み込み時に自動的にSVGチャートに変換されます。

```html
<table data-chart="bar">
  <caption>月別売上</caption>
  <thead>
    <tr><th></th><th>1月</th><th>2月</th><th>3月</th></tr>
  </thead>
  <tbody>
    <tr><th>売上</th><td>120</td><td>150</td><td>180</td></tr>
    <tr><th>コスト</th><td>80</td><td>90</td><td>100</td></tr>
  </tbody>
</table>
```

JavaScriptが無効な環境でも、元のテーブルがフォールバックとして機能します。

## チャートタイプ

| 値 | 説明 |
| --- | --- |
| `bar` | 縦棒グラフ |
| `bar` + `data-chart-horizontal` | 横棒グラフ |
| `bar` + `data-chart-stacked` | 積み上げ棒グラフ |
| `line` | 折れ線グラフ |
| `area` | エリアチャート |
| `pie` | 円グラフ |
| `donut` | ドーナツチャート |

## データ属性

| 属性 | 値 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `data-chart` | `bar` `line` `area` `pie` `donut` | -- | チャートタイプ（必須） |
| `data-chart-height` | 数値（px） | `300` | チャートの高さ |
| `data-chart-colors` | カンマ区切りの16進数/色名 | 組み込みパレット | カスタムカラーパレット |
| `data-chart-grid` | `y` `x` `both` `none` | `y` | グリッド線 |
| `data-chart-legend` | `top` `bottom` `none` | `bottom` | 凡例の位置 |
| `data-chart-radius` | 数値（px） | `0` | 棒グラフの角丸 |
| `data-chart-horizontal` | （真偽値属性） | -- | 横棒グラフ |
| `data-chart-stacked` | （真偽値属性） | -- | 積み上げ棒グラフ |
| `data-chart-source` | （真偽値属性） | -- | ソーステーブルの表示切替 |
| `data-chart-debug` | （真偽値属性） | -- | デバッグログの有効化 |

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

## ダークモード

data-chartは `prefers-color-scheme` を通じてダークモードに自動対応します。色、グリッド線、テキストが設定不要で切り替わります。`--dc-` プレフィックスのCSSカスタムプロパティでスタイルを上書きすることも可能です。

## data-animとの連携

[data-anim](https://github.com/ryo-manba/data-anim) は宣言的アニメーションをDOM要素に追加するライブラリです。data-chartはソーステーブルの `data-anim-*` 属性を生成されたチャートコンテナに転送し、data-animが処理できるようにします。

```html
<script src="https://unpkg.com/data-chart" defer></script>
<script src="https://unpkg.com/data-anim" defer></script>

<table data-chart="bar"
       data-anim-name="fade-in"
       data-anim-duration="0.5s">
  ...
</table>
```

data-animは完全にオプションです。data-chart単体で問題なく動作します。

## JavaScript API

ライブラリは `window.dataChart` をプログラム的に利用できます。

```js
// data-chart属性を持つすべてのテーブルを再初期化
dataChart.init();

// 特定のテーブルをレンダリング
const svg = dataChart.render(tableElement);

// テーブルデータ変更後に再レンダリング
const svg = dataChart.refresh(tableElement);

// チャートを削除して元のテーブルを復元
dataChart.destroy();           // すべてのチャート
dataChart.destroy(tableElement); // 特定のチャート

// ライブラリバージョン
console.log(dataChart.version);
```

## ブラウザサポート

| ブラウザ | バージョン |
| --- | --- |
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

## ライセンス

[MIT](./LICENSE)
