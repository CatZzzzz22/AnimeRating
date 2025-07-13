import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../helpers';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import type { AnimeType } from '../types';
import AnimeList from '../components/AnimeList';

interface PublicUser {
  uid: number;
  username: string;
  isFollowing: boolean;
}

interface Props {
  isLoggedIn: boolean;
  watchlist: Set<number>;
  toggleWatchlist: (aid: number) => void;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
}

const UserProfilePage = ({ isLoggedIn, watchlist, toggleWatchlist, ratings, rateAnime }: Props) => {
  const { uid } = useParams();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    Promise.all([
      apiFetch<PublicUser>(`/api/user/${uid}`),
      apiFetch<AnimeType[]>(`/api/user/${uid}/watchlist`)
    ])
      .then(([userData, animeData]) => {
        setUser(userData);
        setAnimeList(animeData);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [uid]);

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      await apiFetch(`/api/user/${uid}/${user.isFollowing ? 'unfollow' : 'follow'}`, { method: 'POST' });
      setUser({ ...user, isFollowing: !user.isFollowing });
    } catch (e) {
      console.error('Failed to toggle follow', e);
    }
  };

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error || !user) return <Alert severity="error">{error ?? "User not found."}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {user.username}'s Profile
      </Typography>

      {isLoggedIn && (
        <Button variant="outlined" onClick={handleFollowToggle} sx={{ mb: 2 }}>
          {user.isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}

      <Typography variant="h6">Watchlist</Typography>
      <AnimeList
        animeList={animeList}
        watchlist={watchlist}
        toggleWatchlist={toggleWatchlist}
        ratings={ratings}
        rateAnime={rateAnime}
        isLoggedIn={isLoggedIn}
      />
    </Container>
  );
};

export default UserProfilePage;
