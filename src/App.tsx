import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { UploadPage } from './components/UploadPage';
import { DetectedFieldsPage } from './components/DetectedFieldsPage';
import { GuidedQuestionsPage } from './components/GuidedQuestionsPage';
import { ReviewAnswersPage } from './components/ReviewAnswersPage';
import { CompletedPreviewPage } from './components/CompletedPreviewPage';
import { WebsiteFormPage } from './components/WebsiteFormPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { ContactPage } from './components/ContactPage';
import { DocumentAnalysisResult, FormField, NavigationTab } from './types';
import { safeFetchJson } from './utils/apiClient';
import { generateFilledPdfClient } from './utils/clientDocumentProcessor';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [completedPdfUrl, setCompletedPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [pendingSampleId, setPendingSampleId] = useState<string | undefined>(undefined);

  const handleDocumentAnalyzed = (result: DocumentAnalysisResult) => {
    setAnalysisResult(result);
    // Initialize answers with any pre-filled values
    const initialAnswers: Record<string, string | boolean> = {};
    result.fields.forEach(f => {
      if (f.currentValue !== undefined && f.currentValue !== null && f.currentValue !== '') {
        initialAnswers[f.id] = f.currentValue;
      }
    });
    setAnswers(initialAnswers);
    setCompletedPdfUrl(null);
    setCurrentTab('fields');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateFields = (newFields: FormField[]) => {
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        fields: newFields,
      });
    }
  };

  const handleAnswerChange = (id: string, value: string | boolean) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleConfirmAndGeneratePdf = async () => {
    if (!analysisResult) return;

    setIsGenerating(true);
    setGlobalError(null);

    try {
      // 1. Try server-side PDF generation
      const res = await safeFetchJson<{ success?: boolean; pdfBase64?: string; error?: string }>('/api/generate-filled-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalBase64: analysisResult.base64Data,
          fileType: analysisResult.fileType,
          answers,
          fields: analysisResult.fields,
          isFillablePdf: analysisResult.isFillablePdf,
        }),
      });

      if (res.ok && res.data?.pdfBase64) {
        setCompletedPdfUrl(res.data.pdfBase64);
        setCurrentTab('preview');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 2. Fallback to client-side PDF generation if server returned HTML redirect or unavailable
      console.info('[FormEase] Generating filled PDF using client-side engine...');
      const clientPdf = await generateFilledPdfClient({
        originalBase64: analysisResult.base64Data,
        fileType: analysisResult.fileType,
        answers,
        fields: analysisResult.fields,
        isFillablePdf: analysisResult.isFillablePdf,
      });

      setCompletedPdfUrl(clientPdf);
      setCurrentTab('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('[FormEase] Server PDF generation note, trying client generator:', err);
      try {
        const clientPdf = await generateFilledPdfClient({
          originalBase64: analysisResult.base64Data,
          fileType: analysisResult.fileType,
          answers,
          fields: analysisResult.fields,
          isFillablePdf: analysisResult.isFillablePdf,
        });
        setCompletedPdfUrl(clientPdf);
        setCurrentTab('preview');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (clientErr: any) {
        setGlobalError(clientErr.message || 'Error generating completed PDF document.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectSampleFromHome = (sampleId: string) => {
    setPendingSampleId(sampleId);
    setCurrentTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewForm = () => {
    setAnalysisResult(null);
    setAnswers({});
    setCompletedPdfUrl(null);
    setPendingSampleId(undefined);
    setCurrentTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasActiveForm={Boolean(analysisResult)}
      />

      {/* Global Error Banner (if any) */}
      {globalError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-xs text-red-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span>{globalError}</span>
            <button
              onClick={() => setGlobalError(null)}
              className="font-bold hover:underline"
            >
              Dismiss ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectSample={handleSelectSampleFromHome}
          />
        )}

        {currentTab === 'upload' && (
          <UploadPage
            onDocumentAnalyzed={handleDocumentAnalyzed}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialSampleId={pendingSampleId}
          />
        )}

        {currentTab === 'fields' && analysisResult && (
          <DetectedFieldsPage
            analysis={analysisResult}
            onUpdateFields={handleUpdateFields}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartQuestions={() => {
              setCurrentTab('questions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'questions' && analysisResult && (
          <GuidedQuestionsPage
            fields={analysisResult.fields}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onFinishQuestions={() => {
              setCurrentTab('review');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'review' && analysisResult && (
          <ReviewAnswersPage
            fields={analysisResult.fields}
            answers={answers}
            onUpdateAnswer={handleAnswerChange}
            onConfirmAndGenerate={handleConfirmAndGeneratePdf}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isGenerating={isGenerating}
            analysis={analysisResult}
          />
        )}

        {currentTab === 'preview' && completedPdfUrl && analysisResult && (
          <CompletedPreviewPage
            pdfBase64={completedPdfUrl}
            downloadFileName={`${analysisResult.formTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Completed.pdf`}
            formTitle={analysisResult.formTitle}
            onEditAnswers={() => {
              setCurrentTab('review');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRegenerate={handleConfirmAndGeneratePdf}
            onStartNewForm={handleStartNewForm}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'webform' && (
          <WebsiteFormPage
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacyPage
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
