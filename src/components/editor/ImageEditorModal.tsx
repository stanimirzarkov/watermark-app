import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import type { EditorImage, EditorWatermark } from '@/features/editor/editor.types';

import { ImageEditorCanvas } from './ImageEditorCanvas';

interface ImageEditorModalProps {
  open: boolean;
  image: EditorImage | null;
  watermark: EditorWatermark | null;
  onClose: () => void;
}

export function ImageEditorModal({ open, image, watermark, onClose }: ImageEditorModalProps) {
  if (!image || !watermark) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Edit image
        <IconButton
          aria-label="Close editor"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'auto',
          }}
        >
          <ImageEditorCanvas
            imageSrc={image.src}
            watermarkSrc={watermark.src}
            width={800}
            height={600}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
