import { useEffect, useState, useRef, useCallback } from 'react';
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
import { useNavigate } from 'react-router-dom';

interface Props {
  watchlist: Set<number>;
  toggleWatchlist: (aid: number) => void;
  isLoggedIn: boolean;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
}

const ITEMS_PER_LOAD = 20;

function HomePage({ watchlist, toggleWatchlist, isLoggedIn, ratings, rateAnime }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [sortBy, setSortBy] = useState<SortType>('aired');
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [recommended, setRecommended] = useState<AnimeType[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadAnimeList = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/anime/query?sort_by=${sortBy}&order=${sortOrder}`;
      if (selectedGenre) url += `&genre=${encodeURIComponent(selectedGenre)}`;
      if (selectedType) url += `&type=${encodeURIComponent(selectedType)}`;
      if (searchQuery) url += `&aname=${encodeURIComponent(searchQuery)}`;

      const data = await apiFetch<AnimeType[]>(url);
      setAnimeList(Array.isArray(data) ? data : []);
      setVisibleCount(ITEMS_PER_LOAD);
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
      const data = await apiFetch<AnimeType[]>('/api/user/recommendation/anime');
      setRecommended(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setRecError(e.message);
    } finally {
      setRecLoading(false);
    }
  };

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, animeList.length));
    }
  }, [animeList.length]);

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    loadAnimeList();
  }, [sortBy, sortOrder, selectedGenre, selectedType, searchQuery]);

  useEffect(() => {
    const init = async () => {
      const genreData = await apiFetch<GenreType[]>('/api/anime/genre');
      setGenres(Array.isArray(genreData) ? genreData : []);
      const typeData = await apiFetch<string[]>('/api/anime/type');
      setTypes(Array.isArray(typeData) ? typeData : []);
      if (isLoggedIn) fetchRecommended();
    };
    init();
  }, []);

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
                <Box key={anime.aid} textAlign="center" minWidth={120} onClick={async () => {
                  await apiFetch("/api/user/view", {
                    method: 'POST',
                    body: JSON.stringify({ aid: anime.aid }),
                    headers: { "Content-Type": "application/json" },
                  });
                  navigate(`/anime/${anime.aid}`)
                }}>
                  <img
                    src={anime.imageURL}
                    alt={anime.aname}
                    style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
                  />
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', mt: 0.5, mx: 'auto' }}
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
        <SearchBar onSearch={(query) => setSearchQuery(query)} />
      </Box>

      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <AnimeList
            animeList={animeList.slice(0, visibleCount)}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            isLoggedIn={isLoggedIn}
            ratings={ratings}
            rateAnime={rateAnime}
          />
          {visibleCount < animeList.length && (
            <Box ref={loaderRef} textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">Loading more...</Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default HomePage;
