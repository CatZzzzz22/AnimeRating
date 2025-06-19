import type { AnimeType } from "../../types";
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';

interface Props {
  anime: AnimeType;
}

const Anime = ({ anime }: Props) => {
  return (
    <Card sx={{ display: 'flex', height: 200, border: 1 }}>
      <CardMedia
        component="img"
        sx={{ width: 140, objectFit: 'cover' }}
        image={anime.imageURL}
        alt={anime.aname}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent>
          <Typography component="h2" variant="h6" gutterBottom>
            {anime.aname}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
            }}
          >
            {anime.synopsis}
          </Typography>

          <Typography variant="body2" color="text.primary">
            <strong>Rating:</strong> {anime.score ?? 'N/A'}
          </Typography>

          <Typography variant="body2" color="text.primary">
            <strong>Aired:</strong> {anime.aired
              ? new Date(anime.aired).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
              : 'Unknown'}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Anime;
