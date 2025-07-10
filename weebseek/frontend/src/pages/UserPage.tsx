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
import { Link } from 'react-router-dom';

interface Props {
  isLoggedIn: boolean;
}

const UserPage = ({ isLoggedIn }: Props) => {
  const [recent, setRecent] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    apiFetch<AnimeType[]>('/api/user/recent')
      .then((data) => setRecent(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Recently Viewed Anime
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : recent.length === 0 ? (
        <Typography>No recently viewed anime yet.</Typography>
      ) : (
        <Box display="flex" gap={2} overflow="auto">
          {recent.map((anime) => (
            <Box
              key={anime.aid}
              minWidth={120}
              textAlign="center"
              component={Link}
              to={`/anime/${anime.aid}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img
                src={anime.imageURL}
                alt={anime.aname}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  objectFit: 'cover',
                  marginBottom: 4,
                }}
              />
              <Typography
                variant="caption"
                noWrap
                sx={{
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  mx: 'auto',
                }}
              >
                {anime.aname}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default UserPage;
