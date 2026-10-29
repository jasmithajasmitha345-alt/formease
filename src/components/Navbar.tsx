import React from 'react';
import { FileText, ArrowRight, Menu, X } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  hasActiveForm: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, hasActiveForm }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark & Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap">
              FormEase
            </span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'home' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                if (currentTab !== 'home') {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                if (currentTab !== 'home') {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('webform')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'webform' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Fill Website Form
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'about' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'contact' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {hasActiveForm && currentTab !== 'upload' && currentTab !== 'preview' && (
              <button
                onClick={() => onNavigate('questions')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Resume Form
              </button>
            )}
            <button
              onClick={() => handleNavClick('upload')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('upload')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Upload Document
          </button>
          <button
            onClick={() => handleNavClick('webform')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Fill Website Form
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Contact
          </button>
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('upload')}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-slate-900 rounded-lg shadow-sm"
            >
              Start Filling a Form
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
