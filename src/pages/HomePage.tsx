import { Container, Stack } from '@mui/material';
import { useState } from 'react';

import { ActionButtons } from '@/components/editor/ActionButtons';
import { ImageGallery } from '@/components/editor/ImageGallery';
import { UploadBoxes } from '@/components/upload/UploadBoxes';
import type { ImageItem } from '@/features/images/image.types';

export function HomePage() {
  const [images, setImages] = useState<ImageItem[]>([]);

  const handleImagesSelected = (files: File[]) => {
    const newImages: ImageItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((currentImages) => [...currentImages, ...newImages]);
  };

  const handleDeleteImage = (id: string) => {
    setImages((currentImages) => {
      const imageToDelete = currentImages.find((image) => image.id === id);

      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.previewUrl);
      }

      return currentImages.filter((image) => image.id !== id);
    });
  };

  const handleDeleteAll = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });

    setImages([]);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: 'stretch',
          }}
        >
          <UploadBoxes onImagesSelected={handleImagesSelected} />

          <ActionButtons onDeleteAll={handleDeleteAll} />
        </Stack>

        <ImageGallery images={images} onDeleteImage={handleDeleteImage} />
      </Stack>
    </Container>
  );
}
