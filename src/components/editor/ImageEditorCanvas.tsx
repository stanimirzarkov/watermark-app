import { Image as KonvaImage, Layer, Stage } from 'react-konva';
import useImage from 'use-image';

interface ImageEditorCanvasProps {
  imageSrc: string;
  watermarkSrc: string;
  width: number;
  height: number;
}

function CanvasImage({
  src,
  x,
  y,
  width,
  height,
  opacity = 1,
}: {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}) {
  const [image] = useImage(src);

  if (!image) {
    return null;
  }

  return <KonvaImage image={image} x={x} y={y} width={width} height={height} opacity={opacity} />;
}

export function ImageEditorCanvas({
  imageSrc,
  watermarkSrc,
  width,
  height,
}: ImageEditorCanvasProps) {
  return (
    <Stage width={width} height={height}>
      <Layer>
        <CanvasImage src={imageSrc} x={0} y={0} width={width} height={height} />

        <CanvasImage
          src={watermarkSrc}
          x={width * 0.7}
          y={height * 0.7}
          width={width * 0.2}
          height={height * 0.2}
          opacity={0.7}
        />
      </Layer>
    </Stage>
  );
}
