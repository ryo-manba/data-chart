export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>Next.js + data-chart</h1>

      <table data-chart="bar">
        <caption>Quarterly Revenue</caption>
        <thead>
          <tr><th>Quarter</th><th>Revenue</th><th>Profit</th></tr>
        </thead>
        <tbody>
          <tr><td>Q1</td><td>420</td><td>180</td></tr>
          <tr><td>Q2</td><td>580</td><td>240</td></tr>
          <tr><td>Q3</td><td>510</td><td>210</td></tr>
          <tr><td>Q4</td><td>690</td><td>310</td></tr>
        </tbody>
      </table>

      <table data-chart="donut">
        <caption>Budget Allocation</caption>
        <thead>
          <tr><th>Category</th><th>Budget</th></tr>
        </thead>
        <tbody>
          <tr><td>Engineering</td><td>45</td></tr>
          <tr><td>Marketing</td><td>25</td></tr>
          <tr><td>Sales</td><td>20</td></tr>
          <tr><td>Support</td><td>10</td></tr>
        </tbody>
      </table>
    </main>
  );
}
