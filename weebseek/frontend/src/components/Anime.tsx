import type { AnimeType } from "../types";

interface Props {
  anime: AnimeType;
}

const Anime = ({ anime }: Props) => {
  return (
    <>
      {anime.aname}
    </>
  );
}

export default Anime;
