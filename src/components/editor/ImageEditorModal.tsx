import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import type { EditorImage, EditorWatermark, WatermarkConfig } from '@/features/editor/editor.types';

import { EditorControls } from './EditorControls';
import { ImageEditorCanvas } from './ImageEditorCanvas';

interface ImageEditorModalProps {
  open: boolean;
  image: EditorImage | null;
  watermark: EditorWatermark | null;
  watermarkConfig: WatermarkConfig;
  onWatermarkConfigChange: (updates: Partial<WatermarkConfig>) => void;
  onClose: () => void;
}

export function ImageEditorModal({
  open,
  image,
  watermark,
  watermarkConfig,
  onWatermarkConfigChange,
  onClose,
}: ImageEditorModalProps) {
  if (!image || !watermark) {
    return null;
  }

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

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          py: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Отказ
        </Button>

        <Button variant="contained">Приложи</Button>
      </Box>
    </Dialog>
  );
}
