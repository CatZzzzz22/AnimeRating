export interface AnimeType {
  aid: number,
  aname: string,
  score: number,
  aired: string,
  genres: string[];
  synopsis?: string;
  type?: string;
  episodes?: number;
  imageURL?: string;
}

export type SortType = "score" | "aired";

export type SortOrder = "asc" | "desc";

export const TypeOptions = [
  'TV',
  'Movie',
  'OVA',
  'ONA',
  'Special',
  'Music',
  'Unknown',
] as const;

