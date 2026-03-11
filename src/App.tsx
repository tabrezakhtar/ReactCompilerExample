import { useState, useEffect } from 'react'
import useSWR from 'swr';
import './App.css'
import ShowItem from './ShowItem';
import { fetcher } from './helpers';

interface Show {
  id: number;
  name: string;
  image?: { medium: string; original: string };
  summary?: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const [shows, setShows] = useState<Show[]>([]);

  const { data, isLoading } = useSWR(
    searchKey
      ? `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
          searchKey
        )}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setShows(data.map((item: any) => item.show));
    }
  }, [data]);

  const search = () => {
    if (!query.trim()) return;
    setSearchKey(query.trim());
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
        <button onClick={search} disabled={isLoading}>
          Search
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
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
