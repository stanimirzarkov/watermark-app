import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { Button, Stack } from '@mui/material';

interface ActionButtonsProps {
  onDeleteAll: () => void;
}

export function ActionButtons({ onDeleteAll }: ActionButtonsProps) {
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
      <Button variant="contained" size="large" startIcon={<CheckOutlinedIcon />}>
        Приложи
      </Button>

      <Button variant="outlined" size="large" startIcon={<LayersOutlinedIcon />}>
        Приложи за всички
      </Button>

      <Button variant="contained" color="success" size="large" startIcon={<DownloadOutlinedIcon />}>
        Изтегли
      </Button>

      <Button
        variant="outlined"
        color="error"
        size="large"
        startIcon={<DeleteOutlineOutlinedIcon />}
        onClick={onDeleteAll}
      >
        Изтрий всички
      </Button>
    </Stack>
  );
}
