import { useState } from 'react'
import './App.css'
import ShowItem from './ShowItem';

interface Show {
  id: number;
  name: string;
  image?: { medium: string; original: string };
  summary?: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setShows(data.map((item: any) => item.show));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>TVMaze Search</h1>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') search();
          }}
          placeholder="Search shows..."
        />
        <button onClick={search} disabled={loading}>
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <ul>
        {shows.map((show) => (
          <ShowItem
            key={show.id}
            show={show}
            onSelect={(s) => console.log('selected', s.name)}
          />
        ))}
      </ul>
    </div>
  );
}

export default App
