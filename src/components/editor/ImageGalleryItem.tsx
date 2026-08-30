import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';

import type { ImageItem } from '@/features/images/image.types';

interface ImageGalleryItemProps {
  image: ImageItem;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ImageGalleryItem({ image, onDelete, onEdit }: ImageGalleryItemProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={image.previewUrl}
          alt={image.name}
          sx={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>

      <Stack
        direction="row"
        sx={{
          p: 1,
          gap: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="caption"
          noWrap
          title={image.name}
          sx={{
            minWidth: 0,
          }}
        >
          {image.name}
        </Typography>

        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            aria-label={`Edit ${image.name}`}
            onClick={() => onEdit(image.id)}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            aria-label={`Delete ${image.name}`}
            onClick={() => onDelete(image.id)}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
