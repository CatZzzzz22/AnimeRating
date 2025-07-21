import { Box, Grid, Typography } from "@mui/material";
import type { AnimeType } from "../../types";
import Anime from "../Anime";

interface Props {
  animeList: AnimeType[];
  watchlist: Set<number>;
  toggleWatchlist: (aid: number) => void;
  isLoggedIn: boolean;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
}

const AnimeList = ({ animeList, watchlist, toggleWatchlist, isLoggedIn, ratings, rateAnime }: Props) => {
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
    <Grid container spacing={2} gap={3} sx={{ width: "100%", mx: "auto" }}>
      {animeList.map((anime, index) => (
        <Grid key={index} size={12}>
          <Anime
            anime={anime}
            inWatchlist={watchlist.has(anime.aid)}
            onToggleWatchlist={() => toggleWatchlist(anime.aid)}
            isLoggedIn={isLoggedIn}
            ratings={ratings}
            rateAnime={rateAnime}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default AnimeList;
