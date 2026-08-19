import type { FileRejection } from 'react-dropzone';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import { Stack } from '@mui/material';

import { UploadBox } from './UploadBox';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
};

interface UploadBoxesProps {
  onImagesSelected: (files: File[]) => void;
  onImagesRejected?: (rejections: FileRejection[]) => void;
}

export function UploadBoxes({ onImagesSelected, onImagesRejected }: UploadBoxesProps) {
  const handleWatermarkSelected = (files: File[]) => {
    console.log('Watermark:', files);
  };

  const handleWatermarkRejected = (rejections: FileRejection[]) => {
    console.log('Rejected watermark:', rejections);
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1 }}>
      <UploadBox
        icon={<ImageOutlinedIcon sx={{ fontSize: 48 }} />}
        title="Добави изображения"
        description="Кликни или плъзни изображения тук"
        formats="JPG, PNG, WebP до 20MB"
        accept={ACCEPTED_IMAGE_TYPES}
        multiple
        maxSize={MAX_FILE_SIZE}
        onFilesSelected={onImagesSelected}
        onFilesRejected={onImagesRejected}
      />

      <UploadBox
        icon={<TextFieldsOutlinedIcon sx={{ fontSize: 48 }} />}
        title="Добави воден знак"
        description="Кликни или плъзни изображение тук"
        formats="PNG, JPG, WebP до 20MB"
        accept={ACCEPTED_IMAGE_TYPES}
        maxSize={MAX_FILE_SIZE}
        onFilesSelected={handleWatermarkSelected}
        onFilesRejected={handleWatermarkRejected}
      />
    </Stack>
  );
}
