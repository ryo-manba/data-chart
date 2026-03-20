<script setup>
useHead({
  script: [
    {
      src: 'https://unpkg.com/data-chart@latest/dist/data-chart.js',
      tagPosition: 'head',
    },
  ],
});
</script>

<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem;">
    <h1>Nuxt + data-chart</h1>

    <table data-chart="area" data-chart-grid="y">
      <caption>Weekly Visitors</caption>
      <thead>
        <tr><th>Week</th><th>Visitors</th></tr>
      </thead>
      <tbody>
        <tr><td>W1</td><td>3200</td></tr>
        <tr><td>W2</td><td>4100</td></tr>
        <tr><td>W3</td><td>3800</td></tr>
        <tr><td>W4</td><td>5200</td></tr>
      </tbody>
    </table>

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
  </div>
</template>
