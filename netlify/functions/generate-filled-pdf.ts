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

    // Case A: Fillable AcroForm PDF
    if (fileType === 'application/pdf' && isFillablePdf) {
      const pdfDoc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
      const form = pdfDoc.getForm();

      for (const f of fields || []) {
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

      for (const f of fields || []) {
        const val = answers?.[f.id];
        if (val === undefined || val === null || val === '') continue;

        const pageIdx = Math.min(f.pageIndex || 0, pages.length - 1);
        const page = pages[pageIdx];
        const { width, height } = page.getSize();

        if (f.bbox) {
          const xPt = (f.bbox.x / 100) * width;
          const yPt = height - ((f.bbox.y / 100) * height) - ((f.bbox.height / 100) * height);
          if (f.type === 'checkbox') {
            if (val === true || val === 'true' || val === 'yes') {
              page.drawText('✓', {
                x: xPt + 2,
                y: yPt + 2,
                size: 13,
                font: fontBold,
                color: rgb(0.04, 0.25, 0.65),
              });
            }
          } else {
            page.drawText(String(val), {
              x: xPt + 4,
              y: yPt + 4,
              size: 9.5,
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

    for (const f of fields || []) {
      const val = answers?.[f.id];
      if (val === undefined || val === null || val === '') continue;

      if (f.bbox) {
        const xPt = (f.bbox.x / 100) * pageWidth;
        const yPt = pageHeight - ((f.bbox.y / 100) * pageHeight) - ((f.bbox.height / 100) * pageHeight);
        const fontSize = Math.max(9, Math.min(13, (f.bbox.height / 100) * pageHeight * 0.7));

        if (f.type === 'checkbox') {
          if (val === true || val === 'true' || val === 'yes') {
            page.drawText('X', {
              x: xPt + 3,
              y: yPt + 2,
              size: fontSize * 1.1,
              font: fontBold,
              color: rgb(0.04, 0.25, 0.65),
            });
          }
        } else {
          page.drawText(String(val), {
            x: xPt + 4,
            y: yPt + 3,
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
  } catch (err: any) {
    console.error('Error generating filled PDF in Netlify function:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Error generating PDF.' }),
    };
  }
};
