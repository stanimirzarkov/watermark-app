import { useCallback, useState } from 'react';

import type { ImageItem } from '@/features/images/image.types';
import type { Watermark } from '@/features/watermark/watermark.types';

import type { EditorImage, EditorWatermark, WatermarkConfig } from './editor.types';

const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  x: 0.5,
  y: 0.5,
  widthRatio: 0.5,
  opacity: 0.5,
};

interface UseImageEditorProps {
  images: ImageItem[];
  watermark: Watermark | null;
}

export function useImageEditor({ images, watermark }: UseImageEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState<EditorImage | null>(null);

  const [editorWatermark, setEditorWatermark] = useState<EditorWatermark | null>(null);

  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>(DEFAULT_WATERMARK_CONFIG);

  const [savedWatermarkConfig, setSavedWatermarkConfig] =
    useState<WatermarkConfig>(DEFAULT_WATERMARK_CONFIG);

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

      setWatermarkConfig(savedWatermarkConfig);

      setIsOpen(true);
    },
    [images, savedWatermarkConfig, watermark],
  );

  const closeEditor = useCallback(() => {
    setWatermarkConfig(savedWatermarkConfig);

    setIsOpen(false);
    setSelectedImage(null);
    setEditorWatermark(null);
  }, [savedWatermarkConfig]);

  const updateWatermarkConfig = useCallback((updates: Partial<WatermarkConfig>) => {
    setWatermarkConfig((currentConfig) => ({
      ...currentConfig,
      ...updates,
    }));
  }, []);

  const saveWatermarkConfig = useCallback(() => {
    setSavedWatermarkConfig({
      ...watermarkConfig,
    });

    setIsOpen(false);
  }, [watermarkConfig]);

  return {
    isOpen,
    selectedImage,
    watermark: editorWatermark,
    watermarkConfig,
    editImage,
    closeEditor,
    updateWatermarkConfig,
    saveWatermarkConfig,
  };
}
