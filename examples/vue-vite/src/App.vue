<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem;">
    <h1>Vue + data-chart</h1>

    <table data-chart="bar" data-chart-stacked>
      <caption>Device Traffic</caption>
      <thead>
        <tr><th>Q</th><th>Desktop</th><th>Mobile</th></tr>
      </thead>
      <tbody>
        <tr><td>Q1</td><td>300</td><td>200</td></tr>
        <tr><td>Q2</td><td>280</td><td>250</td></tr>
        <tr><td>Q3</td><td>260</td><td>300</td></tr>
      </tbody>
    </table>

    <table data-chart="pie">
      <caption>Browser Share</caption>
      <thead>
        <tr><th>Browser</th><th>Share</th></tr>
      </thead>
      <tbody>
        <tr><td>Chrome</td><td>65</td></tr>
        <tr><td>Safari</td><td>19</td></tr>
        <tr><td>Firefox</td><td>10</td></tr>
        <tr><td>Other</td><td>6</td></tr>
      </tbody>
    </table>
  </div>
</template>
