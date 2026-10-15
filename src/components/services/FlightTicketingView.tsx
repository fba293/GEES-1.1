/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone International Student Flight Ticketing & Travel Logistics Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface FlightTicketingViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
  onNavigate?: (view: string, payload?: string) => void;
}

interface AirlinePartner {
  id: string;
  name: string;
  logoCode: string;
  studentClub: string;
  baggageAllowance: string;
  discountRange: string;
  dateChangePolicy: string;
  destinations: string[];
  perks: string[];
  popularHubs: string;
}

interface DestinationFlightGuide {
  country: string;
  flag: string;
  code: string;
  majorAirports: string[];
  recommendedAirlines: string[];
  avgFlightDuration: string;
  transitVisaNote: string;
  arrivalWindowRecommendation: string;
  baggageStandard: string;
  pickupAssistance: boolean;
}

const AIRLINES: AirlinePartner[] = [
  {
    id: 'emirates',
    name: 'Emirates',
    logoCode: 'EK',
    studentClub: 'Emirates Special Student Offer',
    baggageAllowance: 'Up to 40 kg (or 1 extra piece / 23kg for USA/Canada routes)',
    discountRange: '10% off Economy & Business class fares',
    dateChangePolicy: '1 free date change until 7 days before departure',
    destinations: ['United Kingdom', 'USA', 'Canada', 'Australia', 'Europe', 'New Zealand'],
    perks: [
      'Additional 10kg checked baggage or 1 extra piece (23kg)',
      'Free flexible date change up to 7 days before flight',
      'Complimentary Wi-Fi messaging on board for Skywards members',
      'Seamless transfer through Dubai International Airport (DXB)'
    ],
    popularHubs: 'Dubai (DXB) • Ultra-modern transfer terminal'
  },
  {
    id: 'qatar',
    name: 'Qatar Airways',
    logoCode: 'QR',
    studentClub: 'Student Club (Privilege Club)',
    baggageAllowance: 'Additional 10 kg or 1 extra piece (up to 45kg total)',
    discountRange: '10% on 1st booking, 15% on 2nd, 20% on 3rd booking',
    dateChangePolicy: '1 complimentary date change flexibility',
    destinations: ['UK & Ireland', 'USA & Canada', 'Australia & NZ', 'Schengen Europe', 'Malaysia'],
    perks: [
      'Tier upgrade as graduation gift upon degree completion',
      'Companion Pass: share student discount with 1 friend or family member',
      'Free Super Wi-Fi access on board',
      'Hamad International Airport (DOH) world-class transit hub'
    ],
    popularHubs: 'Doha (DOH) • Voted World’s Best Airport'
  },
  {
    id: 'singapore',
    name: 'Singapore Airlines',
    logoCode: 'SQ',
    studentClub: 'KrisFlyer Student Privileges',
    baggageAllowance: 'Up to 40 kg checked baggage (or 3 × 23kg pieces for US/Canada)',
    discountRange: '10% discount on Economy and Premium Economy fares',
    dateChangePolicy: 'Fee waiver for first booking date change',
    destinations: ['Australia', 'New Zealand', 'United Kingdom', 'USA', 'Europe', 'Malaysia'],
    perks: [
      'Complimentary 40kg baggage or 3 checked bags (US routes)',
      'Free 1st date change with zero penalty',
      'Year-round KrisFlyer miles accrual',
      'Award-winning in-flight service & Changi Airport (SIN) transit'
    ],
    popularHubs: 'Singapore Changi (SIN) • World-renowned transit facilities'
  },
  {
    id: 'malaysia',
    name: 'Malaysia Airlines',
    logoCode: 'MH',
    studentClub: 'MHexplorer Student Travel Programme',
    baggageAllowance: 'Up to 45 kg baggage allowance (Economy class)',
    discountRange: 'Up to 30% flight discount on Malaysia Airlines & Firefly',
    dateChangePolicy: '1 complimentary date change on all bookings',
    destinations: ['Malaysia', 'Australia', 'United Kingdom', 'New Zealand', 'ASEAN'],
    perks: [
      'Direct flights into Kuala Lumpur International Airport (KLIA/KLIA2)',
      'Up to 45kg checked baggage allowance for study routes',
      '20% birthday discount vouchers + Enrich Points',
      'Special family & friends companion discounts'
    ],
    popularHubs: 'Kuala Lumpur (KUL) • Official GEES Headquarters city'
  },
  {
    id: 'turkish',
    name: 'Turkish Airlines',
    logoCode: 'TK',
    studentClub: 'Miles&Smiles Student Benefits',
    baggageAllowance: 'Up to 40 kg (or 2 × 23kg pieces)',
    discountRange: 'Up to 20% discount on international flights',
    dateChangePolicy: '1 free ticket change without penalty fee',
    destinations: ['United Kingdom', 'Germany', 'USA', 'Canada', 'Cyprus', 'Europe'],
    perks: [
      'Flies to more international countries than any other airline',
      'Generous 40kg baggage allowance for international students',
      'Free transit tour in Istanbul (Touristanbul) on long layovers',
      'State-of-the-art mega hub at Istanbul Airport (IST)'
    ],
    popularHubs: 'Istanbul (IST) • Bridge between Europe and Asia'
  },
  {
    id: 'biman',
    name: 'Biman Bangladesh Airlines',
    logoCode: 'BG',
    studentClub: 'Special Student Route Baggage Policy',
    baggageAllowance: 'Up to 40 kg – 46 kg on select direct long-haul routes',
    discountRange: 'Affordable direct point-to-point pricing',
    dateChangePolicy: 'Flexible student reissuing options',
    destinations: ['United Kingdom (London Heathrow & Manchester)', 'Canada (Toronto)', 'Malaysia (KL)'],
    perks: [
      'Non-stop direct flights from Dhaka (DAC) to London (LHR) and Manchester (MAN)',
      'Direct non-stop service to Toronto Pearson (YYZ)',
      'Ideal for students traveling with heavy cultural spices and winter wear',
      'No third-country layover transit visa required'
    ],
    popularHubs: 'Dhaka (DAC) • Non-stop point-to-point connection'
  }
];

const DESTINATIONS: DestinationFlightGuide[] = [
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    code: 'UK',
    majorAirports: ['London Heathrow (LHR)', 'London Gatwick (LGW)', 'Manchester (MAN)', 'Birmingham (BHX)', 'Edinburgh (EDI)'],
    recommendedAirlines: ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'Biman Bangladesh', 'British Airways'],
    avgFlightDuration: '10 – 14 hours (depending on layover / direct)',
    transitVisaNote: 'Direct airside transit via Middle East (DXB/DOH) requires no transit visa. If transiting Schengen countries or USA, verify electronic authorizations first.',
    arrivalWindowRecommendation: 'Arrive 7 to 10 days before university welcome week (Freshers Week) to complete BRP collection and bank account setup.',
    baggageStandard: '40 kg (2 bags of 20kg or 1 bag 30kg + 1 bag 10kg)',
    pickupAssistance: true
  },
  {
    country: 'Malaysia',
    flag: '🇲🇾',
    code: 'MY',
    majorAirports: ['Kuala Lumpur International Airport (KLIA Terminal 1 & 2)', 'Penang (PEN)', 'Kuching (KCH)'],
    recommendedAirlines: ['Malaysia Airlines', 'AirAsia', 'Biman Bangladesh', 'Singapore Airlines', 'Batik Air'],
    avgFlightDuration: '3.5 – 5 hours from South Asia; 11 hours from Europe',
    transitVisaNote: 'Direct flight recommended. eVAL (Electronic Visa Approval Letter) must be printed and validated before flight boarding.',
    arrivalWindowRecommendation: 'Notify GEES and your university 7 working days prior to departure. University representative MUST meet you at KLIA immigration gate.',
    baggageStandard: '35 kg – 45 kg student allowance',
    pickupAssistance: true
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    majorAirports: ['Sydney Kingsford Smith (SYD)', 'Melbourne Tullamarine (MEL)', 'Brisbane (BNE)', 'Perth (PER)', 'Adelaide (ADL)'],
    recommendedAirlines: ['Singapore Airlines', 'Malaysia Airlines', 'Qatar Airways', 'Emirates', 'Qantas'],
    avgFlightDuration: '10 – 16 hours',
    transitVisaNote: 'Do not transit through the USA without a valid C-1/B-1 transit visa or ESTA. Singapore, KL, or Middle East routes are hassle-free.',
    arrivalWindowRecommendation: 'Arrive 10 to 14 days before O-Week to inspect rental accommodation and finalize OSHC health insurance card registration.',
    baggageStandard: '40 kg checked luggage + 7 kg cabin baggage',
    pickupAssistance: true
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    code: 'CA',
    majorAirports: ['Toronto Pearson (YYZ)', 'Vancouver (YVR)', 'Montreal-Trudeau (YUL)', 'Calgary (YYC)'],
    recommendedAirlines: ['Air Canada', 'Qatar Airways', 'Emirates', 'Turkish Airlines', 'Biman (Direct YYZ)'],
    avgFlightDuration: '16 – 22 hours',
    transitVisaNote: 'CRITICAL: If transiting through any US airport, a US C-1 Transit Visa or valid B1/B2 visa is MANDATORY. Book Middle East or European transit to avoid US visa requirements.',
    arrivalWindowRecommendation: 'Arrive 2 to 3 weeks prior to fall semester intake to register for provincial health insurance (UHIP / BC MSP) and SIN number.',
    baggageStandard: 'Piece concept: 2 pieces × 23kg each (Total 46kg) + 1 piece 23kg student bonus',
    pickupAssistance: true
  },
  {
    country: 'United States',
    flag: '🇺🇸',
    code: 'US',
    majorAirports: ['New York JFK', 'Chicago O’Hare (ORD)', 'Los Angeles (LAX)', 'San Francisco (SFO)', 'Dallas/Fort Worth (DFW)', 'Atlanta (ATL)'],
    recommendedAirlines: ['Emirates', 'Qatar Airways', 'Turkish Airlines', 'Singapore Airlines', 'United Airlines'],
    avgFlightDuration: '17 – 24 hours',
    transitVisaNote: 'First entry into the United States must strictly occur within 30 days before your I-20 program start date. Carry original I-20, F-1 visa, and financial affidavit in cabin bag.',
    arrivalWindowRecommendation: 'Earliest allowed arrival is exactly 30 days before I-20 start date. Most students arrive 10 to 14 days ahead of campus move-in.',
    baggageStandard: 'Piece concept: 2 × 23kg (total 46kg) + 7kg carry-on bag + personal laptop bag',
    pickupAssistance: true
  },
  {
    country: 'Germany & Schengen Europe',
    flag: '🇩🇪',
    code: 'EU',
    majorAirports: ['Frankfurt (FRA)', 'Munich (MUC)', 'Berlin (BER)', 'Amsterdam (AMS)', 'Paris (CDG)'],
    recommendedAirlines: ['Turkish Airlines', 'Emirates', 'Qatar Airways', 'Lufthansa', 'Gulf Air'],
    avgFlightDuration: '10 – 14 hours',
    transitVisaNote: 'Airport Transit Visa (ATV) may be required if transiting between two different Schengen airports before reaching your final destination.',
    arrivalWindowRecommendation: 'Arrive 10 to 14 days prior to semester to register with city registration office (Bürgeramt) and activate blocked bank account.',
    baggageStandard: '40 kg checked luggage',
    pickupAssistance: true
  }
];

export const FlightTicketingView: React.FC<FlightTicketingViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('UK');
  const [activeTab, setActiveTab] = useState<'airlines' | 'destinations' | 'checklist' | 'calculator'>('airlines');

  // Flight Request Quote Form State
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    destinationCountry: 'United Kingdom',
    departureCity: 'Dhaka (DAC)',
    destinationAirport: 'London Heathrow (LHR)',
    preferredDepartureDate: '',
    airlinePreference: 'Any Best Student Fare',
    passengerType: 'Student (Solo)',
    extraBaggageNeeded: '40kg+ Student Allowance Required',
    transitPreference: 'Direct or 1 Short Layover',
    universityName: '',
    notes: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Luggage calculator interactive widget state
  const [luggageBoxes, setLuggageBoxes] = useState({
    winterCoats: 4,
    formalSuits: 2,
    shoesPairs: 4,
    textbooks: 3,
    spicesFoodKg: 5,
    electronicsKg: 4
  });

  const estimatedLuggageKg =
    luggageBoxes.winterCoats * 1.8 +
    luggageBoxes.formalSuits * 1.5 +
    luggageBoxes.shoesPairs * 1.2 +
    luggageBoxes.textbooks * 1.4 +
    luggageBoxes.spicesFoodKg * 1.0 +
    luggageBoxes.electronicsKg * 1.0 +
    4.5; // empty suitcase weight allowance

  const currentDest = DESTINATIONS.find((d) => d.code === selectedDestination) || DESTINATIONS[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#070b19] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. TOP BREADCRUMB & BADGE BAR */}
      <div className="w-full bg-white dark:bg-[#0b1329] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate && onNavigate('services')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium"
            >
              Services
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              Flight Ticketing & Student Logistics
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/60 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Official IATA Verified Agency Partner
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium text-[11px] border border-blue-200/60 dark:border-blue-800/60">
              <span className="material-symbols-outlined text-[14px]">luggage</span>
              Up to 45kg Student Allowance
            </span>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white via-blue-50/40 to-slate-50 dark:from-[#0b1329] dark:via-[#091124] dark:to-[#070b19] border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Key Selling Points */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#f59e0b] text-xs font-bold tracking-wide uppercase">
                <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
                <span>Specialized International Student Airfare Services</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Fly to Your Dream Campus with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500">
                  Exclusive Student Fares & 45kg Baggage
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Don’t pay inflated commercial ticket rates or get penalised for heavy study luggage. GEES partners directly with premier international carriers (Emirates, Qatar Airways, Singapore Airlines, Malaysia Airlines) to secure verified student club discounts, 1 free date change, transit visa clearance, and end-to-end airport pickup coordination.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">40 – 45kg</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Checked Baggage</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">FREE</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">1st Date Change</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-xl sm:text-2xl font-black text-amber-500">Up to 25%</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Student Fares</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">100%</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Transit Guidance</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#flight-quote-form"
                  className="px-6 py-3.5 rounded-full bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-black text-sm tracking-tight flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">airplane_ticket</span>
                  <span>Request Student Ticket Quote</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-600">support_agent</span>
                  <span>Talk to Travel Specialist</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-500">verified</span>
                <span>Requires valid CAS, CoE, I-20, or eVAL student visa approval document.</span>
              </div>
            </div>

            {/* Right Column: Visual Ticket Card Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-5">
                {/* Header ribbon */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                      G
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">GEES Student Flight Pass</div>
                      <div className="text-[10px] text-slate-500">Verified Partner Fare</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    EXTRA 40KG LUGGAGE
                  </span>
                </div>

                {/* Flight Route Mockup */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">DAC</div>
                      <div className="text-[11px] text-slate-500">Dhaka Hazrat Shahjalal</div>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">1 Short Transit</span>
                      <div className="w-24 h-[2px] bg-slate-300 dark:bg-slate-600 relative my-1">
                        <span className="material-symbols-outlined text-[16px] text-blue-600 absolute left-1/2 -top-2 -translate-x-1/2 rotate-90">
                          flight
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">Emirates / Qatar</span>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900 dark:text-white">LHR</div>
                      <div className="text-[11px] text-slate-500">London Heathrow</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400">Passenger Category:</span>
                    <span className="font-bold text-slate-900 dark:text-white">International Student (Tier 4)</span>
                  </div>
                </div>

                {/* Perks Checklist */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-emerald-500">check_circle</span>
                      Checked Baggage Allowance
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">2 × 23kg (46kg Total)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-emerald-500">check_circle</span>
                      Cabin Hand Carry
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">7kg + Laptop Backpack</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-emerald-500">check_circle</span>
                      Visa Delay Guarantee
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">1 Free Date Change</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-emerald-500">check_circle</span>
                      Airport Reception Service
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">Campus Shuttle Included</span>
                  </div>
                </div>

                {/* WhatsApp Quick Inquire Button */}
                <a
                  href="https://wa.me/8801805529578?text=Hello%20GEES!%20I%20would%20like%20to%20inquire%20about%20student%20flight%20ticketing%20and%20extra%20baggage%20fares."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Instant Ticket Fare Check on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. NAVIGATION TAB STRIP */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#070b19]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
            {[
              { id: 'airlines', label: 'Partner Airlines & Student Clubs', icon: 'airlines' },
              { id: 'destinations', label: 'Country Flight Guides', icon: 'public' },
              { id: 'checklist', label: 'Pre-Departure Airport Checklist', icon: 'fact_check' },
              { id: 'calculator', label: 'Student Baggage Estimator', icon: 'calculate' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* TAB 1: AIRLINES & STUDENT CLUBS */}
        {activeTab === 'airlines' && (
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Official Student Airfare Schemes & Baggage Privileges
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Most standard internet flight aggregators only show commercial luggage allowances (23kg or 30kg). GEES accesses dedicated student travel booking engines and airline student clubs to unlock up to 45kg baggage and free rebooking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AIRLINES.map((airline) => (
                <div
                  key={airline.id}
                  className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* Airline title & logo badge */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-xs">
                            {airline.logoCode}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{airline.name}</h3>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block mt-0.5">
                          {airline.studentClub}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-2xl">flight</span>
                    </div>

                    {/* Baggage Badge */}
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/70">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300">
                        Student Luggage Allowance
                      </div>
                      <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5">
                        {airline.baggageAllowance}
                      </div>
                    </div>

                    {/* Discount & Policy Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-blue-600 shrink-0 mt-0.5">percent</span>
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Fare Discount: </span>
                          <span className="text-slate-600 dark:text-slate-400">{airline.discountRange}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-purple-600 shrink-0 mt-0.5">edit_calendar</span>
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Date Rebooking: </span>
                          <span className="text-slate-600 dark:text-slate-400">{airline.dateChangePolicy}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-slate-500 shrink-0 mt-0.5">hub</span>
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Hub & Transit: </span>
                          <span className="text-slate-600 dark:text-slate-400">{airline.popularHubs}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bullet Perks */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Key Student Perks:
                      </div>
                      <ul className="space-y-1">
                        {airline.perks.map((p, i) => (
                          <li key={i} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[13px] text-emerald-500 shrink-0 mt-0.5">check</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href="#flight-quote-form"
                      onClick={() => setFormData((prev) => ({ ...prev, airlinePreference: airline.name }))}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Select {airline.name} for Quote</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: COUNTRY FLIGHT GUIDES */}
        {activeTab === 'destinations' && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Country-by-Country Student Flight Logistics
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Understand transit rules, arrival windows, baggage standards, and airport immigration procedures for each key destination.
              </p>
            </div>

            {/* Country Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => setSelectedDestination(d.code)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedDestination === d.code
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{d.flag}</span>
                  <span>{d.country}</span>
                </button>
              ))}
            </div>

            {/* Selected Destination Detailed Card */}
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentDest.flag}</span>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Flying to {currentDest.country}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Average flight time: {currentDest.avgFlightDuration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800">
                    Standard Baggage: {currentDest.baggageStandard}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Major Airports */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">location_on</span>
                    Major Destination Hub Airports
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentDest.majorAirports.map((ap, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/80 dark:border-slate-600"
                      >
                        {ap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Airlines */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">airlines</span>
                    Recommended Carriers for Students
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentDest.recommendedAirlines.map((al, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/80 dark:border-slate-600"
                      >
                        {al}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Transit Visa Advisory */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/70 space-y-2">
                  <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-outlined text-[18px] text-amber-600">warning</span>
                    Transit Visa & Airside Clearance Warning
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentDest.transitVisaNote}
                  </p>
                </div>

                {/* Arrival Window Recommendation */}
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/70 space-y-2">
                  <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">calendar_month</span>
                    Recommended Arrival Timing Window
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentDest.arrivalWindowRecommendation}
                  </p>
                </div>
              </div>

              {/* Free Airport Pickup Note */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">airport_shuttle</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                      Airport Reception & University Accommodation Shuttle
                    </div>
                    <div className="text-xs text-emerald-800 dark:text-emerald-300">
                      GEES coordinates directly with your university international office to schedule official campus pickup representatives.
                    </div>
                  </div>
                </div>

                <a
                  href="#flight-quote-form"
                  onClick={() => setFormData((prev) => ({ ...prev, destinationCountry: currentDest.country }))}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap transition-colors"
                >
                  Book for {currentDest.country}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRE-DEPARTURE CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Essential First-Time Student Traveler Airport Checklist
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Follow this comprehensive checklist to ensure you glide through security, transit gates, and destination border control smoothly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category 1: Hand-Carry Cabin Bag */}
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-blue-600 text-2xl">backpack</span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Hand-Carry Cabin Bag</h3>
                    <div className="text-[10px] text-slate-400">NEVER put these in checked luggage</div>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Original Passport & Visa</strong> (plus 3 physical photocopies)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>University CAS / CoE / I-20 / eVAL</strong> and official offer letter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Financial Proof Documents</strong> (bank solvency, tuition receipts)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Medical & Tuberculosis (TB) Certificate</strong> where applicable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Laptop, Phone & Universal Travel Power Adapter</strong> (UK/AUS plug)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Small Cash in Local Currency</strong> ($200–$300 AUD/GBP/USD) for emergency taxis</span>
                  </li>
                </ul>
              </div>

              {/* Category 2: Checked Luggage Guidelines */}
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-amber-500 text-2xl">luggage</span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Checked Baggage Rules</h3>
                    <div className="text-[10px] text-slate-400">Strict airline weight & packing laws</div>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>TSA-Approved Luggage Locks</strong> with distinct bright luggage tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Vacuum Storage Bags</strong> to compress heavy winter coats & beddings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Properly Sealed Spices / Food Items</strong> (commercially packaged only; declaration required for Australia)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-rose-500 text-[16px] shrink-0 mt-0.5">cancel</span>
                    <span><strong>NO Powerbanks or Spare Lithium Batteries</strong> in checked bags (cabin only!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>One Formal Outfit & Graduation Dress</strong> for campus orientation ceremonies</span>
                  </li>
                </ul>
              </div>

              {/* Category 3: Border Control & Transit */}
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-purple-600 text-2xl">verified_user</span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Immigration & Transit</h3>
                    <div className="text-[10px] text-slate-400">What to expect upon disembarking</div>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Layover Transit Gates:</strong> Check departure monitors immediately upon entering transit halls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Immigration Interview:</strong> State clearly you are entering as a full-time student at your university</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Accommodation Address:</strong> Have the exact address of your student hall / hostel printed out</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Local SIM Card / eSIM:</strong> Set up data connectivity at airport terminal arrival exit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>GEES Emergency Helpline:</strong> Save our counselor numbers on your phone before flight takeoff</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LUGGAGE ESTIMATOR WIDGET */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Interactive Student Luggage Weight Estimator
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                First-time students consistently underestimate packing weight. Tally your essential belongings below to calculate if a 40kg or 45kg student ticket is required.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                
                {/* Winter Coats */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Heavy Winter Jackets / Coats</span>
                    <span className="text-blue-600 font-extrabold">{luggageBoxes.winterCoats} pcs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={luggageBoxes.winterCoats}
                    onChange={(e) => setLuggageBoxes({ ...luggageBoxes, winterCoats: Number(e.target.value) })}
                    className="w-full mt-3 accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">~1.8 kg each</div>
                </div>

                {/* Suits & Formals */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Formal Suits & Blazers</span>
                    <span className="text-blue-600 font-extrabold">{luggageBoxes.formalSuits} sets</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={luggageBoxes.formalSuits}
                    onChange={(e) => setLuggageBoxes({ ...luggageBoxes, formalSuits: Number(e.target.value) })}
                    className="w-full mt-3 accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">~1.5 kg each</div>
                </div>

                {/* Shoes */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Shoes & Boots (Pairs)</span>
                    <span className="text-blue-600 font-extrabold">{luggageBoxes.shoesPairs} pairs</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={luggageBoxes.shoesPairs}
                    onChange={(e) => setLuggageBoxes({ ...luggageBoxes, shoesPairs: Number(e.target.value) })}
                    className="w-full mt-3 accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">~1.2 kg per pair</div>
                </div>

                {/* Textbooks */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Academic Reference Books</span>
                    <span className="text-blue-600 font-extrabold">{luggageBoxes.textbooks} books</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={luggageBoxes.textbooks}
                    onChange={(e) => setLuggageBoxes({ ...luggageBoxes, textbooks: Number(e.target.value) })}
                    className="w-full mt-3 accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">~1.4 kg each</div>
                </div>

                {/* Spices & Dry Food */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Cultural Spices & Packed Snacks</span>
                    <span className="text-blue-600 font-extrabold">{luggageBoxes.spicesFoodKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={luggageBoxes.spicesFoodKg}
                    onChange={(e) => setLuggageBoxes({ ...luggageBoxes, spicesFoodKg: Number(e.target.value) })}
                    className="w-full mt-3 accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Sealed pantry goods</div>
                </div>

                {/* Electronics & Gadgets */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Cables, Hard Drives & Accessories</span>
                    <span className="text-blue-600 font-extrabold">{luggageBoxes.electronicsKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={luggageBoxes.electronicsKg}
                    onChange={(e) => setLuggageBoxes({ ...luggageBoxes, electronicsKg: Number(e.target.value) })}
                    className="w-full mt-3 accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Adapters, cords, peripherals</div>
                </div>

              </div>

              {/* Luggage Calculation Result Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                    Estimated Total Luggage Weight
                  </div>
                  <div className="text-3xl sm:text-4xl font-black">
                    {estimatedLuggageKg.toFixed(1)} kg
                  </div>
                  <p className="text-xs text-blue-100 max-w-md">
                    {estimatedLuggageKg > 30 ? (
                      <span className="font-semibold text-amber-300">
                        ⚠️ Regular commercial tickets (30kg) will incur hefty excess luggage fees (often $40–$60 per extra kg at airport check-in counter). You definitely need a 40kg–45kg student fare ticket.
                      </span>
                    ) : (
                      <span>
                        A standard 30kg or 35kg ticket will suffice, but reserving a 40kg student ticket gives peace of mind.
                      </span>
                    )}
                  </p>
                </div>

                <a
                  href="#flight-quote-form"
                  className="px-6 py-3.5 rounded-full bg-[#fbb034] hover:bg-[#f59e0b] text-slate-950 font-black text-xs whitespace-nowrap shadow-sm transition-all"
                >
                  Book 40kg+ Student Fare Now
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. INTERACTIVE FLIGHT QUOTE REQUEST FORM */}
      <section id="flight-quote-form" className="py-16 bg-white dark:bg-[#0b1329] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-10">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs">
              Instant Ticket Reservation Quote
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Request Your Discounted Student Flight Ticket
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Submit your tentative travel dates and target university. Our certified ticketing counselors will check verified student fare rates across Emirates, Qatar, Singapore Airlines, and direct routes.
            </p>
          </div>

          <div className="bg-[#f8fafc] dark:bg-[#070b19] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
            {formSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Student Ticket Inquiry Received!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Thank you, <strong>{formData.studentName || 'Student'}</strong>! Our flight ticketing coordinator is pulling the lowest available student club rates and baggage allotments for your route. We will reach you via WhatsApp / email within 2 hours.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="px-6 py-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Submit Another Quote Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Student Full Name (as per Passport) *
                    </label>
                    <input
                      type="text"
                      required
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tanvir@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Phone Number (WhatsApp Active) *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1800 000000"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Destination Country */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Destination Country *
                    </label>
                    <select
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="United States">United States</option>
                      <option value="Germany">Germany & Schengen Europe</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Other">Other Destination</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Departure Airport */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Origin Airport
                    </label>
                    <input
                      type="text"
                      name="departureCity"
                      value={formData.departureCity}
                      onChange={handleInputChange}
                      placeholder="e.g. Dhaka (DAC) or Chittagong (CGP)"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Arrival Airport */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Destination Airport
                    </label>
                    <input
                      type="text"
                      name="destinationAirport"
                      value={formData.destinationAirport}
                      onChange={handleInputChange}
                      placeholder="e.g. London Heathrow (LHR)"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Departure Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tentative Departure Date
                    </label>
                    <input
                      type="date"
                      name="preferredDepartureDate"
                      value={formData.preferredDepartureDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Preferred Airline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Airline Preference
                    </label>
                    <select
                      name="airlinePreference"
                      value={formData.airlinePreference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Any Best Student Fare">Any Best Student Fare (Lowest Rate)</option>
                      <option value="Emirates">Emirates (40kg luggage)</option>
                      <option value="Qatar Airways">Qatar Airways (Student Club)</option>
                      <option value="Singapore Airlines">Singapore Airlines</option>
                      <option value="Malaysia Airlines">Malaysia Airlines (Up to 45kg)</option>
                      <option value="Turkish Airlines">Turkish Airlines</option>
                      <option value="Biman Direct">Biman Direct (LHR / MAN / YYZ)</option>
                    </select>
                  </div>

                  {/* Passenger Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Travel Party
                    </label>
                    <select
                      name="passengerType"
                      value={formData.passengerType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Student (Solo)">Student (Solo Traveler)</option>
                      <option value="Student + Parent / Companion">Student + Accompanying Parent</option>
                      <option value="Group of 3+ Students">Group of 3+ Peers (Cohort Discount)</option>
                    </select>
                  </div>

                  {/* Baggage Priority */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Luggage Requirement
                    </label>
                    <select
                      name="extraBaggageNeeded"
                      value={formData.extraBaggageNeeded}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="40kg+ Student Allowance Required">40kg+ Student Allowance (Recommended)</option>
                      <option value="45kg - 46kg Maximum Checked Baggage">45kg - 46kg Maximum Allowance</option>
                      <option value="Standard 30kg is fine">Standard 30kg is sufficient</option>
                    </select>
                  </div>
                </div>

                {/* University Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target University / College (for Campus Pickup Coordination)
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleInputChange}
                    placeholder="e.g. University of Manchester, Taylor’s University, Deakin University"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Special Inquiries (e.g. Dietary meals, wheelchair support, transit hotels)
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Let us know if you need student cohort grouping or special assistance..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-black text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>Submit Request for Lowest Student Fare Quote</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    🔒 No payment required now. You will receive multiple airline options to review and compare before ticketing.
                  </p>
                </div>

              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 bg-[#f8fafc] dark:bg-[#070b19]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions (Student Flight Ticketing)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Clear answers regarding student fares, luggage rules, date changes, and transit visas.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is an airline "Student Fare" and how is it different from regular commercial tickets?',
                a: 'A student fare is a specialized discounted ticket tier provided by airlines for registered international students. It typically features 40kg to 45kg baggage allowance (instead of 23–30kg), 1 complimentary date change if visa processing gets delayed, and lower cancellation penalties.'
              },
              {
                q: 'What documents do I need to prove eligibility for student fares and baggage?',
                a: 'You must hold a valid student visa or an official university admission confirmation document such as a CAS letter (UK), CoE (Australia), I-20 (USA), or eVAL approval letter (Malaysia), alongside a student ID or university enrollment letter.'
              },
              {
                q: 'What happens if my visa gets delayed after I book my flight ticket?',
                a: 'This is the #1 reason why students book through GEES. All our negotiated student tickets include flexible date modification terms. If your visa has not arrived 7 days before departure, we submit proof of pending visa to rebook your flight date with zero airline penalty fees.'
              },
              {
                q: 'Do I need a transit visa if I have a layover in Dubai, Doha, Singapore, or Istanbul?',
                a: 'If you remain airside within the international transit terminal of DXB (Dubai), DOH (Doha), SIN (Singapore), or IST (Istanbul) and your onward flight departs within 24 hours on the same ticket, you DO NOT require a transit visa. However, if your transit is via the United States or certain European Schengen airports, special transit visas may be mandatory.'
              },
              {
                q: 'Can parents traveling with the student get companion flight discounts?',
                a: 'Yes! Programs like Qatar Airways Student Club and Malaysia Airlines MHexplorer provide Companion Passes, allowing accompanying parents or spouses to enjoy discounted fares on the outbound journey.'
              },
              {
                q: 'Does GEES provide airport pickup in the destination country?',
                a: 'Yes. For Malaysia, our GEES Kuala Lumpur staff coordinates directly at KLIA. For the UK, Australia, USA, and Canada, we register you for your university’s dedicated student welcome airport shuttle or arrange vetted private transfers to your student halls.'
              }
            ].map((item, idx) => (
              <details
                key={idx}
                className="group bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 cursor-pointer"
              >
                <summary className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between list-none">
                  <span>{item.q}</span>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform text-[20px]">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRE-FOOTER CTA STRIP */}
      <section className="py-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h3 className="text-2xl font-black">Ready to Take Off? Speak with a Travel Counselor</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Get personalized route planning, companion fares, university group departures, and guaranteed student baggage allowances today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/8801805529578?text=Hello%20GEES!%20I%20would%20like%20to%20book%20a%20student%20flight%20ticket%20with%20extra%20baggage."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp Flight Desk</span>
            </a>
            <button
              type="button"
              onClick={onBackToHome}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
