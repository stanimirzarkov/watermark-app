import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import type { ImageItem } from '@/features/images/image.types';

import type { EditorWatermark, WatermarkConfig } from '@/features/editor/editor.types';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error(`Неуспешно зареждане на изображение: ${src}`));
    };

    image.src = src;
  });
}

function getWatermarkPosition(
  imageWidth: number,
  imageHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  config: WatermarkConfig,
) {
  const availableWidth = Math.max(0, imageWidth - watermarkWidth);

  const availableHeight = Math.max(0, imageHeight - watermarkHeight);

  return {
    x: config.x * availableWidth,
    y: config.y * availableHeight,
  };
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Неуспешно генериране на изображението'));

        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

export async function applyWatermarkToImage(
  image: ImageItem,
  watermark: EditorWatermark,
  config: WatermarkConfig,
): Promise<Blob> {
  const [backgroundImage, watermarkImage] = await Promise.all([
    loadImage(image.previewUrl),
    loadImage(watermark.src),
  ]);

  const canvas = document.createElement('canvas');

  canvas.width = backgroundImage.naturalWidth;
  canvas.height = backgroundImage.naturalHeight;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context не може да бъде създаден');
  }

  // Основното изображение се рисува в оригиналните му размери.
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Размерът на watermark-а е процент от ширината
  // на текущото изображение.
  const watermarkWidth = canvas.width * config.widthRatio;

  const watermarkHeight =
    watermarkWidth * (watermarkImage.naturalHeight / watermarkImage.naturalWidth);

  // Позицията е процент от свободното пространство.
  // x = 0 -> left
  // x = 1 -> right
  // y = 0 -> top
  // y = 1 -> bottom
  const position = getWatermarkPosition(
    canvas.width,
    canvas.height,
    watermarkWidth,
    watermarkHeight,
    config,
  );

  context.save();

  context.globalAlpha = config.opacity;

  context.drawImage(watermarkImage, position.x, position.y, watermarkWidth, watermarkHeight);

  context.restore();

  return canvasToBlob(canvas);
}

function getOutputFileName(name: string) {
  const extensionIndex = name.lastIndexOf('.');

  const baseName = extensionIndex === -1 ? name : name.slice(0, extensionIndex);

  return `${baseName}-watermarked.png`;
}

export async function downloadAllImages(
  images: ImageItem[],
  watermark: EditorWatermark,
  config: WatermarkConfig,
) {
  const zip = new JSZip();

  await Promise.all(
    images.map(async (image) => {
      const blob = await applyWatermarkToImage(image, watermark, config);

      zip.file(getOutputFileName(image.name), blob);
    }),
  );

  const zipBlob = await zip.generateAsync({
    type: 'blob',
  });

  saveAs(zipBlob, 'watermarked-images.zip');
}
