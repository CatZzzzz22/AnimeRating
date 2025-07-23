import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../helpers';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import AnimeList from '../components/AnimeList';
import { format } from 'date-fns';
import type { AnimeType } from '../types';

interface ProfileUser {
  uid: number;
  uname: string;
  username: string;
  age: number;
  gender: string;
  location: string;
  joinedDate: string;
  isFollowing: boolean;
}

interface Props {
  isLoggedIn: boolean;
  watchlist: Set<number>;
  toggleWatchlist: (aid: number) => void;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
}

const UserProfilePage = ({
  isLoggedIn,
  watchlist,
  toggleWatchlist,
  ratings,
  rateAnime,
}: Props) => {
  const { uid } = useParams<{ uid: string }>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    Promise.all([
      apiFetch<Omit<ProfileUser, 'isFollowing'>>(`/api/user/profile/${uid}`),
      apiFetch<AnimeType[]>(`/api/user/${uid}/watchlist`),
    ])
      .then(([profileData, watch]) => {
        setUser({ ...profileData, isFollowing: false });
        setAnimeList(Array.isArray(watch) ? watch : []);
        setError(null);
      })
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, [uid]);

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      await apiFetch(
        `/api/user/${user.isFollowing ? 'unfollow' : 'follow'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followeeUid: user.uid }),
        }
      );
      setUser(u => u && { ...u, isFollowing: !u.isFollowing });
    } catch (e) {
      console.error('Failed to toggle follow', e);
    }
  };

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error || !user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error ?? 'User not found.'}</Alert>
      </Container>
    );
  }

  let joined = user.joinedDate;
  try {
    joined = format(new Date(user.joinedDate), 'MMMM d, yyyy');
  } catch { }

  const initials = user.uname
    .split(' ')
    .map(p => p[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Avatar sx={{ width: 64, height: 64, fontSize: 24 }}>
                {initials}
              </Avatar>
              <Box ml={2}>
                <Typography variant="h5">{user.uname}</Typography>
                <Typography color="text.secondary">
                  @{user.username}
                </Typography>
                <Box mt={1}>
                  {user.age > 0 && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {user.age} yrs
                    </Typography>
                  )}
                  {user.gender && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ mx: 1 }}
                    >
                      · {user.gender}
                    </Typography>
                  )}
                  {user.location && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      · {user.location}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Joined {joined}
                </Typography>
              </Box>
            </Box>
            {isLoggedIn && (
              <Button
                variant={user.isFollowing ? 'outlined' : 'contained'}
                onClick={handleFollowToggle}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Watchlist ({animeList.length})
      </Typography>
      {animeList.length === 0 ? (
        <Typography color="text.secondary">
          This user hasn’t added anything to their watchlist yet.
        </Typography>
      ) : (
        <AnimeList
          animeList={animeList}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          ratings={ratings}
          rateAnime={rateAnime}
          isLoggedIn={isLoggedIn}
        />
      )}
    </Container>
  );
};

export default UserProfilePage;
