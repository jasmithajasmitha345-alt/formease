export type NavigationTab = 
  | 'home'
  | 'upload'
  | 'fields'
  | 'questions'
  | 'review'
  | 'preview'
  | 'webform'
  | 'about'
  | 'privacy'
  | 'contact';

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
    x: number;      // % from left (0 - 100)
    y: number;      // % from top (0 - 100)
    width: number;  // % of width
    height: number; // % of height
  };
  currentValue?: string | boolean;
}

export interface DocumentAnalysisResult {
  formTitle: string;
  pageCount: number;
  fileType: string;
  fileName: string;
  base64Data: string;
  fields: FormField[];
  isFillablePdf: boolean;
  rawTextSnippet?: string;
}

export interface SampleFormPreset {
  id: string;
  name: string;
  type: string;
  isFillable: boolean;
  category: string;
  description: string;
  badge: string;
}
