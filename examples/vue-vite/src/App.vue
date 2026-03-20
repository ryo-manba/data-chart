<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem;">
    <h1>Vue + data-chart</h1>

    <table data-chart="bar">
      <caption>Sample Bar</caption>
      <thead>
        <tr><th>Category</th><th>Series A</th><th>Series B</th></tr>
      </thead>
      <tbody>
        <tr><td>Alpha</td><td>420</td><td>180</td></tr>
        <tr><td>Beta</td><td>580</td><td>240</td></tr>
        <tr><td>Gamma</td><td>510</td><td>210</td></tr>
        <tr><td>Delta</td><td>690</td><td>310</td></tr>
      </tbody>
    </table>

    <table data-chart="line" data-chart-grid="y">
      <caption>Sample Line</caption>
      <thead>
        <tr><th>Period</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>W1</td><td>1200</td></tr>
        <tr><td>W2</td><td>1800</td></tr>
        <tr><td>W3</td><td>1500</td></tr>
        <tr><td>W4</td><td>2200</td></tr>
        <tr><td>W5</td><td>2800</td></tr>
      </tbody>
    </table>

    <table data-chart="pie">
      <caption>Sample Pie</caption>
      <thead>
        <tr><th>Segment</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>A</td><td>40</td></tr>
        <tr><td>B</td><td>25</td></tr>
        <tr><td>C</td><td>20</td></tr>
        <tr><td>D</td><td>15</td></tr>
      </tbody>
    </table>

    <hr style="margin: 3rem 0; border: none; border-top: 1px solid #ddd;">
    <h2>With Animation</h2>

    <table data-chart="bar" data-chart-animate>
      <caption>Animated Bar</caption>
      <thead>
        <tr><th>Category</th><th>Series A</th><th>Series B</th></tr>
      </thead>
      <tbody>
        <tr><td>Alpha</td><td>420</td><td>180</td></tr>
        <tr><td>Beta</td><td>580</td><td>240</td></tr>
        <tr><td>Gamma</td><td>510</td><td>210</td></tr>
        <tr><td>Delta</td><td>690</td><td>310</td></tr>
      </tbody>
    </table>

    <table data-chart="line" data-chart-grid="y" data-chart-animate>
      <caption>Animated Line</caption>
      <thead>
        <tr><th>Period</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>W1</td><td>1200</td></tr>
        <tr><td>W2</td><td>1800</td></tr>
        <tr><td>W3</td><td>1500</td></tr>
        <tr><td>W4</td><td>2200</td></tr>
        <tr><td>W5</td><td>2800</td></tr>
      </tbody>
    </table>

    <table data-chart="pie" data-chart-animate>
      <caption>Animated Pie</caption>
      <thead>
        <tr><th>Segment</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>A</td><td>40</td></tr>
        <tr><td>B</td><td>25</td></tr>
        <tr><td>C</td><td>20</td></tr>
        <tr><td>D</td><td>15</td></tr>
      </tbody>
    </table>
  </div>
</template>
