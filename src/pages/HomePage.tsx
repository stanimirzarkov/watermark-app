import { Container, Stack } from '@mui/material';

import { ActionButtons } from '@/components/editor/ActionButtons';
import { ImageGallery, type GalleryImage } from '@/components/editor/ImageGallery';
import { UploadBoxes } from '@/components/upload/UploadBoxes';

const mockImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    name: 'landscape.jpg',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    name: 'mountains.jpg',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    name: 'lake.jpg',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    name: 'landscape.jpg',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    name: 'mountains.jpg',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    name: 'lake.jpg',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    name: 'landscape.jpg',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    name: 'mountains.jpg',
  },
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    name: 'lake.jpg',
  },
];

export function HomePage() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
          <UploadBoxes />
          <ActionButtons />
        </Stack>

        <ImageGallery images={mockImages} />
      </Stack>
    </Container>
  );
}
