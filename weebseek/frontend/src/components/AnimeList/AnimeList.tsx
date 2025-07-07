import { Box, Grid, Typography } from "@mui/material";
import type { AnimeType } from "../../types";
import Anime from "../Anime";

interface Props {
  animeList: AnimeType[];
}

const AnimeList = ({ animeList }: Props) => {
  if (animeList.length === 0) {
    return (
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No anime results found.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} gap={3}>
      {animeList.map((anime, index) => (
        <Grid key={index}>
          <Anime anime={anime} />
        </Grid>
      ))}
    </Grid>
  );
}

export default AnimeList;
