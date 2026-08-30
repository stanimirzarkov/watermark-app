import type Konva from 'konva';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Image as KonvaImage, Layer, Stage, Transformer } from 'react-konva';
import useImage from 'use-image';

import type { WatermarkConfig } from '@/features/editor/editor.types';

interface ImageEditorCanvasProps {
  imageSrc: string;
  watermarkSrc: string;
  watermarkConfig: WatermarkConfig;
  onWatermarkConfigChange: (updates: Partial<WatermarkConfig>) => void;
}

export interface ImageEditorCanvasHandle {
  exportImage: () => string | null;
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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export const ImageEditorCanvas = forwardRef<ImageEditorCanvasHandle, ImageEditorCanvasProps>(
  function ImageEditorCanvas(
    { imageSrc, watermarkSrc, watermarkConfig, onWatermarkConfigChange },
    ref,
  ) {
    const [backgroundImage] = useImage(imageSrc);
    const [watermarkImage] = useImage(watermarkSrc);

    const stageRef = useRef<Konva.Stage | null>(null);
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
    }, [isSelected, watermarkImage, width, height]);

    useImperativeHandle(
      ref,
      () => ({
        exportImage: () => {
          const stage = stageRef.current;
          const transformer = transformerRef.current;

          if (!stage || !backgroundImage) {
            return null;
          }

          const wasVisible = transformer?.visible() ?? false;

          if (transformer) {
            transformer.visible(false);
            transformer.getLayer()?.batchDraw();
          }

          const dataUrl = stage.toDataURL({
            pixelRatio: backgroundImage.width / stage.width(),
          });

          if (transformer && wasVisible) {
            transformer.visible(true);
            transformer.getLayer()?.batchDraw();
          }

          return dataUrl;
        },
      }),
      [backgroundImage],
    );

    if (!backgroundImage || !watermarkImage || !width || !height) {
      return null;
    }

    const watermarkAspectRatio = watermarkImage.height / watermarkImage.width;

    /*
     * Максималната ширина е такава, че watermark-ът
     * да се побере изцяло както по ширина, така и по височина.
     */
    const maxWatermarkWidth = Math.min(width, height / watermarkAspectRatio);

    const maxWatermarkHeight = maxWatermarkWidth * watermarkAspectRatio;

    /*
     * widthRatio вече означава:
     *
     * 0 -> минимален размер
     * 1 -> максималният възможен размер,
     *      който се побира изцяло в изображението
     */
    const watermarkWidth = maxWatermarkWidth * clamp(watermarkConfig.widthRatio, 0, 1);

    const watermarkHeight = watermarkWidth * watermarkAspectRatio;

    /*
     * x и y са позиция в свободното пространство.
     *
     * x = 0 -> left
     * x = 1 -> right
     *
     * y = 0 -> top
     * y = 1 -> bottom
     */
    const availableWidth = Math.max(0, width - watermarkWidth);

    const availableHeight = Math.max(0, height - watermarkHeight);

    const watermarkX = clamp(watermarkConfig.x, 0, 1) * availableWidth;

    const watermarkY = clamp(watermarkConfig.y, 0, 1) * availableHeight;

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

    const handleDragMove = () => {
      const node = watermarkRef.current;

      if (!node) {
        return;
      }

      const actualWidth = node.width() * node.scaleX();

      const actualHeight = node.height() * node.scaleY();

      const maxX = Math.max(0, width - actualWidth);

      const maxY = Math.max(0, height - actualHeight);

      node.x(clamp(node.x(), 0, maxX));
      node.y(clamp(node.y(), 0, maxY));
    };

    const handleDragEnd = () => {
      const node = watermarkRef.current;

      if (!node) {
        return;
      }

      const actualWidth = node.width() * node.scaleX();

      const actualHeight = node.height() * node.scaleY();

      const availableWidth = Math.max(0, width - actualWidth);

      const availableHeight = Math.max(0, height - actualHeight);

      const clampedX = clamp(node.x(), 0, availableWidth);

      const clampedY = clamp(node.y(), 0, availableHeight);

      node.x(clampedX);
      node.y(clampedY);

      onWatermarkConfigChange({
        x: availableWidth === 0 ? 0 : clampedX / availableWidth,

        y: availableHeight === 0 ? 0 : clampedY / availableHeight,
      });
    };

    const handleTransformEnd = () => {
      const node = watermarkRef.current;

      if (!node) {
        return;
      }

      /*
       * Реалният размер след transform.
       */
      const actualWidth = node.width() * node.scaleX();

      const actualHeight = node.height() * node.scaleY();

      /*
       * Допълнителна защита.
       * Не допускаме стойност над максималния размер.
       */
      const clampedWidth = clamp(actualWidth, 30, maxWatermarkWidth);

      const clampedHeight = clampedWidth * watermarkAspectRatio;

      /*
       * Нормализираме Konva node-а.
       *
       * Това е важно, защото след transform Konva работи
       * чрез scaleX / scaleY, а React props работят с
       * width / height.
       */
      node.width(clampedWidth);
      node.height(clampedHeight);
      node.scaleX(1);
      node.scaleY(1);

      /*
       * След resize изчисляваме свободното пространство
       * отново с новия размер.
       */
      const newAvailableWidth = Math.max(0, width - clampedWidth);

      const newAvailableHeight = Math.max(0, height - clampedHeight);

      const clampedX = clamp(node.x(), 0, newAvailableWidth);

      const clampedY = clamp(node.y(), 0, newAvailableHeight);

      node.x(clampedX);
      node.y(clampedY);

      /*
       * widthRatio е процент от maxWatermarkWidth,
       * а НЕ процент от ширината на canvas-а.
       */
      onWatermarkConfigChange({
        x: newAvailableWidth === 0 ? 0 : clampedX / newAvailableWidth,

        y: newAvailableHeight === 0 ? 0 : clampedY / newAvailableHeight,

        widthRatio: clampedWidth / maxWatermarkWidth,
      });
    };

    return (
      <Stage
        ref={stageRef}
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
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />

          {isSelected && (
            <Transformer
              ref={transformerRef}
              keepRatio
              rotateEnabled={false}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              boundBoxFunc={(oldBox, newBox) => {
                /*
                 * Минимален размер.
                 */
                if (newBox.width < 30 || newBox.height < 30) {
                  return oldBox;
                }

                /*
                 * Максимален размер.
                 *
                 * maxWatermarkWidth вече отчита
                 * и височината на изображението.
                 */
                if (newBox.width > maxWatermarkWidth || newBox.height > maxWatermarkHeight) {
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
  },
);
