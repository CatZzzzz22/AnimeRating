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
          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {anime.synopsis}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default Anime;
