import type Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Layer, Stage, Transformer } from 'react-konva';
import useImage from 'use-image';

import type { WatermarkConfig } from '@/features/editor/editor.types';

interface ImageEditorCanvasProps {
  imageSrc: string;
  watermarkSrc: string;
  watermarkConfig: WatermarkConfig;
  onWatermarkConfigChange: (updates: Partial<WatermarkConfig>) => void;
}

const MAX_CANVAS_WIDTH = 900;
const MAX_CANVAS_HEIGHT = 700;

function getCanvasDimensions(imageWidth: number, imageHeight: number) {
  const scale = Math.min(MAX_CANVAS_WIDTH / imageWidth, MAX_CANVAS_HEIGHT / imageHeight, 1);

  return {
    width: Math.round(imageWidth * scale),
    height: Math.round(imageHeight * scale),
  };
}

export function ImageEditorCanvas({
  imageSrc,
  watermarkSrc,
  watermarkConfig,
  onWatermarkConfigChange,
}: ImageEditorCanvasProps) {
  const [backgroundImage] = useImage(imageSrc);
  const [watermarkImage] = useImage(watermarkSrc);

  const watermarkRef = useRef<Konva.Image | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

  const [isSelected, setIsSelected] = useState(true);

  const canvasDimensions = backgroundImage
    ? getCanvasDimensions(backgroundImage.width, backgroundImage.height)
    : null;

  const width = canvasDimensions?.width;
  const height = canvasDimensions?.height;

  useEffect(() => {
    const transformer = transformerRef.current;

    const watermarkNode = watermarkRef.current;

    if (!isSelected || !watermarkImage || !transformer || !watermarkNode) {
      return;
    }

    transformer.nodes([watermarkNode]);

    transformer.getLayer()?.batchDraw();
  }, [isSelected, watermarkImage, backgroundImage, width, height]);

  if (!backgroundImage || !watermarkImage || !width || !height) {
    return null;
  }

  const watermarkWidth = width * watermarkConfig.widthRatio;

  const watermarkHeight = watermarkWidth * (watermarkImage.height / watermarkImage.width);

  const watermarkX = width * watermarkConfig.x - watermarkWidth / 2;

  const watermarkY = height * watermarkConfig.y - watermarkHeight / 2;

  const handleStageClick = (event: Konva.KonvaEventObject<Event>) => {
    const clickedOnWatermark = event.target === watermarkRef.current;

    const transformer = transformerRef.current;

    const clickedOnTransformer = transformer
      ? event.target.getAncestors().includes(transformer)
      : false;

    if (!clickedOnWatermark && !clickedOnTransformer) {
      setIsSelected(false);
    }
  };

  const handleWatermarkClick = () => {
    setIsSelected(true);
  };

  const handleDragEnd = () => {
    const node = watermarkRef.current;

    if (!node) {
      return;
    }

    const actualWidth = node.width() * node.scaleX();

    const actualHeight = node.height() * node.scaleY();

    const centerX = node.x() + actualWidth / 2;

    const centerY = node.y() + actualHeight / 2;

    onWatermarkConfigChange({
      x: centerX / width,
      y: centerY / height,
    });
  };

  const handleTransformEnd = () => {
    const node = watermarkRef.current;

    if (!node) {
      return;
    }

    const actualWidth = node.width() * node.scaleX();

    const actualHeight = node.height() * node.scaleY();

    const centerX = node.x() + actualWidth / 2;

    const centerY = node.y() + actualHeight / 2;

    node.scaleX(1);
    node.scaleY(1);

    onWatermarkConfigChange({
      x: centerX / width,
      y: centerY / height,
      widthRatio: actualWidth / width,
    });
  };

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={handleStageClick}
      onTouchStart={handleStageClick}
    >
      <Layer>
        <KonvaImage image={backgroundImage} x={0} y={0} width={width} height={height} />

        <KonvaImage
          ref={watermarkRef}
          image={watermarkImage}
          x={watermarkX}
          y={watermarkY}
          width={watermarkWidth}
          height={watermarkHeight}
          opacity={watermarkConfig.opacity}
          draggable
          onClick={handleWatermarkClick}
          onTap={handleWatermarkClick}
          onDragEnd={handleDragEnd}
        />

        {isSelected && (
          <Transformer
            ref={transformerRef}
            keepRatio
            rotateEnabled={false}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 30 || newBox.height < 30) {
                return oldBox;
              }

              return newBox;
            }}
            onTransformEnd={handleTransformEnd}
          />
        )}
      </Layer>
    </Stage>
  );
}
