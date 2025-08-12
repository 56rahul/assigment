import React from 'react';

export default function CompanyList({ companies, onSelect }) {
  return (
    <div className="company-list">
      {companies.map((c) => (
        <div
          key={c.symbol}
          className="company-item"
          onClick={() => onSelect(c.symbol)}
        >
          <div className="company-name">{c.name}</div>
          <div className="company-symbol">{c.symbol}</div>
        </div>
      ))}
    </div>
  );
}
