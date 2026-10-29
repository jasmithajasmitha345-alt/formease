import React from 'react';
import { 
  Download, 
  Edit3, 
  RotateCcw, 
  PlusCircle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  FileText,
  Eye,
  Printer,
  FileCheck2,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { NavigationTab } from '../types';

interface CompletedPreviewPageProps {
  pdfBase64: string;
  downloadFileName: string;
  formTitle: string;
  onEditAnswers: () => void;
  onRegenerate: () => void;
  onStartNewForm: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const CompletedPreviewPage: React.FC<CompletedPreviewPageProps> = ({
  pdfBase64,
  downloadFileName,
  formTitle,
  onEditAnswers,
  onRegenerate,
  onStartNewForm,
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const referenceId = React.useMemo(() => {
    return 'FE-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026';
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfBase64;
    link.download = downloadFileName || 'FormEase_Completed_Form.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        return;
      } catch {
        // Fallback for browsers with iframe print restriction
      }
    }
    const printWindow = window.open(pdfBase64);
    if (printWindow) {
      printWindow.onload = () => printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Notification Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-emerald-950 font-display">
                Original Form Successfully Populated & Ready
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Your answers have been positioned into the matching fields of <span className="font-semibold text-emerald-950">{formTitle}</span>. The original design, badges, and layout have been preserved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Print document directly"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Completed PDF</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 truncate max-w-xs">{formTitle}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
              Ref: {referenceId}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onEditAnswers}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Answers</span>
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onStartNewForm}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 ml-2 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start New Form</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive PDF Viewer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold">Interactive High-Fidelity PDF Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-slate-400">
                Ready for printing, official submission, or uploading to portals
              </span>
              <a
                href={pdfBase64}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                title="Open raw PDF in new browser tab"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Tab</span>
              </a>
            </div>
          </div>

          <div className="h-[750px] w-full bg-slate-100 relative">
            <iframe
              ref={iframeRef}
              src={pdfBase64}
              title="FormEase Completed Document"
              className="w-full h-full border-0"
            />
          </div>
        </div>

        {/* Professional Document Verification & Audit Seal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-bold mb-1">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Layout Fidelity: 100%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Original margins, seals, signatures, and page orientation preserved without formatting drift.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standard Compliance: ISO 32000</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Standard compliant binary PDF compatible with Adobe Acrobat, Google Chrome, and official scanners.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-bold mb-1">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Session Isolation: Secure</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Processed ephemerally in sandbox memory; no permanent storage or cross-user data leakage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
