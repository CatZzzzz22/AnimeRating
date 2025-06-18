import type { AnimeType } from "../types";
import Anime from "./Anime";

interface Props {
  animeList: AnimeType[];
}

const AnimeList = ({ animeList }: Props) => {
  return (
    <>
      {animeList.map(anime => <Anime anime={anime} />)}
    </>
  );
}

export default AnimeList;
