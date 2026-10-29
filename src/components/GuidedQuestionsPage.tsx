import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Globe2, 
  Volume2,
  VolumeX,
  List,
  Sparkles,
  Zap,
  Bookmark,
  Languages,
  Check
} from 'lucide-react';
import { FormField, NavigationTab } from '../types';

interface GuidedQuestionsPageProps {
  fields: FormField[];
  answers: Record<string, string | boolean>;
  onAnswerChange: (id: string, value: string | boolean) => void;
  onFinishQuestions: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

// -------------------------------------------------------------
// Bilingual Guidance & UI Translations for Accessibility
// -------------------------------------------------------------
const GUIDANCE_STRINGS = {
  en: {
    stepBadge: 'Workflow Step 2 of 4 · Guided Form Filling',
    questionProgress: (cur: number, total: number) => `Question ${cur} of ${total}`,
    jumpToQuestion: 'Jump to Question',
    questionDirectory: 'Question Directory',
    autofillDemo: 'Autofill Verified Demo Data',
    close: 'Close',
    requiredBadge: 'Required *',
    optionalBadge: 'Optional',
    listenAudio: 'Listen to field explanation',
    stopAudio: 'Stop audio',
    plainEnglishHeader: 'Plain English Guidance',
    teluguHeader: 'తెలుగు వివరణ & మార్గదర్శకత్వం (Telugu Guidance)',
    yourAnswer: 'Your Answer:',
    useExample: (ex: string) => `Use Example (${ex})`,
    exampleFormat: 'Official example format:',
    checkboxConfirm: 'Yes, I confirm / agree to this requirement',
    checkboxHint: 'Checking this places an authentic checkmark in the original document box.',
    selectOptionPlaceholder: '-- Select an option --',
    textPlaceholder: (label: string, ex?: string) => ex ? `e.g. ${ex}` : `Enter ${label}...`,
    textareaPlaceholder: (ex?: string) => ex ? `e.g. ${ex}` : 'Type full residential address or details...',
    previous: 'Previous',
    reviewFieldList: '← Review Field List',
    skipForNow: 'Skip for now',
    nextQuestion: 'Next Question',
    finishReview: 'Finish & Review Answers',
    answeredCountText: (answered: number, total: number) => `${answered} of ${total} questions answered`,
    goToReviewPage: 'Go to Review Page →',
    autofillSampleAnswers: 'Autofill Sample Answers',
    validationRequiredCheckbox: 'Please mark this checkbox confirmation to proceed.',
    validationRequiredText: 'This field is marked required by the original document. Please provide an answer.',
    validationInvalidEmail: 'Please enter a valid email address (e.g. name@example.com).',
    validationInvalidPhone: 'Please enter a valid contact phone number (at least 7 to 10 digits).',
    languageSelectorAria: 'Select guidance language between English and Telugu',
    englishLabel: 'English',
    teluguLabel: 'తెలుగు (Telugu)',
    bothLabel: 'Dual (EN + తెలుగు)',
    languageSwitchedNotice: (lang: string) => `Guidance language set to ${lang}`,
  },
  te: {
    stepBadge: 'దశ 2 / 4 · మార్గదర్శక ఫారం పూరణ',
    questionProgress: (cur: number, total: number) => `ప్రశ్న ${cur} / ${total}`,
    jumpToQuestion: 'ప్రశ్నల జాబితా',
    questionDirectory: 'ప్రశ్నల డైరెక్టరీ',
    autofillDemo: 'నమూనా వివరాలను నింపండి',
    close: 'మూసివేయి',
    requiredBadge: 'తప్పనిసరి *',
    optionalBadge: 'ఐచ్ఛికం',
    listenAudio: 'వివరణ ఆడియో వినండి',
    stopAudio: 'ఆడియో ఆపివేయండి',
    plainEnglishHeader: 'ఆంగ్ల వివరణ (Plain English)',
    teluguHeader: 'తెలుగు వివరణ & మార్గదర్శకత్వం',
    yourAnswer: 'మీ సమాధానం:',
    useExample: (ex: string) => `ఈ ఉదాహరణ ఉపయోగించండి (${ex})`,
    exampleFormat: 'అధికారిక నమూనా రూపం:',
    checkboxConfirm: 'అవును, నేను ఈ నిబంధనను అంగీకరిస్తున్నాను మరియు ధృవీకరిస్తున్నాను',
    checkboxHint: 'దీన్ని ఎంచుకోవడం ద్వారా అసలు పత్రంలోని బాక్స్‌లో గుర్తు (checkmark) నమోదు అవుతుంది.',
    selectOptionPlaceholder: '-- ఒక ఎంపికను ఎంచుకోండి --',
    textPlaceholder: (_label: string, ex?: string) => ex ? `ఉదాహరణ: ${ex}` : 'ఇక్కడ మీ వివరాలను నమోదు చేయండి...',
    textareaPlaceholder: (ex?: string) => ex ? `ఉదాహరణ: ${ex}` : 'పూర్తి చిరునామా లేదా వివరాలను ఇక్కడ నమోదు చేయండి...',
    previous: 'వెనుకకు',
    reviewFieldList: '← ఫీల్డ్ జాబితా సమీక్షించండి',
    skipForNow: 'ప్రస్తుతానికి దాటవేయి',
    nextQuestion: 'తరువాతి ప్రశ్న',
    finishReview: 'పూర్తి చేసి సమీక్షించండి',
    answeredCountText: (answered: number, total: number) => `${total} లో ${answered} ప్రశ్నలకు సమాధానం ఇవ్వబడింది`,
    goToReviewPage: 'సమీక్ష పేజీకి వెళ్లండి →',
    autofillSampleAnswers: 'నమూనా వివరాలను నింపండి',
    validationRequiredCheckbox: 'దయచేసి ముందుకు వెళ్లడానికి ఈ బాక్స్‌ను ఎంచుకోండి.',
    validationRequiredText: 'అసలు పత్రం ప్రకారం ఈ వివరాలు తప్పనిసరి. దయచేసి సమాధానం ఇవ్వండి.',
    validationInvalidEmail: 'దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి (ఉదా. name@example.com).',
    validationInvalidPhone: 'దయచేసి సరైన సంప్రదింపు ఫోన్ నంబర్‌ను నమోదు చేయండి (కనీసం 7 నుండి 10 అంకెలు).',
    languageSelectorAria: 'ఆంగ్లం మరియు తెలుగు మధ్య మార్గదర్శక భాషను ఎంచుకోండి',
    englishLabel: 'English',
    teluguLabel: 'తెలుగు (Telugu)',
    bothLabel: 'ద్వంద్వ భాష (EN + తెలుగు)',
    languageSwitchedNotice: (lang: string) => `భాష ${lang} కు మార్చబడింది`,
  },
};

export const GuidedQuestionsPage: React.FC<GuidedQuestionsPageProps> = ({
  fields,
  answers,
  onAnswerChange,
  onFinishQuestions,
  onNavigate,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [preferredLang, setPreferredLang] = React.useState<'both' | 'en' | 'te'>('both');
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const currentField = fields[currentIndex];

  // Active translation strings: English for 'en' and 'both', Telugu for 'te'
  const isTeluguActive = preferredLang === 'te';
  const t = isTeluguActive ? GUIDANCE_STRINGS.te : GUIDANCE_STRINGS.en;

  // Initialize answer with currentValue if empty
  React.useEffect(() => {
    if (currentField && currentField.currentValue && answers[currentField.id] === undefined) {
      onAnswerChange(currentField.id, currentField.currentValue);
    }
  }, [currentIndex, currentField]);

  // Stop speaking when question or language changes
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex, preferredLang]);

  if (!currentField) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-slate-600">No questions available.</p>
          <button
            onClick={() => onNavigate('upload')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const currentValue = answers[currentField.id] ?? '';

  const handleSpeak = (text: string, lang = 'en-US') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = lang;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleFastFillAll = () => {
    fields.forEach(f => {
      if (answers[f.id] === undefined || answers[f.id] === '') {
        if (f.type === 'checkbox') {
          onAnswerChange(f.id, true);
        } else if (f.type === 'date') {
          onAnswerChange(f.id, f.example || '2026-10-28');
        } else if (f.example) {
          onAnswerChange(f.id, f.example);
        } else {
          onAnswerChange(f.id, 'Verified');
        }
      }
    });
  };

  const validateCurrent = (): boolean => {
    setValidationError(null);

    // Required check
    if (currentField.required) {
      if (currentField.type === 'checkbox') {
        if (!currentValue) {
          setValidationError(t.validationRequiredCheckbox);
          return false;
        }
      } else if (typeof currentValue === 'string' && !currentValue.trim()) {
        setValidationError(t.validationRequiredText);
        return false;
      }
    }

    // Type-specific validations
    if (typeof currentValue === 'string' && currentValue.trim()) {
      if (currentField.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(currentValue.trim())) {
          setValidationError(t.validationInvalidEmail);
          return false;
        }
      } else if (currentField.type === 'phone') {
        const phoneDigits = currentValue.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
          setValidationError(t.validationInvalidPhone);
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrent()) return;

    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setValidationError(null);
    } else {
      onFinishQuestions();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setValidationError(null);
    }
  };

  const handleSkip = () => {
    setValidationError(null);
    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinishQuestions();
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / fields.length) * 100);

  const answeredCount = fields.filter(f => {
    const val = answers[f.id];
    return val !== undefined && val !== null && val !== '';
  }).length;

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Top Header & Breadcrumb Tracker */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">
                {t.questionProgress(currentIndex + 1, fields.length)}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium truncate max-w-xs">{currentField.section}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDrawer(!showDrawer)}
                className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
              >
                <List className="w-3.5 h-3.5" />
                <span>{t.jumpToQuestion}</span>
              </button>
              <span className="font-mono tabular-nums text-slate-800 font-semibold">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Quick Jump Drawer (if open) */}
        {showDrawer && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">{t.questionDirectory}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFastFillAll}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  title="Populate missing fields with realistic example applicant answers"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{t.autofillDemo}</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pt-2">
              {fields.map((f, idx) => {
                const hasAnswer = answers[f.id] !== undefined && answers[f.id] !== '';
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowDrawer(false);
                      setValidationError(null);
                    }}
                    className={`p-2 rounded-lg text-left text-[11px] truncate border transition-colors cursor-pointer ${
                      currentIndex === idx
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                        : hasAnswer
                        ? 'border-slate-200 bg-white text-slate-800'
                        : 'border-dashed border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span className="font-mono mr-1.5">{idx + 1}.</span>
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          
          {/* Top Section Strip & Accessibility Language Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded self-start sm:self-auto">
              {currentField.section}
            </span>

            {/* Accessibility Language Toggle Switch */}
            <div 
              role="radiogroup" 
              aria-label={t.languageSelectorAria}
              className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80 shadow-2xs"
            >
              <div className="flex items-center gap-1 px-1.5 text-slate-500">
                <Languages className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">Language:</span>
              </div>

              {/* English Toggle */}
              <button
                type="button"
                role="radio"
                aria-checked={preferredLang === 'en'}
                onClick={() => setPreferredLang('en')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  preferredLang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>English</span>
                {preferredLang === 'en' && <Check className="w-3 h-3 text-blue-600" />}
              </button>

              {/* Telugu Toggle */}
              <button
                type="button"
                role="radio"
                aria-checked={preferredLang === 'te'}
                onClick={() => setPreferredLang('te')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  preferredLang === 'te'
                    ? 'bg-blue-600 text-white shadow-xs font-bold border border-blue-600'
                    : 'text-blue-900 hover:text-blue-950 hover:bg-blue-50'
                }`}
              >
                <span className="font-semibold">తెలుగు (Telugu)</span>
                {preferredLang === 'te' && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* Dual Language Toggle */}
              <button
                type="button"
                role="radio"
                aria-checked={preferredLang === 'both'}
                onClick={() => setPreferredLang('both')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  preferredLang === 'both'
                    ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title="Display both English and Telugu side-by-side for comparison"
              >
                <span>Dual (EN + తెలుగు)</span>
                {preferredLang === 'both' && <Check className="w-3 h-3 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Question Label and Speech Helper */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  {currentField.label}
                </h2>
                {currentField.required ? (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    {t.requiredBadge}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {t.optionalBadge}
                  </span>
                )}
                {currentField.bbox && (
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    Mapped: {Math.round(currentField.bbox.x)}%, {Math.round(currentField.bbox.y)}%
                  </span>
                )}
              </div>

              {/* Secondary bilingual title hint when in Telugu or Dual mode */}
              {(preferredLang === 'te' || preferredLang === 'both') && currentField.explanationTe && (
                <p className="text-xs text-blue-700 font-medium">
                  {currentField.explanationTe.split('.')[0]}.
                </p>
              )}
            </div>

            {/* Audio Speech Helper Button */}
            <button
              onClick={() => handleSpeak(
                preferredLang === 'te' && currentField.explanationTe
                  ? currentField.explanationTe
                  : `${currentField.label}. ${currentField.explanationEn || ''}`,
                preferredLang === 'te' ? 'te-IN' : 'en-US'
              )}
              className={`p-2.5 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                isSpeaking
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={isSpeaking ? t.stopAudio : t.listenAudio}
              aria-label={isSpeaking ? t.stopAudio : t.listenAudio}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Clear Explanations in English and/or Telugu */}
          <div className="space-y-3 mb-6" aria-live="polite">
            
            {/* Plain English Box */}
            {(preferredLang === 'both' || preferredLang === 'en') && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 transition-all">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Plain English Explanation</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">English Guidance</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {currentField.explanationEn || `Enter your ${currentField.label.toLowerCase()} as requested on the form.`}
                </p>
              </div>
            )}

            {/* Telugu Guidance Box */}
            {(preferredLang === 'both' || preferredLang === 'te') && currentField.explanationTe && (
              <div className={`p-4 rounded-xl border transition-all ${
                preferredLang === 'te'
                  ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/10'
                  : 'bg-blue-50/40 border-blue-200'
              }`}>
                <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>తెలుగు వివరణ & మార్గదర్శకత్వం</span>
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">Telugu Guidance</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-950 leading-relaxed font-medium">
                  {currentField.explanationTe}
                </p>
              </div>
            )}
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Input Element based on type */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 block">
                {t.yourAnswer}
              </label>
              {currentField.example && (
                <button
                  type="button"
                  onClick={() => onAnswerChange(currentField.id, currentField.example)}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {t.useExample(currentField.example)}
                </button>
              )}
            </div>

            {currentField.type === 'checkbox' ? (
              <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={Boolean(currentValue)}
                  onChange={(e) => onAnswerChange(currentField.id, e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-900">
                    {t.checkboxConfirm}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.checkboxHint}
                  </p>
                </div>
              </label>
            ) : currentField.type === 'textarea' ? (
              <textarea
                rows={4}
                value={String(currentValue)}
                placeholder={t.textareaPlaceholder(currentField.example)}
                onChange={(e) => onAnswerChange(currentField.id, e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
              />
            ) : currentField.type === 'date' ? (
              <input
                type="date"
                value={String(currentValue)}
                onChange={(e) => onAnswerChange(currentField.id, e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
            ) : currentField.type === 'select' && currentField.options && currentField.options.length > 0 ? (
              <select
                value={String(currentValue)}
                onChange={(e) => onAnswerChange(currentField.id, e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              >
                <option value="">{t.selectOptionPlaceholder}</option>
                {currentField.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={currentField.type === 'number' ? 'number' : currentField.type === 'email' ? 'email' : currentField.type === 'phone' ? 'tel' : 'text'}
                value={String(currentValue)}
                placeholder={t.textPlaceholder(currentField.label, currentField.example)}
                onChange={(e) => onAnswerChange(currentField.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
            )}

            {currentField.example && (
              <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                <span>
                  <span className="font-semibold text-slate-700">{t.exampleFormat} </span>
                  <span className="italic">{currentField.example}</span>
                </span>
                {currentField.bbox && (
                  <span className="text-[10px] font-mono text-slate-400">
                    Pos: ({currentField.bbox.x}%, {currentField.bbox.y}%)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls: Back, Skip, Next */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              {currentIndex > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.previous}</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('fields')}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {t.reviewFieldList}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!currentField.required && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  {t.skipForNow}
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>{currentIndex === fields.length - 1 ? t.finishReview : t.nextQuestion}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Tracker and Fast Demo Fill Strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>{t.answeredCountText(answeredCount, fields.length)}</span>
            <span className="text-slate-300">·</span>
            <button
              onClick={handleFastFillAll}
              className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{t.autofillSampleAnswers}</span>
            </button>
          </div>

          <button
            onClick={onFinishQuestions}
            className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
          >
            {t.goToReviewPage}
          </button>
        </div>
      </div>
    </div>
  );
};
