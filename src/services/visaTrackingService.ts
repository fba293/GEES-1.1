/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Student Visa Tracking Service Abstraction
 *
 * Implements strict security, privacy masking, input validation, and
 * official EMGS Government Tracker integration adherence.
 */

import {
  NationalityOption,
  VisaTrackingFormValues,
  VisaTrackingResponse,
  EMGSApplicationRecord
} from '../types/visaTracking.ts';

export const OFFICIAL_EMGS_TRACKER_URL = 'https://visa.educationmalaysia.gov.my/emgs/application/searchForm/';
export const OFFICIAL_EMGS_HOME_URL = 'https://visa.educationmalaysia.gov.my/';

/**
 * Standard list of nationalities commonly applying to Malaysian universities,
 * with Bangladesh as the primary default.
 */
export const POPULAR_NATIONALITIES: NationalityOption[] = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AX', name: 'Åland Islands' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh', emgsCode: 'BGD' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan', emgsCode: 'BTN' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'VG', name: 'British Virgin Islands' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia', emgsCode: 'KHM' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China', emgsCode: 'CHN' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo - Brazzaville' },
  { code: 'CD', name: 'Congo - Kinshasa' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: 'Côte d’Ivoire' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt', emgsCode: 'EGY' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia', emgsCode: 'ETH' },
  { code: 'FK', name: 'Falkland Islands' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana', emgsCode: 'GHA' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island and McDonald Islands' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong SAR China' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India', emgsCode: 'IND' },
  { code: 'ID', name: 'Indonesia', emgsCode: 'IDN' },
  { code: 'IR', name: 'Iran', emgsCode: 'IRN' },
  { code: 'IQ', name: 'Iraq', emgsCode: 'IRQ' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan', emgsCode: 'KAZ' },
  { code: 'KE', name: 'Kenya', emgsCode: 'KEN' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'XK', name: 'Kosovo' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos', emgsCode: 'LAO' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macau SAR China' },
  { code: 'MK', name: 'Macedonia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives', emgsCode: 'MDV' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar (Burma)', emgsCode: 'MMR' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal', emgsCode: 'NPL' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'AN', name: 'Netherlands Antilles' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria', emgsCode: 'NGA' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan', emgsCode: 'PAK' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestinian Territories' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines', emgsCode: 'PHL' },
  { code: 'PN', name: 'Pitcairn Islands' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'Saint Barthélemy' },
  { code: 'SH', name: 'Saint Helena' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'MF', name: 'Saint Martin' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'São Tomé and Príncipe' },
  { code: 'SA', name: 'Saudi Arabia', emgsCode: 'SAU' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia', emgsCode: 'SOM' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka', emgsCode: 'LKA' },
  { code: 'SD', name: 'Sudan', emgsCode: 'SDN' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria', emgsCode: 'SYR' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania', emgsCode: 'TZA' },
  { code: 'TH', name: 'Thailand', emgsCode: 'THA' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks and Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda', emgsCode: 'UGA' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates', emgsCode: 'ARE' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UM', name: 'U.S. Minor Outlying Islands' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
  { code: 'UZ', name: 'Uzbekistan', emgsCode: 'UZB' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VA', name: 'Vatican City' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam', emgsCode: 'VNM' },
  { code: 'WF', name: 'Wallis and Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen', emgsCode: 'YEM' },
  { code: 'ZM', name: 'Zambia', emgsCode: 'ZMB' },
  { code: 'ZW', name: 'Zimbabwe', emgsCode: 'ZWE' }
];

/**
 * Validates and normalizes passport input safely.
 * Returns null if valid, or a descriptive error message if invalid.
 */
export function validatePassportNumber(rawPassport: string): { isValid: boolean; normalized: string; error?: string } {
  if (!rawPassport || typeof rawPassport !== 'string') {
    return { isValid: false, normalized: '', error: 'Passport number is required.' };
  }

  // Remove spaces, hyphens and enforce uppercase
  const normalized = rawPassport.trim().replace(/[\s\-]/g, '').toUpperCase();

  if (normalized.length < 1 || normalized.length > 16) {
    return { isValid: false, normalized, error: 'Passport number must be up to 16 characters.' };
  }

  // Must consist only of standard alphanumeric characters (no special characters or script injection)
  const isAlphaNumeric = /^[A-Z0-9]+$/.test(normalized);
  if (!isAlphaNumeric) {
    return { isValid: false, normalized, error: 'Passport number can only contain letters and numbers.' };
  }

  return { isValid: true, normalized };
}

/**
 * Masks a sensitive passport identifier for safe display on screen and in logs.
 * e.g., A03450221 -> A034****21
 */
export function maskPassportNumber(passport: string): string {
  const clean = passport.trim().toUpperCase();
  if (clean.length <= 4) return '****';
  const firstFour = clean.slice(0, Math.min(4, Math.floor(clean.length / 2)));
  const lastTwo = clean.slice(-2);
  return `${firstFour}${'*'.repeat(Math.max(2, clean.length - firstFour.length - lastTwo.length))}${lastTwo}`;
}

/**
 * Generates an educational sample EMGS timeline matching the verified Malaysian Immigration workflow.
 * Clearly labeled as an educational model to explain progress stages.
 */
export function getEducationalSampleRecord(passportNumber: string, nationalityName: string = 'Bangladesh'): EMGSApplicationRecord {
  const masked = maskPassportNumber(passportNumber);
  
  return {
    passportNumberMasked: masked,
    nationality: nationalityName,
    nationalityCode: 'BGD',
    applicantNameMasked: 'SAMPLE APPLICANT (DEMO)',
    applicationNumber: '101365023',
    institutionName: 'Top Partner University, Malaysia',
    currentStatusTitle: 'Application completed',
    currentPercentage: 100,
    lastUpdatedTimestamp: 'Recent Update',
    isClosedOrRejected: false,
    officialTrackerUrl: OFFICIAL_EMGS_TRACKER_URL,
    dataSource: 'educational_demo',
    stages: [
      {
        id: 'st-7',
        stageNumber: 7,
        title: 'Application completed',
        description: 'Your Student Pass endorsement has been completed and verified.',
        date: '09/07/2026',
        status: 'completed',
        percentageBenchmark: 100
      },
      {
        id: 'st-6',
        stageNumber: 6,
        title: 'Student Pass Issued by Immigration',
        description: 'Your Student Pass has been officially issued by the Immigration Department of Malaysia.',
        date: '30/06/2026',
        status: 'completed',
        percentageBenchmark: 95
      },
      {
        id: 'st-5',
        stageNumber: 5,
        title: 'Supporting Letter Provided to Institution',
        description: 'The EMGS supporting letter for your Student Pass has been issued for State Immigration endorsement.',
        date: '01/04/2026',
        status: 'completed',
        percentageBenchmark: 85
      },
      {
        id: 'st-4',
        stageNumber: 4,
        title: 'Visa Approval Letter (VAL) Issued',
        description: 'Immigration approved your eVAL (~70%). You can now apply for your Single Entry Visa (SEV) and travel.',
        date: '31/03/2026',
        status: 'completed',
        percentageBenchmark: 70
      },
      {
        id: 'st-3',
        stageNumber: 3,
        title: 'In Progress with EMGS & Immigration',
        description: 'Issuance of your Student Pass eligibility and vetting is in progress with EMGS and Immigration.',
        date: '30/03/2026',
        status: 'completed',
        percentageBenchmark: 35
      },
      {
        id: 'st-2',
        stageNumber: 2,
        title: 'Document checking in progress',
        description: 'Academic certificates, photo, passport copy, and medical declaration are being vetted by EMGS officers.',
        date: '28/03/2026',
        status: 'completed',
        percentageBenchmark: 15
      },
      {
        id: 'st-1',
        stageNumber: 1,
        title: 'Application Received & Student Record Created',
        description: 'Your host university created your STARS application record and paid processing fees to EMGS.',
        date: '26/03/2026',
        status: 'completed',
        percentageBenchmark: 5
      }
    ]
  };
}

/**
 * Main Visa Tracking service handler.
 * Respects data privacy, does not fabricate unverified personal records,
 * and seamlessly provides official EMGS portal access.
 */
export async function trackVisaApplication(values: VisaTrackingFormValues): Promise<VisaTrackingResponse> {
  const { passportNumber, nationalityCode, consentAgreed } = values;

  // 1. Consent verification
  if (!consentAgreed) {
    return {
      success: false,
      errorCode: 'CONSENT_REQUIRED',
      error: 'Please acknowledge the privacy consent to look up your visa status.'
    };
  }

  // 2. Format validation
  const validation = validatePassportNumber(passportNumber);
  if (!validation.isValid) {
    return {
      success: false,
      errorCode: 'INVALID_PASSPORT',
      error: validation.error || 'Invalid passport number format.'
    };
  }

  // 3. Request execution via backend API proxy (cPanel /api/track-visa or configured proxy)
  const configuredEndpoint = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_EMGS_API_ENDPOINT : null;
  const endpointUrl = configuredEndpoint ? `${configuredEndpoint}/track` : '/api/track-visa';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        passportNumber: validation.normalized,
        nationalityCode
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result = await response.json().catch(() => null);

    if (response.ok && result?.success && result?.data) {
      return {
        success: true,
        data: result.data
      };
    }

    // Backend returned a structured status (e.g. direct verification required or institutional token pending)
    if (result && !result.success) {
      return {
        success: false,
        errorCode: result.errorCode || 'DIRECT_VERIFICATION_REQUIRED',
        error: result.error || 'Live status lookup requires direct Malaysian government portal verification.',
        suggestOfficialPortal: result.suggestOfficialPortal ?? true
      };
    }

    throw new Error(`Gateway returned HTTP ${response.status}`);
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.info('EMGS direct gateway status check note:', err?.message || err);

    const isTimeout = err?.name === 'AbortError';

    return {
      success: false,
      errorCode: isTimeout ? 'TIMEOUT' : 'PROVIDER_UNAVAILABLE',
      error: isTimeout
        ? 'The verification request timed out. Please verify your visa directly on the official EMGS portal.'
        : 'Official EMGS live status lookup requires direct Malaysian government portal verification. Check your status directly on the official tracker.',
      suggestOfficialPortal: true
    };
  }
}
