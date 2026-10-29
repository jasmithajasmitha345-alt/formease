import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Globe2, 
  FileCheck, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { NavigationTab } from '../types';

interface AboutPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <span>About FormEase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Fill Forms Easily, Without Confusion.
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            FormEase was created to solve one of the most frustrating modern obstacles: complex, jargon-heavy official forms that cause errors, delays, and anxiety.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Our Purpose & Core Tenets
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every year, millions of students, job seekers, and families face lengthy application forms for scholarships, visas, government benefits, and admissions. Ambiguous questions like <em>"Correspondence vs Permanent Address"</em> or confusing legal clauses lead to costly mistakes.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            FormEase breaks down barriers by translating confusing requirements into clear human language with full English and Telugu (తెలుగు) support, and delivering a completed, downloadable PDF that matches the original layout down to the millimeter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-3">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Original Layout Integrity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never replace your form with a generic summary document. Your answers are positioned precisely in the original form fields.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-3">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">No Hallucinations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                FormEase never invents personal data or silently guesses missing facts. If an answer is unknown, you can leave it blank or enter it yourself.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-3">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Bilingual Guidance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive explanations in simple English and native Telugu (తెలుగు) ensure nobody is left behind by bureaucratic jargon.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Verification Pledge */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
            <ShieldCheck className="w-4 h-4" />
            Security & User Control
          </div>
          <h2 className="text-2xl font-bold font-display text-white mb-3">
            You Always Maintain Complete Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
            FormEase strictly prohibits automatic submission of banking, college, or government documents. You inspect the generated document, review your answers, and make the submission yourself.
          </p>

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <span>Start a Form Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
