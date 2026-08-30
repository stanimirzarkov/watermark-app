import { useCallback, useState } from 'react';
import type { FileRejection } from 'react-dropzone';

import type { ImageItem } from './image.types';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function useImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const addImages = useCallback((files: File[]) => {
    setUploadErrors([]);

    const newImages: ImageItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((currentImages) => [...currentImages, ...newImages]);
  }, []);

  const handleRejectedFiles = useCallback((rejections: FileRejection[]) => {
    const errors = rejections.map((rejection) => {
      const reasons = rejection.errors
        .map((error) => {
          if (error.code === 'file-too-large') {
            return `размерът надвишава ${MAX_FILE_SIZE / 1024 / 1024} MB`;
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
  }, []);

  const setProcessedImage = useCallback((id: string, processedBlob: Blob) => {
    setImages((currentImages) =>
      currentImages.map((image) =>
        image.id === id
          ? {
              ...image,
              processedBlob,
            }
          : image,
      ),
    );
  }, []);

  const setProcessedImages = useCallback((processedImages: Map<string, Blob>) => {
    setImages((currentImages) =>
      currentImages.map((image) => ({
        ...image,
        processedBlob: processedImages.get(image.id),
      })),
    );
  }, []);

  const deleteImage = useCallback((id: string) => {
    setUploadErrors([]);

    setImages((currentImages) => {
      const imageToDelete = currentImages.find((image) => image.id === id);

      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.previewUrl);
      }

      return currentImages.filter((image) => image.id !== id);
    });
  }, []);

  const deleteAll = useCallback(() => {
    setUploadErrors([]);

    setImages((currentImages) => {
      currentImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });

      return [];
    });
  }, []);

  const clearErrors = useCallback(() => {
    setUploadErrors([]);
  }, []);

  return {
    images,
    uploadErrors,
    addImages,
    handleRejectedFiles,
    setProcessedImage,
    setProcessedImages,
    deleteImage,
    deleteAll,
    clearErrors,
  };
}
