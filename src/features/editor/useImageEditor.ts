import { useCallback, useState } from 'react';

import type { ImageItem } from '@/features/images/image.types';
import type { Watermark } from '@/features/watermark/watermark.types';
import type { EditorImage, EditorWatermark } from './editor.types';

interface UseImageEditorProps {
  images: ImageItem[];
  watermark: Watermark | null;
}

export function useImageEditor({ images, watermark }: UseImageEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<EditorImage | null>(null);

  const [editorWatermark, setEditorWatermark] = useState<EditorWatermark | null>(null);

  const editImage = useCallback(
    (imageId: string) => {
      const image = images.find((currentImage) => currentImage.id === imageId);

      if (!image || !watermark) {
        return;
      }

      setSelectedImage({
        id: image.id,
        src: image.previewUrl,
        name: image.name,
      });

      setEditorWatermark({
        src: watermark.previewUrl,
        name: watermark.name,
      });

      setIsOpen(true);
    },
    [images, watermark],
  );

  const closeEditor = useCallback(() => {
    setIsOpen(false);
    setSelectedImage(null);
    setEditorWatermark(null);
  }, []);

  return {
    isOpen,
    selectedImage,
    watermark: editorWatermark,
    editImage,
    closeEditor,
  };
}
