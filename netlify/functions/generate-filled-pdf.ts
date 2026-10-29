import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
}

function normalizeBbox(raw?: any): { x: number; y: number; width: number; height: number } | undefined {
  if (!raw) return undefined;

  let x: number | undefined;
  let y: number | undefined;
  let width: number | undefined;
  let height: number | undefined;

  if (Array.isArray(raw) && raw.length >= 4) {
    y = Number(raw[0]);
    x = Number(raw[1]);
    height = Math.max(0, Number(raw[2]) - y);
    width = Math.max(0, Number(raw[3]) - x);
  } else if (typeof raw === 'object') {
    if (raw.ymin !== undefined && raw.xmin !== undefined && raw.ymax !== undefined && raw.xmax !== undefined) {
      y = Number(raw.ymin);
      x = Number(raw.xmin);
      height = Math.max(0, Number(raw.ymax) - y);
      width = Math.max(0, Number(raw.xmax) - x);
    } else {
      x = Number(raw.x !== undefined ? raw.x : raw.left);
      y = Number(raw.y !== undefined ? raw.y : raw.top);
      width = Number(raw.width !== undefined ? raw.width : raw.w);
      height = Number(raw.height !== undefined ? raw.height : raw.h);
    }
  }

  if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
    return undefined;
  }

  if (width === undefined || isNaN(width) || width <= 0) width = 35.0;
  if (height === undefined || isNaN(height) || height <= 0) height = 3.2;

  const maxVal = Math.max(x, y, width, height);
  if (maxVal <= 1.05 && (width > 0 || height > 0)) {
    x *= 100; y *= 100; width *= 100; height *= 100;
  } else if (maxVal > 100.0 && maxVal <= 1050.0) {
    x /= 10; y /= 10; width /= 10; height /= 10;
  }

  x = Math.max(0.2, Math.min(97.0, x));
  y = Math.max(0.2, Math.min(97.0, y));
  width = Math.max(1.5, Math.min(99.0, width));
  height = Math.max(1.0, Math.min(99.0, height));

  if (x + width > 99.5) width = Math.max(2.0, 99.5 - x);
  if (y + height > 99.5) height = Math.max(1.2, 99.5 - y);

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2)),
  };
}

function sanitizeFields(fields: any[]): any[] {
  if (!fields) return [];
  // Only normalize fields that actually have a bbox. Never invent coordinates.
  const normalized = fields.map((f) => {
    const bbox = f.bbox ? normalizeBbox(f.bbox) : undefined;
    return { ...f, bbox };
  });

  for (let i = 0; i < normalized.length; i++) {
    const f1 = normalized[i];
    if (!f1.bbox) continue;
    for (let j = 0; j < normalized.length; j++) {
      if (i === j) continue;
      const f2 = normalized[j];
      if (!f2.bbox) continue;

      const vTop = Math.max(f1.bbox.y, f2.bbox.y);
      const vBottom = Math.min(f1.bbox.y + f1.bbox.height, f2.bbox.y + f2.bbox.height);
      if (vBottom - vTop > Math.min(f1.bbox.height, f2.bbox.height) * 0.5) {
        if (f1.bbox.x < f2.bbox.x && f1.bbox.x + f1.bbox.width > f2.bbox.x) {
          const maxW = f2.bbox.x - f1.bbox.x - 1.0;
          if (maxW >= 3.0) f1.bbox.width = Number(maxW.toFixed(2));
        }
      }
    }
  }
  return normalized;
}

function wrapText(text: string, maxWidthPt: number, measureFn: (t: string) => number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (measureFn(test) <= maxWidthPt) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf-8')
      : event.body;
    const body = JSON.parse(rawBody || '{}');

    const { originalBase64, fileType, answers, fields, isFillablePdf } = body;

    if (!originalBase64) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing originalBase64 document data.' }),
      };
    }

    const raw = originalBase64.replace(/^data:[^;]+;base64,/, '');
    const docBytes = Buffer.from(raw, 'base64');
    const sanitizedList = sanitizeFields(fields || []);

    // Case A: Fillable AcroForm PDF
    if (fileType === 'application/pdf' && isFillablePdf) {
      const pdfDoc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
      const form = pdfDoc.getForm();

      for (const f of sanitizedList) {
        const val = answers?.[f.id];
        if (val === undefined || val === null || val === '') continue;

        try {
          if (f.type === 'checkbox') {
            const cb = form.getCheckBox(f.id);
            if (val === true || val === 'true' || val === 'yes' || val === 'on') {
              cb.check();
            } else {
              cb.uncheck();
            }
          } else {
            const tf = form.getTextField(f.id);
            tf.setText(String(val));
          }
        } catch (fErr) {
          console.warn(`Could not set field ${f.id}:`, fErr);
        }
      }

      const outputBytes = await pdfDoc.save();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          pdfBase64: `data:application/pdf;base64,${uint8ArrayToBase64(outputBytes)}`,
        }),
      };
    }

    // Case B: Scanned Flat PDF
    if (fileType === 'application/pdf') {
      const pdfDoc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      for (const f of sanitizedList) {
        const val = answers?.[f.id];
        if (val === undefined || val === null || val === '') continue;

        const pageIdx = Math.min(f.pageIndex || 0, pages.length - 1);
        const page = pages[pageIdx];
        const { width, height } = page.getSize();

        if (f.bbox) {
          const boxLeft = (f.bbox.x / 100) * width;
          const boxTop = (f.bbox.y / 100) * height;
          const boxWidth = (f.bbox.width / 100) * width;
          const boxHeight = (f.bbox.height / 100) * height;
          const boxBottomPt = height - (boxTop + boxHeight);

          if (f.type === 'checkbox') {
            if (val === true || val === 'true' || val === 'yes') {
              const checkSize = Math.max(9, Math.min(boxHeight * 0.8, boxWidth * 0.8));
              const checkX = boxLeft + (boxWidth - checkSize) / 2;
              const checkY = boxBottomPt + (boxHeight - checkSize) / 2 + (checkSize * 0.12);
              page.drawText('✓', {
                x: checkX,
                y: checkY,
                size: checkSize,
                font: fontBold,
                color: rgb(0.04, 0.25, 0.65),
              });
            }
          } else if (f.type === 'textarea') {
            const textStr = String(val).trim();
            const paddingX = Math.max(3, Math.min(8, boxWidth * 0.025));
            const maxTextWidth = boxWidth - (paddingX * 2);
            const fontSize = Math.max(8, Math.min(10.5, boxHeight * 0.35));
            const lines = wrapText(textStr, maxTextWidth, txt => fontRegular.widthOfTextAtSize(txt, fontSize));
            const lineHeight = fontSize * 1.25;

            lines.slice(0, 4).forEach((line, lineIdx) => {
              const lineY = height - boxTop - (fontSize * 0.9) - (lineIdx * lineHeight);
              if (lineY > boxBottomPt) {
                page.drawText(line, {
                  x: boxLeft + paddingX,
                  y: lineY,
                  size: fontSize,
                  font: fontRegular,
                  color: rgb(0.05, 0.1, 0.2),
                });
              }
            });
          } else {
            const textStr = String(val).trim();
            const paddingX = Math.max(3, Math.min(8, boxWidth * 0.025));
            const maxTextWidth = boxWidth - (paddingX * 2);
            let fontSize = Math.max(8.5, Math.min(boxHeight * 0.68, width * 0.032));

            const measuredWidth = fontRegular.widthOfTextAtSize(textStr, fontSize);
            if (measuredWidth > maxTextWidth && maxTextWidth > 10) {
              fontSize = Math.max(6.5, fontSize * (maxTextWidth / measuredWidth));
            }

            const baselineY = boxBottomPt + ((boxHeight - fontSize) / 2) + (fontSize * 0.15);
            page.drawText(textStr, {
              x: boxLeft + paddingX,
              y: baselineY,
              size: fontSize,
              font: fontRegular,
              color: rgb(0.05, 0.1, 0.2),
            });
          }
        }
      }

      const outputBytes = await pdfDoc.save();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          pdfBase64: `data:application/pdf;base64,${uint8ArrayToBase64(outputBytes)}`,
        }),
      };
    }

    // Case C: Images (JPG, JPEG, PNG)
    const pdfDoc = await PDFDocument.create();
    let embeddedImage;

    if (fileType && fileType.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(docBytes);
    } else {
      embeddedImage = await pdfDoc.embedJpg(docBytes);
    }

    const imgDims = embeddedImage.scale(1);
    const pageWidth = imgDims.width > 0 ? imgDims.width : 595.28;
    const pageHeight = imgDims.height > 0 ? imgDims.height : 841.89;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const f of sanitizedList) {
      const val = answers?.[f.id];
      if (val === undefined || val === null || val === '') continue;

      if (f.bbox) {
        const boxLeft = (f.bbox.x / 100) * pageWidth;
        const boxTop = (f.bbox.y / 100) * pageHeight;
        const boxWidth = (f.bbox.width / 100) * pageWidth;
        const boxHeight = (f.bbox.height / 100) * pageHeight;
        const boxBottomPt = pageHeight - (boxTop + boxHeight);

        if (f.type === 'checkbox') {
          if (val === true || val === 'true' || val === 'yes') {
            const checkSize = Math.max(12, Math.min(boxHeight * 0.8, boxWidth * 0.8));
            const checkX = boxLeft + (boxWidth - checkSize) / 2;
            const checkY = boxBottomPt + (boxHeight - checkSize) / 2 + (checkSize * 0.12);
            page.drawText('X', {
              x: checkX,
              y: checkY,
              size: checkSize,
              font: fontBold,
              color: rgb(0.04, 0.22, 0.65),
            });
          }
        } else if (f.type === 'textarea') {
          const textStr = String(val).trim();
          const paddingX = Math.max(4, Math.min(12, boxWidth * 0.025));
          const maxTextWidth = boxWidth - (paddingX * 2);
          const fontSize = Math.max(9, Math.min(boxHeight * 0.32, pageWidth * 0.022));
          const lines = wrapText(textStr, maxTextWidth, txt => fontRegular.widthOfTextAtSize(txt, fontSize));
          const lineHeight = fontSize * 1.25;

          lines.slice(0, 5).forEach((line, lineIdx) => {
            const lineY = pageHeight - boxTop - (fontSize * 0.95) - (lineIdx * lineHeight);
            if (lineY > boxBottomPt) {
              page.drawText(line, {
                x: boxLeft + paddingX,
                y: lineY,
                size: fontSize,
                font: fontRegular,
                color: rgb(0.04, 0.08, 0.18),
              });
            }
          });
        } else {
          const textStr = String(val).trim();
          const paddingX = Math.max(4, Math.min(12, boxWidth * 0.025));
          const maxTextWidth = boxWidth - (paddingX * 2);
          let fontSize = Math.max(9.5, Math.min(boxHeight * 0.65, pageWidth * 0.025));

          const measuredWidth = fontRegular.widthOfTextAtSize(textStr, fontSize);
          if (measuredWidth > maxTextWidth && maxTextWidth > 15) {
            fontSize = Math.max(7.5, fontSize * (maxTextWidth / measuredWidth));
          }

          const baselineY = boxBottomPt + ((boxHeight - fontSize) / 2) + (fontSize * 0.15);
          page.drawText(textStr, {
            x: boxLeft + paddingX,
            y: baselineY,
            size: fontSize,
            font: fontRegular,
            color: rgb(0.04, 0.08, 0.18),
          });
        }
      }
    }

    const outputBytes = await pdfDoc.save();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        pdfBase64: `data:application/pdf;base64,${uint8ArrayToBase64(outputBytes)}`,
      }),
    };
  } catch (err: any) {
    console.error('Error generating filled PDF in Netlify function:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Error generating PDF.' }),
    };
  }
};
