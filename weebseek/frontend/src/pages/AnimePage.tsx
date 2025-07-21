import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../helpers';
import type { AnimeType } from '../types';

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Rating,
  Button,
} from '@mui/material';

interface Props {
  watchlist: Set<number>;
  toggleWatchlist: (aid: number) => void;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
  isLoggedIn: boolean;
}

function AnimePage({ watchlist, toggleWatchlist, ratings, rateAnime, isLoggedIn }: Props) {
  const { aid } = useParams();
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!aid) return;
    apiFetch<AnimeType>(`/api/anime/${aid}`)
      .then(data => setAnime(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [aid]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error || !anime) return <Alert severity="error">{error ?? "Anime not found."}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{anime.aname}</Typography>

      <Box display="flex" gap={3} mb={3}>
        <img
          src={anime.imageURL}
          alt={anime.aname}
          style={{ width: 200, borderRadius: 8, objectFit: 'cover' }}
        />

        <Box flex={1}>
          <Typography variant="body1" paragraph>{anime.synopsis}</Typography>
          <Typography><strong>Score:</strong> {anime.score ?? "N/A"}</Typography>
          <Typography><strong>Genres:</strong> {anime.genres}</Typography>
          <Typography><strong>Type:</strong> {anime.type}</Typography>
          <Typography><strong>Aired:</strong> {anime.aired}</Typography>
          <Typography><strong>Episodes:</strong> {anime.episodes}</Typography>
        </Box>
      </Box>

      {isLoggedIn && (
        <Box mt={3}>
          <Typography variant="h6">Your Rating:</Typography>
          <Rating
            name="user-rating"
            max={10}
            value={ratings.get(anime.aid) ?? null}
            precision={1}
            onChange={(_, newValue) => rateAnime(anime.aid, newValue)}
            onContextMenu={(e) => {
              e.preventDefault();
              rateAnime(anime.aid, null);
            }}
          />
          <Box mt={2}>
            <Button
              variant={watchlist.has(anime.aid) ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => toggleWatchlist(anime.aid)}
            >
              {watchlist.has(anime.aid) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default AnimePage;
