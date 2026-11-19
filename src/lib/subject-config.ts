/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES & IDP Complete Study Abroad Subject Directory Configuration
 * Includes all IDP Study Abroad Categories, Sub-Subjects, and GEES Academic Disciplines
 */

import { Course } from '../types/index.ts';

export interface IdpSubjectCategory {
  letter: string;
  category: string;
  subSubjects: string[];
}

/**
 * Structured IDP Study Abroad Subjects Directory (A-Z)
 */
export const IDP_SUBJECT_CATEGORIES: IdpSubjectCategory[] = [
  {
    letter: 'A',
    category: 'Agriculture Sciences',
    subSubjects: [
      'Pest And Weed Control',
      'Plant Sciences',
      'Horticulture and Viticulture',
      'Crop Sciences',
      'Wool Science',
    ],
  },
  {
    letter: 'A',
    category: 'Agriculture, Environmental & Rel Studies',
    subSubjects: ['Fisheries studies'],
  },
  {
    letter: 'A',
    category: 'All Pharmacy',
    subSubjects: ['Pharmaceutical Science'],
  },
  {
    letter: 'A',
    category: 'Art and Design',
    subSubjects: [
      'Product Design',
      'Fashion Merchandise',
      'Visual arts',
      'Industrial Design',
      'Graphic and Design Studies',
      'Fashion Design',
      'Art History',
      'Video Game development',
      'Digital production',
    ],
  },
  {
    letter: 'A',
    category: 'Arts, Humanities And Social Science',
    subSubjects: ['Human Welfare Studies And Services'],
  },
  {
    letter: 'A',
    category: 'Arts, Visual and Performing',
    subSubjects: ['Computer Graphics'],
  },
  {
    letter: 'B',
    category: 'Biological and Biomedical Sciences',
    subSubjects: ['Pharmacology', 'Botany'],
  },
  {
    letter: 'B',
    category: 'Biological and life Sciences',
    subSubjects: ['Forensics'],
  },
  {
    letter: 'B',
    category: 'Building and Architecture',
    subSubjects: [
      'Technology',
      'Planning',
      'Landscape design and architecture',
      'Town planning',
    ],
  },
  {
    letter: 'B',
    category: 'Business',
    subSubjects: ['Psychology', 'Business Administration'],
  },
  {
    letter: 'B',
    category: 'Business, Commerce And Management',
    subSubjects: ['Tourism'],
  },
  {
    letter: 'C',
    category: 'Chemistry',
    subSubjects: ['Chemical lab technology'],
  },
  {
    letter: 'C',
    category: 'Computer and Information Sciences',
    subSubjects: ['Systems Engineering', 'Statistics'],
  },
  {
    letter: 'C',
    category: 'Computing and IT',
    subSubjects: ['Information technology'],
  },
  {
    letter: 'E',
    category: 'Economics',
    subSubjects: ['Qualitative Economics'],
  },
  {
    letter: 'E',
    category: 'Engineering',
    subSubjects: ['Electronic Equipment Servicing', 'Food Science'],
  },
  {
    letter: 'E',
    category: 'English Language and Literature',
    subSubjects: ['Creative Writing'],
  },
  {
    letter: 'E',
    category: 'English Language Studies',
    subSubjects: ['Business English'],
  },
  {
    letter: 'E',
    category: 'Environmental Science',
    subSubjects: ['Environmental Management', 'Conservation'],
  },
  {
    letter: 'F',
    category: 'Family and Consumer Sciences',
    subSubjects: ['Dietetics'],
  },
  {
    letter: 'F',
    category: 'Food, Hospitality And Personal Services',
    subSubjects: ['Food And Hospitality'],
  },
  {
    letter: 'G',
    category: 'General Primary And Secondary Education',
    subSubjects: ['Social Skills Programmes'],
  },
  {
    letter: 'H',
    category: 'Health and Medicine',
    subSubjects: [
      'Physiotherapy',
      'Rehabilitation Therapy',
      'Human Movement',
      'Geriatric Studies',
      'Sports Science',
      'Surgery',
      'Animal and Veterinary Studies',
      'Disability Studies',
      'First Aid',
      'Speech Pathology',
      'Allied Health Science',
      'Occupational Health & Safety',
      'Podiatry',
      'Psychiatry and Neurosurgery',
      'Occupational Therapy',
      'Speech Therapy',
    ],
  },
  {
    letter: 'H',
    category: 'Health Professions & Clinical Sciences',
    subSubjects: ['Acupuncture'],
  },
  {
    letter: 'H',
    category: 'Health, Medicine And Veterinary Studies',
    subSubjects: ['Public Health', 'Radiography'],
  },
  {
    letter: 'H',
    category: 'History',
    subSubjects: ['Heritage', 'General History'],
  },
  {
    letter: 'H',
    category: 'Hospitality and Tourism',
    subSubjects: ['Hotel and hospitality', 'Bakery', 'Beauty'],
  },
  {
    letter: 'L',
    category: 'Language and Culture',
    subSubjects: ['Philosophy and Religious Studies'],
  },
  {
    letter: 'L',
    category: 'Law and Legal Studies',
    subSubjects: ['Justice studies', 'Police Studies'],
  },
  {
    letter: 'M',
    category: 'Marketing, Media and Communication',
    subSubjects: ['Written Communication', 'Mass Communication'],
  },
  {
    letter: 'N',
    category: 'Natural And Physical Sciences',
    subSubjects: ['Earth Sciences'],
  },
  {
    letter: 'N',
    category: 'Natural Resources and Conservation',
    subSubjects: ['Environmental Engineering'],
  },
  {
    letter: 'P',
    category: 'Personal and Culinary Services',
    subSubjects: ['Cosmetology'],
  },
  {
    letter: 'P',
    category: 'Philosophy & Religion',
    subSubjects: ['Religious Studies'],
  },
  {
    letter: 'P',
    category: 'Physical Sciences',
    subSubjects: ['Physics', 'Theoretical Physics'],
  },
  {
    letter: 'P',
    category: 'Political and Social Sciences',
    subSubjects: [
      'Social Justice',
      'Social Science',
      'Political Science and Policy Studies',
      'Political Science',
    ],
  },
  {
    letter: 'S',
    category: 'Social Sciences',
    subSubjects: ['International Relations', 'Sociology'],
  },
  {
    letter: 'T',
    category: 'Teaching and Education',
    subSubjects: [
      'Higher Education',
      'Counselling',
      'Curriculum and Education Studies',
      'Early Childhood Education',
      'Primary Education',
      'Secondary Education',
    ],
  },
];

const RAW_SUBJECTS: string[] = [
  // All IDP Categories & Sub-subjects from the IDP Directory
  ...IDP_SUBJECT_CATEGORIES.flatMap((group) => [group.category, ...group.subSubjects]),

  // Existing GEES Subjects & Complete IDP Study-Abroad A-Z Subjects
  'Accounting',
  'Accounting & Finance',
  'Actuarial Science',
  'Actuarial Studies',
  'Aerospace Engineering',
  'Agriculture & Environmental Forestry',
  'AI & Machine Learning',
  'Animation & Game Development',
  'Anthropology & Archaeology',
  'Applied Mathematics & Statistics',
  'Archaeology & Ancient History',
  'Architecture',
  'Architecture & Building Design',
  'Artificial Intelligence',
  'Artificial Intelligence & Data Science',
  'Astronomy',
  'Astrophysics & Astronomy',
  'Automotive & Transport Engineering',
  'Automotive Engineering',
  'Aviation',
  'Banking & Wealth Management',
  'Banking and Finance',
  'Biochemistry',
  'Biochemistry & Molecular Biology',
  'Bioengineering',
  'Bioinformatics',
  'Bioinformatics & Computational Biology',
  'Biological & Life Sciences',
  'Biology',
  'Biomedical Engineering',
  'Biomedical Science',
  'Biotechnology',
  'Building and Construction',
  'Business & Management',
  'Business Administration (BBA/MBA)',
  'Business Analytics & Intelligence',
  'Chemical Engineering',
  'Chemistry & Chemical Sciences',
  'Civil & Structural Engineering',
  'Civil Engineering',
  'Clinical Psychology',
  'Cloud Computing & DevOps',
  'Commerce',
  'Communication and Media',
  'Communications & Media Studies',
  'Computer Engineering',
  'Computer Science',
  'Computer Science & IT',
  'Construction Management',
  'Creative Writing & Literature',
  'Criminology',
  'Criminology & Criminal Justice',
  'Culinary Arts',
  'Cyber Security',
  'Cybersecurity & Digital Forensics',
  'Data Analytics',
  'Data Science',
  'Dental Surgery & Dentistry',
  'Dentistry',
  'Design Studies',
  'Digital Marketing',
  'Digital Marketing & E-Commerce',
  'Drama and Theatre',
  'Drama, Theater & Performing Arts',
  'Earth & Marine Sciences',
  'Ecology',
  'Ecology & Conservation Biology',
  'Econometrics',
  'Economics & Finance',
  'Education',
  'Education & Teaching Pedagogy',
  'Electrical & Electronic Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Energy & Environmental Engineering',
  'Energy Engineering',
  'Engineering & Technology',
  'Engineering Management',
  'English Literature',
  'English Literature & Linguistics',
  'Entrepreneurship',
  'Entrepreneurship & Innovation',
  'Environmental Science & Sustainability',
  'Event Management',
  'Event Management & PR',
  'Fashion & Textile Design',
  'Film and Television',
  'Film, Video & Television Production',
  'Finance',
  'Finance & Financial Markets',
  'Fine Arts',
  'Fine Arts & Visual Design',
  'Food Science & Human Nutrition',
  'Food Science and Technology',
  'Forensic Science',
  'Forensic Science & Criminology',
  'Forestry',
  'Game Design',
  'Game Design & Interactive Media',
  'Genetics',
  'Genetics & Genomics',
  'Geography',
  'Geology',
  'Geology & Earth Systems',
  'Geophysics',
  'Global Governance & Public Policy',
  'Graphic & UI/UX Design',
  'Graphic Design',
  'Health & Medicine',
  'Health Informatics',
  'Health Informatics & E-Health',
  'Health Management',
  'Healthcare',
  'Healthcare & Hospital Management',
  'History & International Studies',
  'Horticulture',
  'Hospitality & Tourism Management',
  'Hospitality Management',
  'Human Resource Management',
  'Human Resource Management (HRM)',
  'Human-Computer Interaction (HCI)',
  'Industrial & Systems Engineering',
  'Industrial Engineering',
  'Information Systems',
  'Information Systems & Technology',
  'Information Technology',
  'Interior Architecture & Design',
  'Interior Design',
  'International Business',
  'International Business & Trade',
  'International Law',
  'International Law & Human Rights',
  'International Relations & Diplomacy',
  'Journalism',
  'Journalism & Mass Communication',
  'Landscape Architecture',
  'Law',
  'Law & Legal Studies',
  'Liberal Arts',
  'Linguistics',
  'Logistics & Supply Chain Management',
  'Logistics and Supply Chain Management',
  'Management',
  'Manufacturing Engineering',
  'Marine Biology',
  'Marine Biology & Oceanography',
  'Marine Engineering',
  'Marketing',
  'Marketing & Brand Strategy',
  'Materials Science',
  'Materials Science & Engineering',
  'Mathematics',
  'Mechanical & Manufacturing Engineering',
  'Mechanical Engineering',
  'Mechatronics',
  'Mechatronics & Robotics Engineering',
  'Media Production & Journalism',
  'Media Studies',
  'Medical Laboratory Technology',
  'Medical Science',
  'Medical Sciences & MBBS',
  'Medicine',
  'Microbiology',
  'Microbiology & Immunology',
  'Mining Engineering',
  'Molecular Biology',
  'Multimedia',
  'Music',
  'Music Production & Sound Design',
  'Nanotechnology',
  'Nanotechnology & Advanced Materials',
  'Natural & Applied Sciences',
  'Networking',
  'Neuroscience',
  'Neuroscience & Cognitive Science',
  'Nursing',
  'Nursing & Midwifery',
  'Nutrition & Dietetics',
  'Nutrition and Dietetics',
  'Occupational Health and Safety',
  'Oceanography',
  'Oceanography & Climate Science',
  'Optometry',
  'Optometry & Vision Science',
  'Pathology',
  'Performing Arts',
  'Petroleum & Mining Engineering',
  'Petroleum Engineering',
  'Pharmaceutical Sciences',
  'Pharmacy',
  'Philosophy',
  'Philosophy & Ethics',
  'Photography',
  'Physical Education',
  'Physics & Applied Physics',
  'Physiology',
  'Physiotherapy & Sports Rehab',
  'Political Science & Public Admin',
  'Project Management',
  'Psychiatry',
  'Psychology & Behavioral Science',
  'Public Administration',
  'Public Health & Epidemiology',
  'Public Policy',
  'Public Relations',
  'Public Relations & Strategic Comm',
  'Quantity Surveying',
  'Quantity Surveying & Commercial Mgmt',
  'Real Estate',
  'Real Estate & Property Management',
  'Renewable & Clean Energy Tech',
  'Renewable Energy',
  'Robotics',
  'Robotics & Automation Engineering',
  'Social Sciences & Humanities',
  'Social Work',
  'Social Work & Community Dev',
  'Software Engineering',
  'Space Science & Satellite Tech',
  'Special Education',
  'Special Education & Inclusion',
  'Sports Management',
  'Sports Science & Kinesiology',
  'Statistics & Predictive Modeling',
  'Structural Engineering',
  'Supply Chain Management',
  'Sustainable Development',
  'Sustainable Development & Environment',
  'Teaching',
  'Telecommunication Networks',
  'Telecommunications Engineering',
  'TESOL',
  'Textile Design',
  'Theology',
  'Tourism and Hospitality',
  'Translation and Interpreting',
  'Urban Planning',
  'Urban Planning & Smart Cities',
  'Veterinary Medicine',
  'Veterinary Medicine & Animal Care',
  'Veterinary Science',
  'Vocational Education and Training',
  'Web Development',
  'Web Development & Mobile Apps',
  'Womens Health',
  'Zoology',
];

/**
 * Deduplicated, alphabetically sorted complete list of GEES + IDP Study Abroad Subjects
 */
export const ALL_IDP_SUBJECTS: string[] = Array.from(
  new Map(RAW_SUBJECTS.map((s) => [s.trim(), s.trim()])).values()
).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

/**
 * Helper to match a Course against any selected IDP or GEES subject name
 */
export function matchesCourseSubject(course: Course, selectedSubject: string): boolean {
  if (!selectedSubject || selectedSubject === 'all') return true;
  const target = selectedSubject.toLowerCase().trim();
  const title = (course.title || '').toLowerCase();
  const dept = (course.department || '').toLowerCase();
  const combined = `${title} ${dept}`;

  if (combined.includes(target)) return true;

  // Token-based semantic matching for broad or specific IDP subjects
  const stopWords = new Set(['and', 'the', 'for', 'rel', 'all', 'studies', 'science', 'sciences', 'general']);
  const tokens = target
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w));

  if (tokens.length === 0) {
    return combined.includes(target);
  }

  return tokens.some((tok) => {
    if (combined.includes(tok)) return true;
    // Domain synonym bridges so every IDP subject surfaces relevant courses
    if (['agriculture', 'pest', 'weed', 'plant', 'horticulture', 'viticulture', 'crop', 'wool', 'fisheries', 'botany', 'forestry'].includes(tok)) {
      return combined.includes('science') || combined.includes('environment') || combined.includes('biology') || combined.includes('agriculture');
    }
    if (['pharmacy', 'pharmaceutical', 'pharmacology', 'physiotherapy', 'rehabilitation', 'geriatric', 'surgery', 'veterinary', 'disability', 'speech', 'pathology', 'allied', 'podiatry', 'psychiatry', 'neurosurgery', 'occupational', 'acupuncture', 'radiography', 'dietetics', 'nutrition', 'nursing', 'medical', 'medicine', 'health', 'dentistry', 'optometry'].includes(tok)) {
      return combined.includes('health') || combined.includes('med') || combined.includes('nurs') || combined.includes('bio') || combined.includes('pharm') || combined.includes('clinical') || combined.includes('psych');
    }
    if (['art', 'arts', 'design', 'fashion', 'merchandise', 'visual', 'graphic', 'video', 'game', 'digital', 'graphics', 'media', 'creative', 'writing', 'film', 'music', 'photography', 'cosmetology', 'beauty'].includes(tok)) {
      return combined.includes('art') || combined.includes('design') || combined.includes('media') || combined.includes('comm') || combined.includes('game') || combined.includes('creative');
    }
    if (['building', 'architecture', 'landscape', 'town', 'planning', 'urban', 'construction', 'surveying'].includes(tok)) {
      return combined.includes('arch') || combined.includes('civil') || combined.includes('build') || combined.includes('design') || combined.includes('eng');
    }
    if (['business', 'commerce', 'management', 'economics', 'qualitative', 'accounting', 'finance', 'banking', 'marketing', 'entrepreneurship', 'tourism', 'hospitality', 'hotel', 'bakery', 'culinary', 'food'].includes(tok)) {
      return combined.includes('business') || combined.includes('manage') || combined.includes('econ') || combined.includes('finan') || combined.includes('market') || combined.includes('hospitality') || combined.includes('tourism') || combined.includes('mba');
    }
    if (['computer', 'computing', 'information', 'systems', 'statistics', 'software', 'cyber', 'data', 'artificial', 'intelligence', 'web', 'networking'].includes(tok)) {
      return combined.includes('comput') || combined.includes('info') || combined.includes('data') || combined.includes('soft') || combined.includes('cyber') || combined.includes('tech') || combined.includes('ai');
    }
    if (['engineering', 'electronic', 'equipment', 'servicing', 'mechanical', 'electrical', 'chemical', 'aerospace', 'automotive', 'mechatronics', 'robotics', 'petroleum', 'mining', 'environmental', 'structural', 'industrial'].includes(tok)) {
      return combined.includes('eng') || combined.includes('tech') || combined.includes('mech') || combined.includes('electr') || combined.includes('civil') || combined.includes('system');
    }
    if (['law', 'legal', 'justice', 'police', 'criminology', 'political', 'policy', 'social', 'sociology', 'international', 'relations', 'human', 'welfare', 'history', 'heritage', 'philosophy', 'religious', 'religion', 'language', 'culture', 'english', 'counselling', 'psychology'].includes(tok)) {
      return combined.includes('law') || combined.includes('social') || combined.includes('human') || combined.includes('arts') || combined.includes('psych') || combined.includes('relat') || combined.includes('polic');
    }
    if (['teaching', 'education', 'primary', 'secondary', 'curriculum', 'childhood', 'higher', 'tesol'].includes(tok)) {
      return combined.includes('educ') || combined.includes('teach') || combined.includes('social') || combined.includes('arts');
    }
    if (['chemistry', 'physics', 'theoretical', 'earth', 'natural', 'physical', 'conservation', 'forensics', 'biological', 'biomedical'].includes(tok)) {
      return combined.includes('scien') || combined.includes('bio') || combined.includes('chem') || combined.includes('phys') || combined.includes('eng');
    }
    return false;
  });
}
