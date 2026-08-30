import type { WatermarkConfig } from './editor.types';

interface ApplyWatermarkOptions {
  imageSrc: string;
  watermarkSrc: string;
  watermarkConfig: WatermarkConfig;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;

    image.src = src;
  });
}

export async function applyWatermark({
  imageSrc,
  watermarkSrc,
  watermarkConfig,
}: ApplyWatermarkOptions): Promise<Blob> {
  const [image, watermark] = await Promise.all([loadImage(imageSrc), loadImage(watermarkSrc)]);

  const canvas = document.createElement('canvas');

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not create canvas context');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const watermarkWidth = canvas.width * watermarkConfig.widthRatio;

  const watermarkHeight = watermarkWidth * (watermark.naturalHeight / watermark.naturalWidth);

  const watermarkX = canvas.width * watermarkConfig.x - watermarkWidth / 2;

  const watermarkY = canvas.height * watermarkConfig.y - watermarkHeight / 2;

  context.globalAlpha = watermarkConfig.opacity;

  context.drawImage(watermark, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Could not create image'));

        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}
