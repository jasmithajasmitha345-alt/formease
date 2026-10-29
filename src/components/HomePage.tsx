import React from 'react';
import { 
  FileUp, 
  HelpCircle, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Globe2, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Laptop
} from 'lucide-react';
import { NavigationTab, SampleFormPreset } from '../types';
import heroImg from '../assets/images/hero_form_assistance_1793162726049.jpg';
import pdfScanImg from '../assets/images/feature_pdf_scan_1793162726599.jpg';
import wordDocImg from '../assets/images/feature_word_doc_1793162727267.jpg';
import webFormImg from '../assets/images/feature_web_form_1793162727351.jpg';
import { 
  PdfScanIllustration, 
  WordDocIllustration, 
  WebFormIllustration,
  HeroIllustration 
} from './FeatureIllustrations';
import { safeFetchJson } from '../utils/apiClient';

interface FeatureCardImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  illustration: React.ReactNode;
}

const FeatureCardImage: React.FC<FeatureCardImageProps> = ({ src, fallbackSrc, alt, illustration }) => {
  const [currentSrc, setCurrentSrc] = React.useState<string>(src);
  const [hasFailed, setHasFailed] = React.useState<boolean>(false);

  if (hasFailed) {
    return <div className="w-full h-full flex items-center justify-center p-2">{illustration}</div>;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setHasFailed(true);
        }
      }}
    />
  );
};

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectSample: (sampleId: string) => void;
}

const DEFAULT_SAMPLE_PRESETS: SampleFormPreset[] = [
  {
    id: 'school-application',
    name: 'Private School Admission Application Form',
    type: 'application/pdf',
    isFillable: false,
    category: 'Scanned / Boxed Form',
    description: "Official private school admission form with boxes for Parent/Guardian Name, Child's Age, Child's Name, Previous School, Address, City, Region, Postal Code, Country, and Phone.",
    badge: 'Featured School Form',
  },
  {
    id: 'scholarship-fillable',
    name: 'Higher Education Scholarship Application',
    type: 'application/pdf',
    isFillable: true,
    category: 'Interactive AcroForm',
    description: 'Government scholarship application with fillable interactive fields, household income, academic records, and declaration confirmation.',
    badge: 'Fillable PDF',
  },
  {
    id: 'identity-scanned',
    name: 'Official Citizen Identity Verification Form',
    type: 'application/pdf',
    isFillable: false,
    category: 'Scanned Government Form',
    description: 'Flat scanned citizen identity registration form with bounding-box input spaces and bilingual explanation requirements.',
    badge: 'Scanned Paper Form',
  },
  {
    id: 'grant-proposal-docx',
    name: 'Academic Research Grant Proposal',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    isFillable: false,
    category: 'Microsoft Word Form',
    description: 'Standard Word DOCX academic grant proposal template with investigator, funding, timeline, and abstract placeholders.',
    badge: 'DOCX Word Form',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectSample }) => {
  const [samples, setSamples] = React.useState<SampleFormPreset[]>(DEFAULT_SAMPLE_PRESETS);
  const [loadingSamples, setLoadingSamples] = React.useState(false);
  const [heroSrc, setHeroSrc] = React.useState<string>(heroImg);
  const [heroFailed, setHeroFailed] = React.useState<boolean>(false);

  React.useEffect(() => {
    safeFetchJson<{ samples: SampleFormPreset[] }>('/api/sample-forms')
      .then(res => {
        if (res.ok && res.data?.samples && res.data.samples.length > 0) {
          setSamples(res.data.samples);
        }
      })
      .catch(err => console.warn('Failed to fetch samples:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-100 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
                <span>Fill Forms Easily, Without Confusion</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.1] text-balance">
                Forms, Made Effortless.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Upload a document or enter a website form link. Understand confusing fields, answer simple questions, and get your completed form ready to download.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('upload')}
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <FileUp className="w-4 h-4 text-blue-400" />
                  <span>Start Filling a Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>How It Works</span>
                </button>
              </div>

              {/* Supported Workflow Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Fillable PDFs
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Scanned / Photo Forms
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Word DOCX
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Live Web Forms
                </span>
              </div>
            </div>

            {/* Right Column: Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] flex items-center justify-center group">
                {heroFailed ? (
                  <HeroIllustration className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
                ) : (
                  <img
                    src={heroSrc}
                    alt="FormEase intelligent document completion in action"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    onError={() => {
                      if (heroSrc !== '/images/hero_form_assistance.jpg') {
                        setHeroSrc('/images/hero_form_assistance.jpg');
                      } else {
                        setHeroFailed(true);
                      }
                    }}
                  />
                )}
              </div>

              {/* Trust Callout Floating Tag */}
              <div className="absolute -bottom-5 -left-4 sm:left-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Bilingual Assistance</div>
                  <div className="text-[11px] text-slate-500">English + Telugu (తెలుగు) field explanations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Prominent Feature Cards Section */}
      <section id="features" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Four Core Document Workflows
            </h2>
            <p className="mt-3 text-base text-slate-600">
              FormEase handles every common format while keeping your original document structure 100% intact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Upload a PDF or Image */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col group">
              <div className="rounded-xl overflow-hidden mb-5 aspect-[4/3] bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                <FeatureCardImage
                  src={pdfScanImg}
                  fallbackSrc="/images/feature_pdf_scan.jpg"
                  alt="Upload a PDF or Image"
                  illustration={<PdfScanIllustration className="w-full h-full" />}
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Upload a PDF or Image
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-grow">
                Upload a blank, scanned, or partially completed form. Works with fillable digital PDFs and camera photos using precision coordinate mapping.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">PDF, JPG, PNG</span>
                <button
                  onClick={() => onNavigate('upload')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Upload Form <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Upload a Word Document */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col group">
              <div className="rounded-xl overflow-hidden mb-5 aspect-[4/3] bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                <FeatureCardImage
                  src={wordDocImg}
                  fallbackSrc="/images/feature_word_doc.jpg"
                  alt="Upload a Word Document"
                  illustration={<WordDocIllustration className="w-full h-full" />}
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Upload a Word Document
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-grow">
                Work with supported DOCX forms, extract input placeholders, answer questions step by step, and generate a completed high-fidelity PDF.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">DOCX Supported</span>
                <button
                  onClick={() => onNavigate('upload')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Upload Word Doc <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Fill a Website Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col group">
              <div className="rounded-xl overflow-hidden mb-5 aspect-[4/3] bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                <FeatureCardImage
                  src={webFormImg}
                  fallbackSrc="/images/feature_web_form.jpg"
                  alt="Fill a Website Form"
                  illustration={<WebFormIllustration className="w-full h-full" />}
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Fill a Website Form
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-grow">
                Enter a supported online form URL and receive guided assistance, field definitions, and direct filling through an authorized browser helper script.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Live Web URL</span>
                <button
                  onClick={() => onNavigate('webform')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Explore Web Forms <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four-Step How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
              Simple 4-Step Process
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              How FormEase Works
            </h2>
            <p className="mt-3 text-base text-slate-600">
              No technical expertise needed. Just answer questions naturally and let FormEase do the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Upload or open your form
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Drag and drop your PDF, photo scan, or DOCX document. Or enter a live website form link.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Understand the fields
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                FormEase identifies labels, checkboxes, and confusing sections, clarifying them in plain English and Telugu.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Answer questions one by one
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Answer each field in a clean, focused questionnaire with instant validation, clear examples, and easy navigation.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Review and download
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Review all entries, confirm accuracy, and download your completed original PDF with your answers placed precisely in the original boxes.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Ready-to-Test Sample Forms Section */}
      <section className="py-16 bg-blue-50/40 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Instant Verification
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                Try Ready-to-Fill Sample Forms
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Test FormEase immediately without looking for documents on your computer.
              </p>
            </div>
            <button
              onClick={() => onNavigate('upload')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>Or Upload Your Own Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {sample.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {sample.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {sample.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {sample.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {sample.type === 'web' ? (
                    <button
                      onClick={() => onNavigate('webform')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      Open Web Assistant <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectSample(sample.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      Fill This Form <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {sample.type !== 'web' && (
                    <a
                      href={`/api/sample-forms/${sample.id}/download`}
                      download
                      className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                      title="Download blank sample PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Original</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bilingual / Telugu Explanation Showcase */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Inclusive & Accessible
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Clear Explanations in Simple English and Telugu
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Forms frequently use confusing terminology like "Permanent vs Correspondence Address", "Guardian Name", or "Declaration Clauses". FormEase clarifies every field in plain, non-legalese English, with full Telugu (తెలుగు) guidance for users who prefer regional language assistance.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">Permanent Address</div>
                  <div className="text-xs text-slate-600 mt-0.5">English: The address where you permanently live.</div>
                  <div className="text-xs text-blue-800 font-medium mt-0.5">తెలుగు: మీరు శాశ్వతంగా నివసించే స్థలం లేదా మీ స్వంత ఇంటి చిరునామా.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">Correspondence Address</div>
                  <div className="text-xs text-slate-600 mt-0.5">English: The address where you want to receive letters or official communication.</div>
                  <div className="text-xs text-blue-800 font-medium mt-0.5">తెలుగు: మీకు పోస్ట్ లేదా అధికారిక ఉత్తరాలు పంపడానికి ప్రస్తుత చిరునామా.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">Annual Household Income</div>
                  <div className="text-xs text-slate-600 mt-0.5">English: The total income earned by your family in one year.</div>
                  <div className="text-xs text-blue-800 font-medium mt-0.5">తెలుగు: ఒక సంవత్సరంలో మీ కుటుంబానికి వచ్చే మొత్తం సంపాదన.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  FormEase Integrity Pledge
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-4">
                  Honest Document Processing
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Original Form Preserved:</strong> We place your answers on the original form layout without replacing it with a generic summary.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>No Invented Information:</strong> We never silently guess missing details. If something is unknown, you can leave it blank or enter it yourself.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>No Automatic Submissions:</strong> We never auto-submit government, scholarship, or banking forms without your review.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Unnecessary Storage:</strong> Documents are processed in temporary memory sessions and not stored permanently on public servers.</span>
                  </li>
                </ul>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Ready to complete your form?</span>
                  <button
                    onClick={() => onNavigate('upload')}
                    className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Start Filling Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
