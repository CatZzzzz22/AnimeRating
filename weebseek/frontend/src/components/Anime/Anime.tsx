import type { AnimeType } from "../../types";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Divider,
  Chip
} from "@mui/material";

interface Props {
  anime: AnimeType;
}

const Anime = ({ anime }: Props) => {
  const airedDate = anime.aired
    ? new Date(anime.aired).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "Unknown";

  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: 2,
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 140, objectFit: "cover" }}
        image={anime.imageURL}
        alt={anime.aname}
      />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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

            <Typography variant="caption">{anime.gname ?? "N/A"}</Typography>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Anime;
