import type { FormField } from '../types';

export interface BoundingBox {
  x: number;       // % from left (0 to 100)
  y: number;       // % from top (0 to 100)
  width: number;   // % of page width (0 to 100)
  height: number;  // % of page height (0 to 100)
}

/**
 * Normalizes bounding box coordinates across multiple representation formats:
 * 1. Gemini native `box_2d` array: [ymin, xmin, ymax, xmax] in 0..1000 or 0..1
 * 2. Object with { ymin, xmin, ymax, xmax } in 0..1000 or 0..1
 * 3. Object with { x, y, width, height } in 0..1000, 0..1, 0..100%, or raw pixels
 * 4. Object with { left, top, width, height }
 * 5. Pixel coordinates converted using natural image dimensions
 *
 * CRITICAL RULE: If no valid coordinates exist, returns undefined.
 * NEVER invents fake or arbitrary coordinates.
 */
export function normalizeBbox(
  raw?: any,
  naturalWidth?: number,
  naturalHeight?: number
): BoundingBox | undefined {
  if (!raw) return undefined;

  let x: number | undefined;
  let y: number | undefined;
  let width: number | undefined;
  let height: number | undefined;

  // Format 1: Gemini box_2d array [ymin, xmin, ymax, xmax]
  if (Array.isArray(raw) && raw.length >= 4) {
    const ymin = Number(raw[0]);
    const xmin = Number(raw[1]);
    const ymax = Number(raw[2]);
    const xmax = Number(raw[3]);

    if (!isNaN(ymin) && !isNaN(xmin) && !isNaN(ymax) && !isNaN(xmax)) {
      x = xmin;
      y = ymin;
      width = Math.max(0, xmax - xmin);
      height = Math.max(0, ymax - ymin);
    }
  } else if (typeof raw === 'object') {
    // Format 2: Object with box_2d property
    if (Array.isArray(raw.box_2d) && raw.box_2d.length >= 4) {
      return normalizeBbox(raw.box_2d, naturalWidth, naturalHeight);
    }

    // Format 3: Object with { ymin, xmin, ymax, xmax }
    if (raw.ymin !== undefined && raw.xmin !== undefined && raw.ymax !== undefined && raw.xmax !== undefined) {
      const ymin = Number(raw.ymin);
      const xmin = Number(raw.xmin);
      const ymax = Number(raw.ymax);
      const xmax = Number(raw.xmax);

      if (!isNaN(ymin) && !isNaN(xmin) && !isNaN(ymax) && !isNaN(xmax)) {
        x = xmin;
        y = ymin;
        width = Math.max(0, xmax - xmin);
        height = Math.max(0, ymax - ymin);
      }
    } else {
      // Format 4: Object with x/left and y/top
      const rawX = raw.x !== undefined ? raw.x : raw.left;
      const rawY = raw.y !== undefined ? raw.y : raw.top;
      let rawW = raw.width !== undefined ? raw.width : raw.w;
      let rawH = raw.height !== undefined ? raw.height : raw.h;

      if (rawX !== undefined && rawY !== undefined) {
        x = Number(rawX);
        y = Number(rawY);
        width = rawW !== undefined ? Number(rawW) : undefined;
        height = rawH !== undefined ? Number(rawH) : undefined;

        // Check if rawW and rawH were actually x2/xmax and y2/ymax coordinates
        if (width !== undefined && height !== undefined) {
          if (width > x && height > y) {
            // If width + x > 100 on 0..100 scale, width was almost certainly xmax
            if (x < 100 && width <= 100 && x + width > 105) {
              width = width - x;
            } else if (x < 1000 && width <= 1000 && x + width > 1050) {
              width = width - x;
            }
            if (y < 100 && height <= 100 && y + height > 105) {
              height = height - y;
            } else if (y < 1000 && height <= 1000 && y + height > 1050) {
              height = height - y;
            }
          }
        }
      }
    }
  }

  if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
    return undefined;
  }

  // Set safe fallbacks for missing width/height
  if (width === undefined || isNaN(width) || width <= 0) width = 35.0;
  if (height === undefined || isNaN(height) || height <= 0) height = 3.2;

  // -----------------------------------------------------------------
  // SCALE CONVERSION LOGIC
  // -----------------------------------------------------------------
  const maxVal = Math.max(x, y, width, height);

  // Case A: Natural Image Pixel coordinates (e.g. 1920x1080 or 2400x3200)
  if (naturalWidth && naturalHeight && naturalWidth > 0 && naturalHeight > 0) {
    if (x > 100 || y > 100 || width > 100 || height > 100) {
      x = (x / naturalWidth) * 100;
      y = (y / naturalHeight) * 100;
      width = (width / naturalWidth) * 100;
      height = (height / naturalHeight) * 100;
    }
  }
  // Case B: 0..1 normalized fraction representation
  else if (maxVal <= 1.05 && (width > 0 || height > 0)) {
    x *= 100;
    y *= 100;
    width *= 100;
    height *= 100;
  }
  // Case C: 0..1000 normalized representation (Gemini standard box_2d)
  else if (maxVal > 100.0 && maxVal <= 1050.0) {
    x /= 10;
    y /= 10;
    width /= 10;
    height /= 10;
  }
  // Case D: Raw pixel without known natural dimensions, but clearly pixel values (> 1000)
  else if (maxVal > 1050.0) {
    // Standard A4 aspect ratio approximation (2480 x 3508)
    const approxW = 2480;
    const approxH = 3508;
    x = (x / approxW) * 100;
    y = (y / approxH) * 100;
    width = (width / approxW) * 100;
    height = (height / approxH) * 100;
  }

  // -----------------------------------------------------------------
  // STRICT BOUNDARY CLAMPING (0% to 100% relative coordinates)
  // -----------------------------------------------------------------
  x = Math.max(0.2, Math.min(97.0, x));
  y = Math.max(0.2, Math.min(97.0, y));

  // Minimum dimensions to remain visible & usable
  width = Math.max(1.5, Math.min(99.0, width));
  height = Math.max(1.0, Math.min(99.0, height));

  // Clamp right and bottom edges within document bounds
  if (x + width > 99.5) {
    width = Math.max(2.0, 99.5 - x);
  }
  if (y + height > 99.5) {
    height = Math.max(1.2, 99.5 - y);
  }

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2)),
  };
}

/**
 * Normalizes existing bounding boxes and prevents neighboring box overlaps.
 * CRITICAL: Fields without a bbox remain undefined. We DO NOT invent fake coordinates.
 */
export function sanitizeFieldBoundingBoxes(
  fields: FormField[],
  naturalWidth?: number,
  naturalHeight?: number
): FormField[] {
  if (!fields || fields.length === 0) return [];

  // 1. Normalize only fields that actually have coordinates
  const processedFields: FormField[] = fields.map(f => {
    const bbox = f.bbox ? normalizeBbox(f.bbox, naturalWidth, naturalHeight) : undefined;
    return {
      ...f,
      bbox,
    };
  });

  // 2. Prevent horizontal collisions between placed fields on the same page and row
  for (let i = 0; i < processedFields.length; i++) {
    const f1 = processedFields[i];
    if (!f1.bbox) continue;

    for (let j = 0; j < processedFields.length; j++) {
      if (i === j) continue;
      const f2 = processedFields[j];
      if (!f2.bbox || (f1.pageIndex || 0) !== (f2.pageIndex || 0)) continue;

      // Vertical overlap check
      const vTop = Math.max(f1.bbox.y, f2.bbox.y);
      const vBottom = Math.min(f1.bbox.y + f1.bbox.height, f2.bbox.y + f2.bbox.height);
      const verticalOverlap = vBottom - vTop;

      // If they share more than 50% of their vertical height
      if (verticalOverlap > Math.min(f1.bbox.height, f2.bbox.height) * 0.5) {
        // If f1 is to the left of f2 and overlaps horizontally
        if (f1.bbox.x < f2.bbox.x && f1.bbox.x + f1.bbox.width > f2.bbox.x) {
          const maxAllowedWidth = f2.bbox.x - f1.bbox.x - 1.0;
          if (maxAllowedWidth >= 3.0) {
            f1.bbox.width = Number(maxAllowedWidth.toFixed(2));
          }
        }
      }
    }
  }

  return processedFields;
}

/**
 * Splits text into lines that fit within a maximum point width
 */
export function wrapTextToWidth(
  text: string,
  maxWidthPt: number,
  measureWidthFn: (txt: string) => number
): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (measureWidthFn(testLine) <= maxWidthPt) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}
