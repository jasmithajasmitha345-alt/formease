import React, { useState, useRef, useEffect } from 'react';
import { FormField } from '../types';
import { BoundingBox, sanitizeFieldBoundingBoxes } from '../utils/bboxUtils';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  MapPin, 
  Check, 
  Move, 
  Crosshair,
  AlertCircle,
  HelpCircle,
  Maximize2
} from 'lucide-react';

interface FormDocumentViewerProps {
  base64Data: string;
  fileType: string;
  fileName: string;
  fields: FormField[];
  answers?: Record<string, string | boolean>;
  activeFieldId?: string | null;
  onSelectField?: (field: FormField) => void;
  onUpdateFieldBbox?: (fieldId: string, newBbox: BoundingBox) => void;
  showValues?: boolean;
  className?: string;
}

export const FormDocumentViewer: React.FC<FormDocumentViewerProps> = ({
  base64Data,
  fileType,
  fileName,
  fields,
  answers = {},
  activeFieldId = null,
  onSelectField,
  onUpdateFieldBbox,
  showValues = true,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'values' | 'blueprint'>(showValues ? 'values' : 'blueprint');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(activeFieldId);
  const [placingFieldId, setPlacingFieldId] = useState<string | null>(null);

  // Dragging / Resizing State
  const [dragState, setDragState] = useState<{
    fieldId: string;
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    initialBbox: BoundingBox;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const isImage = fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png)$/i);
  const sanitizedFields = React.useMemo(() => sanitizeFieldBoundingBoxes(fields), [fields]);

  // Sync activeFieldId from outside
  useEffect(() => {
    if (activeFieldId) {
      setSelectedFieldId(activeFieldId);
    }
  }, [activeFieldId]);

  const placedFields = sanitizedFields.filter(f => f.bbox !== undefined);
  const unplacedFields = sanitizedFields.filter(f => f.bbox === undefined);

  const placingField = placingFieldId ? fields.find(f => f.id === placingFieldId) : null;
  const activeSelectedField = selectedFieldId ? fields.find(f => f.id === selectedFieldId) : null;

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(60, Math.min(220, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Click on the document image to place an unplaced field
  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingFieldId || !onUpdateFieldBbox || !imageWrapperRef.current) return;

    const rect = imageWrapperRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const targetField = fields.find(f => f.id === placingFieldId);
    const isTextarea = targetField?.type === 'textarea';
    const isCheckbox = targetField?.type === 'checkbox';

    const defaultWidth = isCheckbox ? 4.0 : isTextarea ? 60.0 : 38.0;
    const defaultHeight = isCheckbox ? 2.8 : isTextarea ? 6.0 : 3.2;

    const newBbox: BoundingBox = {
      x: Number(Math.max(0.5, Math.min(99.0 - defaultWidth, clickX - 2.0)).toFixed(2)),
      y: Number(Math.max(0.5, Math.min(99.0 - defaultHeight, clickY - (defaultHeight / 2))).toFixed(2)),
      width: Number(defaultWidth.toFixed(2)),
      height: Number(defaultHeight.toFixed(2)),
    };

    onUpdateFieldBbox(placingFieldId, newBbox);
    setSelectedFieldId(placingFieldId);
    setPlacingFieldId(null);
  };

  // Pointer drag to move bounding box
  const handleStartMove = (e: React.PointerEvent, f: FormField) => {
    if (!onUpdateFieldBbox || !f.bbox) return;
    e.stopPropagation();
    e.preventDefault();

    setSelectedFieldId(f.id);
    if (onSelectField) onSelectField(f);

    setDragState({
      fieldId: f.id,
      mode: 'move',
      startX: e.clientX,
      startY: e.clientY,
      initialBbox: { ...f.bbox },
    });
  };

  // Pointer drag to resize bounding box
  const handleStartResize = (e: React.PointerEvent, f: FormField) => {
    if (!onUpdateFieldBbox || !f.bbox) return;
    e.stopPropagation();
    e.preventDefault();

    setSelectedFieldId(f.id);
    if (onSelectField) onSelectField(f);

    setDragState({
      fieldId: f.id,
      mode: 'resize',
      startX: e.clientX,
      startY: e.clientY,
      initialBbox: { ...f.bbox },
    });
  };

  // Global pointer move listener during drag
  useEffect(() => {
    if (!dragState || !imageWrapperRef.current || !onUpdateFieldBbox) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = imageWrapperRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;

      const deltaXPercent = ((e.clientX - dragState.startX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragState.startY) / rect.height) * 100;

      if (dragState.mode === 'move') {
        let newX = dragState.initialBbox.x + deltaXPercent;
        let newY = dragState.initialBbox.y + deltaYPercent;

        newX = Math.max(0.2, Math.min(99.0 - dragState.initialBbox.width, newX));
        newY = Math.max(0.2, Math.min(99.0 - dragState.initialBbox.height, newY));

        onUpdateFieldBbox(dragState.fieldId, {
          ...dragState.initialBbox,
          x: Number(newX.toFixed(2)),
          y: Number(newY.toFixed(2)),
        });
      } else if (dragState.mode === 'resize') {
        let newW = dragState.initialBbox.width + deltaXPercent;
        let newH = dragState.initialBbox.height + deltaYPercent;

        newW = Math.max(2.0, Math.min(99.5 - dragState.initialBbox.x, newW));
        newH = Math.max(1.5, Math.min(99.5 - dragState.initialBbox.y, newH));

        onUpdateFieldBbox(dragState.fieldId, {
          ...dragState.initialBbox,
          width: Number(newW.toFixed(2)),
          height: Number(newH.toFixed(2)),
        });
      }
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, onUpdateFieldBbox]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col ${className}`}>
      {/* Control Header Strip */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600 font-mono text-[11px] bg-slate-200/60 px-2 py-0.5 rounded">
            {placedFields.length} of {fields.length} placed
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('values')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'values'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Filled Values
            </button>
            <button
              type="button"
              onClick={() => setViewMode('blueprint')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'blueprint'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Field Boxes
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => handleZoom(-15)}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 tabular-nums text-slate-700 font-medium">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(15)}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 border-l border-slate-100 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Guidance or Placement Action Banner */}
      {placingField ? (
        <div className="bg-blue-600 text-white px-4 py-2.5 flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 shrink-0" />
            <span>
              <strong>Click anywhere on the document</strong> where <strong>"{placingField.label}"</strong> belongs.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPlacingFieldId(null)}
            className="px-2.5 py-1 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded text-[11px] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : unplacedFields.length > 0 && onUpdateFieldBbox ? (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{unplacedFields.length} field{unplacedFields.length > 1 ? 's' : ''} not yet positioned on document:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {unplacedFields.map(uf => (
              <button
                key={uf.id}
                type="button"
                onClick={() => setPlacingFieldId(uf.id)}
                className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 font-semibold text-[11px] hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Click to place this field on the document"
              >
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>Place: {uf.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Main Document Canvas Viewport */}
      <div 
        ref={containerRef}
        className="w-full overflow-auto bg-slate-900/5 p-4 sm:p-6 flex items-center justify-center min-h-[460px] select-none"
      >
        <div 
          className="transition-all duration-150 shadow-md rounded-lg overflow-hidden bg-white max-w-full"
          style={{ 
            width: `${zoomLevel}%`,
            maxWidth: zoomLevel === 100 ? '760px' : 'none',
          }}
        >
          {/* Document & Overlays Container (Strict 1:1 Aspect Ratio Matching) */}
          <div 
            ref={imageWrapperRef}
            onClick={handleDocumentClick}
            className={`relative w-full ${placingFieldId ? 'cursor-crosshair' : 'cursor-default'}`}
          >
            {isImage ? (
              <img
                src={base64Data}
                alt={fileName}
                className="block w-full h-auto select-none pointer-events-none"
              />
            ) : (
              <div className="w-full aspect-[1/1.414] bg-white relative">
                <div className="absolute inset-x-8 top-12 h-6 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 font-display">{fileName}</span>
                  <span className="text-[10px] text-slate-400">PDF Document</span>
                </div>
              </div>
            )}

            {/* Bounding Box Overlays */}
            {placedFields.map((f) => {
              if (!f.bbox) return null;
              const answer = answers[f.id];
              const hasAnswer = answer !== undefined && answer !== null && answer !== '';
              const isSelected = selectedFieldId === f.id;

              return (
                <div
                  key={f.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFieldId(f.id);
                    if (onSelectField) onSelectField(f);
                  }}
                  className={`absolute rounded-xs transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-blue-600 bg-blue-500/25 border-2 border-blue-600 z-30 shadow-md'
                      : viewMode === 'blueprint'
                      ? 'border border-blue-500/80 bg-blue-500/10 hover:bg-blue-500/25 z-10'
                      : hasAnswer
                      ? 'bg-blue-50/75 border border-blue-300/70 z-10 hover:border-blue-500'
                      : 'border border-dashed border-amber-400/80 bg-amber-500/10 hover:bg-amber-500/20 z-10'
                  }`}
                  style={{
                    left: `${f.bbox.x}%`,
                    top: `${f.bbox.y}%`,
                    width: `${f.bbox.width}%`,
                    height: `${f.bbox.height}%`,
                    cursor: onUpdateFieldBbox ? 'move' : 'pointer',
                  }}
                  onPointerDown={(e) => onUpdateFieldBbox && handleStartMove(e, f)}
                  title={`${f.label} (${f.bbox.x}%, ${f.bbox.y}%) - Drag to move`}
                >
                  {/* Content Inside Bounding Box */}
                  <div className="w-full h-full flex items-center px-1 overflow-hidden pointer-events-none">
                    {viewMode === 'values' && hasAnswer ? (
                      f.type === 'checkbox' ? (
                        <span className="text-[11px] font-bold text-blue-900 mx-auto">
                          {answer === true || answer === 'true' || answer === 'yes' ? '✓' : ''}
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[11px] font-semibold text-slate-950 truncate leading-tight font-sans">
                          {String(answer)}
                        </span>
                      )
                    ) : (
                      <span className="text-[8px] sm:text-[9.5px] font-medium text-blue-950 truncate leading-tight opacity-95">
                        {f.label}
                      </span>
                    )}
                  </div>

                  {/* Corner Resize Handle */}
                  {onUpdateFieldBbox && isSelected && (
                    <div
                      onPointerDown={(e) => handleStartResize(e, f)}
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-se-resize shadow-xs z-40 hover:scale-125 transition-transform"
                      title="Drag to resize field box"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Field Quick Inspector Bar */}
      {activeSelectedField && (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-bold text-slate-900">{activeSelectedField.label}</span>
            {activeSelectedField.bbox ? (
              <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                Position: {activeSelectedField.bbox.x}%, {activeSelectedField.bbox.y}% · Size: {activeSelectedField.bbox.width}% × {activeSelectedField.bbox.height}%
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Not positioned on document
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onUpdateFieldBbox && (
              <button
                type="button"
                onClick={() => setPlacingFieldId(activeSelectedField.id)}
                className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <Crosshair className="w-3 h-3" />
                <span>{activeSelectedField.bbox ? 'Reposition on Form' : 'Place on Form'}</span>
              </button>
            )}
            {onUpdateFieldBbox && activeSelectedField.bbox && (
              <button
                type="button"
                onClick={() => {
                  onUpdateFieldBbox(activeSelectedField.id, undefined as any);
                }}
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-red-600 rounded transition-colors cursor-pointer"
                title="Remove field position from this form"
              >
                Clear Position
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
