export interface EditorImage {
  id: string;
  src: string;
  name: string;
}

export interface ImageItem {
  id: string;
  name: string;
  previewUrl: string;
  file: File;
}

export interface EditorWatermark {
  src: string;
  name: string;
}

export interface WatermarkConfig {
  /**
   * Horizontal position within the available space.
   * 0 = left, 1 = right.
   */
  x: number;

  /**
   * Vertical position within the available space.
   * 0 = top, 1 = bottom.
   */
  y: number;

  /**
   * Watermark width relative to the image width.
   */
  widthRatio: number;

  opacity: number;
}
