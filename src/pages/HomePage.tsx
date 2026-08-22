import { Alert, Container, Stack } from '@mui/material';

import { ActionButtons } from '@/components/editor/ActionButtons';
import { ImageEditorModal } from '@/components/editor/ImageEditorModal';
import { ImageGallery } from '@/components/editor/ImageGallery';
import { UploadBoxes } from '@/components/upload/UploadBoxes';
import { useImageEditor } from '@/features/editor/useImageEditor';
import { useImages } from '@/features/images/useImages';
import { useWatermark } from '@/features/watermark/useWatermark';

export function HomePage() {
  const {
    images,
    uploadErrors,
    addImages,
    handleRejectedFiles,
    deleteImage,
    deleteAll,
    clearErrors,
  } = useImages();

  const { watermark, setWatermark } = useWatermark();

  const {
    isOpen,
    selectedImage,
    watermark: editorWatermark,
    editImage,
    closeEditor,
  } = useImageEditor({
    images,
    watermark,
  });

  const canProcess = images.length > 0 && watermark !== null;

  const canDelete = images.length > 0;

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
            onImagesSelected={addImages}
            onImagesRejected={handleRejectedFiles}
            onWatermarkSelected={setWatermark}
            watermarkPreviewUrl={watermark?.previewUrl}
            watermarkName={watermark?.name}
          />

          <ActionButtons canProcess={canProcess} canDelete={canDelete} onDeleteAll={deleteAll} />
        </Stack>

        {uploadErrors.length > 0 && (
          <Alert severity="warning" onClose={clearErrors}>
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

        <ImageGallery images={images} onDeleteImage={deleteImage} onEditImage={editImage} />
        <ImageEditorModal
          open={isOpen}
          image={selectedImage}
          watermark={editorWatermark}
          onClose={closeEditor}
        />
      </Stack>
    </Container>
  );
}
