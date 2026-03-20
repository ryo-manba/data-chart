function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>React + data-chart</h1>

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

      <table data-chart="line" data-chart-grid="y">
        <caption>Monthly Users</caption>
        <thead>
          <tr><th>Month</th><th>Users</th></tr>
        </thead>
        <tbody>
          <tr><td>Jan</td><td>1200</td></tr>
          <tr><td>Feb</td><td>1800</td></tr>
          <tr><td>Mar</td><td>2400</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
