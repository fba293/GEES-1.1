/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Comprehensive Contact Us View & Global Office Directory
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface ContactUsViewProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultationModal?: (counselorName?: string) => void;
}

interface OfficeInfo {
  id: 'dhaka' | 'malaysia';
  country: string;
  flag: string;
  city: string;
  name: string;
  address: string;
  landmark: string;
  hours: string;
  days: string;
  phone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  googleMapsUrl: string;
  embedQuery: string;
  publicTransit: string;
}

const OFFICES: OfficeInfo[] = [
  {
    id: 'dhaka',
    country: 'Bangladesh',
    flag: '🇧🇩',
    city: 'Dhaka',
    name: 'GEES Central Headquarters (Dhaka)',
    address: 'Green City Regency, Road 27/1, Level 10, Kakrail, Dhaka 1000',
    landmark: 'Opposite to Kakrail Mosque / Near Shantinagar Intersection',
    hours: '10:00 AM – 5:00 PM',
    days: 'Sunday – Thursday (Closed Friday & Saturday)',
    phone: '+880 1805-529578',
    whatsappNumber: '+8801805529578',
    whatsappUrl: 'https://wa.me/8801805529578',
    email: 'info@globaleducationexpert.com',
    googleMapsUrl: 'https://maps.app.goo.gl/TgoFcTtKpkXC1KK88',
    embedQuery: 'Green City Regency, Kakrail, Dhaka, Bangladesh',
    publicTransit: 'Accessible via Kakrail Road bus routes or Shantinagar intersection rickshaw drop-off. Elevator to Level 10.'
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    city: 'Subang Jaya',
    name: 'GEES Southeast Asia Regional Hub',
    address: 'USJ 19 City Mall, Level 1, Subang Jaya, Selangor 47620',
    landmark: 'Inside USJ 19 Digital Mall / Next to Wawasan LRT Station',
    hours: '9:30 AM – 6:00 PM',
    days: 'Monday – Friday (Closed Sunday)',
    phone: '+60 11-1237 6224',
    whatsappNumber: '+601112376224',
    whatsappUrl: 'https://wa.me/601112376224',
    email: 'info@globaleducationexpert.com',
    googleMapsUrl: 'https://maps.app.goo.gl/8UQxEMhP4u1Bwpa66',
    embedQuery: 'USJ 19 City Mall, Subang Jaya, Selangor, Malaysia',
    publicTransit: 'Kelana Jaya LRT line to Wawasan Station (direct connected pedestrian bridge to USJ 19 Mall).'
  }
];

export const ContactUsView: React.FC<ContactUsViewProps> = ({
  onNavigate,
  onOpenConsultationModal
}) => {
  // Selected office tab for the interactive map and location focus
  const [selectedOffice, setSelectedOffice] = useState<'dhaka' | 'malaysia'>('dhaka');

  // Contact form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('+880');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('United Kingdom');
  const [studyLevel, setStudyLevel] = useState("Bachelor's Degree");
  const [preferredMode, setPreferredMode] = useState('Dhaka Office (In-Person)');
  const [subject, setSubject] = useState('University Admissions & Course Selection');
  const [message, setMessage] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    name: string;
    destination: string;
    phone: string;
    mode: string;
  } | null>(null);

  // FAQ open item
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const activeOffice = OFFICES.find(o => o.id === selectedOffice) || OFFICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([15, 30, 15]);
      } catch (err) {
        // Ignore vibration errors
      }
    }

    setTimeout(() => {
      const randomTicketId = `GEES-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({
        id: randomTicketId,
        name: fullName,
        destination,
        phone: `${phoneCountry} ${phone}`,
        mode: preferredMode
      });
      setIsSubmitting(false);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 800);
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="w-full pb-20 bg-slate-50 dark:bg-[#070D1E] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Header & Breadcrumbs */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/10 via-amber-500/5 to-transparent dark:from-blue-950/40 dark:via-slate-900/60 dark:to-[#070D1E] border-b border-slate-200/80 dark:border-slate-800/80 pt-8 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Contact Us</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#D97706] dark:text-[#FBB034] font-bold block mb-2">
              Official Head Office & International Centers
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              Get in Touch with Our Global Education Experts
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Have questions regarding university admission criteria, student visas, scholarship applications, or test requirements? Our senior education counselors in Dhaka and Malaysia are ready to guide you at every stage.
            </p>

            {/* Quick Unboxed Highlights (Zero-Pill Compliance) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Response within 2 hours
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span>100% Free Initial Counseling</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span>Authorized Representative for 500+ Universities</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span>WhatsApp Direct Line</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Quick Contact Hotline Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Card 1: Dhaka Phone */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">call</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-base leading-none">🇧🇩</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Dhaka Hotline</span>
                </div>
                <a
                  href="tel:+8801805529578"
                  className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400 block truncate transition-colors"
                >
                  +880 1805-529578
                </a>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Sun – Thu: 10AM – 5PM</span>
              </div>
            </div>
          </div>

          {/* Card 2: Malaysia Phone */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">call</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-base leading-none">🇲🇾</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Malaysia Hotline</span>
                </div>
                <a
                  href="tel:+601112376224"
                  className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400 block truncate transition-colors"
                >
                  +60 11-1237 6224
                </a>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Mon – Fri: 9:30AM – 6PM</span>
              </div>
            </div>
          </div>

          {/* Card 3: Official Email */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">General Inquiries</span>
                <a
                  href="mailto:info@globaleducationexpert.com"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400 block truncate transition-colors"
                >
                  info@globaleducationexpert.com
                </a>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">24/7 inbox monitoring</span>
              </div>
            </div>
          </div>

          {/* Card 4: WhatsApp Instant Chat */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">WhatsApp Chat</span>
                <a
                  href="https://wa.me/8801805529578"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline block truncate"
                >
                  Start Live Chat Now
                </a>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400/80 block mt-0.5">Quickest counselor reply</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Primary Grid: Form on Left, Office Explorer & Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: Contact & Consultation Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Fill out the form below. An authorized counselor will review your inquiry and connect with you.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#D97706] dark:text-[#FBB034] font-semibold bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50 shrink-0">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Free Consultation</span>
                </div>
              </div>

              {submittedTicket ? (
                /* Success Feedback Card */
                <div className="py-8 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                    <span className="material-symbols-outlined text-3xl">task_alt</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-1">
                      Inquiry Ticket #{submittedTicket.id}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Thank You, {submittedTicket.name}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                      Your study inquiry for <strong>{submittedTicket.destination}</strong> ({submittedTicket.mode}) has been routed to our Senior Counseling Panel.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Number:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedTicket.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preferred Mode:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedTicket.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Response:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Within 2 Business Hours</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <a
                      href={`https://wa.me/8801805529578?text=Hello%20GEES%20Team%2C%20I%20just%20submitted%20inquiry%20ticket%20${submittedTicket.id}%20regarding%20studying%20in%20${encodeURIComponent(submittedTicket.destination)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>Connect with Counselor on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Actual Inquiry Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      WhatsApp / Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                        className="w-32 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="+880">🇧🇩 +880 (BD)</option>
                        <option value="+60">🇲🇾 +60 (MY)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+1">🇺🇸 +1 (US/CA)</option>
                        <option value="+61">🇦🇺 +61 (AU)</option>
                        <option value="+64">🇳🇿 +64 (NZ)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                        <option value="+91">🇮🇳 +91 (IN)</option>
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="1805-529578"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#fbb034] transition-all"
                      />
                    </div>
                  </div>

                  {/* Destination & Degree Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        Target Destination <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                        <option value="Canada">🇨🇦 Canada</option>
                        <option value="Australia">🇦🇺 Australia</option>
                        <option value="United States">🇺🇸 United States</option>
                        <option value="New Zealand">🇳🇿 New Zealand</option>
                        <option value="Germany">🇩🇪 Germany</option>
                        <option value="Malaysia">🇲🇾 Malaysia</option>
                        <option value="Ireland">🇮🇪 Ireland</option>
                        <option value="Cyprus">🇨🇾 Cyprus</option>
                        <option value="Finland">🇫🇮 Finland</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        Intended Study Level
                      </label>
                      <select
                        value={studyLevel}
                        onChange={(e) => setStudyLevel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="Bachelor's Degree">Undergraduate / Bachelor's</option>
                        <option value="Master's Degree">Postgraduate / Master's</option>
                        <option value="Doctorate / PhD">Doctorate / PhD</option>
                        <option value="Foundation / Diploma">Foundation / Pathway / Diploma</option>
                        <option value="English Language Course">IELTS / PTE / Language Program</option>
                      </select>
                    </div>
                  </div>

                  {/* Consultation Mode & Inquiry Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        Preferred Counseling Mode
                      </label>
                      <select
                        value={preferredMode}
                        onChange={(e) => setPreferredMode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="Dhaka Office (In-Person)">🏢 Kakrail Dhaka Office (In-Person)</option>
                        <option value="Malaysia Office (In-Person)">🏢 Subang Jaya Malaysia Office (In-Person)</option>
                        <option value="Online Video Call (Zoom/Meet)">💻 Online Video Call (Zoom / Google Meet)</option>
                        <option value="Direct WhatsApp Chat">💬 Direct WhatsApp Discussion</option>
                        <option value="Phone Call">📞 Voice Call with Senior Counselor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                        Service Category
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="University Admissions & Course Selection">University Admissions & Course Selection</option>
                        <option value="Student Visa & Financial Documentation">Student Visa & Financial Documentation</option>
                        <option value="Scholarship & Tuition Fee Waiver Assessment">Scholarship & Fee Waiver Assessment</option>
                        <option value="IELTS / PTE Coaching & Exam Booking">IELTS / PTE Coaching & Exam Booking</option>
                        <option value="Accommodation & Pre-Departure Assistance">Accommodation & Pre-Departure Assistance</option>
                        <option value="B2B Sub-Agent Partnership Inquiry">B2B Sub-Agent Partnership Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Message / Academic Background Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your current education background, GPA, IELTS score (if any), or specific universities you are interested in..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034] transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="consent-check"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <label htmlFor="consent-check" className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal cursor-pointer">
                      I agree to allow GEES counselors to contact me via phone, email, or WhatsApp with official university updates and counseling schedules.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !consentGiven}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                          <span>Routing to Senior Counselor...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Inquiry for Free Counseling</span>
                          <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Office Directory & Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Office Branch Switcher Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Physical Office Branches
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Walk-ins Welcome</span>
              </div>

              {/* Segmented Office Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
                {OFFICES.map((office) => {
                  const isActive = selectedOffice === office.id;
                  return (
                    <button
                      key={office.id}
                      type="button"
                      onClick={() => setSelectedOffice(office.id)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="text-base leading-none">{office.flag}</span>
                      <span>{office.city}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Office Details Card */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                    {activeOffice.country} Operations
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {activeOffice.name}
                  </h4>
                </div>

                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                  {/* Address */}
                  <div className="flex items-start gap-2.5">
                    <span className="text-red-500 shrink-0 text-sm mt-0.5 select-none">📍</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold text-xs">
                        Address:
                      </strong>
                      <span className="leading-relaxed">{activeOffice.address}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{activeOffice.landmark}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-2.5">
                    <span className="text-blue-500 shrink-0 text-sm mt-0.5 select-none">🕒</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold text-xs">
                        Working Hours:
                      </strong>
                      <span>{activeOffice.hours}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{activeOffice.days}</p>
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 shrink-0 text-sm mt-0.5 select-none">📞</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold text-xs">
                        Direct Phone / WhatsApp:
                      </strong>
                      <a
                        href={activeOffice.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        {activeOffice.phone}
                      </a>
                    </div>
                  </div>

                  {/* Public Transit Guide */}
                  <div className="flex items-start gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-purple-500 shrink-0 text-sm mt-0.5 select-none">🚇</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold text-xs">
                        Directions & Transit:
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                        {activeOffice.publicTransit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={activeOffice.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    <span>Google Maps</span>
                  </a>

                  <a
                    href={activeOffice.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Map Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">location_on</span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {activeOffice.name}
                  </span>
                </div>
                <a
                  href={activeOffice.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Maps</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
              <div className="h-64 sm:h-72 w-full bg-slate-100 dark:bg-slate-800 relative">
                <iframe
                  title={`GEES ${activeOffice.city} Office Map`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    selectedOffice === 'dhaka'
                      ? 'Green City Regency, Road 27/1, Kakrail, Dhaka 1000'
                      : 'The 19 USJ City Mall, Subang Jaya, Selangor'
                  )}&output=embed`}
                ></iframe>
              </div>
            </div>

            {/* Sub-Agent & Institutional Notice Card */}
            <div className="p-5 rounded-3xl bg-linear-to-br from-blue-500/10 via-purple-500/5 to-transparent dark:from-blue-900/20 dark:via-purple-900/10 dark:to-transparent border border-blue-200/80 dark:border-blue-900/40">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-lg">handshake</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Are You an Educational Agent or University Rep?
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    We partner with 200+ certified regional agents and international admissions offices with direct portal access and fast-track commission settlements.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('agent-portal')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>Visit B2B Sub-Agent Portal</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Specialized Department Desks */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest text-[#D97706] dark:text-[#FBB034] font-bold block mb-1">
              Direct Contact Desks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Connect Directly with Department Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Desk 1: Admissions & Applications */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                Admissions & Offer Letters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Direct assistance with course choices, entry criteria, document verification, and university unconditional offers.
              </p>
              <a
                href="mailto:admissions@globaleducationexpert.com"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>admissions@globaleducationexpert.com</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>

            {/* Desk 2: Visa & Immigration Wing */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-amber-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                Visa & Immigration Filing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Guidance on CAS, COE, bank statements, sponsor affidavits, biometric appointments, and embassy interview prep.
              </p>
              <a
                href="mailto:visa@globaleducationexpert.com"
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>visa@globaleducationexpert.com</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>

            {/* Desk 3: English Testing (IELTS / PTE) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">record_voice_over</span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                IELTS / PTE Test Prep
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Free mock tests, band score diagnostic sessions, and registration discounts with British Council & IDP.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('services', 'ielts-preparation')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore English Test Modules</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {/* Desk 4: Partnerships & Sub-Agents */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-purple-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">hub</span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                Institutional Partnerships
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                New university representations, education fair invitations, and official agency agreements.
              </p>
              <a
                href="mailto:partners@globaleducationexpert.com"
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>partners@globaleducationexpert.com</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions regarding Office Visits & Inquiries */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#D97706] dark:text-[#FBB034] font-bold block mb-1">
              Visiting GEES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Do I need to pay any consultation fees for my first appointment?',
                a: 'No, absolutely not. All initial profile assessments, university shortlisting, and admission guidance sessions at GEES are 100% free with zero consultation charges.'
              },
              {
                q: 'Can I visit the Dhaka or Malaysia office as a walk-in without a prior appointment?',
                a: 'Yes, our office reception is open for walk-ins during office hours (Sunday to Thursday 10:00 AM – 5:00 PM in Dhaka; Monday to Friday 9:30 AM – 6:00 PM in Malaysia). However, booking an appointment in advance guarantees an assigned senior counselor tailored to your target destination.'
              },
              {
                q: 'What academic documents should I bring when visiting the office?',
                a: 'For the most accurate assessment, please bring: 1) Copies of all academic certificates and marksheets/transcripts, 2) Valid passport copy, 3) IELTS / PTE / Duolingo test scorecard (if completed), and 4) An updated CV/Resume.'
              },
              {
                q: 'How do students outside Dhaka or Malaysia get counseling?',
                a: 'We conduct full digital consultations daily via Zoom and Google Meet for students nationwide across Bangladesh, Southeast Asia, and the Middle East. Your documents are verified digitally through our secure student portal.'
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Direct CTA Card */}
        <div className="rounded-3xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-950 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#FBB034] font-bold block">
              Start Your Journey Today
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need Immediate Academic Guidance?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Connect directly with one of our certified counselors now via WhatsApp or book a 1-on-1 virtual counseling session.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a
                href="https://wa.me/8801805529578"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FBB034] hover:bg-[#FBB034]/90 text-slate-950 font-black text-xs transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>

              {onOpenConsultationModal && (
                <button
                  type="button"
                  onClick={() => onOpenConsultationModal()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
                >
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>Book 1-on-1 Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
