import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

interface Props {
  genres: string[];
  selectedGenre: string;
  onChange: (newSelection: string) => void;
}

const GenreFilter = ({ genres, selectedGenre, onChange }: Props) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="genre-filter-label">Genre</InputLabel>
      <Select
        labelId="genre-filter-label"
        value={selectedGenre}
        label="Genre"
        onChange={handleChange}
      >
        <MenuItem value="">All Genres</MenuItem>
        {genres.map((g) => (
          <MenuItem key={g} value={g}>
            {g}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default GenreFilter
