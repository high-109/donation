/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates cleared scratch percentage from image data buffer.
 * Samples every step pixels for optimal performance on mobile devices.
 */
export function calculateClearedPercentage(
  imageData: { data: Uint8ClampedArray; width: number; height: number },
  step = 8
): number {
  const { data, width, height } = imageData;
  let clearedCount = 0;
  let totalSampled = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      // If alpha is below threshold, pixel is considered cleared/scratched
      if (alpha < 128) {
        clearedCount++;
      }
      totalSampled++;
    }
  }

  if (totalSampled === 0) return 0;
  return Math.min(100, Math.round((clearedCount / totalSampled) * 100));
}
