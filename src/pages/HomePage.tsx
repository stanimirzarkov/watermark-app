import { Box, Stack } from '@mui/material';

import { ImageEditorModal } from '@/components/editor/ImageEditorModal';
import { ImageGallery } from '@/components/editor/ImageGallery';
import { UploadBoxes } from '@/components/upload/UploadBoxes';

import { useImageEditor } from '@/features/editor/useImageEditor';
import { useImages } from '@/features/images/useImages';
import { useWatermark } from '@/features/watermark/useWatermark';

export function HomePage() {
  const { images, addImages, handleRejectedFiles, deleteImage, deleteAll } = useImages();

  const { watermark, setWatermark } = useWatermark();

  const {
    isOpen,
    selectedImage,
    watermark: editorWatermark,
    watermarkConfig,
    editImage,
    closeEditor,
    updateWatermarkConfig,
    saveWatermarkConfig,
  } = useImageEditor({
    images,
    watermark,
  });

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1400,
        mx: 'auto',
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        py: {
          xs: 3,
          md: 4,
        },
      }}
    >
      <Stack spacing={4}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            gap: 3,
            alignItems: {
              xs: 'stretch',
              md: 'flex-start',
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <UploadBoxes
              onImagesSelected={addImages}
              onImagesRejected={handleRejectedFiles}
              onWatermarkSelected={setWatermark}
              watermarkPreviewUrl={watermark?.previewUrl}
              watermarkName={watermark?.name}
            />
          </Box>
        </Box>

        <ImageGallery images={images} onDeleteImage={deleteImage} onEditImage={editImage} />
      </Stack>

      <ImageEditorModal
        open={isOpen}
        image={selectedImage}
        images={images}
        watermark={editorWatermark}
        watermarkConfig={watermarkConfig}
        onWatermarkConfigChange={updateWatermarkConfig}
        onClose={closeEditor}
        onSave={saveWatermarkConfig}
      />
    </Box>
  );
}
