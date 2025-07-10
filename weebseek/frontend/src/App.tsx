import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';

import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import AuthModal from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { apiFetch } from './helpers';
import AnimePage from './pages/AnimePage';
import UserPage from './pages/UserPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  const { user, logout, checkSession, loading: authLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());
  const [ratings, setRatings] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      apiFetch<number[]>('/api/watchlist')
        .then((data) => setWatchlist(new Set(data)))
        .catch((err) => console.error('Failed to load watchlist', err));
    } else {
      setWatchlist(new Set());
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      apiFetch<{ aid: number; score: number }[]>('/api/rating')
        .then((data) => {
          const map = new Map(data.map(r => [r.aid, r.score]));
          setRatings(map);
        })
        .catch(err => console.error('Failed to load ratings', err));
    } else {
      setRatings(new Map());
    }
  }, [user]);

  const rateAnime = async (aid: number, score: number | null) => {
    const updated = new Map(ratings);
    try {
      if (score === null) {
        await apiFetch(`/api/rating/${aid}`, { method: 'DELETE' });
        updated.delete(aid);
      } else {
        await apiFetch(`/api/rating`, {
          method: 'POST',
          body: JSON.stringify({ aid, score }),
          headers: { 'Content-Type': 'application/json' },
        });
        updated.set(aid, score);
      }
      setRatings(updated);
    } catch (e) {
      console.error("Failed to update rating", e);
    }
  };

  const toggleWatchlist = async (aid: number) => {
    const updated = new Set(watchlist);
    try {
      if (watchlist.has(aid)) {
        await apiFetch(`/api/watchlist/${aid}`, { method: 'DELETE' });
        updated.delete(aid);
      } else {
        await apiFetch(`/api/watchlist`, {
          method: 'POST',
          body: JSON.stringify({ aid }),
          headers: { 'Content-Type': 'application/json' },
        });
        updated.add(aid);
      }
      setWatchlist(updated);
    } catch (e) {
      console.error('Failed to update watchlist', e);
    }
  };

  if (authLoading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Weebseek
          </Typography>
          {user && (
            <Typography sx={{ ml: 10, mr: 2 }}>
              Logged in as {user.username}
            </Typography>
          )}
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/watchlist">
                Watchlist
              </Button>
              <Button color="inherit" component={Link} to="/user">
                Profile
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => setAuthModalOpen(true)}>
              Login / Register
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              ratings={ratings}
              rateAnime={rateAnime}
              isLoggedIn={!!user}
            />
          }
        />
        <Route
          path="/watchlist"
          element={
            <WatchlistPage
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              ratings={ratings}
              rateAnime={rateAnime}
              isLoggedIn={!!user}
            />
          }
        />
        <Route
          path="/anime/:aid"
          element={
            <AnimePage
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              ratings={ratings}
              rateAnime={rateAnime}
              isLoggedIn={!!user}
            />
          }
        />
        <Route
          path="/user"
          element={<UserPage isLoggedIn={!!user} />}
        />
        <Route
          path="/user/:uid"
          element={
            <UserProfilePage
              isLoggedIn={!!user}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              ratings={ratings}
              rateAnime={rateAnime}
            />
          }
        />
      </Routes>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </Router>
  );
}

export default App;
