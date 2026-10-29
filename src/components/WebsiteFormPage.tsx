import React from 'react';
import { 
  Laptop, 
  ArrowRight, 
  ExternalLink, 
  ShieldAlert, 
  Copy, 
  Check, 
  RefreshCw, 
  HelpCircle, 
  Globe2, 
  AlertTriangle, 
  Lock,
  Bookmark,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { FormField, NavigationTab } from '../types';

interface WebsiteFormPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

interface WebAnalysisResult {
  url: string;
  siteName: string;
  formTitle: string;
  instructions: string;
  technicalNote: string;
  fields: FormField[];
  helperBookmarklet: string;
}

export const WebsiteFormPage: React.FC<WebsiteFormPageProps> = ({ onNavigate }) => {
  const [urlInput, setUrlInput] = React.useState('https://admissions.stateuniv.edu/portal/application-2026');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<WebAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [copiedScript, setCopiedScript] = React.useState(false);
  const [copiedFieldId, setCopiedFieldId] = React.useState<string | null>(null);
  const [userAnswers, setUserAnswers] = React.useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = React.useState<'guided' | 'script' | 'security'>('guided');

  const presetUrls = [
    {
      title: 'State University Admission Application',
      url: 'https://admissions.stateuniv.edu/portal/application-2026',
      desc: 'Typical higher education student registration portal.',
    },
    {
      title: 'Citizen Welfare & Grant Portal',
      url: 'https://citizenportal.gov/services/welfare-aid-form',
      desc: 'Government subsidy and welfare assistance form.',
    },
    {
      title: 'Global Conference Speaker Registration',
      url: 'https://events.globaltechcon.org/apply/speaker-form',
      desc: 'Conference session submission and bio details.',
    },
  ];

  const handleAnalyze = async () => {
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-website-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to inspect website form.');
      }

      setAnalysisResult(data);

      // Pre-fill answer state with examples
      const initial: Record<string, string> = {};
      (data.fields || []).forEach((f: FormField) => {
        initial[f.id] = f.example || '';
      });
      setUserAnswers(initial);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to inspect the given URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyScript = () => {
    if (!analysisResult) return;

    // Generate dynamic JavaScript snippet with the user's answers mapped to form input names/IDs!
    const fillScript = `/* FormEase Authorized Autofill Script for ${analysisResult.siteName} */
(function() {
  const fields = ${JSON.stringify(userAnswers, null, 2)};
  let filledCount = 0;
  let missing = [];

  for (const [key, value] of Object.entries(fields)) {
    // Search by ID, name, or placeholder
    const el = document.getElementById(key) || 
               document.querySelector(\`[name="\${key}"]\`) || 
               document.querySelector(\`[data-field="\${key}"]\`);
    if (el) {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      filledCount++;
    } else {
      missing.push(key);
    }
  }

  alert(\`FormEase Assistant: Successfully filled \${filledCount} fields!\\nFields needing manual attention: \${missing.length > 0 ? missing.join(', ') : 'None'}.\\nPlease inspect and confirm before submitting manually.\`);
})();`;

    navigator.clipboard.writeText(fillScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyFieldValue = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFieldId(id);
    setTimeout(() => setCopiedFieldId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <span>Workflow 4 · Online Form Assistant</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Fill a Website Form
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Enter the URL of any online web form. FormEase breaks down confusing questions with English and Telugu explanations and generates a secure helper to assist filling the original website.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <label className="text-xs font-bold text-slate-900 block mb-2">
            Website Form URL:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="url"
              placeholder="https://example.edu/application-form"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !urlInput.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Online Form...</span>
                </>
              ) : (
                <>
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <span>Analyze Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Preset URLs */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">
              Or test with sample portal forms:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetUrls.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUrlInput(preset.url);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
            <div className="font-bold">Inspection Notice</div>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        )}

        {/* Technical Limitation & Security Transparency Banner (Crucial Requirement) */}
        <div className="mb-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
              <h3 className="font-bold text-slate-900 text-sm">
                Important Technical & Security Architecture Notice
              </h3>
              <p>
                Under web browser security standards (Same-Origin Policy), a web application cannot silently inject scripts or control an external third-party domain without user permission.
              </p>
              <p className="text-slate-700">
                <strong>FormEase Safe Bridge:</strong> We provide two reliable, authorized methods:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                <li><strong>Side-by-side Guided Entry:</strong> Answer questions with English & Telugu explanations, then copy clean answers with 1-click.</li>
                <li><strong>FormEase Autofill Bookmarklet:</strong> A client-side browser helper that you trigger with one click on the original website.</li>
                <li><strong>No Auto-Submissions:</strong> FormEase never automatically submits external banking, university, or government forms. You inspect the form and submit manually.</li>
                <li><strong>No Bypassing Security:</strong> You complete CAPTCHAs, OTPs, or passwords yourself.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Area */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Form Title & Site Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {analysisResult.siteName}
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-display mt-1">
                  {analysisResult.formTitle}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                  <span>Target: {analysisResult.url}</span>
                </div>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab('guided')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'guided' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Side-by-Side Guide
                </button>
                <button
                  onClick={() => setActiveTab('script')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'script' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Autofill Helper Script
                </button>
              </div>
            </div>

            {/* Tab 1: Side-by-Side Guided Answers & Explanations */}
            {activeTab === 'guided' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <span>
                    Answer or verify your information below. Click <strong>Copy</strong> next to any field to paste it directly into the online form.
                  </span>
                  <button
                    onClick={handleCopyScript}
                    className="shrink-0 flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Script Copied!' : 'Copy 1-Click Autofill Script'}</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {analysisResult.fields.map(f => (
                    <div key={f.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="md:w-5/12 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{f.label}</span>
                          {f.required && (
                            <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {f.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {f.explanationEn}
                        </p>
                        {f.explanationTe && (
                          <p className="text-[11px] text-blue-900 font-medium">
                            తెలుగు: {f.explanationTe}
                          </p>
                        )}
                      </div>

                      <div className="md:w-7/12 flex items-center gap-2">
                        <input
                          type="text"
                          value={userAnswers[f.id] || ''}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [f.id]: e.target.value })}
                          placeholder={f.example ? `e.g. ${f.example}` : 'Your answer...'}
                          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                        />
                        <button
                          onClick={() => handleCopyFieldValue(f.id, userAnswers[f.id] || '')}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                          title="Copy this answer to clipboard"
                        >
                          {copiedFieldId === f.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Autofill Helper Script Generator */}
            {activeTab === 'script' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      FormEase 1-Click Autofill Helper Script
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Run this in your browser console on <span className="font-semibold">{analysisResult.url}</span> to automatically populate all matched inputs.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                  <pre>{`/* Copy and paste into browser DevTools console (F12 -> Console) on the target webpage */
(function() {
  const data = ${JSON.stringify(userAnswers, null, 2)};
  for (const [key, val] of Object.entries(data)) {
    const el = document.getElementById(key) || document.querySelector(\`[name="\${key}"]\`);
    if (el) {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  console.log('[FormEase] Form fields populated safely!');
})();`}</pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="font-bold text-slate-900">How to use this helper:</div>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open the website form in another browser tab: <a href={analysisResult.url} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">{analysisResult.siteName}</a>.</li>
                    <li>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">F12</kbd> (or right click → Inspect → Console).</li>
                    <li>Paste this snippet and press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Enter</kbd>.</li>
                    <li>All fields will be instantly filled with your validated answers.</li>
                    <li>Review the entries, complete any CAPTCHA/OTP verification yourself, and submit when ready.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
