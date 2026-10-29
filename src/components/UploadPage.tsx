import React from 'react';
import { 
  FileUp, 
  FileText, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  FileCheck
} from 'lucide-react';
import { DocumentAnalysisResult, NavigationTab, SampleFormPreset } from '../types';

interface UploadPageProps {
  onDocumentAnalyzed: (result: DocumentAnalysisResult) => void;
  onNavigate: (tab: NavigationTab) => void;
  initialSampleId?: string;
}

export const UploadPage: React.FC<UploadPageProps> = ({ 
  onDocumentAnalyzed, 
  onNavigate,
  initialSampleId 
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [samplePresets, setSamplePresets] = React.useState<SampleFormPreset[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetch('/api/sample-forms')
      .then(res => res.json())
      .then(data => {
        if (data.samples) setSamplePresets(data.samples);
      })
      .catch(console.warn);

    if (initialSampleId) {
      handleLoadSample(initialSampleId);
    }
  }, [initialSampleId]);

  const validateFile = (file: File): string | null => {
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith('.doc') && !lowerName.endsWith('.docx')) {
      return 'Legacy Microsoft Word .doc files cannot be processed reliably without desktop Office. Please open your document, choose "Save As", select .docx or .pdf, and upload again.';
    }

    const hasValidExt = validExtensions.some(ext => lowerName.endsWith(ext));
    if (!hasValidExt) {
      return 'Unsupported file format. FormEase accepts PDF, JPG, PNG, and DOCX files.';
    }

    // 25 MB limit
    if (file.size > 25 * 1024 * 1024) {
      return 'File size exceeds the 25 MB maximum limit. Please upload a smaller file or compress your PDF.';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setSelectedFile(null);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setSelectedFile(null);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setUploadProgress(15);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setUploadProgress(45);

      const response = await fetch('/api/analyze-form', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze document fields.');
      }

      setUploadProgress(100);
      setTimeout(() => {
        onDocumentAnalyzed(data);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during form extraction.');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleLoadSample = async (sampleId: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setUploadProgress(30);

    try {
      const response = await fetch('/api/analyze-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId }),
      });

      setUploadProgress(80);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load sample form.');
      }

      setUploadProgress(100);
      setTimeout(() => {
        onDocumentAnalyzed(data);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to load sample form.');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <span>Workflow Step 1 of 4</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Upload Your Document
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Upload a fillable PDF, flat scan, photograph, or DOCX Word document. FormEase will identify all fields and guide you step by step.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-red-900">File Processing Notice</div>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Upload Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-colors cursor-pointer ${
                dragOver
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={handleFileChange}
              />

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
                <FileUp className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Drag and drop your form here, or browse files
              </h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Supported: PDF, JPG, PNG, DOCX · Max file size: 25 MB
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors">
                <span>Browse Files</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File Card */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    {selectedFile.type.includes('image') ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatFileSize(selectedFile.size)} · Ready to analyze
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setErrorMessage(null);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Replace
                  </button>
                </div>
              </div>

              {/* Progress Bar (if processing) */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                      Analyzing document fields and coordinates...
                    </span>
                    <span className="font-mono tabular-nums">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedFile(null)}
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessFile}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Document...</span>
                    </>
                  ) : (
                    <>
                      <span>Extract Fields & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Technical Security Note */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Processed locally in secure session; original layout strictly preserved.</span>
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
              Max 25 MB
            </span>
          </div>
        </div>

        {/* 1-Click Sample Testing Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Or Try One of Our Verified Sample Forms
            </h3>
            <span className="text-xs text-slate-500">1-click instant test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {samplePresets.filter(s => s.type !== 'web').map(preset => (
              <div
                key={preset.id}
                onClick={() => !isProcessing && handleLoadSample(preset.id)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {preset.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight line-clamp-2">
                    {preset.description}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-md bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center shrink-0 ml-3 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
