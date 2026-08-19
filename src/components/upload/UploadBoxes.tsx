import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import { Stack } from '@mui/material';

import { UploadBox } from './UploadBox';

interface UploadBoxesProps {
  onImagesSelected: (files: File[]) => void;
}

export function UploadBoxes({ onImagesSelected }: UploadBoxesProps) {
  const handleWatermarkSelected = (files: File[]) => {
    console.log('Watermark:', files);
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1 }}>
      <UploadBox
        icon={<ImageOutlinedIcon sx={{ fontSize: 48 }} />}
        title="Добави изображения"
        description="Кликни или плъзни изображения тук"
        formats="JPG, PNG, WebP до 20MB"
        accept={{
          'image/jpeg': [],
          'image/png': [],
          'image/webp': [],
        }}
        multiple
        onFilesSelected={onImagesSelected}
      />

      <UploadBox
        icon={<TextFieldsOutlinedIcon sx={{ fontSize: 48 }} />}
        title="Добави воден знак"
        description="Кликни или плъзни изображение тук"
        formats="PNG, JPG, WebP до 20MB"
        accept={{
          'image/jpeg': [],
          'image/png': [],
          'image/webp': [],
        }}
        onFilesSelected={handleWatermarkSelected}
      />
    </Stack>
  );
}
