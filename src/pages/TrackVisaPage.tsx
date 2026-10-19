/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Student Visa Tracking Page View
 *
 * Route: https://globaleducationexpert.com/track-visa
 */

import React, { useState, useEffect } from 'react';
import { VisaTrackingHero } from '../components/visa/VisaTrackingHero.tsx';
import { VisaTrackingForm } from '../components/visa/VisaTrackingForm.tsx';
import { VisaStatusCard } from '../components/visa/VisaStatusCard.tsx';
import { VisaProgressTimeline } from '../components/visa/VisaProgressTimeline.tsx';
import { VisaSupportConversion } from '../components/visa/VisaSupportConversion.tsx';
import { VisaTrackingFAQ, VISA_TRACKING_FAQS } from '../components/visa/VisaTrackingFAQ.tsx';
import {
  trackVisaApplication,
  getEducationalSampleRecord,
  validatePassportNumber,
  OFFICIAL_EMGS_TRACKER_URL
} from '../services/visaTrackingService.ts';
import {
  EMGSApplicationRecord,
  VisaTrackingFormValues
} from '../types/visaTracking.ts';
import { SITE_URL, getCanonicalUrl } from '../lib/seo-config.ts';

interface TrackVisaPageProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultation?: () => void;
}

export const TrackVisaPage: React.FC<TrackVisaPageProps> = ({
  onNavigate,
  onOpenConsultation
}) => {
  const [record, setRecord] = useState<EMGSApplicationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suggestOfficialPortal, setSuggestOfficialPortal] = useState(false);

  // Dynamic SEO Title, Description, Canonical and Structured Data
  useEffect(() => {
    const pageTitle = 'Malaysia Student Visa Tracking | EMGS Status Guide | GEES';
    const pageDescription = 'Track your Malaysia student visa journey with GEES. Access official EMGS status verification and understand the next steps in your application.';
    const canonicalUrl = getCanonicalUrl('track-visa');

    document.title = pageTitle;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDescription);

    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Open Graph Tags
    const updateOgTag = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateOgTag('og:title', pageTitle);
    updateOgTag('og:description', pageDescription);
    updateOgTag('og:url', canonicalUrl);
    updateOgTag('og:type', 'website');

    // JSON-LD Structured Data (FAQPage & Breadcrumbs)
    const jsonLdScriptId = 'emgs-tracking-jsonld';
    let scriptEl = document.getElementById(jsonLdScriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = jsonLdScriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': SITE_URL
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Malaysia Visa Tracking',
              'item': canonicalUrl
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': VISA_TRACKING_FAQS.map((f) => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a
            }
          }))
        }
      ]
    };

    scriptEl.textContent = JSON.stringify(structuredData);

    return () => {
      const existingScript = document.getElementById(jsonLdScriptId);
      if (existingScript) existingScript.remove();
    };
  }, []);

  const handleFormSubmit = async (values: VisaTrackingFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuggestOfficialPortal(false);

    // 1. Robust client-side validation for Passport Number
    const validation = validatePassportNumber(values.passportNumber);
    if (!validation.isValid) {
      setIsLoading(false);
      setErrorMessage(validation.error || 'Please enter a valid passport number (5 to 15 alphanumeric characters).');
      setSuggestOfficialPortal(true);
      return;
    }

    if (!values.consentAgreed) {
      setIsLoading(false);
      setErrorMessage('Please agree to the privacy statement to proceed.');
      return;
    }

    try {
      // Secure submission simulation with loading state management
      await new Promise((resolve) => setTimeout(resolve, 700));

      const res = await trackVisaApplication({
        ...values,
        passportNumber: validation.normalized
      });

      if (res.success && res.data) {
        setRecord(res.data);
      } else {
        setErrorMessage(res.error || 'Live tracking requires direct official verification.');
        setSuggestOfficialPortal(true);

        // Automatically copy validated passport to clipboard for seamless official portal pasting
        try {
          navigator.clipboard.writeText(validation.normalized);
        } catch {}
      }
    } catch {
      setErrorMessage('Unable to connect to the secure visa tracking gateway. Please verify your application directly on the official EMGS portal.');
      setSuggestOfficialPortal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewSample = (passportNumber: string, nationalityName: string) => {
    const sampleRecord = getEducationalSampleRecord(passportNumber, nationalityName);
    setRecord(sampleRecord);
    setErrorMessage(null);
    setSuggestOfficialPortal(false);

    // Smooth scroll down to result card
    setTimeout(() => {
      const el = document.querySelector('[data-purpose="visa-status-result-dashboard"]');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleClearRecord = () => {
    setRecord(null);
    setErrorMessage(null);
    setSuggestOfficialPortal(false);
  };

  return (
    <div className="w-full bg-white dark:bg-[#070D1E] min-h-screen py-4 sm:py-8 transition-colors">
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('study-destination', 'study-in-malaysia')}
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium"
          >
            Study in Malaysia
          </button>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold" aria-current="page">
            EMGS Visa Tracking
          </span>
        </nav>
      </div>

      {/* Hero Section */}
      <VisaTrackingHero />

      {/* Input Form Card */}
      <VisaTrackingForm
        onSubmit={handleFormSubmit}
        onPreviewSample={handlePreviewSample}
        isLoading={isLoading}
        errorMessage={errorMessage}
        suggestOfficialPortal={suggestOfficialPortal}
      />

      {/* Result Status Card (When available or when sample demo is triggered) */}
      {record && (
        <VisaStatusCard record={record} onClear={handleClearRecord} />
      )}

      {/* 6 Steps Educational Timeline */}
      <VisaProgressTimeline />

      {/* Student Support, WhatsApp Advisory, & Referral Conversion Cards */}
      <VisaSupportConversion
        onNavigate={onNavigate}
        onOpenConsultation={onOpenConsultation}
      />

      {/* Common Questions FAQ Accordion */}
      <VisaTrackingFAQ />
    </div>
  );
};

export default TrackVisaPage;
