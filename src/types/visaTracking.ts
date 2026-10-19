/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Student Visa Tracking Types & Interfaces
 */

export type EMGSStageStatus = 'completed' | 'in_progress' | 'pending' | 'action_required' | 'rejected';

export interface EMGSStageItem {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  date?: string;
  status: EMGSStageStatus;
  percentageBenchmark?: number;
  actionNote?: string;
}

export interface EMGSApplicationRecord {
  passportNumberMasked: string;
  nationality: string;
  nationalityCode: string;
  applicantNameMasked?: string;
  applicationNumber?: string;
  institutionName?: string;
  currentStatusTitle: string;
  currentPercentage: number;
  lastUpdatedTimestamp: string;
  stages: EMGSStageItem[];
  isClosedOrRejected?: boolean;
  officialTrackerUrl: string;
  dataSource: 'official_emgs' | 'educational_demo' | 'manual_verification';
}

export interface NationalityOption {
  code: string;
  name: string;
  flag?: string;
  emgsCode?: string;
}

export interface VisaTrackingFormValues {
  passportNumber: string;
  nationalityCode: string;
  consentAgreed: boolean;
}

export interface VisaTrackingResponse {
  success: boolean;
  data?: EMGSApplicationRecord;
  error?: string;
  errorCode?: 'INVALID_PASSPORT' | 'NOT_FOUND' | 'PROVIDER_UNAVAILABLE' | 'CONSENT_REQUIRED' | 'RATE_LIMITED' | 'TIMEOUT' | 'DIRECT_VERIFICATION_REQUIRED';
  suggestOfficialPortal?: boolean;
}
