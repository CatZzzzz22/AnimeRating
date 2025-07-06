import { useEffect, useState } from 'react';
import { apiFetch } from './helpers';
import type { AnimeType, SortOrder, SortType } from './types';

import './App.css'
import AnimeList from './components/AnimeList';
import { Alert, AppBar, Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, Toolbar, Typography, type SelectChangeEvent } from '@mui/material';
import GenreFilter from './components/Filters';
import TypeFilter from './components/Filters/TypeFilter';
import AuthModal from './components/Auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [sortBy, setSortBy] = useState<SortType>("aired");

  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const [selectedType, setSelectedType] = useState<string>('');

  const [animeList, setAnimeList] = useState<AnimeType[]>([]);

  const loadGenres = async () => {
    try {
      // const data = await apiFetch<string[]>('/api/genres');
      const data = ['Romance', 'Action'];
      setGenres(data);
    } catch (e) {
      console.error('Could not load Genres', e);
    }
  }

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/anime?sort_by=${sortBy}&order=${sortOrder}`;
      if (selectedGenre) url += `&genre=${encodeURIComponent(selectedGenre)}`;
      if (selectedType) url += `&type=${encodeURIComponent(selectedType)}`;

      const data = await apiFetch<AnimeType[]>(url);
      setAnimeList(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSortByChange = (e: SelectChangeEvent) => {
    setSortBy(e.target.value as SortType);
  }

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setIsLoggedIn(false);
  }

  // will need once cookies implemented - checks if there is existing cookie
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const me = await fetch('/api/check', { credentials: 'include' });
  //       if (me.ok) setIsLoggedIn(true);
  //     } catch { }
  //   })();
  // }, []);

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    fetchAnime();
  }, [sortBy, sortOrder, selectedGenre, selectedType])

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Weebseek
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color='inherit' onClick={() => setAuthModalOpen(true)}>
              Login / Register
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort by"
              onChange={handleSortByChange}
              size="small"
            >
              <MenuItem value="score">Score</MenuItem>
              <MenuItem value="aired">Aired Date</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onChange={setSelectedGenre}
          />

          <TypeFilter
            selectedType={selectedType}
            onChange={setSelectedType}
          />
        </Box>

        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <AnimeList animeList={animeList} />
        )}
      </Container>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setIsLoggedIn(true)}
      />
    </>
  )
}

export default App
