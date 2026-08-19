import type { ReactNode } from 'react';

import { Box, Paper, Stack, Typography } from '@mui/material';
import { useDropzone, type FileRejection } from 'react-dropzone';

interface UploadBoxProps {
  icon: ReactNode;
  title: string;
  description: string;
  formats: string;
  accept: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void;
}

export function UploadBox({
  icon,
  title,
  description,
  formats,
  accept,
  multiple = false,
  maxSize,
  onFilesSelected,
  onFilesRejected,
}: UploadBoxProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    multiple,
    maxSize,
    onDrop: onFilesSelected,
    onDropRejected: onFilesRejected,
  });

  return (
    <Paper
      {...getRootProps()}
      variant="outlined"
      sx={{
        flex: 1,
        minHeight: { xs: 180, sm: 220 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',

        ...(isDragActive && {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover',
        }),

        ...(isDragReject && {
          borderColor: 'error.main',
          backgroundColor: 'error.50',
        }),

        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />

      <Stack
        spacing={1}
        sx={{
          p: 3,
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            color: isDragReject ? 'error.main' : 'primary.main',
            display: 'flex',
          }}
        >
          {icon}
        </Box>

        <Typography variant="h6">
          {isDragReject ? 'Невалиден файл' : isDragActive ? 'Пусни файловете тук' : title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {formats}
        </Typography>
      </Stack>
    </Paper>
  );
}
