import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates an authentic fillable PDF with interactive AcroForm fields
 * for instant testing of fillable forms.
 */
export async function createSampleFillablePdf(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Header banner
  page.drawRectangle({
    x: 40,
    y: height - 100,
    width: width - 80,
    height: 60,
    color: rgb(0.06, 0.13, 0.24), // Navy blue
  });

  page.drawText('HIGHER EDUCATION SCHOLARSHIP APPLICATION', {
    x: 60,
    y: height - 68,
    size: 15,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Department of Academic Grants & Student Aid - Academic Year 2026-2027', {
    x: 60,
    y: height - 85,
    size: 9,
    font: fontRegular,
    color: rgb(0.85, 0.9, 0.98),
  });

  // Section 1: Applicant Details
  page.drawText('SECTION 1: APPLICANT PERSONAL INFORMATION', {
    x: 40,
    y: height - 130,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });

  page.drawLine({
    start: { x: 40, y: height - 135 },
    end: { x: width - 40, y: height - 135 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  // Label 1: Full Name
  page.drawText('1. Full Legal Name (as per national identity card):', {
    x: 40,
    y: height - 155,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Label 2: Date of Birth
  page.drawText('2. Date of Birth (DD/MM/YYYY):', {
    x: 320,
    y: height - 155,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Label 3: Guardian / Father's Name
  page.drawText("3. Guardian / Parent's Full Name:", {
    x: 40,
    y: height - 215,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Label 4: Annual Household Income
  page.drawText('4. Total Annual Household Income (INR / USD):', {
    x: 320,
    y: height - 215,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Section 2: Contact Information
  page.drawText('SECTION 2: CONTACT & RESIDENCE DETAILS', {
    x: 40,
    y: height - 280,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });

  page.drawLine({
    start: { x: 40, y: height - 285 },
    end: { x: width - 40, y: height - 285 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  // Label 5: Email Address
  page.drawText('5. Primary Email Address:', {
    x: 40,
    y: height - 305,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Label 6: Mobile Phone
  page.drawText('6. Primary Contact Telephone / Mobile Number:', {
    x: 320,
    y: height - 305,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Label 7: Permanent Address
  page.drawText('7. Permanent Residential Address:', {
    x: 40,
    y: height - 365,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Label 8: Correspondence Address
  page.drawText('8. Correspondence / Mailing Address (if different):', {
    x: 40,
    y: height - 440,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Section 3: Academic Qualifications
  page.drawText('SECTION 3: ACADEMIC DETAILS & AID CATEGORY', {
    x: 40,
    y: height - 515,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });

  page.drawLine({
    start: { x: 40, y: height - 520 },
    end: { x: width - 40, y: height - 520 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  page.drawText('9. Institution / College Name:', {
    x: 40,
    y: height - 540,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  page.drawText('10. Current Degree / Major Course:', {
    x: 320,
    y: height - 540,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  page.drawText('11. Scholarship Category Preference (Merit / Need / Rural / First-Gen):', {
    x: 40,
    y: height - 600,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Section 4: Declaration
  page.drawText('SECTION 4: APPLICANT DECLARATION', {
    x: 40,
    y: height - 670,
    size: 11,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });

  page.drawLine({
    start: { x: 40, y: height - 675 },
    end: { x: width - 40, y: height - 675 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  page.drawText('I confirm that all particulars provided in this form are accurate and complete.', {
    x: 65,
    y: height - 700,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  page.drawText('12. Place of Submission:', {
    x: 40,
    y: height - 735,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  page.drawText('13. Date (DD/MM/YYYY):', {
    x: 320,
    y: height - 735,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3),
  });

  // Now create the interactive AcroForm fields
  const form = pdfDoc.getForm();

  // Field 1: Full Name
  const nameField = form.createTextField('fullName');
  nameField.addToPage(page, {
    x: 40,
    y: height - 190,
    width: 250,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 2: Date of Birth
  const dobField = form.createTextField('dob');
  dobField.addToPage(page, {
    x: 320,
    y: height - 190,
    width: 235,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 3: Guardian Name
  const guardianField = form.createTextField('guardianName');
  guardianField.addToPage(page, {
    x: 40,
    y: height - 250,
    width: 250,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 4: Annual Income
  const incomeField = form.createTextField('annualIncome');
  incomeField.addToPage(page, {
    x: 320,
    y: height - 250,
    width: 235,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 5: Email
  const emailField = form.createTextField('email');
  emailField.addToPage(page, {
    x: 40,
    y: height - 340,
    width: 250,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 6: Phone
  const phoneField = form.createTextField('phone');
  phoneField.addToPage(page, {
    x: 320,
    y: height - 340,
    width: 235,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 7: Permanent Address
  const permAddrField = form.createTextField('permanentAddress');
  permAddrField.addToPage(page, {
    x: 40,
    y: height - 415,
    width: 515,
    height: 38,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 8: Correspondence Address
  const corrAddrField = form.createTextField('correspondenceAddress');
  corrAddrField.addToPage(page, {
    x: 40,
    y: height - 490,
    width: 515,
    height: 38,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 9: Institution
  const institutionField = form.createTextField('institution');
  institutionField.addToPage(page, {
    x: 40,
    y: height - 575,
    width: 250,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 10: Course
  const courseField = form.createTextField('course');
  courseField.addToPage(page, {
    x: 320,
    y: height - 575,
    width: 235,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 11: Scholarship Category
  const categoryField = form.createTextField('scholarshipCategory');
  categoryField.addToPage(page, {
    x: 40,
    y: height - 640,
    width: 515,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 12: Declaration Checkbox
  const declareCheck = form.createCheckBox('declarationConfirmed');
  declareCheck.addToPage(page, {
    x: 42,
    y: height - 703,
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: rgb(0.2, 0.3, 0.4),
  });

  // Field 13: Place
  const placeField = form.createTextField('placeOfSubmission');
  placeField.addToPage(page, {
    x: 40,
    y: height - 770,
    width: 250,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  // Field 14: Date
  const dateField = form.createTextField('submissionDate');
  dateField.addToPage(page, {
    x: 320,
    y: height - 770,
    width: 235,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
  });

  return await pdfDoc.save();
}

/**
 * Generates an authentic flat/scanned-style PDF with visible form fields, boxes,
 * and underlines (no AcroForm fields) to test coordinate overlay PDF filling.
 */
export async function createSampleFlatScannedPdf(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Watermark header & emblem style
  page.drawText('GOVERNMENT OF CITIZEN SERVICES', {
    x: 170,
    y: height - 55,
    size: 14,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  page.drawText('OFFICIAL IDENTITY & CERTIFICATE VERIFICATION FORM (FLAT / SCANNED)', {
    x: 90,
    y: height - 72,
    size: 9,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });

  page.drawLine({
    start: { x: 40, y: height - 85 },
    end: { x: width - 40, y: height - 85 },
    thickness: 1.5,
    color: rgb(0.1, 0.15, 0.25),
  });

  // Box 1: Full Name
  page.drawText('Applicant Full Name:', {
    x: 40,
    y: height - 120,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page.drawRectangle({
    x: 40,
    y: height - 150,
    width: 320,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
    color: rgb(0.98, 0.99, 1),
  });

  // Box 2: National ID / Aadhaar
  page.drawText('National ID / Aadhaar Number:', {
    x: 380,
    y: height - 120,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page.drawRectangle({
    x: 380,
    y: height - 150,
    width: 175,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
    color: rgb(0.98, 0.99, 1),
  });

  // Box 3: Guardian / Father's Name
  page.drawText("Father's / Guardian's Full Name:", {
    x: 40,
    y: height - 190,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page.drawRectangle({
    x: 40,
    y: height - 220,
    width: 320,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
    color: rgb(0.98, 0.99, 1),
  });

  // Box 4: Date of Birth
  page.drawText('Date of Birth (DD-MM-YYYY):', {
    x: 380,
    y: height - 190,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page.drawRectangle({
    x: 380,
    y: height - 220,
    width: 175,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
    color: rgb(0.98, 0.99, 1),
  });

  // Box 5: Permanent Residential Address
  page.drawText('Permanent Residential Address (with PIN / ZIP Code):', {
    x: 40,
    y: height - 260,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page.drawRectangle({
    x: 40,
    y: height - 310,
    width: 515,
    height: 40,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
    color: rgb(0.98, 0.99, 1),
  });

  // Box 6: Annual Household Income
  page.drawText('Annual Household Income (INR):', {
    x: 40,
    y: height - 345,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page.drawRectangle({
    x: 40,
    y: height - 375,
    width: 240,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
    color: rgb(0.98, 0.99, 1),
  });

  // Box 7: Contact Mobile Number
  page.drawText('Contact Mobile Number:', {
    x: 310,
    y: height - 345,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page.drawRectangle({
    x: 310,
    y: height - 375,
    width: 245,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
    color: rgb(0.98, 0.99, 1),
  });

  // Box 8: Checkboxes
  page.drawText('Category of Application:', {
    x: 40,
    y: height - 420,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  // Checkbox 1
  page.drawRectangle({
    x: 40,
    y: height - 450,
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
  });
  page.drawText('Resident Citizen', {
    x: 60,
    y: height - 447,
    size: 9,
    font: fontRegular,
  });

  // Checkbox 2
  page.drawRectangle({
    x: 180,
    y: height - 450,
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.4),
  });
  page.drawText('Scholarship / Fee Waiver', {
    x: 200,
    y: height - 447,
    size: 9,
    font: fontRegular,
  });

  // Declaration box
  page.drawRectangle({
    x: 40,
    y: height - 560,
    width: 515,
    height: 70,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
    color: rgb(0.97, 0.98, 0.99),
  });
  page.drawText('APPLICANT CERTIFICATION & SIGNATURE CLAUSE:', {
    x: 50,
    y: height - 510,
    size: 9,
    font: fontBold,
  });
  page.drawText('I hereby declare that the particulars furnished above are true to the best of my knowledge.', {
    x: 50,
    y: height - 530,
    size: 8.5,
    font: fontRegular,
  });

  // Signature line and date
  page.drawLine({
    start: { x: 360, y: height - 640 },
    end: { x: 540, y: height - 640 },
    thickness: 1,
    color: rgb(0.2, 0.25, 0.3),
  });
  page.drawText('Applicant Signature / Full Name', {
    x: 375,
    y: height - 655,
    size: 8.5,
    font: fontRegular,
  });

  page.drawLine({
    start: { x: 40, y: height - 640 },
    end: { x: 180, y: height - 640 },
    thickness: 1,
    color: rgb(0.2, 0.25, 0.3),
  });
  page.drawText('Date (DD/MM/YYYY)', {
    x: 55,
    y: height - 655,
    size: 8.5,
    font: fontRegular,
  });

  return await pdfDoc.save();
}

/**
 * Creates a sample partially completed form to demonstrate preservation of
 * existing values and only asking for missing fields.
 */
export async function createSamplePartiallyCompletedPdf(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  page.drawText('RESIDENTIAL APARTMENT LEASE APPLICATION', {
    x: 130,
    y: height - 60,
    size: 14,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });

  page.drawText('Form Ref: LSE-2026-PARTIAL - Existing details already filled below', {
    x: 135,
    y: height - 76,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.3, 0.4, 0.5),
  });

  page.drawLine({
    start: { x: 40, y: height - 85 },
    end: { x: width - 40, y: height - 85 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  const form = pdfDoc.getForm();

  // Already filled name
  page.drawText('1. Full Legal Name of Tenant:', { x: 40, y: height - 120, size: 9, font: fontRegular });
  const nameField = form.createTextField('tenantName');
  nameField.addToPage(page, { x: 40, y: height - 150, width: 250, height: 24 });
  nameField.setText('Venkata Krishna Rao');

  // Already filled email
  page.drawText('2. Contact Email Address:', { x: 320, y: height - 120, size: 9, font: fontRegular });
  const emailField = form.createTextField('tenantEmail');
  emailField.addToPage(page, { x: 320, y: height - 150, width: 235, height: 24 });
  emailField.setText('vkrishna.rao@example.com');

  // MISSING: Phone
  page.drawText('3. Mobile Phone Number (REQUIRED - MISSING):', { x: 40, y: height - 190, size: 9, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  const phoneField = form.createTextField('tenantPhone');
  phoneField.addToPage(page, { x: 40, y: height - 220, width: 250, height: 24 });

  // MISSING: Permanent Address
  page.drawText('4. Permanent Residential Address (REQUIRED - MISSING):', { x: 40, y: height - 260, size: 9, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  const addrField = form.createTextField('permanentAddress');
  addrField.addToPage(page, { x: 40, y: height - 310, width: 515, height: 40 });

  // MISSING: Monthly Income
  page.drawText('5. Monthly Gross Salary / Income:', { x: 40, y: height - 340, size: 9, font: fontRegular });
  const incomeField = form.createTextField('monthlyIncome');
  incomeField.addToPage(page, { x: 40, y: height - 370, width: 250, height: 24 });

  // MISSING: Emergency Contact Name
  page.drawText('6. Emergency Contact Person Name:', { x: 320, y: height - 340, size: 9, font: fontRegular });
  const emContactField = form.createTextField('emergencyContact');
  emContactField.addToPage(page, { x: 320, y: height - 370, width: 235, height: 24 });

  return await pdfDoc.save();
}

/**
 * Creates an authentic Private School Application Form (scanned/flat style with visible boxes)
 * containing fields for:
 * - Parent/guardian name
 * - Child's name
 * - Child's age
 * - Previous school
 * - Home address
 * - City
 * - Region
 * - Postal code
 * - Country
 * - Phone number
 * - Grade applying for, parent email, declaration checkbox, signature and date
 */
export async function createSampleSchoolApplicationPdf(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Top header banner
  page.drawRectangle({
    x: 40,
    y: height - 95,
    width: width - 80,
    height: 60,
    color: rgb(0.06, 0.13, 0.24), // Official deep navy
  });

  page.drawText('ST. AUGUSTINE PREPARATORY ACADEMY', {
    x: 55,
    y: height - 62,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('PRIVATE SCHOOL ADMISSION & STUDENT ENROLLMENT APPLICATION', {
    x: 55,
    y: height - 78,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.85, 0.9, 0.98),
  });

  page.drawText('FORM REF: SAP-2026-ADM · ACADEMIC YEAR 2026-2027', {
    x: 55,
    y: height - 90,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.7, 0.8, 0.92),
  });

  // Small badge on right of header
  page.drawRectangle({
    x: width - 150,
    y: height - 85,
    width: 95,
    height: 22,
    color: rgb(0.12, 0.22, 0.38),
    borderWidth: 1,
    borderColor: rgb(0.3, 0.45, 0.65),
  });
  page.drawText('OFFICIAL FORM', {
    x: width - 138,
    y: height - 77,
    size: 8,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // -------------------------------------------------------------
  // SECTION 1: STUDENT INFORMATION
  // -------------------------------------------------------------
  page.drawText('SECTION 1: STUDENT / APPLICANT INFORMATION', {
    x: 40,
    y: height - 120,
    size: 9.5,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });
  page.drawLine({
    start: { x: 40, y: height - 125 },
    end: { x: width - 40, y: height - 125 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  // 1. Child's Name
  page.drawText("1. Child's Full Legal Name (First, Middle, Last):", {
    x: 40,
    y: height - 140,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 40,
    y: height - 165,
    width: 360,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 2. Child's Age
  page.drawText("2. Child's Age:", {
    x: 415,
    y: height - 140,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 415,
    y: height - 165,
    width: 140,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 3. Grade Applying For
  page.drawText('3. Grade / Class Applying For:', {
    x: 40,
    y: height - 190,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 40,
    y: height - 215,
    width: 175,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 4. Previous School
  page.drawText('4. Previous School Attended (Name & Location):', {
    x: 230,
    y: height - 190,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 230,
    y: height - 215,
    width: 325,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // -------------------------------------------------------------
  // SECTION 2: PARENT / GUARDIAN DETAILS
  // -------------------------------------------------------------
  page.drawText('SECTION 2: PARENT / GUARDIAN CONTACT DETAILS', {
    x: 40,
    y: height - 248,
    size: 9.5,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });
  page.drawLine({
    start: { x: 40, y: height - 253 },
    end: { x: width - 40, y: height - 253 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  // 5. Parent / Guardian Name
  page.drawText("5. Parent / Guardian Full Legal Name:", {
    x: 40,
    y: height - 268,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 40,
    y: height - 295,
    width: 320,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 6. Phone Number
  page.drawText('6. Primary Contact Phone Number:', {
    x: 375,
    y: height - 268,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 375,
    y: height - 295,
    width: 180,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 7. Parent Email
  page.drawText('7. Primary Contact Email Address:', {
    x: 40,
    y: height - 320,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 40,
    y: height - 345,
    width: 515,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // -------------------------------------------------------------
  // SECTION 3: RESIDENTIAL ADDRESS
  // -------------------------------------------------------------
  page.drawText('SECTION 3: RESIDENTIAL ADDRESS', {
    x: 40,
    y: height - 378,
    size: 9.5,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });
  page.drawLine({
    start: { x: 40, y: height - 383 },
    end: { x: width - 40, y: height - 383 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  // 8. Home Address
  page.drawText('8. Home Street Address (House No, Building, Street):', {
    x: 40,
    y: height - 398,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 40,
    y: height - 425,
    width: 515,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // Row of City, Region, Postal Code, Country
  // 9. City
  page.drawText('9. City:', {
    x: 40,
    y: height - 450,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 40,
    y: height - 475,
    width: 150,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 10. Region
  page.drawText('10. State / Region:', {
    x: 205,
    y: height - 450,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 205,
    y: height - 475,
    width: 145,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 11. Postal Code
  page.drawText('11. Postal Code:', {
    x: 365,
    y: height - 450,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 365,
    y: height - 475,
    width: 95,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // 12. Country
  page.drawText('12. Country:', {
    x: 475,
    y: height - 450,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 475,
    y: height - 475,
    width: 80,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // -------------------------------------------------------------
  // SECTION 4: DECLARATION & ENROLLMENT CLAUSE
  // -------------------------------------------------------------
  page.drawText('SECTION 4: PARENT / GUARDIAN DECLARATION CLAUSE', {
    x: 40,
    y: height - 508,
    size: 9.5,
    font: fontBold,
    color: rgb(0.06, 0.13, 0.24),
  });
  page.drawLine({
    start: { x: 40, y: height - 513 },
    end: { x: width - 40, y: height - 513 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  // Checkbox: Declaration
  page.drawRectangle({
    x: 42,
    y: height - 540,
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: rgb(0.2, 0.25, 0.35),
    color: rgb(1, 1, 1),
  });
  page.drawText('I hereby certify that all information submitted in this application is truthful and accurate.', {
    x: 65,
    y: height - 537,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.1, 0.15, 0.25),
  });

  // Signature and Date boxes
  page.drawText("13. Parent / Guardian Signature / Full Legal Name:", {
    x: 40,
    y: height - 565,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 40,
    y: height - 592,
    width: 320,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  page.drawText('14. Submission Date (DD/MM/YYYY):', {
    x: 375,
    y: height - 565,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.2, 0.28),
  });
  page.drawRectangle({
    x: 375,
    y: height - 592,
    width: 180,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.35, 0.45),
    color: rgb(0.98, 0.99, 1),
  });

  // Official school footer note
  page.drawRectangle({
    x: 40,
    y: height - 680,
    width: 515,
    height: 60,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.75, 0.8),
    color: rgb(0.96, 0.97, 0.99),
  });
  page.drawText('OFFICIAL ADMISSION OFFICE USE ONLY', {
    x: 50,
    y: height - 640,
    size: 8,
    font: fontBold,
    color: rgb(0.3, 0.35, 0.45),
  });
  page.drawText('Application Received By: ____________________   Date Processed: ____________________   Decision: [ ] Approved   [ ] Waitlisted', {
    x: 50,
    y: height - 662,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.55),
  });

  return await pdfDoc.save();
}
