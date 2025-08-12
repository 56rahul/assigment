import React, { useState } from 'react';
import CompanyList from './components/CompanyList';
import StockChart from './components/StockChart';

const companies = [
  { symbol: 'RELIANCE.BSE', name: 'Reliance' },
  { symbol: 'TCS.BSE', name: 'TCS' },
  { symbol: 'INFY.BSE', name: 'Infosys' },
  { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank' },
  { symbol: 'SBIN.BSE', name: 'State Bank of India' },
  { symbol: 'WIPRO.BSE', name: 'Wipro' },
  { symbol: 'HINDUNILVR.BSE', name: 'Hindustan Unilever' },
  { symbol: 'LT.BSE', name: 'Larsen & Toubro' },
  { symbol: 'ASIANPAINT.BSE', name: 'Asian Paints' },
  { symbol: 'BAJFINANCE.BSE', name: 'Bajaj Finance' },
  { symbol: 'AXISBANK.BSE', name: 'Axis Bank' },
  { symbol: 'ITC.BSE', name: 'ITC' },
  { symbol: 'KOTAKBANK.BSE', name: 'Kotak Mahindra Bank' },
  { symbol: 'MARUTI.BSE', name: 'Maruti Suzuki' },
  { symbol: 'POWERGRID.BSE', name: 'Power Grid' }
];

export default function App() {
  const [labels, setLabels] = useState([]);
  const [prices, setPrices] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchResults, setSearchResults] = useState(companies);

  const fetchStock = async (sym) => {
    setError('');
    setLoading(true);
    setSymbol(sym);
    setLabels([]);
    setPrices([]);
    setMeta({});

    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
    if (!apiKey) {
      setError('Missing API key.');
      setLoading(false);
      return;
    }

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(sym)}&outputsize=compact&apikey=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data['Time Series (Daily)']) {
        setError('Failed to fetch data.');
        setLoading(false);
        return;
      }
      console.log("API Key:", process.env.REACT_APP_ALPHA_VANTAGE_KEY);


      const timeSeries = data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).sort();
      const closePrices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

      const high52 = Math.max(...closePrices);
      const low52 = Math.min(...closePrices);
      const avg = (closePrices.reduce((a,b) => a+b,0) / closePrices.length).toFixed(2);

      setLabels(dates);
      setPrices(closePrices);
      setMeta({ latest: closePrices[closePrices.length -1], high52, low52, avg });
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (term) => {
    setSearchTerm(term);
    if (!term) {
      setSearchResults(companies);
      return;
    }

    // Filter local matches
    const localMatches = companies.filter(c =>
      c.name.toLowerCase().includes(term.toLowerCase()) ||
      c.symbol.toLowerCase().includes(term.toLowerCase())
    );

    if (localMatches.length > 0) {
      setSearchResults(localMatches);
      return;
    }

    // If no local matches, fetch from API
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
    if (!apiKey) {
      setError('Missing API key for search.');
      return;
    }

    try {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.bestMatches) {
        const apiMatches = data.bestMatches.map(item => ({
          symbol: item['1. symbol'],
          name: item['2. name']
        }));
        setSearchResults(apiMatches);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <div className={`app-root ${darkMode ? 'dark' : ''}`}>
      <aside className="left-panel">
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            placeholder="Search company..."
            value={searchTerm}
            className='search-input'
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ width: '100%', padding: '6px' }}
          />
        </div>
        <CompanyList companies={searchResults} onSelect={fetchStock} />
      </aside>
      <main className="main-panel">
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>JarNox Stock Dashboard</h2>
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div>{loading ? 'Loading...' : error ? <span className="error">{error}</span> : symbol}</div>
          </div>
        </header>
        <section className="chart-area glass">
  <StockChart labels={labels} prices={prices} symbol={symbol} />
</section>

<section className="meta-cards glass">
  {meta && meta.latest && (
    <>
      <div className="card glass">Latest: <strong>{meta.latest}</strong></div>
      <div className="card glass">High: <strong>{meta.high52}</strong></div>
      <div className="card glass">Low: <strong>{meta.low52}</strong></div>
      <div className="card glass">Avg: <strong>{meta.avg}</strong></div>
    </>
  )}
</section>

      
      </main>
    </div>
  );
}
