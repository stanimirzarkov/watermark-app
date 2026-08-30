import { Box, Button, Tooltip } from '@mui/material';

interface EditorActionsProps {
  onClose: () => void;
  onApply: () => void;
  onApplyAndDownload: () => void;
  onApplyAndDownloadAll: () => void;
}

export function EditorActions({
  onClose,
  onApply,
  onApplyAndDownload,
  onApplyAndDownloadAll,
}: EditorActionsProps) {
  return (
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
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 1.5,
      }}
    >
      <Tooltip title="Отказ от текущите промени и затваряне на редактора">
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Отказ
        </Button>
      </Tooltip>

      <Box sx={{ flexGrow: 1 }} />

      <Tooltip title="Запази текущата конфигурация на водния знак за всички изображения">
        <Button variant="outlined" onClick={onApply}>
          Запази
        </Button>
      </Tooltip>

      <Tooltip title="Приложи водния знак и изтегли текущото изображение">
        <Button variant="contained" onClick={onApplyAndDownload}>
          Приложи и изтегли
        </Button>
      </Tooltip>

      <Tooltip title="Приложи водния знак върху всички изображения и ги изтегли">
        <Button variant="contained" onClick={onApplyAndDownloadAll}>
          Приложи и изтегли всички
        </Button>
      </Tooltip>
    </Box>
  );
}
