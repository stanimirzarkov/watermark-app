import { Alert, Container, Stack } from '@mui/material';
import { useState } from 'react';
import type { FileRejection } from 'react-dropzone';

import { ActionButtons } from '@/components/editor/ActionButtons';
import { ImageGallery } from '@/components/editor/ImageGallery';
import { UploadBoxes } from '@/components/upload/UploadBoxes';
import type { ImageItem } from '@/features/images/image.types';

export function HomePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const handleImagesSelected = (files: File[]) => {
    setUploadErrors([]);

    const newImages: ImageItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((currentImages) => [...currentImages, ...newImages]);
  };

  const handleImagesRejected = (rejections: FileRejection[]) => {
    const errors = rejections.map((rejection) => {
      const reasons = rejection.errors
        .map((error) => {
          if (error.code === 'file-too-large') {
            return 'размерът надвишава 20 MB';
          }

          if (error.code === 'file-invalid-type') {
            return 'неподдържан формат';
          }

          if (error.code === 'too-many-files') {
            return 'твърде много файлове';
          }

          return error.message;
        })
        .join(', ');

      return `${rejection.file.name} — ${reasons}`;
    });

    setUploadErrors(errors);
  };

  const handleDeleteImage = (id: string) => {
    setUploadErrors([]);
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
    setUploadErrors([]);
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
          <UploadBoxes
            onImagesSelected={handleImagesSelected}
            onImagesRejected={handleImagesRejected}
          />

          <ActionButtons onDeleteAll={handleDeleteAll} />
        </Stack>

        {uploadErrors.length > 0 && (
          <Alert severity="warning" onClose={() => setUploadErrors([])}>
            <strong>Следните файлове не бяха качени:</strong>

            <ul
              style={{
                marginTop: 8,
                marginBottom: 0,
                paddingLeft: 20,
              }}
            >
              {uploadErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <ImageGallery images={images} onDeleteImage={handleDeleteImage} />
      </Stack>
    </Container>
  );
}
