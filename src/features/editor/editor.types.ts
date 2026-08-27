export interface EditorImage {
  id: string;
  src: string;
  name: string;
}

export interface EditorWatermark {
  src: string;
  name: string;
}

export interface WatermarkConfig {
  x: number;
  y: number;
  widthRatio: number;
  opacity: number;
}
