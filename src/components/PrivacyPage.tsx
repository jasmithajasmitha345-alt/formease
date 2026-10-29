import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  EyeOff, 
  AlertTriangle, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { NavigationTab } from '../types';

interface PrivacyPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <span>FormEase Data Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Forms contain sensitive personal information. Here is our transparent, uncompromising approach to protecting your privacy.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-blue-600" />
              1. Ephemeral, Zero-Retention Processing
            </h2>
            <p>
              Uploaded documents (PDFs, images, Word documents) are parsed in temporary server memory solely for extracting field labels and placing your answers into the output PDF. We do not maintain a permanent database of your filled applications, identity papers, or certificates. Once your session concludes or you download your completed document, server memory buffers are discarded.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              2. Strict Isolation Between Users
            </h2>
            <p>
              Your document files and questionnaire answers are never exposed to other users or logged in public databases. All communications occur over encrypted TLS connections directly to your application host.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              3. No Silent Guesses or Fake Information
            </h2>
            <p>
              FormEase will never hallucinate or invent answers (such as social security numbers, bank accounts, or parent names). Missing required information is always flagged for your personal entry, and optional fields may be safely skipped.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              4. External Form Submission Boundaries
            </h2>
            <p>
              FormEase explicitly avoids automatic submission of government, banking, scholarship, tax, or university portal forms. You retain final authority over when, where, and how your completed PDF or web answers are submitted. We never store or ask for your login passwords, banking PINs, or SMS OTP codes.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              5. Processing Technology Disclosure
            </h2>
            <p>
              Document layout analysis, field coordinate bounding-box detection, and bilingual translations are processed via server-side Google GenAI services using temporary in-memory streams. The underlying models operate under strict enterprise API terms ensuring user customer data is not used for model retraining.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('upload')}
            className="px-6 py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Start Filling a Form Securely
          </button>
        </div>
      </div>
    </div>
  );
};
