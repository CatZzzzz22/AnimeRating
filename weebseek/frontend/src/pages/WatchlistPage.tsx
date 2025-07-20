import { useEffect, useState } from 'react';
import { apiFetch } from '../helpers';
import type { AnimeType } from '../types';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import AnimeList from '../components/AnimeList';

interface Props {
  watchlist: Set<number>;
  toggleWatchlist: (aid: number) => void;
  isLoggedIn: boolean;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
}

function WatchlistPage({ watchlist, toggleWatchlist, isLoggedIn, ratings, rateAnime }: Props) {
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AnimeType[]>('/api/watchlist/view')
      .then((data) => setAnimeList(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Watchlist
      </Typography>
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : animeList.length === 0 ? (
        <Typography>Your watchlist is empty</Typography>
      ) : (
        <AnimeList
          animeList={animeList}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          isLoggedIn={isLoggedIn}
          ratings={ratings}
          rateAnime={rateAnime}
        />
      )}
    </Container>
  );
}

export default WatchlistPage;
