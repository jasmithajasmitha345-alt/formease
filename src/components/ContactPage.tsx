import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  FileQuestion,
  PhoneCall
} from 'lucide-react';
import { NavigationTab } from '../types';

interface ContactPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('Form Assistance Help');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Contact & Support
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Have questions about a difficult form, custom field positioning, or Telugu translations? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 font-display mb-4">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950">Thank You!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your message has been received. Our team will review your form inquiry and respond to <span className="font-semibold">{email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-3 text-xs font-semibold text-emerald-800 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Form Assistance Help">Help with a Specific Form</option>
                    <option value="Telugu Translations">Telugu / Regional Guidance Feedback</option>
                    <option value="PDF Generation">PDF Overlay or Alignment Question</option>
                    <option value="Browser Integration">Website Form Browser Helper</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Details / Question
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the form or the confusion you experienced..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick FAQ */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Frequently Asked Questions
            </h2>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileQuestion className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Will my form look identical to the original?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. FormEase uses PDF field population and high-precision coordinate overlays. All original fonts, borders, signatures, stamps, and layout remain untouched.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileQuestion className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Can I edit answers after generating?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Absolutely. Click "Edit Answers" at any time to revise any field and regenerate your PDF in seconds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileQuestion className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Why doesn't FormEase submit directly?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To protect your security. Government and banking institutions prohibit automated submission bots. You retain 100% control over submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
