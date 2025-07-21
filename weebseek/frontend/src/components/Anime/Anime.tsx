import type { AnimeType } from "../../types";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Rating from '@mui/material/Rating';
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { apiFetch } from "../../helpers";

interface Props {
  anime: AnimeType;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
  isLoggedIn: boolean;
  ratings: Map<number, number>;
  rateAnime: (aid: number, score: number | null) => void;
}

const Anime = ({ anime, inWatchlist, onToggleWatchlist, isLoggedIn, ratings, rateAnime }: Props) => {
  const navigate = useNavigate();

  const airedDate = anime.aired
    ? new Date(anime.aired).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "Unknown";

  const handleCardClick = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await apiFetch("/api/user/view", {
          method: 'POST',
          body: JSON.stringify({ aid: anime.aid }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Failed to record view: ", err);
      }
    }
    navigate(`/anime/${anime.aid}`);
  }, [anime.aid, isLoggedIn, navigate]);

  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: 2,
        boxShadow: 1,
        overflow: "hidden",
        width: "100%",
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
          textDecoration: 'none',
        },
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        sx={{ width: 140, objectFit: "cover" }}
        image={anime.imageURL}
        alt={anime.aname}
      />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
        {isLoggedIn && (
          <Tooltip title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWatchlist();
              }}
              sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
              color={inWatchlist ? "error" : "default"}
            >
              {inWatchlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        )}

        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" align="center" gutterBottom>
            {anime.aname}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {anime.synopsis}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="caption">
              <strong>Rating:</strong> {anime.score ?? "N/A"}
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="caption">
              <strong>Aired:</strong> {airedDate}
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="caption">
              <strong>Type:</strong> {anime.type}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
          >
            <Typography variant="caption">
              <strong>Genres:</strong>
            </Typography>
            <Typography variant="caption">{anime.genres ?? "N/A"}</Typography>
          </Stack>

          {isLoggedIn && (
            <Box
              mt={1}
              textAlign="center"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onContextMenu={(e) => {
                e.stopPropagation();
              }}
            >
              <Rating
                name={`rating-${anime.aid}`}
                value={ratings.get(anime.aid) ?? null}
                max={10}
                precision={1}
                onChange={(_, newValue) => {
                  rateAnime(anime.aid, newValue);
                  console.log('rating changed to ', newValue)
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  rateAnime(anime.aid, null);
                }}
              />
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default Anime;
