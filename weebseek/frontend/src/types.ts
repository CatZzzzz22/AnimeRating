export interface AnimeType {
  aid: number,
  aname: string,
  rating: number,
  aired: string,
  genres: string;
  synopsis?: string;
  type?: string;
  episodes?: number;
  imageURL?: string;
}

export type SortType = "score" | "aired";

export type SortOrder = "asc" | "desc";

