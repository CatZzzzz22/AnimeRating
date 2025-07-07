import { Grid } from "@mui/material";
import type { AnimeType } from "../../types";
import Anime from "../Anime";

interface Props {
  animeList: AnimeType[];
}

const AnimeList = ({ animeList }: Props) => {
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
