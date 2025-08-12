# JarNox Stock Market Dashboard (React + Chart.js)

A GitHub-ready frontend-only stock market dashboard built with React and Chart.js. Uses **Alpha Vantage** free API (no backend, no Docker).

## Setup
1. Clone repo
2. `npm install`
3. Create `.env` with `REACT_APP_ALPHA_VANTAGE_KEY=YOUR_KEY`
4. `npm start`

Development Approach:
This project is a responsive Stock Market Dashboard built with React and Chart.js to visualize historical stock price data. It features a clean, modern UI with light/dark mode, glassmorphism effects, and a company search option. Users can select from a predefined list or search for any stock using Alpha Vantage’s SYMBOL_SEARCH API. The selected stock’s daily closing prices are displayed in an interactive chart, alongside key stats such as latest price, 52-week high/low, and average close.

Technologies Used:

React (Frontend)

Chart.js via react-chartjs-2 (Data visualization)

Alpha Vantage API (Live stock data)

CSS with Flexbox/Grid & Glassmorphism

Environment variables for API keys

Challenges Encountered:
The main challenge was handling Alpha Vantage’s rate limit (5 calls/min) while ensuring smooth search and data fetching. Another challenge was ensuring the UI remained fully responsive without scrollbars on different devices. Some stock symbols from search results do not have valid daily data, so filtering and better error handling were implemented. Designing a visually appealing yet functional dashboard required balancing aesthetics with performance.
