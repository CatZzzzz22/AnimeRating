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

function App() {
  const { user, logout, checkSession, loading: authLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());

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
            <Typography sx={{ mr: 10 }}>
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
              isLoggedIn={!!user}
            />
          }
        />
      </Routes>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </Router>
  );
}

export default App;
