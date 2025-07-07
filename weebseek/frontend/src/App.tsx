import { useEffect, useState } from 'react';
import { apiFetch } from './helpers';
import type { AnimeType, GenreType, SortOrder, SortType } from './types';

import './App.css'
import AnimeList from './components/AnimeList';
import { Alert, AppBar, Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, Toolbar, Typography, type SelectChangeEvent } from '@mui/material';
import GenreFilter from './components/Filters';
import TypeFilter from './components/Filters/TypeFilter';
import AuthModal from './components/Auth';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading: authLoading, logout, checkSession } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [sortBy, setSortBy] = useState<SortType>("aired");

  const [genres, setGenres] = useState<GenreType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  const [animeList, setAnimeList] = useState<AnimeType[]>([]);

  const loadGenres = async () => {
    try {
      const data = await apiFetch<GenreType[]>('/api/anime/genre');
      setGenres(data);
    } catch (e) {
      console.error('Could not load Genres', e);
    }
  }

  const loadTypes = async () => {
    try {
      const data = await apiFetch<string[]>('/api/anime/type');
      setTypes(data);
    } catch (e) {
      console.error('Could not load Types', e);
    }
  }

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/anime/query?sort_by=${sortBy}&order=${sortOrder}`;
      if (selectedGenre) url += `&genre=${encodeURIComponent(selectedGenre)}`;
      if (selectedType) url += `&type=${encodeURIComponent(selectedType)}`;

      const data = await apiFetch<AnimeType[]>(url);
      if (!Array.isArray(data)) {
        setAnimeList([]);
      } else {
        setAnimeList(data);
      }
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

  useEffect(() => {
    checkSession();
    loadGenres();
    loadTypes();
  }, []);

  useEffect(() => {
    fetchAnime();
  }, [sortBy, sortOrder, selectedGenre, selectedType])

  if (authLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Weebseek
          </Typography>
          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>Hi, {user.username}</Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
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
            types={types}
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
      />
    </>
  )
}

export default App
