import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck, 
  RefreshCw, 
  HelpCircle, 
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { FormField, NavigationTab, DocumentAnalysisResult } from '../types';
import { FormDocumentViewer } from './FormDocumentViewer';
import { Layers } from 'lucide-react';

interface ReviewAnswersPageProps {
  fields: FormField[];
  answers: Record<string, string | boolean>;
  onUpdateAnswer: (id: string, value: string | boolean) => void;
  onConfirmAndGenerate: () => void;
  onNavigate: (tab: NavigationTab) => void;
  isGenerating: boolean;
  analysis?: DocumentAnalysisResult;
}

export const ReviewAnswersPage: React.FC<ReviewAnswersPageProps> = ({
  fields,
  answers,
  onUpdateAnswer,
  onConfirmAndGenerate,
  onNavigate,
  isGenerating,
  analysis,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [tempValue, setTempValue] = React.useState<string | boolean>('');
  const [displayMode, setDisplayMode] = React.useState<'sections' | 'overlay'>('sections');

  const sections = Array.from(new Set(fields.map(f => f.section || 'General Details')));

  // Check for any missing required fields
  const missingRequiredFields = fields.filter(f => {
    if (!f.required) return false;
    const val = answers[f.id];
    if (f.type === 'checkbox') return !val;
    return val === undefined || val === null || String(val).trim() === '';
  });

  const handleStartEdit = (f: FormField) => {
    setEditingId(f.id);
    setTempValue(answers[f.id] ?? '');
  };

  const handleSaveEdit = (id: string) => {
    onUpdateAnswer(id, tempValue);
    setEditingId(null);
  };

  const handleFillMissingSamples = () => {
    missingRequiredFields.forEach(f => {
      if (f.type === 'checkbox') {
        onUpdateAnswer(f.id, true);
      } else if (f.type === 'date') {
        onUpdateAnswer(f.id, f.example || '2026-10-28');
      } else if (f.example) {
        onUpdateAnswer(f.id, f.example);
      } else {
        onUpdateAnswer(f.id, 'Verified');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <span>Step 3 of 4 · Final Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Review Your Form Answers
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Verify your information before FormEase maps your responses into the original document.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('questions')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Questions</span>
            </button>
            <button
              onClick={onConfirmAndGenerate}
              disabled={isGenerating || missingRequiredFields.length > 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Confirm & Fill Original Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Missing Required Warning (if any) */}
        {missingRequiredFields.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{missingRequiredFields.length} Mandatory Field{missingRequiredFields.length > 1 ? 's' : ''} Still Require Your Input</span>
              </div>
              <button
                onClick={handleFillMissingSamples}
                className="self-start sm:self-auto px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-800" />
                <span>Fill Missing with Sample Data</span>
              </button>
            </div>
            <p className="text-amber-800 leading-relaxed">
              The original document marks the following fields as mandatory. You can fill them individually below or use the fast sample data filler:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {missingRequiredFields.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleStartEdit(f)}
                  className="px-2.5 py-1 rounded-md bg-white text-amber-900 font-semibold border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  Fill: {f.label} →
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inspection View Mode Selector */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold pl-1">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Review Layout Mode:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDisplayMode('sections')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                displayMode === 'sections'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Section Answers ({fields.length})
            </button>
            <button
              onClick={() => setDisplayMode('overlay')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                displayMode === 'overlay'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Form Document Overlay
            </button>
          </div>
        </div>

        {displayMode === 'overlay' ? (
          <div className="space-y-4">
            {analysis?.base64Data ? (
              <FormDocumentViewer
                base64Data={analysis.base64Data}
                fileType={analysis.fileType}
                fileName={analysis.fileName}
                fields={fields}
                answers={answers}
                showValues={true}
                onSelectField={(f) => handleStartEdit(f)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                Document preview not available. Please switch to Section Answers.
              </div>
            )}
            <p className="text-[11px] text-slate-500 text-center">
              Click on any field box to edit its value directly. Coordinates scale proportionally with original form boundaries.
            </p>
          </div>
        ) : (
          /* Grouped Answers by Section */
          <div className="space-y-6">
          {sections.map(section => {
            const sectionFields = fields.filter(f => (f.section || 'General Details') === section);
            const answeredInSec = sectionFields.filter(f => answers[f.id] !== undefined && answers[f.id] !== '').length;

            return (
              <div key={section} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
                      {section}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {answeredInSec} / {sectionFields.length} completed
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {sectionFields.map(f => {
                    const answer = answers[f.id];
                    const isMissing = f.required && (answer === undefined || answer === null || answer === '');
                    const isEditing = editingId === f.id;

                    return (
                      <div key={f.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="sm:w-1/3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900">{f.label}</span>
                            {f.required && (
                              <span className="text-[10px] text-red-600 font-bold">*</span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            Type: {f.type}
                          </span>
                        </div>

                        <div className="sm:w-1/2">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              {f.type === 'checkbox' ? (
                                <input
                                  type="checkbox"
                                  checked={Boolean(tempValue)}
                                  onChange={(e) => setTempValue(e.target.checked)}
                                  className="w-4 h-4 rounded text-blue-600"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={String(tempValue)}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  autoFocus
                                  className="w-full px-2.5 py-1 text-xs border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                />
                              )}
                              <button
                                onClick={() => handleSaveEdit(f.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div>
                              {f.type === 'checkbox' ? (
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                  answer ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {answer ? '✓ Confirmed / Checked' : 'Not Checked'}
                                </span>
                              ) : answer ? (
                                <span className="text-xs text-slate-800 font-medium break-words font-sans">
                                  {String(answer)}
                                </span>
                              ) : isMissing ? (
                                <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">
                                  Missing Required Answer
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">
                                  Left blank (Optional)
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="sm:w-1/6 flex items-center justify-end">
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEdit(f)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Confirmation Footer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900">Original Document Integrity Guaranteed: </span>
              Your original uploaded form layout, stamps, checkboxes, and logos will be 100% preserved. Answers are overlaid into the matching field positions.
            </div>
          </div>

          <button
            onClick={onConfirmAndGenerate}
            disabled={isGenerating || missingRequiredFields.length > 0}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Completed Form...</span>
              </>
            ) : (
              <>
                <span>Confirm & Fill Original Form</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
