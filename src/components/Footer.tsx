import React from 'react';
import { FileText, ShieldCheck, Lock, Globe2, HelpCircle } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-display">
                FormEase
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fill Forms Easily, Without Confusion. Simplifying complicated government, admission, and commercial forms through guided understanding.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Zero Document Retention Policy</span>
            </div>
          </div>

          {/* Col 2: Supported Workflows */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Supported Workflows
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('upload')}
                  className="hover:text-white transition-colors text-left"
                >
                  Fillable PDF Completion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('upload')}
                  className="hover:text-white transition-colors text-left"
                >
                  Scanned / Image Form OCR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('upload')}
                  className="hover:text-white transition-colors text-left"
                >
                  Word DOCX to PDF Filling
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('webform')}
                  className="hover:text-white transition-colors text-left"
                >
                  Live Website Form Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance & Languages */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Accessibility & Aid
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Plain English Explanations</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Telugu (తెలుగు) Guided Explanations</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Client-Side Local Sandbox</span>
              </li>
              <li className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Field Coordinate Calibration</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About FormEase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Feedback & Support
                </button>
              </li>
              <li className="text-[11px] text-slate-500 pt-2 leading-tight">
                FormEase never automatically submits external banking, university, or government forms without explicit user confirmation.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} FormEase. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300">
              Privacy
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">
              Terms
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
