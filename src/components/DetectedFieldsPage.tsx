import React from 'react';
import { 
  CheckCircle2, 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Globe2, 
  Layers, 
  FileText,
  SlidersHorizontal,
  Check,
  Crosshair,
  Maximize2,
  Move
} from 'lucide-react';
import { DocumentAnalysisResult, FormField, NavigationTab } from '../types';
import { FormDocumentViewer } from './FormDocumentViewer';
import { sanitizeFieldBoundingBoxes } from '../utils/bboxUtils';

interface DetectedFieldsPageProps {
  analysis: DocumentAnalysisResult;
  onUpdateFields: (fields: FormField[]) => void;
  onNavigate: (tab: NavigationTab) => void;
  onStartQuestions: () => void;
}

export const DetectedFieldsPage: React.FC<DetectedFieldsPageProps> = ({
  analysis,
  onUpdateFields,
  onNavigate,
  onStartQuestions,
}) => {
  const [fields, setFields] = React.useState<FormField[]>(() => sanitizeFieldBoundingBoxes(analysis.fields));
  const [displayMode, setDisplayMode] = React.useState<'cards' | 'preview'>('cards');
  const [editingFieldId, setEditingFieldId] = React.useState<string | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [calibratingField, setCalibratingField] = React.useState<FormField | null>(null);

  // New field state
  const [newLabel, setNewLabel] = React.useState('');
  const [newSection, setNewSection] = React.useState('General Details');
  const [newType, setNewType] = React.useState<FormField['type']>('text');
  const [newRequired, setNewRequired] = React.useState(true);
  const [newExplanationEn, setNewExplanationEn] = React.useState('');
  const [newExplanationTe, setNewExplanationTe] = React.useState('');

  const sections = Array.from(new Set(fields.map(f => f.section || 'General Details')));

  const handleSaveEdit = (id: string, updatedProps: Partial<FormField>) => {
    const updated = fields.map(f => f.id === id ? { ...f, ...updatedProps } : f);
    setFields(updated);
    onUpdateFields(updated);
    setEditingFieldId(null);
  };

  const handleDeleteField = (id: string) => {
    const updated = fields.filter(f => f.id !== id);
    setFields(updated);
    onUpdateFields(updated);
  };

  const handleAddField = () => {
    if (!newLabel.trim()) return;

    const id = 'custom_' + Date.now();
    const newField: FormField = {
      id,
      label: newLabel.trim(),
      section: newSection.trim() || 'General Details',
      type: newType,
      required: newRequired,
      explanationEn: newExplanationEn.trim() || `Please enter the required information for ${newLabel}.`,
      explanationTe: newExplanationTe.trim() || `${newLabel} కోసం అవసరమైన వివరాలను నమోదు చేయండి.`,
      example: 'Example Value',
      pageIndex: 0,
      bbox: { x: 10, y: 50, width: 40, height: 4 },
    };

    const updated = [...fields, newField];
    setFields(updated);
    onUpdateFields(updated);
    setShowAddModal(false);

    // Reset inputs
    setNewLabel('');
    setNewExplanationEn('');
    setNewExplanationTe('');
  };

  const handleUpdateBbox = (fieldId: string, newBbox: any) => {
    const updated = fields.map(f => f.id === fieldId ? { ...f, bbox: newBbox } : f);
    setFields(updated);
    onUpdateFields(updated);
    if (calibratingField && calibratingField.id === fieldId) {
      setCalibratingField({ ...calibratingField, bbox: newBbox });
    }
  };

  const handleNudgeBbox = (axis: 'x' | 'y' | 'width' | 'height', delta: number) => {
    if (!calibratingField) return;
    const currentBbox = calibratingField.bbox || { x: 10, y: 20, width: 40, height: 3.5 };
    const updatedVal = Math.max(1, Math.min(95, Number((currentBbox[axis] + delta).toFixed(1))));

    const updatedField = {
      ...calibratingField,
      bbox: {
        ...currentBbox,
        [axis]: updatedVal,
      },
    };

    setCalibratingField(updatedField);
    const updatedAll = fields.map(f => f.id === updatedField.id ? updatedField : f);
    setFields(updatedAll);
    onUpdateFields(updatedAll);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <span>Step 2 of 4 · Document Calibration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Review Detected Form Fields
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Document: <span className="font-semibold text-slate-800">{analysis.formTitle}</span> · {analysis.pageCount} {analysis.pageCount === 1 ? 'page' : 'pages'} · {fields.length} verified fields
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('upload')}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Back to Upload
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Field</span>
            </button>
            <button
              onClick={onStartQuestions}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Start Questions ({fields.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Informational Guidance Box */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900">Precision Blueprint Verified: </span>
            FormEase mapped all labels, bounding boxes, and field coordinates. Click <strong>Calibrate Position</strong> on any field to fine-tune its exact position on the page, or click <strong>Start Questions</strong> to begin answering.
          </div>
        </div>

        {/* View Mode Toggle: Form Preview vs Cards List */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold pl-1">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Inspection Display:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDisplayMode('cards')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                displayMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Field Cards ({fields.length})
            </button>
            <button
              onClick={() => setDisplayMode('preview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                displayMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Form Overlay
            </button>
          </div>
        </div>

        {displayMode === 'preview' ? (
          <div className="space-y-4">
            <FormDocumentViewer
              base64Data={analysis.base64Data}
              fileType={analysis.fileType}
              fileName={analysis.fileName}
              fields={fields}
              showValues={false}
              onSelectField={(f) => setCalibratingField(f)}
              onUpdateFieldBbox={handleUpdateBbox}
            />
            <p className="text-[11px] text-slate-500 text-center">
              💡 Drag any box to move it. Drag the corner to resize. Click on unplaced fields above to place them directly on your form.
            </p>
          </div>
        ) : (
          /* Grouped Fields Sections */
          <div className="space-y-6">
          {sections.map(section => {
            const sectionFields = fields.filter(f => (f.section || 'General Details') === section);

            return (
              <div key={section} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                      {section}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {sectionFields.length} {sectionFields.length === 1 ? 'field' : 'fields'}
                  </span>
                </div>

                <div className="space-y-3">
                  {sectionFields.map(f => (
                    <div
                      key={f.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      {editingFieldId === f.id ? (
                        /* Editing view */
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-700">Field Label</label>
                              <input
                                type="text"
                                defaultValue={f.label}
                                id={`edit_label_${f.id}`}
                                className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-700">Input Type</label>
                              <select
                                defaultValue={f.type}
                                id={`edit_type_${f.id}`}
                                className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="text">Single-line Text</option>
                                <option value="number">Numeric / Amount</option>
                                <option value="date">Date</option>
                                <option value="email">Email Address</option>
                                <option value="phone">Phone / Mobile</option>
                                <option value="checkbox">Checkbox (Yes/No)</option>
                                <option value="textarea">Paragraph / Address</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-700">English Explanation</label>
                            <input
                              type="text"
                              defaultValue={f.explanationEn}
                              id={`edit_expen_${f.id}`}
                              className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-700">Telugu Explanation (తెలుగు)</label>
                            <input
                              type="text"
                              defaultValue={f.explanationTe}
                              id={`edit_expte_${f.id}`}
                              className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingFieldId(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                const labelInput = document.getElementById(`edit_label_${f.id}`) as HTMLInputElement;
                                const typeInput = document.getElementById(`edit_type_${f.id}`) as HTMLSelectElement;
                                const expEnInput = document.getElementById(`edit_expen_${f.id}`) as HTMLInputElement;
                                const expTeInput = document.getElementById(`edit_expte_${f.id}`) as HTMLInputElement;

                                handleSaveEdit(f.id, {
                                  label: labelInput.value,
                                  type: typeInput.value as FormField['type'],
                                  explanationEn: expEnInput.value,
                                  explanationTe: expTeInput.value,
                                });
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal display view */
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">{f.label}</span>
                              {f.required ? (
                                <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                  Required
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  Optional
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                                Type: {f.type}
                              </span>
                              {f.bbox ? (
                                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                  Position: {f.bbox.x}%, {f.bbox.y}%
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded">
                                  ⚠️ Needs Placement on Form
                                </span>
                              )}
                              {f.currentValue && (
                                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                  Existing: "{String(f.currentValue)}"
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                              <span className="text-slate-400 font-semibold">EN:</span>
                              <span>{f.explanationEn}</span>
                            </div>

                            {f.explanationTe && (
                              <div className="text-[11px] text-blue-900 flex items-center gap-1.5">
                                <span className="text-blue-500 font-semibold">TE:</span>
                                <span>{f.explanationTe}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                            <button
                              onClick={() => {
                                setDisplayMode('preview');
                                setCalibratingField(f);
                              }}
                              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                                f.bbox
                                  ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                                  : 'text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 font-bold'
                              }`}
                              title={f.bbox ? "Fine-tune visual position on original document" : "Place field on the document"}
                            >
                              <Crosshair className="w-3 h-3" />
                              <span>{f.bbox ? 'Adjust Position' : 'Place on Form'}</span>
                            </button>
                            <button
                              onClick={() => setEditingFieldId(f.id)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-white transition-colors cursor-pointer"
                              title="Edit Field"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteField(f.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-white transition-colors cursor-pointer"
                              title="Delete Field"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Bottom CTA Strip */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Total {fields.length} questions prepared for your document
          </div>
          <button
            onClick={onStartQuestions}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Proceed to Guided Questions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Visual Coordinate Calibrator Modal */}
        {calibratingField && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Calibrate Field Coordinates: {calibratingField.label}
                  </h3>
                </div>
                <button
                  onClick={() => setCalibratingField(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Real Document Canvas Simulator */}
              <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-center max-h-96 overflow-auto">
                <div className="relative max-w-sm w-full bg-white border-2 border-slate-300 rounded shadow-md overflow-hidden select-none">
                  {analysis.base64Data ? (
                    <img
                      src={analysis.base64Data}
                      alt="Document calibration view"
                      className="block w-full h-auto select-none pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-72 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                      No document image preview
                    </div>
                  )}

                  {/* Active Bounding Box Highlight */}
                  {calibratingField.bbox && (
                    <div
                      className="absolute border-2 border-blue-600 bg-blue-500/25 rounded-xs flex items-center justify-center transition-all duration-75 shadow-xs"
                      style={{
                        left: `${calibratingField.bbox.x}%`,
                        top: `${calibratingField.bbox.y}%`,
                        width: `${calibratingField.bbox.width}%`,
                        height: `${Math.max(2.5, calibratingField.bbox.height || 2.5)}%`,
                      }}
                    >
                      <span className="text-[9px] font-bold text-white bg-blue-700/90 px-1 py-0.5 rounded-xs truncate shadow-xs">
                        {calibratingField.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Steppers for X, Y, Width, Height */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Horizontal (X): {calibratingField.bbox?.x}%</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNudgeBbox('x', -1)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleNudgeBbox('x', 1)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Vertical (Y): {calibratingField.bbox?.y}%</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNudgeBbox('y', -1)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleNudgeBbox('y', 1)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Width: {calibratingField.bbox?.width}%</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNudgeBbox('width', -2)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleNudgeBbox('width', 2)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Height: {calibratingField.bbox?.height}%</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNudgeBbox('height', -0.5)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleNudgeBbox('height', 0.5)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => setCalibratingField(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
                >
                  Confirm Calibration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Custom Field Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Add Custom Form Field
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Field Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Passport Expiry Date"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Section Group</label>
                    <input
                      type="text"
                      placeholder="e.g. Travel Credentials"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Field Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as FormField['type'])}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="text">Single-line Text</option>
                      <option value="number">Numeric / Amount</option>
                      <option value="date">Date</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone Number</option>
                      <option value="checkbox">Checkbox (Yes/No)</option>
                      <option value="textarea">Paragraph / Address</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">English Meaning / Explanation</label>
                  <input
                    type="text"
                    placeholder="Explain what to enter in simple English"
                    value={newExplanationEn}
                    onChange={(e) => setNewExplanationEn(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Telugu Explanation (తెలుగు)</label>
                  <input
                    type="text"
                    placeholder="స్పష్టమైన తెలుగు వివరణ"
                    value={newExplanationTe}
                    onChange={(e) => setNewExplanationTe(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="new_req"
                    checked={newRequired}
                    onChange={(e) => setNewRequired(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="new_req" className="text-xs font-medium text-slate-700">
                    This field is mandatory / required on the form
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddField}
                  disabled={!newLabel.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Add Field
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
