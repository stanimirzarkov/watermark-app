import { Box, Slider, Typography } from '@mui/material';

import type { WatermarkConfig } from '@/features/editor/editor.types';

interface EditorControlsProps {
  watermarkConfig: WatermarkConfig;
  onWatermarkConfigChange: (updates: Partial<WatermarkConfig>) => void;
}

export function EditorControls({ watermarkConfig, onWatermarkConfigChange }: EditorControlsProps) {
  const handleSizeChange = (_: Event, value: number | number[]) => {
    onWatermarkConfigChange({
      widthRatio: Number(value) / 100,
    });
  };

  const handleOpacityChange = (_: Event, value: number | number[]) => {
    onWatermarkConfigChange({
      opacity: Number(value) / 100,
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Размер
        </Typography>

        <Slider
          value={watermarkConfig?.widthRatio * 100}
          min={10}
          max={100}
          step={1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}%`}
          onChange={handleSizeChange}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Прозрачност
        </Typography>

        <Slider
          value={watermarkConfig?.opacity * 100}
          min={10}
          max={100}
          step={1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}%`}
          onChange={handleOpacityChange}
        />
      </Box>
    </Box>
  );
}
