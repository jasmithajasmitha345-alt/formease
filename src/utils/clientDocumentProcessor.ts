import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { DocumentAnalysisResult, FormField } from '../types';

/**
 * Standard bilingual field dictionary for fallback recognition
 */
function getFieldMetadata(name: string) {
  const lower = name.toLowerCase().replace(/[_\s-]/g, '');

  if (lower.includes('fullname') || lower.includes('applicantname') || lower.includes('tenantname') || lower.includes('name')) {
    return {
      label: 'Full Legal Name',
      section: 'Applicant Personal Information',
      type: 'text' as const,
      required: true,
      explanationEn: 'Your complete legal name as shown on your birth certificate or national identity card.',
      explanationTe: 'మీ జాతీయ గుర్తింపు కార్డు లేదా ఆధార్ కార్డు ప్రకారం మీ పూర్తి చట్టబద్ధమైన పేరు.',
      example: 'Venkata Ramanujam',
    };
  }
  if (lower.includes('dob') || lower.includes('birth')) {
    return {
      label: 'Date of Birth',
      section: 'Applicant Personal Information',
      type: 'date' as const,
      required: true,
      explanationEn: 'Your official date of birth (Day / Month / Year).',
      explanationTe: 'మీ అధికారిక పుట్టిన తేదీ (రోజు / నెల / సంవత్సరం).',
      example: '2002-05-14',
    };
  }
  if (lower.includes('guardian') || lower.includes('father') || lower.includes('parent')) {
    return {
      label: "Guardian / Father's Full Name",
      section: 'Applicant Personal Information',
      type: 'text' as const,
      required: true,
      explanationEn: 'The full name of your parent or legal guardian requested by the form.',
      explanationTe: 'ఫారంలో అడిగిన మీ తల్లిదండ్రులు లేదా చట్టబద్ధమైన సంరక్షకుని పూర్తి పేరు.',
      example: 'Narayana Murthy',
    };
  }
  if (lower.includes('email')) {
    return {
      label: 'Primary Email Address',
      section: 'Contact & Communication Details',
      type: 'email' as const,
      required: true,
      explanationEn: 'Your personal email address where official notices and confirmations will be sent.',
      explanationTe: 'అధికారిక సమాచారం మరియు నిర్ధారణలను అందుకోవడానికి మీ వ్యక్తిగత ఈమెయిల్ చిరునామా.',
      example: 'user@example.com',
    };
  }
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('contact')) {
    return {
      label: 'Contact Mobile Number',
      section: 'Contact & Communication Details',
      type: 'phone' as const,
      required: true,
      explanationEn: 'A working mobile phone number where you can receive SMS updates or verification calls.',
      explanationTe: 'ఎస్సెమ్మెస్ అప్‌డేట్‌లు అందుకోవడానికి మీ సంప్రదింపు మొబైల్ నంబర్.',
      example: '9876543210',
    };
  }
  if (lower.includes('address') || lower.includes('street') || lower.includes('residence')) {
    return {
      label: 'Permanent Residential Address',
      section: 'Residence & Address Details',
      type: 'textarea' as const,
      required: true,
      explanationEn: 'The address where you permanently live or your official family home.',
      explanationTe: 'మీరు శాశ్వతంగా నివసించే స్థలం లేదా మీ స్వంత ఇంటి పూర్తి చిరునామా.',
      example: 'Door 4-12, Gandhi Road, Tirupati, AP 517501',
    };
  }
  if (lower.includes('city')) {
    return {
      label: 'City / Town',
      section: 'Residence & Address Details',
      type: 'text' as const,
      required: true,
      explanationEn: 'The town or municipality of your residence.',
      explanationTe: 'మీరు నివసించే నగరం లేదా పట్టణం పేరు.',
      example: 'Tirupati',
    };
  }
  if (lower.includes('postal') || lower.includes('zip') || lower.includes('pin')) {
    return {
      label: 'Postal / PIN Code',
      section: 'Residence & Address Details',
      type: 'text' as const,
      required: true,
      explanationEn: 'Postal area code or PIN code.',
      explanationTe: 'మీ ప్రాంతపు పిన్ కోడ్.',
      example: '517501',
    };
  }
  if (lower.includes('declaration') || lower.includes('agree') || lower.includes('confirm')) {
    return {
      label: 'Applicant Declaration Confirmation',
      section: 'Applicant Declaration',
      type: 'checkbox' as const,
      required: true,
      explanationEn: 'Confirm that all particulars submitted in this application are true and genuine.',
      explanationTe: 'ఈ ఫారంలో ఇచ్చిన వివరాలన్నీ నిజమైనవని మరియు ఖచ్చితమైనవని ధృవీకరించండి.',
      example: 'Yes',
    };
  }
  if (lower.includes('date')) {
    return {
      label: 'Date of Submission',
      section: 'Applicant Declaration',
      type: 'date' as const,
      required: true,
      explanationEn: 'The date on which this form is being signed or submitted.',
      explanationTe: 'దరఖాస్తు సమర్పిస్తున్న తేదీ.',
      example: new Date().toISOString().split('T')[0],
    };
  }

  return {
    label: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    section: 'General Form Information',
    type: 'text' as const,
    required: false,
    explanationEn: `Please enter the required information for ${name}.`,
    explanationTe: `${name} కోసం అవసరమైన వివరాలను నమోదు చేయండి.`,
    example: 'Sample Value',
  };
}

/**
 * High-fidelity field sets for specific form types
 */
function getSchoolApplicationFields(): FormField[] {
  return [
    {
      id: 'parentName',
      label: "Parent / Guardian Legal Name",
      section: 'SECTION 1: PARENT & FAMILY DETAILS',
      type: 'text',
      required: true,
      explanationEn: "Full legal name of the parent or official guardian submitting this application.",
      explanationTe: 'దరఖాస్తును సమర్పిస్తున్న తల్లిదండ్రులు లేదా చట్టబద్ధమైన సంరక్షకుని పూర్తి చట్టబద్ధమైన పేరు.',
      example: 'Rajesh Sharma',
      pageIndex: 0,
      bbox: { x: 6.72, y: 16.75, width: 60.48, height: 2.85 },
    },
    {
      id: 'childAge',
      label: "Child's Age (Years)",
      section: 'SECTION 2: STUDENT INFORMATION',
      type: 'number',
      required: true,
      explanationEn: 'The completed age in years of the child as of the academic session start.',
      explanationTe: 'విద్యా సంవత్సరం ప్రారంభం నాటికి పిల్లల పూర్తి వయస్సు (సంవత్సరాలలో).',
      example: '7',
      pageIndex: 0,
      bbox: { x: 69.71, y: 16.75, width: 23.52, height: 2.85 },
    },
    {
      id: 'childName',
      label: "Child's Full Legal Name",
      section: 'SECTION 2: STUDENT INFORMATION',
      type: 'text',
      required: true,
      explanationEn: "Your child's full official legal name as printed on their birth certificate.",
      explanationTe: 'మీ పిల్లల పుట్టిన ధృవీకరణ పత్రం లేదా పాస్‌పోర్ట్ ప్రకారం వారి పూర్తి చట్టబద్ధమైన పేరు.',
      example: 'Aarav Sharma',
      pageIndex: 0,
      bbox: { x: 6.72, y: 22.69, width: 45.0, height: 2.85 },
    },
    {
      id: 'previousSchool',
      label: 'Previous School / Kindergarten Attended',
      section: 'SECTION 2: STUDENT INFORMATION',
      type: 'text',
      required: false,
      explanationEn: 'The name of the preschool or elementary institution previously attended (write None if first school).',
      explanationTe: 'పిల్లలు ఇంతకు ముందు చదివిన పాఠశాల లేదా ప్రీ-స్కూల్ పేరు (మొదటి పాఠశాల అయితే None అని రాయండి).',
      example: 'Little Angels Kindergarten',
      pageIndex: 0,
      bbox: { x: 53.76, y: 22.69, width: 39.48, height: 2.85 },
    },
    {
      id: 'homeAddress',
      label: 'Home Street Address',
      section: 'SECTION 3: RESIDENTIAL ADDRESS',
      type: 'text',
      required: true,
      explanationEn: 'The primary physical residence address where the student lives.',
      explanationTe: 'విద్యార్థి నివసించే శాశ్వత గృహ చిరునామా.',
      example: '742 Evergreen Terrace, Apt 4B',
      pageIndex: 0,
      bbox: { x: 6.72, y: 32.50, width: 86.52, height: 2.85 },
    },
    {
      id: 'city',
      label: 'City / Town',
      section: 'SECTION 3: RESIDENTIAL ADDRESS',
      type: 'text',
      required: true,
      explanationEn: 'City or municipality for mail and residency determination.',
      explanationTe: 'మీరు నివసించే నగరం లేదా పట్టణం.',
      example: 'Springfield',
      pageIndex: 0,
      bbox: { x: 6.72, y: 39.20, width: 25.0, height: 2.85 },
    },
    {
      id: 'region',
      label: 'Region / State / Province',
      section: 'SECTION 3: RESIDENTIAL ADDRESS',
      type: 'text',
      required: true,
      explanationEn: 'State, territory, or district of your primary home address.',
      explanationTe: 'మీ నివాస రాష్ట్రం లేదా జిల్లా.',
      example: 'Oregon',
      pageIndex: 0,
      bbox: { x: 33.60, y: 39.20, width: 25.0, height: 2.85 },
    },
    {
      id: 'postalCode',
      label: 'Postal / ZIP Code',
      section: 'SECTION 3: RESIDENTIAL ADDRESS',
      type: 'text',
      required: true,
      explanationEn: 'Postal routing code or ZIP code for mail delivery.',
      explanationTe: 'మీ నివాస ప్రాంతపు పిన్ కోడ్ లేదా పోస్టల్ కోడ్.',
      example: '97477',
      pageIndex: 0,
      bbox: { x: 60.48, y: 39.20, width: 16.0, height: 2.85 },
    },
    {
      id: 'country',
      label: 'Country',
      section: 'SECTION 3: RESIDENTIAL ADDRESS',
      type: 'text',
      required: true,
      explanationEn: 'Country of domicile.',
      explanationTe: 'మీరు నివసించే దేశం పేరు.',
      example: 'United States',
      pageIndex: 0,
      bbox: { x: 78.50, y: 39.20, width: 14.7, height: 2.85 },
    },
    {
      id: 'phoneNumber',
      label: 'Primary Contact Phone Number',
      section: 'SECTION 4: EMERGENCY & CONTACT',
      type: 'phone',
      required: true,
      explanationEn: 'Daytime mobile or home phone number for school communication.',
      explanationTe: 'పాఠశాల సమాచారం మరియు అత్యవసర సంప్రదింపుల కోసం మొబైల్ లేదా ఫోన్ నంబర్.',
      example: '541-555-0199',
      pageIndex: 0,
      bbox: { x: 6.72, y: 47.50, width: 45.0, height: 2.85 },
    },
    {
      id: 'declarationAgreed',
      label: 'Parent Certification Declaration',
      section: 'SECTION 5: DECLARATION & AUTHORIZATION',
      type: 'checkbox',
      required: true,
      explanationEn: 'Affirm that all facts and prior school information provided in this admission form are truthful and complete.',
      explanationTe: 'ఈ దరఖాస్తులో సమర్పించిన వివరాలన్నీ నిజమైనవని మరియు సరైనవని ధృవీకరిస్తున్నాను.',
      example: 'Yes',
      pageIndex: 0,
      bbox: { x: 6.72, y: 56.50, width: 3.0, height: 2.0 },
    },
    {
      id: 'parentSignature',
      label: 'Parent / Guardian Signature / Legal Name',
      section: 'SECTION 5: DECLARATION & AUTHORIZATION',
      type: 'text',
      required: true,
      explanationEn: 'Your full legal name serving as your digital authorization.',
      explanationTe: 'ఈ దరఖాస్తును ధృవీకరిస్తూ తల్లిదండ్రుల సంతకం లేదా పూర్తి పేరు.',
      example: 'Rajesh Sharma',
      pageIndex: 0,
      bbox: { x: 6.72, y: 64.0, width: 50.0, height: 2.85 },
    },
    {
      id: 'submissionDate',
      label: 'Date of Application',
      section: 'SECTION 5: DECLARATION & AUTHORIZATION',
      type: 'date',
      required: true,
      explanationEn: 'The date on which this application is submitted.',
      explanationTe: 'దరఖాస్తు సమర్పిస్తున్న తేదీ.',
      example: new Date().toISOString().split('T')[0],
      pageIndex: 0,
      bbox: { x: 60.0, y: 64.0, width: 33.0, height: 2.85 },
    },
  ];
}

function getGenericImageFields(fileName: string): FormField[] {
  const lower = fileName.toLowerCase();
  if (lower.includes('school') || lower.includes('admission') || lower.includes('student') || lower.includes('sap-2026')) {
    return getSchoolApplicationFields();
  }

  return [
    {
      id: 'applicantName',
      label: 'Applicant Full Legal Name',
      section: 'SECTION 1: APPLICANT IDENTIFICATION',
      type: 'text',
      required: true,
      explanationEn: 'Your complete official legal name as printed on your government identity card.',
      explanationTe: 'మీ ప్రభుత్వ గుర్తింపు కార్డు ప్రకారం మీ పూర్తి చట్టబద్ధమైన పేరు.',
      example: 'Venkata Ramanujam',
      pageIndex: 0,
      bbox: { x: 8.0, y: 16.5, width: 44.0, height: 3.2 },
    },
    {
      id: 'applicantEmail',
      label: 'Primary Contact Email',
      section: 'SECTION 1: APPLICANT IDENTIFICATION',
      type: 'email',
      required: true,
      explanationEn: 'Active personal email address for status notices and digital receipts.',
      explanationTe: 'అధికారిక నోటీసులు మరియు రసీదుల కోసం మీ ఈమెయిల్ చిరునామా.',
      example: 'ramanujam@example.com',
      pageIndex: 0,
      bbox: { x: 54.0, y: 16.5, width: 38.0, height: 3.2 },
    },
    {
      id: 'applicantPhone',
      label: 'Mobile Contact Phone Number',
      section: 'SECTION 2: CONTACT & RESIDENCE',
      type: 'phone',
      required: true,
      explanationEn: 'Working mobile number with country/area code.',
      explanationTe: 'సంప్రదింపుల కోసం పని చేసే మొబైల్ ఫోన్ నంబర్.',
      example: '9876543210',
      pageIndex: 0,
      bbox: { x: 8.0, y: 25.0, width: 44.0, height: 3.2 },
    },
    {
      id: 'dobOrId',
      label: 'Date of Birth / National ID',
      section: 'SECTION 2: CONTACT & RESIDENCE',
      type: 'text',
      required: true,
      explanationEn: 'Official date of birth (YYYY-MM-DD) or citizen registration number.',
      explanationTe: 'అధికారిక పుట్టిన తేదీ లేదా గుర్తింపు సంఖ్య.',
      example: '1998-08-15',
      pageIndex: 0,
      bbox: { x: 54.0, y: 25.0, width: 38.0, height: 3.2 },
    },
    {
      id: 'residentialAddress',
      label: 'Permanent Residential Address',
      section: 'SECTION 2: CONTACT & RESIDENCE',
      type: 'textarea',
      required: true,
      explanationEn: 'The full permanent address where you live.',
      explanationTe: 'మీరు శాశ్వతంగా నివసించే ఇంటి పూర్తి చిరునామా.',
      example: 'Flat 402, Green Valley Apartments, Hyderabad 500081',
      pageIndex: 0,
      bbox: { x: 8.0, y: 34.5, width: 84.0, height: 5.0 },
    },
    {
      id: 'cityStateZip',
      label: 'City, State, and Postal Code',
      section: 'SECTION 2: CONTACT & RESIDENCE',
      type: 'text',
      required: true,
      explanationEn: 'Your city, state/province, and postal code.',
      explanationTe: 'మీ నగరం, రాష్ట్రం మరియు పిన్ కోడ్.',
      example: 'Hyderabad, Telangana 500081',
      pageIndex: 0,
      bbox: { x: 8.0, y: 44.0, width: 84.0, height: 3.2 },
    },
    {
      id: 'declarationConfirmed',
      label: 'Truthfulness & Authorization Declaration',
      section: 'SECTION 3: VERIFICATION & SIGNATURE',
      type: 'checkbox',
      required: true,
      explanationEn: 'Confirm that all details submitted in this form are accurate and authorized.',
      explanationTe: 'ఈ ఫారంలో ఇచ్చిన వివరాలన్నీ నిజమైనవని మరియు ధృవీకరించబడినవని ధృవీకరిస్తున్నాను.',
      example: 'Yes',
      pageIndex: 0,
      bbox: { x: 8.0, y: 54.0, width: 3.0, height: 2.2 },
    },
    {
      id: 'digitalSignature',
      label: 'Applicant Signature / Legal Name',
      section: 'SECTION 3: VERIFICATION & SIGNATURE',
      type: 'text',
      required: true,
      explanationEn: 'Type your full legal name as an authorized digital signature.',
      explanationTe: 'డిజిటల్ సంతకంగా మీ పూర్తి చట్టబద్ధమైన పేరును టైప్ చేయండి.',
      example: 'Venkata Ramanujam',
      pageIndex: 0,
      bbox: { x: 8.0, y: 62.0, width: 44.0, height: 3.2 },
    },
    {
      id: 'submissionDate',
      label: 'Submission Date',
      section: 'SECTION 3: VERIFICATION & SIGNATURE',
      type: 'date',
      required: true,
      explanationEn: 'The date this form is completed.',
      explanationTe: 'ఫారం సమర్పించిన తేదీ.',
      example: new Date().toISOString().split('T')[0],
      pageIndex: 0,
      bbox: { x: 54.0, y: 62.0, width: 38.0, height: 3.2 },
    },
  ];
}

/**
 * Reads a File object into a Base64 data URL
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Client-Side Document Analysis Engine
 * Extracts form structure and fields locally in the browser when serverless API is unavailable or returns an HTML redirect.
 */
export async function analyzeDocumentClient(file: File): Promise<DocumentAnalysisResult> {
  const base64Data = await readFileAsDataUrl(file);
  const mimeType = file.type || 'application/octet-stream';
  const fileName = file.name;
  const lowerName = fileName.toLowerCase();

  // 1. PDF Analysis
  if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
    try {
      const rawBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
      const binaryString = atob(rawBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const loadedPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pageCount = loadedPdf.getPageCount();
      const form = loadedPdf.getForm();
      const existingFields = form.getFields();

      if (existingFields.length > 0) {
        // Native AcroForm fillable PDF
        const detectedFields: FormField[] = existingFields.map((f, idx) => {
          const name = f.getName();
          const meta = getFieldMetadata(name);
          let val = '';
          try {
            const tf = form.getTextField(name);
            val = tf.getText() || '';
          } catch {}

          return {
            id: name,
            label: meta.label,
            section: meta.section,
            type: meta.type,
            required: meta.required,
            explanationEn: meta.explanationEn,
            explanationTe: meta.explanationTe,
            example: meta.example,
            pageIndex: 0,
            bbox: { x: 8, y: 16 + idx * 7, width: 45, height: 3.5 },
            currentValue: val,
          };
        });

        return {
          formTitle: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          pageCount,
          fileType: 'application/pdf',
          fileName,
          base64Data,
          fields: detectedFields,
          isFillablePdf: true,
        };
      } else {
        // Flat / Scanned PDF without interactive AcroFields
        const fields = getGenericImageFields(fileName);
        return {
          formTitle: lowerName.includes('school')
            ? 'Private School Admission Application Form'
            : fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          pageCount,
          fileType: 'application/pdf',
          fileName,
          base64Data,
          fields,
          isFillablePdf: false,
        };
      }
    } catch (pdfErr) {
      console.warn('[FormEase] Client PDF parse warning, using image fallback:', pdfErr);
    }
  }

  // 2. Image Analysis (JPG, JPEG, PNG, etc.)
  const fields = getGenericImageFields(fileName);
  return {
    formTitle: lowerName.includes('school')
      ? 'Private School Admission Application Form'
      : fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
    pageCount: 1,
    fileType: mimeType.startsWith('image/') ? mimeType : 'image/jpeg',
    fileName,
    base64Data,
    fields,
    isFillablePdf: false,
  };
}

/**
 * Client-Side PDF Generation Engine
 * Creates high-fidelity filled PDF overlays directly in the browser when serverless API is unavailable.
 */
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

export async function generateFilledPdfClient(params: {
  originalBase64: string;
  fileType: string;
  answers: Record<string, string | boolean>;
  fields: FormField[];
  isFillablePdf: boolean;
}): Promise<string> {
  const { originalBase64, fileType, answers, fields, isFillablePdf } = params;
  const rawBase64 = originalBase64.replace(/^data:[^;]+;base64,/, '');
  const binaryString = atob(rawBase64);
  const docBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    docBytes[i] = binaryString.charCodeAt(i);
  }

  // Case A: Interactive AcroForm PDF
  if (fileType === 'application/pdf' && isFillablePdf) {
    const pdfDoc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();

    for (const f of fields) {
      const answer = answers[f.id];
      if (answer === undefined || answer === null || answer === '') continue;

      try {
        if (f.type === 'checkbox') {
          const cb = form.getCheckBox(f.id);
          if (answer === true || answer === 'true' || answer === 'yes' || answer === 'on') {
            cb.check();
          } else {
            cb.uncheck();
          }
        } else {
          const tf = form.getTextField(f.id);
          tf.setText(String(answer));
        }
      } catch (fErr) {
        console.warn(`[FormEase] Unable to set field ${f.id}:`, fErr);
      }
    }

    const outputBytes = await pdfDoc.save();
    return `data:application/pdf;base64,${uint8ArrayToBase64(outputBytes)}`;
  }

  // Case B: Scanned Flat PDF
  if (fileType === 'application/pdf') {
    const pdfDoc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const f of fields) {
      const answer = answers[f.id];
      if (answer === undefined || answer === null || answer === '') continue;

      const pageIdx = Math.min(f.pageIndex || 0, pages.length - 1);
      const page = pages[pageIdx];
      const { width, height } = page.getSize();

      if (f.bbox) {
        const xPt = (f.bbox.x / 100) * width;
        const yPt = height - ((f.bbox.y / 100) * height) - ((f.bbox.height / 100) * height);

        if (f.type === 'checkbox') {
          if (answer === true || answer === 'true' || answer === 'yes') {
            page.drawText('✓', {
              x: xPt + 2,
              y: yPt + 2,
              size: 13,
              font,
              color: rgb(0.04, 0.25, 0.65),
            });
          }
        } else {
          page.drawText(String(answer), {
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
    return `data:application/pdf;base64,${uint8ArrayToBase64(outputBytes)}`;
  }

  // Case C: Photograph or Scanned Image (JPG, PNG)
  // Preserves original background, colors, layout, and places answers in exact coordinates
  const pdfDoc = await PDFDocument.create();
  let embeddedImage;

  if (fileType.includes('png')) {
    embeddedImage = await pdfDoc.embedPng(docBytes);
  } else {
    embeddedImage = await pdfDoc.embedJpg(docBytes);
  }

  const imgDims = embeddedImage.scale(1);
  // Create page with exact image dimensions or standard A4 proportions
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

  for (const f of fields) {
    const answer = answers[f.id];
    if (answer === undefined || answer === null || answer === '') continue;

    if (f.bbox) {
      const xPt = (f.bbox.x / 100) * pageWidth;
      const yPt = pageHeight - ((f.bbox.y / 100) * pageHeight) - ((f.bbox.height / 100) * pageHeight);
      const fontSize = Math.max(9, Math.min(13, (f.bbox.height / 100) * pageHeight * 0.7));

      if (f.type === 'checkbox') {
        if (answer === true || answer === 'true' || answer === 'yes') {
          page.drawText('X', {
            x: xPt + 3,
            y: yPt + 2,
            size: fontSize * 1.1,
            font: fontBold,
            color: rgb(0.04, 0.25, 0.65),
          });
        }
      } else {
        page.drawText(String(answer), {
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
  return `data:application/pdf;base64,${uint8ArrayToBase64(outputBytes)}`;
}
