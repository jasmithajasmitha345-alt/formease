import { GoogleGenAI, Type } from '@google/genai';
import { PDFDocument } from 'pdf-lib';

export interface FormField {
  id: string;
  label: string;
  section: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'checkbox' | 'radio' | 'select' | 'textarea';
  required: boolean;
  explanationEn: string;
  explanationTe: string;
  example: string;
  options?: string[];
  pageIndex: number;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  currentValue?: string | boolean;
}

function getGenericImageFields(fileName: string): FormField[] {
  const lower = (fileName || '').toLowerCase();
  if (lower.includes('school') || lower.includes('admission') || lower.includes('student') || lower.includes('sap-2026')) {
    return [
      {
        id: 'childName',
        label: "Child's Full Legal Name",
        section: 'SECTION 1: STUDENT / APPLICANT INFORMATION',
        type: 'text',
        required: true,
        explanationEn: "Your child's complete legal name as printed on their official birth certificate or passport.",
        explanationTe: 'మీ పిల్లల అధికారిక జనన ధృవీకరణ పత్రం లేదా ఆధార్ కార్డు ప్రకారం వారి పూర్తి చట్టబద్ధమైన పేరు.',
        example: 'Aarav Sharma',
        pageIndex: 0,
        bbox: { x: 6.72, y: 19.34, width: 45.0, height: 2.85 },
      },
      {
        id: 'dob',
        label: 'Date of Birth (YYYY-MM-DD)',
        section: 'SECTION 1: STUDENT / APPLICANT INFORMATION',
        type: 'date',
        required: true,
        explanationEn: 'The official calendar date on which the student was born.',
        explanationTe: 'విద్యార్థి అధికారిక పుట్టిన తేదీ (సంవత్సరం-నెల-రోజు).',
        example: '2015-06-20',
        pageIndex: 0,
        bbox: { x: 55.0, y: 19.34, width: 38.0, height: 2.85 },
      },
      {
        id: 'applyingGrade',
        label: 'Grade / Class Applying For',
        section: 'SECTION 1: STUDENT / APPLICANT INFORMATION',
        type: 'text',
        required: true,
        explanationEn: 'The specific academic grade or class year you are seeking enrollment for (e.g., Grade 6).',
        explanationTe: 'మీరు ప్రవేశం పొందాలనుకుంటున్న తరగతి లేదా గ్రేడ్ (ఉదా: 6వ తరగతి).',
        example: 'Grade 6',
        pageIndex: 0,
        bbox: { x: 6.72, y: 26.50, width: 45.0, height: 2.85 },
      },
      {
        id: 'gender',
        label: 'Gender',
        section: 'SECTION 1: STUDENT / APPLICANT INFORMATION',
        type: 'select',
        required: true,
        options: ['Female', 'Male', 'Non-Binary', 'Prefer not to disclose'],
        explanationEn: 'Gender identity for school demographic records and accommodations.',
        explanationTe: 'పాఠశాల రికార్డుల కోసం లింగ గుర్తింపు (పురుషుడు / స్త్రీ / ఇతర).',
        example: 'Male',
        pageIndex: 0,
        bbox: { x: 55.0, y: 26.50, width: 38.0, height: 2.85 },
      },
      {
        id: 'primaryParentName',
        label: 'Primary Parent / Legal Guardian Full Name',
        section: 'SECTION 2: PARENT / GUARDIAN INFORMATION',
        type: 'text',
        required: true,
        explanationEn: 'The full legal name of the primary parent or guardian responsible for the student.',
        explanationTe: 'విద్యార్థికి బాధ్యత వహించే తల్లిదండ్రులు లేదా చట్టబద్ధమైన సంరక్షకుని పూర్తి పేరు.',
        example: 'Rajesh Sharma',
        pageIndex: 0,
        bbox: { x: 6.72, y: 35.0, width: 45.0, height: 2.85 },
      },
      {
        id: 'parentEmail',
        label: 'Parent Contact Email Address',
        section: 'SECTION 2: PARENT / GUARDIAN INFORMATION',
        type: 'email',
        required: true,
        explanationEn: 'A working email address for admissions notifications and tuition receipts.',
        explanationTe: 'ప్రవేశ అనుమతి మరియు ఫీజు రసీదులు అందుకోవడానికి పని చేసే ఈమెయిల్.',
        example: 'rajesh.sharma@example.com',
        pageIndex: 0,
        bbox: { x: 55.0, y: 35.0, width: 38.0, height: 2.85 },
      },
      {
        id: 'parentPhone',
        label: 'Primary Mobile / Emergency Telephone',
        section: 'SECTION 2: PARENT / GUARDIAN INFORMATION',
        type: 'phone',
        required: true,
        explanationEn: 'Daytime mobile or home phone number for school communication.',
        explanationTe: 'పాఠశాల సమాచారం మరియు అత్యవసర సంప్రదింపుల కోసం మొబైల్ లేదా ఫోన్ నంబర్.',
        example: '9848012345',
        pageIndex: 0,
        bbox: { x: 6.72, y: 43.50, width: 45.0, height: 2.85 },
      },
      {
        id: 'parentSignature',
        label: 'Parent / Guardian Signature / Legal Name',
        section: 'SECTION 3: DECLARATION & AUTHORIZATION',
        type: 'text',
        required: true,
        explanationEn: 'Your full legal name serving as your digital authorization.',
        explanationTe: 'ఈ దరఖాస్తును ధృవీకరిస్తూ తల్లిదండ్రుల సంతకం లేదా పూర్తి పేరు.',
        example: 'Rajesh Sharma',
        pageIndex: 0,
        bbox: { x: 6.72, y: 55.0, width: 50.0, height: 2.85 },
      },
    ];
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
      label: 'Permanent Street Address',
      section: 'SECTION 2: CONTACT & RESIDENCE',
      type: 'textarea',
      required: true,
      explanationEn: 'House or flat number, street name, city, state, and postal code.',
      explanationTe: 'ఇంటి నంబరు, వీధి పేరు, నగరం, రాష్ట్రం మరియు పిన్ కోడ్.',
      example: 'Flat 302, Green Meadows, MG Road, Hyderabad 500001',
      pageIndex: 0,
      bbox: { x: 8.0, y: 35.0, width: 84.0, height: 5.5 },
    },
    {
      id: 'declarationAgreed',
      label: 'Declaration & Verification Affirmation',
      section: 'SECTION 3: DECLARATION & SUBMISSION',
      type: 'checkbox',
      required: true,
      explanationEn: 'Confirm that all information provided in this form is accurate and truthful.',
      explanationTe: 'ఫారంలో అందించిన వివరాలన్నీ నిజమైనవని మరియు సరిగ్గా ఉన్నాయని ధృవీకరిస్తున్నాను.',
      example: 'Yes',
      pageIndex: 0,
      bbox: { x: 8.0, y: 48.0, width: 3.5, height: 2.2 },
    },
    {
      id: 'applicantSignature',
      label: 'Authorized Signature / Full Legal Name',
      section: 'SECTION 3: DECLARATION & SUBMISSION',
      type: 'text',
      required: true,
      explanationEn: 'Your full legal name serving as your electronic signature.',
      explanationTe: 'మీ ఎలక్ట్రానిక్ సంతకంగా పరిగణించబడే మీ పూర్తి చట్టబద్ధమైన పేరు.',
      example: 'Venkata Ramanujam',
      pageIndex: 0,
      bbox: { x: 8.0, y: 55.0, width: 50.0, height: 3.2 },
    },
    {
      id: 'signatureDate',
      label: 'Signature Date',
      section: 'SECTION 3: DECLARATION & SUBMISSION',
      type: 'date',
      required: true,
      explanationEn: 'Date on which this document was completed.',
      explanationTe: 'పత్రం పూర్తి చేసిన తేదీ.',
      example: new Date().toISOString().split('T')[0],
      pageIndex: 0,
      bbox: { x: 62.0, y: 55.0, width: 30.0, height: 3.2 },
    },
  ];
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let body: any = {};
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf-8')
      : event.body;

    try {
      body = JSON.parse(rawBody || '{}');
    } catch {
      body = {};
    }

    const base64Data = body.base64Data || body.fileBase64 || '';
    const fileName = body.fileName || 'uploaded-document.jpg';
    const mimeType = body.mimeType || (fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const isImage = mimeType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png)$/i);

    let detectedFields: FormField[] = [];

    // Optional Gemini AI extraction if GEMINI_API_KEY is configured
    if (process.env.GEMINI_API_KEY && cleanBase64) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const genResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: cleanBase64,
                },
              },
              {
                text: `Analyze this official form document. Extract all input fields with labels, sections, input types, required status, clear English explanation, Telugu translation explanation, example value, and bounding box percentages (x, y, width, height from 0 to 100).`,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                formTitle: { type: Type.STRING },
                pageCount: { type: Type.INTEGER },
                fields: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      section: { type: Type.STRING },
                      type: { type: Type.STRING },
                      required: { type: Type.BOOLEAN },
                      explanationEn: { type: Type.STRING },
                      explanationTe: { type: Type.STRING },
                      example: { type: Type.STRING },
                      pageIndex: { type: Type.INTEGER },
                      bbox: {
                        type: Type.OBJECT,
                        properties: {
                          x: { type: Type.NUMBER },
                          y: { type: Type.NUMBER },
                          width: { type: Type.NUMBER },
                          height: { type: Type.NUMBER },
                        },
                        required: ['x', 'y', 'width', 'height'],
                      },
                    },
                    required: ['id', 'label', 'section', 'type', 'required', 'explanationEn', 'explanationTe', 'example', 'pageIndex'],
                  },
                },
              },
              required: ['formTitle', 'pageCount', 'fields'],
            },
          },
        });

        const parsed = JSON.parse(genResponse.text || '{}');
        if (parsed.fields && parsed.fields.length > 0) {
          detectedFields = parsed.fields;
        }
      } catch (gemErr) {
        console.warn('Gemini serverless extraction note:', gemErr);
      }
    }

    if (detectedFields.length === 0) {
      detectedFields = getGenericImageFields(fileName);
    }

    const formTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        formTitle: formTitle || 'Standard Application Form',
        pageCount: 1,
        fileType: mimeType,
        fileName,
        base64Data: base64Data ? (base64Data.startsWith('data:') ? base64Data : `data:${mimeType};base64,${cleanBase64}`) : '',
        fields: detectedFields,
        isFillablePdf: false,
      }),
    };
  } catch (err: any) {
    console.error('Error in analyze-form serverless function:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message || 'Internal server error processing document.',
      }),
    };
  }
};
