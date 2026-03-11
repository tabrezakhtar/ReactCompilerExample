import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';

interface Show {
  show: {
    name: string;
    rating?: {
      average: number;
    };
  };
}

interface ChildProps {
  results: Show[];
  query: string;
}

function App() {
  const [count, setCount] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Show[]>([]);

  // ────────────────────────────────────────────────
  // Without useCallback: new function every render →
  // Child re-renders even when only count changes
  // ────────────────────────────────────────────────
  const searchShows = (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => {
        console.error(err);
        setResults([]);
      });
  };

  useEffect(() => {
    searchShows(query);
  }, [query, searchShows]);

  return (
    <div className="App">
      <div className="demo-controls">
        <button onClick={() => setCount(c => c + 1)} className="count-button">
          Count: {count}
        </button>
        <p className="hint">↑ Click to test re-renders</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search TV shows (e.g. breaking)"
        />
      </div>

      <Child results={results} query={query} />
    </div>
  );
}

const Child: React.FC<ChildProps> = React.memo(({ results, query }) => {
  console.log("Child rendered"); // ← with useCallback: only when query/results change

  return (
    <div className="results-container">
      {query && (
        <p className="results-summary">
          Results for "{query}": <strong>{results.length}</strong> shows found
        </p>
      )}

      {results.length > 0 && (
        <ul className="results-list">
          {results.slice(0, 6).map((item, i) => (
            <li key={i} className="result-item">
              <span className="show-name">{item.show.name}</span>
              {item.show.rating?.average && (
                <span className="show-rating"> ({item.show.rating.average}/10)</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default App;