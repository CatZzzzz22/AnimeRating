import { useEffect, useState } from 'react';
import { apiFetch } from '../helpers';
import type { AnimeType } from '../types';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
  isLoggedIn: boolean;
}

interface PublicUser {
  uid: number;
  username: string;
  isFollowing: boolean;
}

const UserPage = ({ isLoggedIn }: Props) => {
  const [recent, setRecent] = useState<AnimeType[]>([]);
  const [followers, setFollowers] = useState<PublicUser[]>([]);
  const [following, setFollowing] = useState<PublicUser[]>([]);
  const [recommend, setRecommend] = useState<PublicUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [recentData, followersData, followingData, recommendData] =
        await Promise.all([
          apiFetch<AnimeType[]>('/api/user/recent-viewed'),
          apiFetch<PublicUser[]>('/api/user/followers'),
          apiFetch<PublicUser[]>('/api/user/following'),
          apiFetch<PublicUser[]>('/api/user/recommendations/user'),
        ]);
      setRecent(Array.isArray(recentData) ? recentData : []);
      setFollowers(followersData);
      setFollowing(followingData);
      setRecommend(recommendData);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSocial = async () => {
    try {
      const [followersData, followingData, recommendData] = await Promise.all([
        apiFetch<PublicUser[]>('/api/user/followers'),
        apiFetch<PublicUser[]>('/api/user/following'),
        apiFetch<PublicUser[]>('/api/user/recommendations/user'),
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
      setRecommend(recommendData);
    } catch (e: any) {
      console.error('Failed to refresh social lists', e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadAll();
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

      <Box mt={4}>
        <Typography variant="h6">Social</Typography>

        <Stack direction="row" spacing={3} mb={2}>
          <Typography variant="body2">Followers: {followers.length}</Typography>
          <Typography variant="body2">Following: {following.length}</Typography>
        </Stack>

        <Typography variant="subtitle1" gutterBottom>
          People you may want to follow:
        </Typography>

        {recommend.length === 0 ? (
          <Typography variant="body2">No suggestions at this time.</Typography>
        ) : (
          <List dense>
            {recommend.map((u) => (
              <ListItem
                key={u.uid}
                secondaryAction={
                  <Button
                    size="small"
                    variant={u.isFollowing ? 'outlined' : 'contained'}
                    onClick={async () => {
                      await apiFetch(`/api/user/${u.isFollowing ? 'unfollow' : 'follow'}`, {
                        method: 'POST',
                        body: JSON.stringify({ followeeUid: u.uid }),
                        headers: { 'Content-Type': 'application/json' },
                      });
                      setRecommend((prev) =>
                        prev.map((user) =>
                          user.uid === u.uid ? { ...user, isFollowing: !user.isFollowing } : user
                        )
                      );
                      loadSocial();
                    }}
                  >
                    {u.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                }
              >
                <ListItemText
                  primary={<Link to={`/user/${u.uid}`}>{u.username}</Link>}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            Your Followers
          </Typography>
          {followers.length === 0 ? (
            <Typography variant="body2">No one is following you yet.</Typography>
          ) : (
            <List dense>
              {followers.map((u) => (
                <ListItem
                  key={u.uid}
                  secondaryAction={
                    <Button
                      size="small"
                      variant={u.isFollowing ? 'outlined' : 'contained'}
                      onClick={async () => {
                        await apiFetch(`/api/user/${u.isFollowing ? 'unfollow' : 'follow'}`, {
                          method: 'POST',
                          body: JSON.stringify({ followeeUid: u.uid }),
                          headers: { 'Content-Type': 'application/json' },
                        });
                        setFollowers((prev) =>
                          prev.map((user) =>
                            user.uid === u.uid ? { ...user, isFollowing: !user.isFollowing } : user
                          )
                        );
                        loadSocial();
                      }}
                    >
                      {u.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  }
                >
                  <ListItemText
                    primary={<Link to={`/user/${u.uid}`}>{u.username}</Link>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            You’re Following
          </Typography>
          {following.length === 0 ? (
            <Typography variant="body2">You're not following anyone yet.</Typography>
          ) : (
            <List dense>
              {following.map((u) => (
                <ListItem
                  key={u.uid}
                  secondaryAction={
                    <Button
                      size="small"
                      variant={u.isFollowing ? 'outlined' : 'contained'}
                      onClick={async () => {
                        await apiFetch(`/api/user/${u.isFollowing ? 'unfollow' : 'follow'}`, {
                          method: 'POST',
                          body: JSON.stringify({ followeeUid: u.uid }),
                          headers: { 'Content-Type': 'application/json' },
                        });
                        setFollowing((prev) =>
                          prev.map((user) =>
                            user.uid === u.uid ? { ...user, isFollowing: !user.isFollowing } : user
                          )
                        );
                        loadSocial();
                      }}
                    >
                      {u.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  }
                >
                  <ListItemText
                    primary={<Link to={`/user/${u.uid}`}>{u.username}</Link>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>

    </Container>
  );
};

export default UserPage;
