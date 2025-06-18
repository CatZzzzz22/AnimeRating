import { useEffect, useState } from 'react';
import { apiFetch } from './helpers';
import type { AnimeType } from './types';

import './App.css'
import AnimeList from './components/AnimeList';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<string>("desc");
  const [sortBy, setSortBy] = useState<string>("score");
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<AnimeType[]>(
        `/api/anime?sort_by=${sortBy}&order=${order}`
      );
      setAnimeList(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnime();
  }, [sortBy, order])

  return (
    <>
      <AnimeList animeList={animeList} />
    </>
  )
}

export default App
