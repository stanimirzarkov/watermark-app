import { Box, Paper, Stack, Typography } from '@mui/material';

import type { ImageItem } from '@/features/images/image.types';

import { ImageGalleryItem } from './ImageGalleryItem';

interface ImageGalleryProps {
  images: ImageItem[];
  onDeleteImage: (id: string) => void;
  onEditImage: (id: string) => void;
}

export function ImageGallery({ images, onDeleteImage, onEditImage }: ImageGalleryProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        mt: 3,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Добавени изображения
      </Typography>

      {images.length === 0 ? (
        <Stack
          spacing={1}
          sx={{
            minHeight: 180,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography>Все още няма добавени изображения</Typography>

          <Typography variant="body2">Добави изображения от полето по-горе.</Typography>
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          {images.map((image) => (
            <ImageGalleryItem
              key={image.id}
              image={image}
              onDelete={onDeleteImage}
              onEdit={onEditImage}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}
