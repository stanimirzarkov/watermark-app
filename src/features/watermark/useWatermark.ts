import { useCallback, useState } from 'react';

import type { Watermark } from './watermark.types';

export function useWatermark() {
  const [watermark, setWatermarkState] = useState<Watermark | null>(null);

  const setWatermark = useCallback((file: File) => {
    setWatermarkState((currentWatermark) => {
      if (currentWatermark) {
        URL.revokeObjectURL(currentWatermark.previewUrl);
      }

      return {
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      };
    });
  }, []);

  // Clear the watermark and revoke the object URL to free up memory will be implemented in the future if needed.
  const clearWatermark = useCallback(() => {
    setWatermarkState((currentWatermark) => {
      if (currentWatermark) {
        URL.revokeObjectURL(currentWatermark.previewUrl);
      }

      return null;
    });
  }, []);

  return {
    watermark,
    setWatermark,
    clearWatermark,
  };
}
