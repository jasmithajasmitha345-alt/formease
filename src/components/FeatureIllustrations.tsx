import React from 'react';

/**
 * 1. PDF / Image Card Illustration:
 * Shows a document with a prominent PDF symbol, an image thumbnail (photo upload),
 * form field coordinate bounding boxes, and verification checkmark.
 */
export const PdfScanIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 400 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Illustration: Upload a PDF or Image"
    role="img"
  >
    <defs>
      <linearGradient id="pdfBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#EFF6FF" />
      </linearGradient>
      <linearGradient id="pdfBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="photoSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
      <filter id="pdfCardShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.07" />
      </filter>
    </defs>

    {/* Background Surface */}
    <rect width="400" height="280" rx="12" fill="url(#pdfBgGrad)" />

    {/* Subtle Grid Pattern */}
    <g opacity="0.4">
      <line x1="40" y1="0" x2="40" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="120" y1="0" x2="120" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="200" y1="0" x2="200" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="280" y1="0" x2="280" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="360" y1="0" x2="360" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="0" y1="70" x2="400" y2="70" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="0" y1="140" x2="400" y2="140" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="0" y1="210" x2="400" y2="210" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
    </g>

    {/* Secondary Document Sheet (Tilted Background Page for depth) */}
    <rect
      x="85"
      y="24"
      width="220"
      height="230"
      rx="10"
      fill="#F1F5F9"
      stroke="#CBD5E1"
      strokeWidth="1.2"
      transform="rotate(3 195 139)"
    />

    {/* Primary Document Sheet */}
    <g filter="url(#pdfCardShadow)">
      <rect
        x="68"
        y="18"
        width="234"
        height="242"
        rx="10"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.4"
      />

      {/* Document Header Line */}
      <rect x="84" y="32" width="125" height="7" rx="3.5" fill="#0B192C" />
      <rect x="84" y="43" width="75" height="4" rx="2" fill="#94A3B8" />

      {/* 1. PDF SYMBOL (Official Style Badge with folded corner) */}
      <g transform="translate(244, 28)">
        <rect x="0" y="0" width="42" height="26" rx="5" fill="url(#pdfBadgeGrad)" filter="url(#pdfCardShadow)" />
        {/* PDF Page Icon Symbol */}
        <path d="M7 6 H16 L21 11 V20 H7 Z" fill="#FFFFFF" fillOpacity="0.25" />
        <path d="M16 6 V11 H21" fill="#FFFFFF" fillOpacity="0.4" />
        <text x="12" y="18" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.5">
          PDF
        </text>
      </g>

      {/* Section Divider */}
      <line x1="84" y1="62" x2="286" y2="62" stroke="#F1F5F9" strokeWidth="1.2" />

      {/* Form Field 1: Student / Applicant Full Name */}
      <text x="84" y="77" fill="#64748B" fontSize="7.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        1. APPLICANT LEGAL NAME
      </text>
      <rect
        x="84"
        y="83"
        width="202"
        height="22"
        rx="4"
        fill="#EFF6FF"
        stroke="#3B82F6"
        strokeWidth="1.3"
        strokeDasharray="3 3"
      />
      <text x="92" y="97" fill="#0B192C" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
        Aarav Sharma
      </text>
      <circle cx="274" cy="94" r="5" fill="#10B981" />
      <path d="M271.5 94 L273.5 96 L276.5 92" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Form Field 2: Two Column Split (Age & Previous School) */}
      <text x="84" y="117" fill="#64748B" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
        2. AGE (YRS)
      </text>
      <rect x="84" y="122" width="60" height="20" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
      <text x="92" y="135" fill="#0B192C" fontSize="8.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        7 Years
      </text>

      <text x="152" y="117" fill="#64748B" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
        3. GRADE APPLYING
      </text>
      <rect x="152" y="122" width="134" height="20" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
      <text x="160" y="135" fill="#0B192C" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
        Grade 2 · Primary
      </text>

      {/* 2. IMAGE THUMBNAIL (Embedded Photograph / Scanned Document Preview) */}
      <g transform="translate(84, 152)">
        <rect
          x="0"
          y="0"
          width="202"
          height="54"
          rx="6"
          fill="#F8FAFC"
          stroke="#93C5FD"
          strokeWidth="1.2"
        />

        {/* Photo Thumbnail Frame */}
        <rect x="8" y="7" width="46" height="40" rx="4" fill="url(#photoSkyGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
        {/* Landscape Sun & Mountain Thumbnail Graphics */}
        <circle cx="38" cy="18" r="4" fill="#FDE047" />
        <path d="M12 43 L26 27 L36 37 L48 23 L54 43 Z" fill="#0284C7" />
        <path d="M22 43 L32 31 L42 41 L50 33 L54 43 Z" fill="#0369A1" opacity="0.8" />
        <rect x="8" y="7" width="46" height="40" rx="4" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="2 2" />

        {/* Thumbnail Info Details */}
        <text x="62" y="21" fill="#0B192C" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
          Photo / Scanned ID Attached
        </text>
        <text x="62" y="32" fill="#64748B" fontSize="7" fontFamily="system-ui, sans-serif">
          Format: JPEG / PNG • OCR Aligned
        </text>
        <rect x="62" y="38" width="82" height="13" rx="3" fill="#DCFCE7" />
        <circle cx="68" cy="44.5" r="2.5" fill="#16A34A" />
        <text x="74" y="47.5" fill="#15803D" fontSize="6.5" fontWeight="700" fontFamily="system-ui, sans-serif">
          Precision Point Matched
        </text>
      </g>

      {/* Declaration Checkbox Row */}
      <rect x="84" y="216" width="11" height="11" rx="3" fill="#2563EB" />
      <path d="M86.5 221.5 L88.5 223.5 L92 218.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="100" y="225" fill="#475569" fontSize="7.5" fontWeight="600" fontFamily="system-ui, sans-serif">
        Parent declaration confirmed &amp; signed
      </text>

      {/* OCR Scanning Glow Indicator */}
      <line x1="68" y1="94" x2="302" y2="94" stroke="#3B82F6" strokeWidth="1.8" opacity="0.75" />
    </g>

    {/* Floating Feature Pill Badge */}
    <g filter="url(#pdfCardShadow)">
      <rect x="238" y="224" width="144" height="34" rx="17" fill="#0B192C" stroke="#3B82F6" strokeWidth="1.2" />
      <circle cx="256" cy="241" r="9" fill="#2563EB" />
      <path d="M253 241 L255.5 243.5 L259.5 239" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="271" y="239" fill="#FFFFFF" fontSize="8.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        PDF &amp; Photo Scans
      </text>
      <text x="271" y="249" fill="#93C5FD" fontSize="7" fontFamily="system-ui, sans-serif">
        Original Layout Kept
      </text>
    </g>
  </svg>
);

/**
 * 2. Word Document Card Illustration:
 * Shows a document with a classic Word-style document symbol (Blue "W" badge),
 * structured form tables, fillable placeholders, and DOCX-to-PDF export indicator.
 */
export const WordDocIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 400 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Illustration: Upload a Word Document"
    role="img"
  >
    <defs>
      <linearGradient id="wordBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#EEF2FF" />
      </linearGradient>
      <linearGradient id="wordBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
      <filter id="wordCardShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.07" />
      </filter>
    </defs>

    {/* Background Surface */}
    <rect width="400" height="280" rx="12" fill="url(#wordBgGrad)" />

    {/* Subtle Grid Lines */}
    <g opacity="0.4">
      <line x1="40" y1="0" x2="40" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="120" y1="0" x2="120" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="200" y1="0" x2="200" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="280" y1="0" x2="280" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="360" y1="0" x2="360" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
    </g>

    {/* Secondary Document Sheet (Tilted Background Page for depth) */}
    <rect
      x="85"
      y="24"
      width="220"
      height="230"
      rx="10"
      fill="#F1F5F9"
      stroke="#CBD5E1"
      strokeWidth="1.2"
      transform="rotate(3 195 139)"
    />

    {/* Primary Document Sheet */}
    <g filter="url(#wordCardShadow)">
      <rect
        x="68"
        y="18"
        width="234"
        height="242"
        rx="10"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.4"
      />

      {/* Word Document Ribbon Header Bar */}
      <rect x="68" y="18" width="234" height="34" rx="10" fill="#1E40AF" />
      <rect x="68" y="42" width="234" height="10" fill="#1E40AF" />

      {/* WORD-STYLE DOCUMENT SYMBOL (Iconic Blue "W" Emblem) */}
      <g transform="translate(82, 24)">
        {/* Word Document Icon Tile with Folded Corner */}
        <rect x="0" y="0" width="24" height="24" rx="5" fill="#2563EB" stroke="#93C5FD" strokeWidth="1" />
        {/* Stylized White "W" glyph */}
        <path
          d="M5.5 6.5 L8.5 17.5 L12 9 L15.5 17.5 L18.5 6.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <text x="114" y="35" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        Quarterly_Report_Form.docx
      </text>
      <text x="114" y="45" fill="#BFDBFE" fontSize="6.5" fontFamily="system-ui, sans-serif">
        Microsoft Word Form Document
      </text>

      {/* Document Content Area */}
      <rect x="84" y="64" width="130" height="7" rx="3.5" fill="#0B192C" />
      <rect x="84" y="75" width="85" height="4" rx="2" fill="#94A3B8" />

      {/* Structured Word Form Table with Placeholders */}
      <rect x="84" y="87" width="202" height="96" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />

      {/* Table Row 1: Employee / Author */}
      <rect x="90" y="93" width="62" height="18" rx="3" fill="#EEF2F6" />
      <text x="95" y="105" fill="#475569" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Author:
      </text>
      <rect x="156" y="93" width="124" height="18" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <text x="162" y="105" fill="#0B192C" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        Dr. A. P. J. Prasad
      </text>

      {/* Table Row 2: Department */}
      <rect x="90" y="115" width="62" height="18" rx="3" fill="#EEF2F6" />
      <text x="95" y="127" fill="#475569" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Department:
      </text>
      <rect x="156" y="115" width="124" height="18" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <text x="162" y="127" fill="#0B192C" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
        Academic Admissions
      </text>

      {/* Table Row 3: Status / Budget */}
      <rect x="90" y="137" width="62" height="18" rx="3" fill="#EEF2F6" />
      <text x="95" y="149" fill="#475569" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Allocated:
      </text>
      <rect x="156" y="137" width="124" height="18" rx="3" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.2" />
      <text x="162" y="149" fill="#1D4ED8" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        $75,000.00 (Approved)
      </text>

      {/* Table Row 4: Verification status */}
      <rect x="90" y="159" width="62" height="18" rx="3" fill="#EEF2F6" />
      <text x="95" y="171" fill="#475569" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Export:
      </text>
      <rect x="156" y="159" width="70" height="18" rx="9" fill="#DCFCE7" />
      <circle cx="164" cy="168" r="3.5" fill="#16A34A" />
      <text x="171" y="171" fill="#15803D" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Ready to PDF
      </text>

      {/* DOCX Conversion Banner */}
      <g transform="translate(84, 192)">
        <rect x="0" y="0" width="202" height="42" rx="6" fill="#F0F7FF" stroke="#BFDBFE" strokeWidth="1" />
        <circle cx="18" cy="21" r="10" fill="#2563EB" />
        <path d="M14 21 L22 21 M19 18 L22 21 L19 24" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="36" y="17" fill="#1E3A8A" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
          DOCX Word Parsing Engine
        </text>
        <text x="36" y="29" fill="#3B82F6" fontSize="7" fontFamily="system-ui, sans-serif">
          Extracts placeholders &amp; builds ready PDF
        </text>
      </g>
    </g>

    {/* Floating Feature Pill Badge */}
    <g filter="url(#wordCardShadow)">
      <rect x="238" y="224" width="144" height="34" rx="17" fill="#0B192C" stroke="#3B82F6" strokeWidth="1.2" />
      <circle cx="256" cy="241" r="9" fill="#2563EB" />
      <path d="M253 241 L255.5 243.5 L259.5 239" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="271" y="239" fill="#FFFFFF" fontSize="8.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        Word DOCX Forms
      </text>
      <text x="271" y="249" fill="#93C5FD" fontSize="7" fontFamily="system-ui, sans-serif">
        Exports to Crisp PDF
      </text>
    </g>
  </svg>
);

/**
 * 3. Website Form Card Illustration:
 * Shows a browser window with titlebar, SSL lock, URL bar,
 * online input fields, radio choices, and a prominent Submit button.
 */
export const WebFormIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 400 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Illustration: Fill a Website Form"
    role="img"
  >
    <defs>
      <linearGradient id="webBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#F0FDFA" />
      </linearGradient>
      <linearGradient id="submitBtnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <filter id="webCardShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.07" />
      </filter>
    </defs>

    {/* Background Surface */}
    <rect width="400" height="280" rx="12" fill="url(#webBgGrad)" />

    {/* Subtle Grid Lines */}
    <g opacity="0.4">
      <line x1="40" y1="0" x2="40" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="120" y1="0" x2="120" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="200" y1="0" x2="200" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="280" y1="0" x2="280" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
      <line x1="360" y1="0" x2="360" y2="280" stroke="#CBD5E1" strokeWidth="0.7" strokeDasharray="3 3" />
    </g>

    {/* Modern Browser Window Mockup */}
    <g filter="url(#webCardShadow)">
      <rect
        x="60"
        y="18"
        width="250"
        height="242"
        rx="10"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.4"
      />

      {/* Browser Chrome Window Header */}
      <rect x="60" y="18" width="250" height="30" rx="10" fill="#F1F5F9" />
      <rect x="60" y="38" width="250" height="10" fill="#F1F5F9" />
      <line x1="60" y1="48" x2="310" y2="48" stroke="#E2E8F0" strokeWidth="1" />

      {/* Window Controls (Red, Yellow, Green macOS style dots) */}
      <circle cx="76" cy="33" r="3.5" fill="#EF4444" />
      <circle cx="87" cy="33" r="3.5" fill="#F59E0B" />
      <circle cx="98" cy="33" r="3.5" fill="#10B981" />

      {/* Browser URL Address Bar with SSL Lock */}
      <g transform="translate(112, 25)">
        <rect x="0" y="0" width="186" height="16" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        {/* Secure Green Padlock Icon */}
        <path
          d="M7 9 V7 A2 2 0 0 1 11 7 V9 M6 9 H12 A1 1 0 0 1 13 10 V13 A1 1 0 0 1 12 14 H6 A1 1 0 0 1 5 13 V10 A1 1 0 0 1 6 9"
          stroke="#10B981"
          strokeWidth="0.9"
          fill="none"
        />
        <text x="17" y="11.5" fill="#334155" fontSize="7" fontFamily="monospace">
          admissions.stateuniv.edu/apply
        </text>
      </g>

      {/* Webpage Content: Form Title */}
      <rect x="76" y="58" width="120" height="8" rx="4" fill="#0B192C" />
      <rect x="76" y="69" width="70" height="4" rx="2" fill="#94A3B8" />

      {/* Web Input Field 1: Candidate Full Name */}
      <text x="76" y="86" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Full Legal Name *
      </text>
      <rect x="76" y="91" width="218" height="20" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
      <text x="84" y="104" fill="#0B192C" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        Praveen Kumar Reddy
      </text>
      <circle cx="282" cy="101" r="4" fill="#10B981" />
      <path d="M280 101 L281.5 102.5 L284 100" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

      {/* Web Input Field 2: Email Address (Active Focused State) */}
      <text x="76" y="122" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Email Address *
      </text>
      <rect x="76" y="127" width="218" height="20" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.3" />
      <text x="84" y="140" fill="#1D4ED8" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        praveen.reddy@example.com
      </text>

      {/* Web Input Field 3: Radio Choices (Mode of Study) */}
      <text x="76" y="158" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">
        Study Preference:
      </text>
      <g transform="translate(76, 163)">
        <circle cx="6" cy="6" r="5" fill="#2563EB" stroke="#2563EB" strokeWidth="1" />
        <circle cx="6" cy="6" r="2" fill="#FFFFFF" />
        <text x="16" y="9" fill="#0B192C" fontSize="7.5" fontWeight="600" fontFamily="system-ui, sans-serif">
          Full-Time Campus
        </text>

        <circle cx="110" cy="6" r="5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
        <text x="120" y="9" fill="#64748B" fontSize="7.5" fontFamily="system-ui, sans-serif">
          Distance / Online
        </text>
      </g>

      {/* SUBMIT BUTTON (Prominent & Clear) */}
      <g transform="translate(76, 182)">
        <rect
          x="0"
          y="0"
          width="218"
          height="28"
          rx="6"
          fill="url(#submitBtnGrad)"
          filter="url(#webCardShadow)"
        />
        {/* Button Text & Submit Arrow */}
        <text x="78" y="17.5" fill="#FFFFFF" fontSize="8.5" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.3">
          Submit Application
        </text>
        <path d="M152 14 L156 14 M154 12 L156 14 L154 16" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* FormEase Helper Script Status Bar */}
      <g transform="translate(76, 218)">
        <rect x="0" y="0" width="218" height="26" rx="5" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="0.9" />
        <circle cx="14" cy="13" r="5" fill="#16A34A" />
        <path d="M12 13 L13.5 14.5 L16 11.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="11" fill="#14532D" fontSize="7.5" fontWeight="700" fontFamily="system-ui, sans-serif">
          FormEase 1-Click Helper Active
        </text>
        <text x="25" y="20" fill="#16A34A" fontSize="6.5" fontFamily="system-ui, sans-serif">
          Direct field autofill via browser assistant
        </text>
      </g>
    </g>

    {/* Floating Feature Pill Badge */}
    <g filter="url(#webCardShadow)">
      <rect x="238" y="224" width="144" height="34" rx="17" fill="#0B192C" stroke="#3B82F6" strokeWidth="1.2" />
      <circle cx="256" cy="241" r="9" fill="#2563EB" />
      <path d="M253 241 L255.5 243.5 L259.5 239" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="271" y="239" fill="#FFFFFF" fontSize="8.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        Online Web Forms
      </text>
      <text x="271" y="249" fill="#93C5FD" fontSize="7" fontFamily="system-ui, sans-serif">
        Browser Script Helper
      </text>
    </g>
  </svg>
);

/**
 * 4. Hero Section Graphic:
 * Renders a full multi-document processing scene with bilingual guidance,
 * PDF preview, and FormEase signature verification.
 */
export const HeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 540 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Illustration: FormEase Document Completion Overview"
    role="img"
  >
    <defs>
      <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B192C" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
      <filter id="heroShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Dark Navy Hero Backdrop */}
    <rect width="540" height="380" rx="16" fill="url(#heroBg)" />

    {/* Subtle Grid Accent */}
    <g opacity="0.1">
      <path d="M 0 0 L 540 380 M 540 0 L 0 380" stroke="#FFFFFF" strokeWidth="0.8" />
      <circle cx="270" cy="190" r="140" stroke="#FFFFFF" strokeWidth="0.8" />
    </g>

    {/* Background Document (Offset) */}
    <rect
      x="120"
      y="30"
      width="300"
      height="300"
      rx="12"
      fill="#1E293B"
      stroke="#334155"
      strokeWidth="1.5"
      transform="rotate(-4 270 180)"
      opacity="0.7"
    />

    {/* Foreground Document */}
    <g filter="url(#heroShadow)">
      <rect
        x="115"
        y="35"
        width="310"
        height="295"
        rx="12"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />

      {/* Document Header */}
      <rect x="135" y="55" width="160" height="10" rx="5" fill="#0B192C" />
      <rect x="135" y="70" width="100" height="5" rx="2.5" fill="#94A3B8" />

      {/* Official Verified Badge */}
      <rect x="345" y="52" width="60" height="22" rx="11" fill="#DCFCE7" />
      <circle cx="356" cy="63" r="4" fill="#16A34A" />
      <text x="365" y="66" fill="#15803D" fontSize="8" fontWeight="800" fontFamily="system-ui, sans-serif">
        VERIFIED
      </text>

      {/* Field 1 */}
      <text x="135" y="95" fill="#64748B" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        APPLICANT FULL NAME:
      </text>
      <rect x="135" y="102" width="270" height="26" rx="5" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.4" />
      <text x="146" y="119" fill="#0B192C" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">
        Aarav Sharma
      </text>

      {/* Field 2 & 3 Split */}
      <text x="135" y="145" fill="#64748B" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        STUDENT AGE:
      </text>
      <rect x="135" y="152" width="80" height="24" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
      <text x="146" y="168" fill="#0B192C" fontSize="9.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        7 Years
      </text>

      <text x="230" y="145" fill="#64748B" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        GRADE APPLYING:
      </text>
      <rect x="230" y="152" width="175" height="24" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
      <text x="241" y="168" fill="#0B192C" fontSize="9.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        Grade 2 (Primary)
      </text>

      {/* Field 4: Address */}
      <text x="135" y="195" fill="#64748B" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
        PERMANENT RESIDENCE:
      </text>
      <rect x="135" y="202" width="270" height="26" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
      <text x="146" y="219" fill="#0B192C" fontSize="9.5" fontWeight="500" fontFamily="system-ui, sans-serif">
        742 Evergreen Terrace, Springfield, OR 97477
      </text>

      {/* Declaration & Signature */}
      <rect x="135" y="246" width="14" height="14" rx="4" fill="#2563EB" />
      <path d="M138 253 L141 256 L146 250" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="156" y="256" fill="#334155" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
        All declarations verified &amp; digitally authorized
      </text>

      <line x1="135" y1="285" x2="260" y2="285" stroke="#0B192C" strokeWidth="1.5" />
      <text x="135" y="297" fill="#64748B" fontSize="7.5" fontFamily="system-ui, sans-serif">
        Parent / Guardian Signature
      </text>

      <text x="310" y="297" fill="#64748B" fontSize="7.5" fontFamily="system-ui, sans-serif">
        Date: 2026-10-28
      </text>
    </g>

    {/* Floating Bilingual Chip */}
    <g filter="url(#heroShadow)">
      <rect x="35" y="295" width="200" height="48" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.2" />
      <circle cx="60" cy="319" r="14" fill="#EFF6FF" />
      <text x="54" y="324" fill="#2563EB" fontSize="14" fontWeight="800">文</text>
      <text x="82" y="313" fill="#0B192C" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
        Bilingual Assistance
      </text>
      <text x="82" y="326" fill="#2563EB" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
        English + తెలుగు (Telugu)
      </text>
    </g>
  </svg>
);
