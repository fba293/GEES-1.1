/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Single Source of Truth for Approved Qualification / Education Level Options
 */

import { Course, University } from '../types/index.ts';

export const APPROVED_QUALIFICATIONS = [
  "All Levels",
  "School Education",
  "O-Level / IGCSE / GCSE",
  "A-Level",
  "Pre-University",
  "Foundation",
  "Certificate",
  "Diploma",
  "Advanced Diploma",
  "Vocational Education & Training (VET)",
  "Bachelor's Degree (Undergraduate)",
  "Postgraduate Diploma",
  "Master's Degree (Postgraduate)",
  "MBA",
  "PhD / Doctorate",
  "Professional Qualifications",
  "English Language Courses",
  "University Pathway Programmes",
] as const;

export type ApprovedQualification = (typeof APPROVED_QUALIFICATIONS)[number];

/**
 * The 17 specific qualifications (excluding "All Levels") in the exact approved order.
 */
export const SPECIFIC_QUALIFICATIONS = APPROVED_QUALIFICATIONS.slice(1) as readonly Exclude<
  ApprovedQualification,
  "All Levels"
>[];

/**
 * Normalizes any legacy or current qualification identifier to the canonical ApprovedQualification.
 */
export function normalizeQualification(raw?: string): ApprovedQualification {
  if (!raw) return "All Levels";
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "all" || lower === "all levels" || lower === "any" || lower === "any level" || lower === "all study levels") {
    return "All Levels";
  }

  // Exact match against APPROVED_QUALIFICATIONS (case-insensitive)
  const exact = APPROVED_QUALIFICATIONS.find((q) => q.toLowerCase() === lower);
  if (exact) return exact;

  // Legacy aliases mapping
  if (lower === "school" || lower.includes("school education")) return "School Education";
  if (lower.includes("o-level") || lower.includes("igcse") || lower.includes("gcse")) return "O-Level / IGCSE / GCSE";
  if (lower === "a-level" || lower === "a-levels" || lower === "a level") return "A-Level";
  if (lower.includes("pre-university") || lower.includes("pre-u")) return "Pre-University";
  if (lower.includes("pathway")) return "University Pathway Programmes";
  if (lower.includes("foundation")) return "Foundation";
  if (lower.includes("advanced diploma") || lower === "advanced-diploma") return "Advanced Diploma";
  if (lower.includes("postgraduate diploma") || lower === "pgdip") return "Postgraduate Diploma";
  if (lower.includes("diploma")) return "Diploma";
  if (lower.includes("certificate")) return "Certificate";
  if (lower.includes("vocational") || lower.includes("vet")) return "Vocational Education & Training (VET)";
  if (
    lower === "undergrad" ||
    lower === "undergraduate" ||
    lower === "bachelor" ||
    lower.includes("bachelor") ||
    lower.includes("undergraduate")
  ) {
    return "Bachelor's Degree (Undergraduate)";
  }
  if (lower === "mba") return "MBA";
  if (
    lower === "postgrad" ||
    lower === "postgraduate" ||
    lower === "master" ||
    lower === "masters" ||
    lower.includes("master") ||
    lower.includes("postgraduate")
  ) {
    return "Master's Degree (Postgraduate)";
  }
  if (lower === "doctorate" || lower === "phd" || lower.includes("phd") || lower.includes("doctor")) {
    return "PhD / Doctorate";
  }
  if (lower.includes("professional")) return "Professional Qualifications";
  if (lower.includes("english")) return "English Language Courses";

  return "All Levels";
}

/**
 * Determines whether a Course matches a selected qualification option.
 */
export function matchesCourseQualification(course: Course, selectedOption: string): boolean {
  const canonical = normalizeQualification(selectedOption);
  if (canonical === "All Levels") return true;

  const lvl = (course.level || "").toLowerCase();
  const title = (course.title || "").toLowerCase();
  const dept = (course.department || "").toLowerCase();
  const overview = (course.overview || "").toLowerCase();
  const entry = (course.entryRequirements || "").toLowerCase();
  const uniType = (course.universityType || "").toLowerCase();
  const accred = (course.accreditations || []).join(" ").toLowerCase();
  const combined = `${title} ${dept} ${overview} ${entry} ${uniType} ${accred}`;

  switch (canonical) {
    case "School Education":
      return (
        lvl === "school-education" ||
        lvl === "a-level" ||
        lvl === "foundation" ||
        combined.includes("school") ||
        combined.includes("secondary") ||
        combined.includes("high school") ||
        combined.includes("college") ||
        combined.includes("foundation")
      );

    case "O-Level / IGCSE / GCSE":
      return (
        lvl === "o-level" ||
        lvl === "foundation" ||
        lvl === "diploma" ||
        lvl === "certificate" ||
        combined.includes("o-level") ||
        combined.includes("igcse") ||
        combined.includes("gcse") ||
        combined.includes("foundation") ||
        combined.includes("diploma")
      );

    case "A-Level":
      return (
        lvl === "a-level" ||
        lvl === "foundation" ||
        combined.includes("a-level") ||
        combined.includes("a-levels") ||
        combined.includes("stpm") ||
        (lvl === "undergraduate" && (entry.includes("a-level") || combined.includes("hons")))
      );

    case "Pre-University":
      return (
        lvl === "foundation" ||
        lvl === "a-level" ||
        lvl === "diploma" ||
        lvl === "certificate" ||
        combined.includes("pre-university") ||
        combined.includes("foundation") ||
        combined.includes("pathway") ||
        combined.includes("gateway") ||
        combined.includes("diploma")
      );

    case "Foundation":
      return (
        lvl === "foundation" ||
        lvl === "diploma" ||
        combined.includes("foundation") ||
        combined.includes("gateway") ||
        combined.includes("pathway")
      );

    case "Certificate":
      return (
        lvl === "certificate" ||
        lvl === "diploma" ||
        combined.includes("certificate") ||
        combined.includes("certification") ||
        combined.includes("cmi") ||
        combined.includes("accredited")
      );

    case "Diploma":
      return (
        lvl === "diploma" ||
        lvl === "advanced-diploma" ||
        title.includes("diploma") ||
        combined.includes("diploma")
      );

    case "Advanced Diploma":
      return (
        lvl === "advanced-diploma" ||
        lvl === "diploma" ||
        title.includes("diploma") ||
        combined.includes("advanced diploma") ||
        combined.includes("executive")
      );

    case "Vocational Education & Training (VET)":
      return (
        lvl === "diploma" ||
        lvl === "certificate" ||
        lvl === "advanced-diploma" ||
        combined.includes("vocational") ||
        combined.includes("vet") ||
        combined.includes("practical") ||
        combined.includes("technical") ||
        combined.includes("training") ||
        combined.includes("diploma") ||
        combined.includes("applied")
      );

    case "Bachelor's Degree (Undergraduate)":
      return (
        lvl === "undergraduate" ||
        title.includes("bachelor") ||
        title.includes("bsc") ||
        title.includes("ba ") ||
        title.includes("bba") ||
        title.includes("btech") ||
        title.includes("beng")
      );

    case "Postgraduate Diploma":
      return (
        (lvl === "postgraduate" && (title.includes("diploma") || title.includes("executive"))) ||
        combined.includes("postgraduate diploma") ||
        combined.includes("graduate diploma")
      );

    case "Master's Degree (Postgraduate)":
      return (
        lvl === "postgraduate" ||
        title.includes("master") ||
        title.includes("msc") ||
        title.includes("ma ") ||
        title.includes("mba") ||
        title.includes("postgraduate")
      );

    case "MBA":
      return (
        title.includes("mba") ||
        title.includes("master of business administration") ||
        (lvl === "postgraduate" && dept.includes("business"))
      );

    case "PhD / Doctorate":
      return (
        lvl === "doctorate" ||
        title.includes("phd") ||
        title.includes("doctor") ||
        title.includes("research") ||
        uniType.includes("research") ||
        combined.includes("phd") ||
        combined.includes("doctorate")
      );

    case "Professional Qualifications":
      return (
        combined.includes("acca") ||
        combined.includes("cima") ||
        combined.includes("cpa") ||
        combined.includes("cmi") ||
        combined.includes("chartered") ||
        combined.includes("professional") ||
        combined.includes("executive") ||
        combined.includes("industry certification")
      );

    case "English Language Courses":
      return (
        combined.includes("english") ||
        combined.includes("ielts") ||
        combined.includes("language") ||
        (typeof course.ieltsRequirement === "number" && course.ieltsRequirement <= 6.0)
      );

    case "University Pathway Programmes":
      return (
        lvl === "foundation" ||
        lvl === "diploma" ||
        combined.includes("pathway") ||
        combined.includes("foundation") ||
        combined.includes("progression") ||
        combined.includes("gateway") ||
        title.includes("diploma")
      );

    default:
      return true;
  }
}

/**
 * Determines whether a University matches a selected qualification option.
 */
export function matchesUniversityQualification(uni: University, selectedOption: string): boolean {
  const canonical = normalizeQualification(selectedOption);
  if (canonical === "All Levels") return true;

  const progStr = (uni.popularPrograms || []).join(" ").toLowerCase();
  const typeStr = (uni.type || "").toLowerCase();
  const descStr = (uni.description || "").toLowerCase();
  const taglineStr = (uni.tagline || "").toLowerCase();
  const combined = `${progStr} ${typeStr} ${descStr} ${taglineStr}`;

  switch (canonical) {
    case "School Education":
    case "O-Level / IGCSE / GCSE":
    case "A-Level":
    case "Pre-University":
    case "Foundation":
    case "University Pathway Programmes":
      return (
        combined.includes("foundation") ||
        combined.includes("pathway") ||
        combined.includes("diploma") ||
        combined.includes("college") ||
        combined.includes("undergraduate") ||
        combined.includes("bachelor") ||
        typeStr.includes("university")
      );

    case "Certificate":
    case "Diploma":
    case "Advanced Diploma":
    case "Vocational Education & Training (VET)":
      return (
        combined.includes("diploma") ||
        combined.includes("certificate") ||
        combined.includes("foundation") ||
        combined.includes("vocational") ||
        combined.includes("applied") ||
        combined.includes("technology") ||
        typeStr.includes("college") ||
        typeStr.includes("institute") ||
        typeStr.includes("private") ||
        typeStr.includes("university")
      );

    case "Bachelor's Degree (Undergraduate)":
      return (
        progStr.includes("bachelor") ||
        progStr.includes("btech") ||
        progStr.includes("bsc") ||
        progStr.includes("ba ") ||
        progStr.includes("bba") ||
        typeStr.includes("university") ||
        typeStr.includes("college") ||
        typeStr.includes("institute")
      );

    case "Postgraduate Diploma":
    case "Master's Degree (Postgraduate)":
      return (
        progStr.includes("master") ||
        progStr.includes("mba") ||
        progStr.includes("msc") ||
        progStr.includes("postgraduate") ||
        progStr.includes("diploma") ||
        typeStr.includes("university")
      );

    case "MBA":
      return (
        progStr.includes("mba") ||
        progStr.includes("business") ||
        progStr.includes("management") ||
        progStr.includes("finance") ||
        typeStr.includes("university")
      );

    case "PhD / Doctorate":
      return (
        progStr.includes("phd") ||
        progStr.includes("doctor") ||
        progStr.includes("research") ||
        typeStr.includes("research") ||
        typeStr.includes("public") ||
        Number(uni.qsRank2027) > 0
      );

    case "Professional Qualifications":
      return (
        combined.includes("accounting") ||
        combined.includes("business") ||
        combined.includes("engineering") ||
        combined.includes("professional") ||
        combined.includes("accredited") ||
        typeStr.includes("university")
      );

    case "English Language Courses":
      return (
        combined.includes("english") ||
        combined.includes("language") ||
        (uni.minIeltsScore || 6.0) <= 6.5
      );

    default:
      return true;
  }
}

/**
 * Formats a course's internal `level` field into the official GEES qualification label.
 */
export function formatQualificationLabel(rawLevel: string, courseTitle?: string): ApprovedQualification {
  const titleLower = (courseTitle || "").toLowerCase();
  const lvlLower = (rawLevel || "").toLowerCase();

  if (lvlLower === "postgraduate") {
    if (titleLower.includes("mba") && !titleLower.includes("msc / mba")) {
      return "MBA";
    }
    if (titleLower.includes("postgraduate diploma") || titleLower.includes("pgdip")) {
      return "Postgraduate Diploma";
    }
    return "Master's Degree (Postgraduate)";
  }

  return normalizeQualification(rawLevel);
}
