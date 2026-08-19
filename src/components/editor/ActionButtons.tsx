import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { Button, Stack } from '@mui/material';

interface ActionButtonsProps {
  canProcess: boolean;
  canDelete: boolean;
  onDeleteAll: () => void;
}

export function ActionButtons({ canProcess, canDelete, onDeleteAll }: ActionButtonsProps) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        width: {
          xs: '100%',
          md: 220,
        },
      }}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={<CheckOutlinedIcon />}
        disabled={!canProcess}
      >
        Приложи
      </Button>

      <Button
        variant="outlined"
        size="large"
        startIcon={<LayersOutlinedIcon />}
        disabled={!canProcess}
      >
        Приложи за всички
      </Button>

      <Button
        variant="contained"
        color="success"
        size="large"
        startIcon={<DownloadOutlinedIcon />}
        disabled={!canProcess}
      >
        Изтегли
      </Button>

      <Button
        variant="outlined"
        color="error"
        size="large"
        startIcon={<DeleteOutlineOutlinedIcon />}
        disabled={!canDelete}
        onClick={onDeleteAll}
      >
        Изтрий всички
      </Button>
    </Stack>
  );
}
