import { useEffect, useState } from 'react';
import { apiFetch } from '../helpers';
import type { AnimeType, GenreType, SortOrder, SortType } from '../types';

import AnimeList from '../components/AnimeList';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import GenreFilter from '../components/Filters';
import TypeFilter from '../components/Filters/TypeFilter';
import SearchBar from '../components/Filters/SearchBar';

interface Props {
  watchlist: Set<number>;
  toggleWatchlist: (aid: number) => void;
  isLoggedIn: boolean;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
}

function HomePage({ watchlist, toggleWatchlist, isLoggedIn, ratings, rateAnime }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [sortBy, setSortBy] = useState<SortType>('aired');
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);
  const [recommended, setRecommended] = useState<AnimeType[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const loadGenres = async () => {
    try {
      const data = await apiFetch<GenreType[]>('/api/anime/genre');
      setGenres(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Could not load Genres', e);
    }
  };

  const loadTypes = async () => {
    try {
      const data = await apiFetch<string[]>('/api/anime/type');
      setTypes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Could not load Types', e);
    }
  };

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/anime/query?sort_by=${sortBy}&order=${sortOrder}`;
      if (selectedGenre) url += `&genre=${encodeURIComponent(selectedGenre)}`;
      if (selectedType) url += `&type=${encodeURIComponent(selectedType)}`;

      const data = (await apiFetch<AnimeType[]>(url)).slice(0, 20);
      setAnimeList(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) return fetchAnime();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AnimeType[]>(
        `/api/anime/query?aname=${encodeURIComponent(query)}`
      );
      setAnimeList(Array.isArray(data) ? data.slice(0, 20) : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    setRecLoading(true);
    setRecError(null);
    try {
      const data = await apiFetch<AnimeType[]>('/api/anime/recommend');
      setRecommended(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setRecError(e.message);
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
    loadTypes();
    fetchRecommended();
  }, []);

  useEffect(() => {
    fetchAnime();
  }, [sortBy, sortOrder, selectedGenre, selectedType]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {isLoggedIn && (
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Recommended for You</Typography>
            <Button size="small" onClick={fetchRecommended}>Refresh</Button>
          </Box>
          {recLoading ? (
            <CircularProgress size={24} />
          ) : recError ? (
            <Alert severity="error">{recError}</Alert>
          ) : recommended.length === 0 ? (
            <Typography variant="body2">No recommendations available.</Typography>
          ) : (
            <Box display="flex" gap={2} overflow="auto">
              {recommended.map(anime => (
                <Box key={anime.aid} textAlign="center" minWidth={120}>
                  <img
                    src={anime.imageURL}
                    alt={anime.aname}
                    style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
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
                      mt: 0.5,
                      mx: 'auto',
                    }}
                  >
                    {anime.aname}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            value={sortBy}
            label="Sort by"
            onChange={(e: SelectChangeEvent) => setSortBy(e.target.value as SortType)}
            size="small"
          >
            <MenuItem value="score">Score</MenuItem>
            <MenuItem value="aired">Aired Date</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}>
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>

        <GenreFilter genres={genres} selectedGenre={selectedGenre} onChange={setSelectedGenre} />
        <TypeFilter types={types} selectedType={selectedType} onChange={setSelectedType} />
      </Box>

      <Box mb={3}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
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

export default HomePage;
