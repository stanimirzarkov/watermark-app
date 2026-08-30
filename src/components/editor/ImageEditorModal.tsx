import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useRef } from 'react';

import type {
  EditorImage,
  EditorWatermark,
  ImageItem,
  WatermarkConfig,
} from '@/features/editor/editor.types';

import { EditorActions } from './EditorActions';
import { EditorControls } from './EditorControls';
import { ImageEditorCanvas, type ImageEditorCanvasHandle } from './ImageEditorCanvas';
import { downloadAllImages } from './imageProcessor';

interface ImageEditorModalProps {
  open: boolean;
  image: EditorImage | null;
  images: ImageItem[];
  watermark: EditorWatermark | null;
  watermarkConfig: WatermarkConfig;
  onWatermarkConfigChange: (updates: Partial<WatermarkConfig>) => void;
  onClose: () => void;
  onSave: () => void;
}

export function ImageEditorModal({
  open,
  image,
  images,
  watermark,
  watermarkConfig,
  onWatermarkConfigChange,
  onClose,
  onSave,
}: ImageEditorModalProps) {
  const canvasRef = useRef<ImageEditorCanvasHandle | null>(null);

  if (!image || !watermark) {
    return null;
  }

  const handleApplyAndDownload = () => {
    const dataUrl = canvasRef.current?.exportImage();

    if (!dataUrl) {
      return;
    }

    const link = document.createElement('a');

    link.href = dataUrl;
    link.download = `watermarked-${image.name}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyAndDownloadAll = async () => {
    if (!watermark) {
      return;
    }
    await downloadAllImages(images, watermark, watermarkConfig);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" fullScreen>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        <Typography component="span" variant="h6">
          Редактиране на изображение
        </Typography>

        <IconButton aria-label="Затвори редактора" onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={3}
          sx={{
            width: '100%',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: {
                xs: 280,
                md: 0,
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto',
              borderRadius: 1,
              bgcolor: 'action.hover',
            }}
          >
            <ImageEditorCanvas
              ref={canvasRef}
              imageSrc={image.src}
              watermarkSrc={watermark.src}
              watermarkConfig={watermarkConfig}
              onWatermarkConfigChange={onWatermarkConfigChange}
            />
          </Box>

          <Box
            sx={{
              width: {
                xs: '100%',
                md: 280,
              },
              flexShrink: 0,
              overflowY: 'auto',
            }}
          >
            <EditorControls
              watermarkConfig={watermarkConfig}
              onWatermarkConfigChange={onWatermarkConfigChange}
            />
          </Box>
        </Stack>
      </DialogContent>

      <EditorActions
        onClose={onClose}
        onApply={onSave}
        onApplyAndDownload={handleApplyAndDownload}
        onApplyAndDownloadAll={handleApplyAndDownloadAll}
      />
    </Dialog>
  );
}
