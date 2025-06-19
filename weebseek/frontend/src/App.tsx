import { useEffect, useState } from 'react';
import { apiFetch } from './helpers';
import type { AnimeType, SortOrder, SortType } from './types';

import './App.css'
import AnimeList from './components/AnimeList';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [sortBy, setSortBy] = useState<SortType>("aired");
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<AnimeType[]>(
        `/api/anime?sort_by=${sortBy}&order=${sortOrder}`
      );
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

  useEffect(() => {
    fetchAnime();
  }, [sortBy, sortOrder])

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anime List
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <FormControl>
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
      </Box>

      <AnimeList animeList={animeList} />
    </Container>
  )
}

export default App
