/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Official Partner University Manager & Extensible Collaboration Template
 * 
 * Sourced directly from country-config.ts and the Official 2027 QS World University Rankings.
 * Strictly prevents non-partner data and displays verified 2027 QS rankings where available.
 */

import { University, Course, Campus, UniversityAccommodation, UniversityArticle } from '../types/index.ts';
import { getApprovedCountryConfig, COUNTRY_METADATA_REGISTRY, ApprovedCountryName, APPROVED_COUNTRY_NAMES } from '../lib/country-config.ts';

export interface CollaboratedUniversityEntry {
  name: string;
  country: ApprovedCountryName | string;
  city: string;
  state: string;
  established?: number;
  type?: 'Public' | 'Private' | 'Public Research' | 'University College' | 'Private College' | 'Public UAS' | 'National Agency' | string;
  qsRank2027?: string | number; // Strictly from uploaded 2027 QS World University Rankings PDF, undefined if not ranked
  websiteUrl: string;
  popularPrograms?: string[];
  intakes?: string[];
  avgTuitionAnnualUSD?: number;
  rankingNational?: number;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  featured?: boolean;
  campuses?: Campus[];
  accommodations?: UniversityAccommodation[];
  articles?: UniversityArticle[];
  customCourses?: Partial<Course>[];
}

/**
 * ============================================================================
 * OFFICIAL COLLABORATION REGISTRY
 * All partner institutions with accurate location, type, establishment year,
 * verified 2027 QS World Ranking (from PDF), and official websites.
 * ============================================================================
 */
export const COLLABORATED_UNIVERSITIES: CollaboratedUniversityEntry[] = [
  // --------------------------------------------------------------------------
  // 1. INDIA (1 University)
  // --------------------------------------------------------------------------
  {
    name: 'Assam Down Town University',
    country: 'India',
    city: 'Guwahati',
    state: 'Assam',
    established: 2010,
    type: 'Private',
    websiteUrl: 'https://adtu.in',
    popularPrograms: ['BTech Computer Science & AI', 'Bachelor of Pharmacy', 'BSc Nursing', 'MBA Healthcare Management'],
    avgTuitionAnnualUSD: 2800,
    tagline: 'Leading Northeast India university with premier allied health, engineering, and nursing faculties.',
    featured: true
  },

  // --------------------------------------------------------------------------
  // 2. UNITED KINGDOM (100 Universities & Higher Education Partners)
  // --------------------------------------------------------------------------
  { name: 'Aberystwyth University', country: 'United Kingdom', city: 'Aberystwyth', state: 'Ceredigion, Wales', established: 1872, type: 'Public Research', qsRank2027: '801-850', websiteUrl: 'https://www.aber.ac.uk' },
  { name: 'Amity University London', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2009, type: 'Private', websiteUrl: 'https://www.amitylondon.org.uk' },
  { name: 'Arts University Bournemouth', country: 'United Kingdom', city: 'Poole', state: 'Dorset', established: 1885, type: 'Public', websiteUrl: 'https://aub.ac.uk' },
  { name: 'Aston University', country: 'United Kingdom', city: 'Birmingham', state: 'West Midlands', established: 1895, type: 'Public Research', qsRank2027: 416, websiteUrl: 'https://www.aston.ac.uk', featured: true },
  { name: 'Aston University London', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2023, type: 'Public Branch', websiteUrl: 'https://www.aston.ac.uk/london', featured: true },
  { name: 'Bangor University', country: 'United Kingdom', city: 'Bangor', state: 'Gwynedd, Wales', established: 1884, type: 'Public Research', qsRank2027: 567, websiteUrl: 'https://www.bangor.ac.uk' },
  { name: 'Birkbeck University, London', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1823, type: 'Public Research', qsRank2027: 354, websiteUrl: 'https://www.bbk.ac.uk' },
  { name: 'Birmingham City University', country: 'United Kingdom', city: 'Birmingham', state: 'West Midlands', established: 1843, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.bcu.ac.uk' },
  { name: 'Bloomsbury Institute', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2002, type: 'Private', websiteUrl: 'https://www.bil.ac.uk' },
  { name: 'BPP', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1976, type: 'Private', websiteUrl: 'https://www.bpp.com' },
  { name: 'Brunel University', country: 'United Kingdom', city: 'Uxbridge', state: 'Greater London', established: 1966, type: 'Public Research', qsRank2027: 353, websiteUrl: 'https://www.brunel.ac.uk', featured: true },
  { name: 'Buckinghamshire New University', country: 'United Kingdom', city: 'High Wycombe', state: 'Buckinghamshire', established: 1891, type: 'Public', websiteUrl: 'https://www.bucks.ac.uk' },
  { name: 'Canterbury Christ Church', country: 'United Kingdom', city: 'Canterbury', state: 'Kent', established: 1962, type: 'Public', qsRank2027: '1401+', websiteUrl: 'https://www.canterbury.ac.uk' },
  { name: 'Cardiff Metropolitan University', country: 'United Kingdom', city: 'Cardiff', state: 'South Glamorgan, Wales', established: 1865, type: 'Public', websiteUrl: 'https://www.cardiffmet.ac.uk' },
  { name: 'CEG', country: 'United Kingdom', city: 'Cambridge', state: 'Cambridgeshire', established: 1952, type: 'Private College Group', websiteUrl: 'https://www.cambridgeeducationgroup.com' },
  { name: 'Coventry University', country: 'United Kingdom', city: 'Coventry', state: 'West Midlands', established: 1843, type: 'Public', qsRank2027: 581, websiteUrl: 'https://www.coventry.ac.uk', featured: true },
  { name: 'Cranfield University', country: 'United Kingdom', city: 'Cranfield', state: 'Bedfordshire', established: 1946, type: 'Public Postgraduate', websiteUrl: 'https://www.cranfield.ac.uk' },
  { name: 'David Game College', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1974, type: 'Private College', websiteUrl: 'https://www.davidgamecollege.com' },
  { name: 'De Montfort University', country: 'United Kingdom', city: 'Leicester', state: 'Leicestershire', established: 1870, type: 'Public', qsRank2027: '851-900', websiteUrl: 'https://www.dmu.ac.uk' },
  { name: 'Edge Hill University', country: 'United Kingdom', city: 'Ormskirk', state: 'Lancashire', established: 1885, type: 'Public', websiteUrl: 'https://www.edgehill.ac.uk' },
  { name: 'Edinburgh Napier University', country: 'United Kingdom', city: 'Edinburgh', state: 'Midlothian, Scotland', established: 1964, type: 'Public', qsRank2027: '801-850', websiteUrl: 'https://www.napier.ac.uk' },
  { name: 'Falmouth', country: 'United Kingdom', city: 'Falmouth', state: 'Cornwall', established: 1902, type: 'Public', websiteUrl: 'https://www.falmouth.ac.uk' },
  { name: 'Glasgow Caledonian University', country: 'United Kingdom', city: 'Glasgow', state: 'Lanarkshire, Scotland', established: 1875, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.gcu.ac.uk' },
  { name: 'Heriot-Watt University', country: 'United Kingdom', city: 'Edinburgh', state: 'Midlothian, Scotland', established: 1821, type: 'Public Research', qsRank2027: 325, websiteUrl: 'https://www.hw.ac.uk' },
  { name: 'INTO', country: 'United Kingdom', city: 'Brighton', state: 'East Sussex', established: 2005, type: 'Private Pathway Group', websiteUrl: 'https://www.intostudy.com' },
  { name: 'Kaplan', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1938, type: 'Private Pathway Group', websiteUrl: 'https://www.kaplanpathways.com' },
  { name: 'Keele University', country: 'United Kingdom', city: 'Keele', state: 'Staffordshire', established: 1949, type: 'Public Research', qsRank2027: '801-850', websiteUrl: 'https://www.keele.ac.uk' },
  { name: "King's College London", country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1829, type: 'Public Research', qsRank2027: 37, websiteUrl: 'https://www.kcl.ac.uk', featured: true },
  { name: 'Kingston University', country: 'United Kingdom', city: 'Kingston upon Thames', state: 'Greater London', established: 1899, type: 'Public', qsRank2027: 686, websiteUrl: 'https://www.kingston.ac.uk' },
  { name: 'Lancaster University', country: 'United Kingdom', city: 'Lancaster', state: 'Lancashire', established: 1964, type: 'Public Research', qsRank2027: 164, websiteUrl: 'https://www.lancaster.ac.uk', featured: true },
  { name: 'Leeds Trinity University', country: 'United Kingdom', city: 'Leeds', state: 'West Yorkshire', established: 1966, type: 'Public', websiteUrl: 'https://www.leedstrinity.ac.uk' },
  { name: 'Liverpool John Moores University', country: 'United Kingdom', city: 'Liverpool', state: 'Merseyside', established: 1823, type: 'Public', qsRank2027: '851-900', websiteUrl: 'https://www.ljmu.ac.uk' },
  { name: 'London College of Contemporary Arts', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2010, type: 'Private College', websiteUrl: 'https://www.lcca.org.uk' },
  { name: 'London Metropolitan University', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1848, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.londonmet.ac.uk' },
  { name: 'London School of Commerce', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1999, type: 'Private College', websiteUrl: 'https://www.lsclondon.co.uk' },
  { name: 'London Southbank', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1892, type: 'Public', qsRank2027: '901-950', websiteUrl: 'https://www.lsbu.ac.uk' },
  { name: 'Loughborough University', country: 'United Kingdom', city: 'Loughborough', state: 'Leicestershire', established: 1909, type: 'Public Research', qsRank2027: 203, websiteUrl: 'https://www.lboro.ac.uk', featured: true },
  { name: 'Malvern House International', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2000, type: 'Private College', websiteUrl: 'https://www.malvernhouse.com' },
  { name: 'Middlesex University', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1878, type: 'Public', qsRank2027: '901-950', websiteUrl: 'https://www.mdx.ac.uk' },
  { name: 'NAVITAS', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1994, type: 'Private Pathway Group', websiteUrl: 'https://www.navitas.com' },
  { name: 'Northeastern University', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2012, type: 'Private', qsRank2027: 385, websiteUrl: 'https://www.nulondon.ac.uk' },
  { name: 'Northumbria University', country: 'United Kingdom', city: 'Newcastle upon Tyne', state: 'Tyne and Wear', established: 1880, type: 'Public', qsRank2027: 528, websiteUrl: 'https://www.northumbria.ac.uk' },
  { name: 'Norwich University of the Arts', country: 'United Kingdom', city: 'Norwich', state: 'Norfolk', established: 1845, type: 'Public', websiteUrl: 'https://www.nua.ac.uk' },
  { name: 'Nottingham Trent University', country: 'United Kingdom', city: 'Nottingham', state: 'Nottinghamshire', established: 1843, type: 'Public', qsRank2027: 639, websiteUrl: 'https://www.ntu.ac.uk' },
  { name: 'Oxford International Education Group (OIEG)', country: 'United Kingdom', city: 'Oxford', state: 'Oxfordshire', established: 1991, type: 'Private Pathway Group', websiteUrl: 'https://www.oxfordinternational.com' },
  { name: 'QA', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1985, type: 'Private Higher Education Partner', websiteUrl: 'https://www.qa.com' },
  { name: 'Queens University of Belfast', country: 'United Kingdom', city: 'Belfast', state: 'Northern Ireland', established: 1845, type: 'Public Research', qsRank2027: 174, websiteUrl: 'https://www.qub.ac.uk', featured: true },
  { name: 'Ravensbourne University', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1962, type: 'Public', websiteUrl: 'https://www.ravensbourne.ac.uk', featured: true },
  { name: 'Regent College London', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2010, type: 'Private College', websiteUrl: 'https://www.rcl.ac.uk' },
  { name: 'Regent University', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1984, type: 'Private', websiteUrl: 'https://www.regents.ac.uk' },
  { name: 'Richmond American University', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1972, type: 'Private', websiteUrl: 'https://www.richmond.ac.uk' },
  { name: 'Robert Gordon University', country: 'United Kingdom', city: 'Aberdeen', state: 'Aberdeenshire, Scotland', established: 1965, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.rgu.ac.uk' },
  { name: 'Roehampton University', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1841, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.roehampton.ac.uk' },
  { name: 'Sheffield Hallam', country: 'United Kingdom', city: 'Sheffield', state: 'South Yorkshire', established: 1843, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.shu.ac.uk' },
  { name: 'Solent University', country: 'United Kingdom', city: 'Southampton', state: 'Hampshire', established: 1856, type: 'Public', websiteUrl: 'https://www.solent.ac.uk' },
  { name: "St. George's University", country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1752, type: 'Public Research', qsRank2027: 361, websiteUrl: 'https://www.sgul.ac.uk' },
  { name: 'Staffordshire University', country: 'United Kingdom', city: 'Stoke-on-Trent', state: 'Staffordshire', established: 1906, type: 'Public', websiteUrl: 'https://www.staffs.ac.uk' },
  { name: 'Swansea University', country: 'United Kingdom', city: 'Swansea', state: 'West Glamorgan, Wales', established: 1920, type: 'Public Research', qsRank2027: 322, websiteUrl: 'https://www.swansea.ac.uk' },
  { name: 'Study Group', country: 'United Kingdom', city: 'Brighton', state: 'East Sussex', established: 1994, type: 'Private Pathway Group', websiteUrl: 'https://www.studygroup.com' },
  { name: 'Teesside University', country: 'United Kingdom', city: 'Middlesbrough', state: 'North Yorkshire', established: 1930, type: 'Public', websiteUrl: 'https://www.tees.ac.uk' },
  { name: 'University of Reading', country: 'United Kingdom', city: 'Reading', state: 'Berkshire', established: 1892, type: 'Public Research', qsRank2027: 196, websiteUrl: 'https://www.reading.ac.uk' },
  { name: 'University College Birmingham', country: 'United Kingdom', city: 'Birmingham', state: 'West Midlands', established: 1957, type: 'Public', websiteUrl: 'https://www.ucb.ac.uk' },
  { name: 'University for the Creative Arts', country: 'United Kingdom', city: 'Canterbury', state: 'Surrey & Kent', established: 1866, type: 'Public', websiteUrl: 'https://www.uca.ac.uk' },
  { name: 'University of Aberdeen', country: 'United Kingdom', city: 'Aberdeen', state: 'Aberdeenshire, Scotland', established: 1495, type: 'Public Research', qsRank2027: 288, websiteUrl: 'https://www.abdn.ac.uk' },
  { name: 'University of Bedfordshire', country: 'United Kingdom', city: 'Luton', state: 'Bedfordshire', established: 1882, type: 'Public', websiteUrl: 'https://www.beds.ac.uk' },
  { name: 'University of Bolton', country: 'United Kingdom', city: 'Bolton', state: 'Greater Manchester', established: 1824, type: 'Public', websiteUrl: 'https://www.bolton.ac.uk' },
  { name: 'University of Bradford', country: 'United Kingdom', city: 'Bradford', state: 'West Yorkshire', established: 1832, type: 'Public Research', qsRank2027: 497, websiteUrl: 'https://www.bradford.ac.uk' },
  { name: 'University of Buckingham', country: 'United Kingdom', city: 'Buckingham', state: 'Buckinghamshire', established: 1973, type: 'Private', websiteUrl: 'https://www.buckingham.ac.uk' },
  { name: 'University of Central Lancashire', country: 'United Kingdom', city: 'Preston', state: 'Lancashire', established: 1828, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.uclan.ac.uk' },
  { name: 'University of Chester', country: 'United Kingdom', city: 'Chester', state: 'Cheshire', established: 1839, type: 'Public', websiteUrl: 'https://www.chester.ac.uk' },
  { name: 'University of Derby', country: 'United Kingdom', city: 'Derby', state: 'Derbyshire', established: 1851, type: 'Public', qsRank2027: '1201-1400', websiteUrl: 'https://www.derby.ac.uk' },
  { name: 'University of Dundee', country: 'United Kingdom', city: 'Dundee', state: 'Angus, Scotland', established: 1881, type: 'Public Research', qsRank2027: 447, websiteUrl: 'https://www.dundee.ac.uk' },
  { name: 'University of East Anglia', country: 'United Kingdom', city: 'Norwich', state: 'Norfolk', established: 1963, type: 'Public Research', qsRank2027: 381, websiteUrl: 'https://www.uea.ac.uk' },
  { name: 'University of East London', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1898, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.uel.ac.uk' },
  { name: 'University of Essex', country: 'United Kingdom', city: 'Colchester', state: 'Essex', established: 1964, type: 'Public Research', qsRank2027: 438, websiteUrl: 'https://www.essex.ac.uk' },
  { name: 'University of Gloucestershire', country: 'United Kingdom', city: 'Cheltenham', state: 'Gloucestershire', established: 1834, type: 'Public', websiteUrl: 'https://www.glos.ac.uk' },
  { name: 'University of Greenwich', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1890, type: 'Public', qsRank2027: '791-800', websiteUrl: 'https://www.gre.ac.uk' },
  { name: 'University of Hertfordshire', country: 'United Kingdom', city: 'Hatfield', state: 'Hertfordshire', established: 1952, type: 'Public', qsRank2027: '851-900', websiteUrl: 'https://www.herts.ac.uk' },
  { name: 'University of Huddersfield', country: 'United Kingdom', city: 'Huddersfield', state: 'West Yorkshire', established: 1825, type: 'Public Research', qsRank2027: 521, websiteUrl: 'https://www.hud.ac.uk' },
  { name: 'University of Hull', country: 'United Kingdom', city: 'Hull', state: 'East Yorkshire', established: 1927, type: 'Public Research', qsRank2027: 575, websiteUrl: 'https://www.hull.ac.uk' },
  { name: 'University of Hull London (CEG)', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2015, type: 'Public / CEG Partner', websiteUrl: 'https://www.hull.ac.uk' },
  { name: 'University of Kent', country: 'United Kingdom', city: 'Canterbury', state: 'Kent', established: 1965, type: 'Public Research', qsRank2027: 415, websiteUrl: 'https://www.kent.ac.uk' },
  { name: 'University of Law', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 1876, type: 'Private', websiteUrl: 'https://www.law.ac.uk' },
  { name: 'University of Lincoln', country: 'United Kingdom', city: 'Lincoln', state: 'Lincolnshire', established: 1861, type: 'Public', qsRank2027: '851-900', websiteUrl: 'https://www.lincoln.ac.uk' },
  { name: 'University of Northampton', country: 'United Kingdom', city: 'Northampton', state: 'Northamptonshire', established: 1924, type: 'Public', qsRank2027: '1201-1400', websiteUrl: 'https://www.northampton.ac.uk' },
  { name: 'University of Plymouth', country: 'United Kingdom', city: 'Plymouth', state: 'Devon', established: 1862, type: 'Public', qsRank2027: 691, websiteUrl: 'https://www.plymouth.ac.uk' },
  { name: 'University of Portsmouth', country: 'United Kingdom', city: 'Portsmouth', state: 'Hampshire', established: 1869, type: 'Public', qsRank2027: 662, websiteUrl: 'https://www.port.ac.uk' },
  { name: 'University of Salford', country: 'United Kingdom', city: 'Salford', state: 'Greater Manchester', established: 1896, type: 'Public Research', qsRank2027: '1001-1200', websiteUrl: 'https://www.salford.ac.uk' },
  { name: 'University of South Wales', country: 'United Kingdom', city: 'Cardiff & Newport', state: 'Glamorgan, Wales', established: 1841, type: 'Public', qsRank2027: '1201-1400', websiteUrl: 'https://www.southwales.ac.uk' },
  { name: 'University of Strathclyde', country: 'United Kingdom', city: 'Glasgow', state: 'Lanarkshire, Scotland', established: 1796, type: 'Public Research', qsRank2027: 230, websiteUrl: 'https://www.strath.ac.uk' },
  { name: 'University of Suffolk', country: 'United Kingdom', city: 'Ipswich', state: 'Suffolk', established: 2007, type: 'Public', websiteUrl: 'https://www.uos.ac.uk' },
  { name: 'University of Sunderland', country: 'United Kingdom', city: 'Sunderland', state: 'Tyne and Wear', established: 1901, type: 'Public', websiteUrl: 'https://www.sunderland.ac.uk' },
  { name: 'University of Sunderland London', country: 'United Kingdom', city: 'London', state: 'Greater London', established: 2012, type: 'Public Branch', websiteUrl: 'https://london.sunderland.ac.uk' },
  { name: 'University of Surrey', country: 'United Kingdom', city: 'Guildford', state: 'Surrey', established: 1966, type: 'Public Research', qsRank2027: 246, websiteUrl: 'https://www.surrey.ac.uk' },
  { name: 'Ulster University', country: 'United Kingdom', city: 'Belfast', state: 'Northern Ireland', established: 1968, type: 'Public Research', qsRank2027: 595, websiteUrl: 'https://www.ulster.ac.uk', featured: true },
  { name: 'University of Sussex', country: 'United Kingdom', city: 'Brighton', state: 'East Sussex', established: 1961, type: 'Public Research', qsRank2027: 273, websiteUrl: 'https://www.sussex.ac.uk' },
  { name: 'University of Wolverhampton', country: 'United Kingdom', city: 'Wolverhampton', state: 'West Midlands', established: 1827, type: 'Public', qsRank2027: '1001-1200', websiteUrl: 'https://www.wlv.ac.uk' },
  { name: 'University of York', country: 'United Kingdom', city: 'York', state: 'North Yorkshire', established: 1963, type: 'Public Research', qsRank2027: 158, websiteUrl: 'https://www.york.ac.uk', featured: true },
  { name: 'UWE Bristol', country: 'United Kingdom', city: 'Bristol', state: 'Gloucestershire', established: 1595, type: 'Public', qsRank2027: '761-770', websiteUrl: 'https://www.uwe.ac.uk' },
  { name: 'Worcester University', country: 'United Kingdom', city: 'Worcester', state: 'Worcestershire', established: 1946, type: 'Public', websiteUrl: 'https://www.worcester.ac.uk' },
  { name: 'Wrexham University', country: 'United Kingdom', city: 'Wrexham', state: 'Wrexham, Wales', established: 1887, type: 'Public', websiteUrl: 'https://wrexham.ac.uk' },

  // --------------------------------------------------------------------------
  // 3. CYPRUS (8 Universities & Colleges)
  // --------------------------------------------------------------------------
  { name: 'University of Central Lancashire (UCLan)', country: 'Cyprus', city: 'Larnaca', state: 'Larnaca District', established: 2012, type: 'Private UK Branch', websiteUrl: 'https://www.uclancyprus.ac.cy', featured: true },
  { name: 'American University', country: 'Cyprus', city: 'Nicosia', state: 'Nicosia District', established: 2014, type: 'Private', websiteUrl: 'https://www.auc.ac.cy' },
  { name: 'Alexander College', country: 'Cyprus', city: 'Larnaca', state: 'Larnaca District', established: 1991, type: 'Private College', websiteUrl: 'https://alexander.ac.cy' },
  { name: 'Neapolis University Pafos', country: 'Cyprus', city: 'Paphos', state: 'Paphos District', established: 2010, type: 'Private', websiteUrl: 'https://www.nup.ac.cy', featured: true },
  { name: 'Uni of Limassol', country: 'Cyprus', city: 'Limassol', state: 'Limassol District', established: 2022, type: 'Private', websiteUrl: 'https://www.uol.ac.cy' },
  { name: 'Mesoyis College', country: 'Cyprus', city: 'Limassol', state: 'Limassol District', established: 1998, type: 'Private College', websiteUrl: 'https://mesoyios.ac.cy' },
  { name: 'Philips University', country: 'Cyprus', city: 'Nicosia', state: 'Nicosia District', established: 1978, type: 'Private', websiteUrl: 'https://philipsuni.ac.cy' },
  { name: 'CDA College', country: 'Cyprus', city: 'Nicosia', state: 'Nicosia District', established: 1976, type: 'Private College', websiteUrl: 'https://www.cdacollege.ac.cy' },

  // --------------------------------------------------------------------------
  // 4. FINLAND (14 Universities & UAS)
  // --------------------------------------------------------------------------
  { name: 'University of Helsinki', country: 'Finland', city: 'Helsinki', state: 'Uusimaa', established: 1640, type: 'Public Research', qsRank2027: 123, websiteUrl: 'https://www.helsinki.fi', featured: true },
  { name: 'Aalto University', country: 'Finland', city: 'Espoo', state: 'Uusimaa', established: 2010, type: 'Public Research', qsRank2027: 126, websiteUrl: 'https://www.aalto.fi', featured: true },
  { name: 'Tampere University', country: 'Finland', city: 'Tampere', state: 'Pirkanmaa', established: 2019, type: 'Public Research', qsRank2027: 436, websiteUrl: 'https://www.tuni.fi', featured: true },
  { name: 'University of Turku', country: 'Finland', city: 'Turku', state: 'Southwest Finland', established: 1920, type: 'Public Research', qsRank2027: 398, websiteUrl: 'https://www.utu.fi' },
  { name: 'LUT University', country: 'Finland', city: 'Lappeenranta', state: 'South Karelia', established: 1969, type: 'Public Research', qsRank2027: 390, websiteUrl: 'https://www.lut.fi' },
  { name: 'University of Oulu', country: 'Finland', city: 'Oulu', state: 'Northern Ostrobothnia', established: 1958, type: 'Public Research', qsRank2027: 360, websiteUrl: 'https://www.oulu.fi' },
  { name: 'Åbo Akademi University', country: 'Finland', city: 'Turku', state: 'Southwest Finland', established: 1918, type: 'Public Research', qsRank2027: 670, websiteUrl: 'https://www.abo.fi' },
  { name: 'University of Eastern Finland', country: 'Finland', city: 'Joensuu & Kuopio', state: 'North Karelia', established: 2010, type: 'Public Research', qsRank2027: 626, websiteUrl: 'https://www.uef.fi' },
  { name: 'Arcada University of Applied Sciences', country: 'Finland', city: 'Helsinki', state: 'Uusimaa', established: 1996, type: 'Public UAS', websiteUrl: 'https://www.arcada.fi' },
  { name: 'Metropolia University of Applied Sciences', country: 'Finland', city: 'Helsinki', state: 'Uusimaa', established: 2007, type: 'Public UAS', websiteUrl: 'https://www.metropolia.fi', featured: true },
  { name: 'Finnish National Agency for Education (EDUFI)', country: 'Finland', city: 'Helsinki', state: 'Uusimaa', established: 1991, type: 'National Agency', websiteUrl: 'https://www.oph.fi' },
  { name: 'Finnish University', country: 'Finland', city: 'Helsinki', state: 'Uusimaa', established: 2000, type: 'Public Consortium', websiteUrl: 'https://www.studyinfinland.fi' },
  { name: 'University of Jyväskylä', country: 'Finland', city: 'Jyväskylä', state: 'Central Finland', established: 1863, type: 'Public Research', qsRank2027: 521, websiteUrl: 'https://www.jyu.fi' },
  { name: 'Hanken School of Economics', country: 'Finland', city: 'Helsinki', state: 'Uusimaa', established: 1909, type: 'Public Business School', websiteUrl: 'https://www.hanken.fi' },
  { name: 'Centria University of Applied Sciences', country: 'Finland', city: 'Kokkola', state: 'Central Ostrobothnia', established: 1991, type: 'Public UAS', websiteUrl: 'https://net.centria.fi' },

  // --------------------------------------------------------------------------
  // 5. GREECE (6 Universities & Colleges)
  // --------------------------------------------------------------------------
  { name: 'Hellenic American University', country: 'Greece', city: 'Athens', state: 'Attica', established: 2004, type: 'Private', websiteUrl: 'https://www.hauniv.edu', featured: true },
  { name: 'City Unit College', country: 'Greece', city: 'Athens', state: 'Attica', established: 1989, type: 'Private College', websiteUrl: 'https://www.cityu.gr' },
  { name: 'Perrotis College', country: 'Greece', city: 'Thessaloniki', state: 'Central Macedonia', established: 1996, type: 'Private College', websiteUrl: 'https://www.perrotiscollege.edu.gr' },
  { name: 'Athens International College', country: 'Greece', city: 'Athens', state: 'Attica', established: 2002, type: 'Private College', websiteUrl: 'https://aic.edu.gr' },
  { name: 'York University', country: 'Greece', city: 'Thessaloniki', state: 'Central Macedonia', established: 1993, type: 'Private Campus (CITY College)', websiteUrl: 'https://york.citycollege.eu', featured: true },
  { name: 'AAS College', country: 'Greece', city: 'Thessaloniki', state: 'Central Macedonia', established: 1990, type: 'Private College', websiteUrl: 'https://www.aas.gr' },

  // --------------------------------------------------------------------------
  // 6. MALAYSIA (43 Universities & Colleges) - Enriched with en.your-uni.com Data
  // --------------------------------------------------------------------------
  { 
    name: 'INTI International University & Colleges', 
    country: 'Malaysia', 
    city: 'Nilai', 
    state: 'Negeri Sembilan', 
    established: 1986, 
    type: 'Private', 
    qsRank2027: 406, 
    websiteUrl: 'https://newinti.edu.my', 
    featured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=200&auto=format&fit=crop',
    popularPrograms: ['BSc (Hons) Computer Science & AI', 'Bachelor of Business Administration', 'Bachelor of Biotechnology', 'Master of International Business'],
    avgTuitionAnnualUSD: 4500,
    intakes: ['January', 'May', 'August']
  },
  { 
    name: "Taylor's University", 
    country: 'Malaysia', 
    city: 'Subang Jaya', 
    state: 'Selangor', 
    established: 1969, 
    type: 'Private', 
    qsRank2027: 272, 
    websiteUrl: 'https://university.taylors.edu.my', 
    featured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&auto=format&fit=crop',
    popularPrograms: ['Bachelor of Business (Hons)', 'Bachelor of Culinary Management', 'Bachelor of Software Engineering', 'Master of Management'],
    avgTuitionAnnualUSD: 8200,
    intakes: ['March', 'August']
  },
  { 
    name: 'SEGi University & Colleges', 
    country: 'Malaysia', 
    city: 'Kota Damansara', 
    state: 'Selangor', 
    established: 1977, 
    type: 'Private', 
    qsRank2027: '701-710', 
    websiteUrl: 'https://www.segi.edu.my',
    popularPrograms: ['Bachelor of Medicine & Surgery (MBBS)', 'Bachelor of Business Management', 'Bachelor of Early Childhood Education'],
    avgTuitionAnnualUSD: 4800,
    intakes: ['February', 'June', 'October']
  },
  { 
    name: 'Sunway University', 
    country: 'Malaysia', 
    city: 'Bandar Sunway', 
    state: 'Selangor', 
    established: 2004, 
    type: 'Private', 
    qsRank2027: 354, 
    websiteUrl: 'https://sunwayuniversity.edu.my', 
    featured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&auto=format&fit=crop',
    popularPrograms: ['BSc (Hons) Accounting & Finance', 'BSc (Hons) Computer Science', 'BSc (Hons) Actuarial Studies', 'Master of Data Science'],
    avgTuitionAnnualUSD: 7800,
    intakes: ['January', 'March', 'August']
  },
  { 
    name: 'Management & Science University (MSU)', 
    country: 'Malaysia', 
    city: 'Shah Alam', 
    state: 'Selangor', 
    established: 2001, 
    type: 'Private', 
    qsRank2027: 608, 
    websiteUrl: 'https://www.msu.edu.my',
    popularPrograms: ['Bachelor of Biomedical Science', 'Bachelor of International Business', 'Bachelor of Graphic Design'],
    avgTuitionAnnualUSD: 5200,
    intakes: ['February', 'July', 'September']
  },
  { 
    name: 'Asia Pacific University of Technology & Innovation (APU)', 
    country: 'Malaysia', 
    city: 'Kuala Lumpur', 
    state: 'Federal Territory', 
    established: 1993, 
    type: 'Private', 
    qsRank2027: 528, 
    websiteUrl: 'https://www.apu.edu.my', 
    featured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=1200&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=200&auto=format&fit=crop',
    popularPrograms: ['BSc (Hons) Information Technology', 'BSc (Hons) Cybersecurity', 'BSc (Hons) Artificial Intelligence', 'MSc Data Science & AI'],
    avgTuitionAnnualUSD: 6400,
    intakes: ['March', 'May', 'July', 'October', 'November']
  },
  { name: 'Universiti Tun Abdul Razak (UNIRAZAK)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 1997, type: 'Private', websiteUrl: 'https://www.unirazak.edu.my' },
  { name: 'Universiti Kuala Lumpur (UniKL)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2002, type: 'Private', qsRank2027: '1401+', websiteUrl: 'https://www.unikl.edu.my' },
  { name: 'Limkokwing University', country: 'Malaysia', city: 'Cyberjaya', state: 'Selangor', established: 1991, type: 'Private', websiteUrl: 'https://www.limkokwing.net' },
  { name: 'University of Cyberjaya (UoC)', country: 'Malaysia', city: 'Cyberjaya', state: 'Selangor', established: 2005, type: 'Private', qsRank2027: '951-1000', websiteUrl: 'https://cyberjaya.edu.my' },
  
  // 11. CITY UNIVERSITY MALAYSIA (Enriched from en.your-uni.com)
  { 
    name: 'City University Malaysia', 
    country: 'Malaysia', 
    city: 'Petaling Jaya', 
    state: 'Selangor', 
    established: 1984, 
    type: 'Private', 
    websiteUrl: 'https://www.city.edu.my',
    bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&auto=format&fit=crop',
    tagline: 'Premier metropolitan university in Petaling Jaya specializing in Business Administration, Accounting, IT, and Creative Design.',
    description: 'City University Malaysia (City U), founded in 1984, is an accredited higher education institution recognized by the Malaysian Qualifications Agency (MQA) and the Ministry of Higher Education (MOHE). Located in Petaling Jaya near Kuala Lumpur, City U delivers market-driven undergraduate degrees, master programs, and foundation pathways with strong corporate linkages and affordable tuition.',
    featured: true,
    popularPrograms: [
      'Bachelor of Business Administration (Hons)',
      'Bachelor of Accounting (Hons)',
      'Bachelor of Information Technology (Hons)',
      'Bachelor of Graphic Design (Hons)',
      'Master of Business Administration (MBA)',
      'Diploma in Business Administration'
    ],
    intakes: ['January', 'March', 'May', 'July', 'September', 'October'],
    avgTuitionAnnualUSD: 3600,
    campuses: [
      { id: 'campus-cityu-1', name: 'Petaling Jaya Main Campus (Menara City U)', city: 'Petaling Jaya', stateOrProvince: 'Selangor', country: 'Malaysia', isMainCampus: true },
      { id: 'campus-cityu-2', name: 'Johor Bahru Regional Campus', city: 'Johor Bahru', stateOrProvince: 'Johor', country: 'Malaysia', isMainCampus: false }
    ],
    accommodations: [
      {
        id: 'acc-cityu-1',
        name: 'City U On-Campus Hostel',
        type: 'On-Campus Hostel',
        distanceToCampus: '0 km (Inside Menara City U)',
        monthlyRentMYR: 'MYR 450 - 650 / month',
        monthlyRentUSD: '$100 - $145 / month',
        roomTypes: ['Twin Sharing Room (Air-Conditioned)', 'Single Executive Room'],
        amenities: ['Air Conditioning & Study Desk', '24/7 Security & CCTV', 'High-Speed Wi-Fi', 'Dining Hall & Cafeteria', 'On-Site Laundry Service'],
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop',
        description: 'Affordable on-campus accommodation within Menara City U, offering hassle-free access to lecture halls and campus library.'
      },
      {
        id: 'acc-cityu-2',
        name: 'Damansara Bistari Student Residence',
        type: 'Student Residence',
        distanceToCampus: '800m (10 mins walk / Campus Shuttle)',
        monthlyRentMYR: 'MYR 500 - 800 / month',
        monthlyRentUSD: '$115 - $180 / month',
        roomTypes: ['Single Room with Balcony', 'Twin Sharing with AC'],
        amenities: ['Next to RapidKL LRT Station', 'Surrounded by Malls & Cafes', 'Swimming Pool', 'High-Speed Fiber Wi-Fi', 'Full Kitchen'],
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop',
        description: 'Convenient student apartment living in Petaling Jaya with rapid transit connections directly into downtown Kuala Lumpur.'
      }
    ],
    articles: [
      {
        id: 'art-cityu-1',
        title: 'Bachelor of Business Administration (Hons) at City University: Complete Course & Career Guide',
        summary: 'Explore curriculum structure, corporate internship placements in Kuala Lumpur, and MQA-accredited dual qualifications.',
        category: 'Academic Excellence',
        readTime: '4 min read',
        date: 'Oct 2026',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 'art-cityu-2',
        title: 'Student Life & Cost of Living in Petaling Jaya, Malaysia',
        summary: 'Detailed monthly breakdown of food, transport, and leisure expenses for international students living in Petaling Jaya.',
        category: 'Campus Life',
        readTime: '5 min read',
        date: 'Oct 2026',
        imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3ab695d3f?q=80&w=600&auto=format&fit=crop'
      }
    ],
    customCourses: [
      {
        title: 'Bachelor of Business Administration (Hons)',
        level: 'undergraduate',
        department: 'Business, Management & Economics',
        durationYears: '3 Years',
        durationMonths: 36,
        studyMode: 'Full-Time',
        annualFeeUSD: 3400,
        tuitionFeeLocal: 'MYR 15,000 / year',
        tuitionPerYear: 'MYR 15,000',
        totalTuitionLocal: 'MYR 45,000',
        totalTuitionUSD: '$10,200 USD',
        intakes: ['January', 'March', 'May', 'July', 'September', 'October'],
        ieltsRequirement: 5.5,
        accreditations: ['MQA Accredited', 'Chartered Management Institute (CMI)', 'MOHE Approved'],
        entryRequirements: 'STPM / Cambridge A-Levels (2 passes) or recognized Foundation / Diploma with min CGPA 2.0. English: IELTS 5.5 or English Placement Test.',
        overview: 'City University’s Bachelor of Business Administration (Hons) delivers an in-depth foundation across corporate management, international trade, marketing intelligence, and organizational strategy with mandatory corporate internships in Kuala Lumpur.',
        careerProspects: ['Business Development Manager', 'Marketing Strategist', 'Operations Analyst', 'Human Resource Specialist', 'Management Trainee'],
        campusName: 'Petaling Jaya Main Campus'
      },
      {
        title: 'Bachelor of Accounting (Hons)',
        level: 'undergraduate',
        department: 'Business, Management & Economics',
        durationYears: '3.5 Years',
        durationMonths: 42,
        studyMode: 'Full-Time',
        annualFeeUSD: 3750,
        tuitionFeeLocal: 'MYR 16,500 / year',
        tuitionPerYear: 'MYR 16,500',
        totalTuitionLocal: 'MYR 57,750',
        totalTuitionUSD: '$13,100 USD',
        intakes: ['January', 'May', 'September'],
        ieltsRequirement: 5.5,
        accreditations: ['MQA Accredited', 'ACCA 9 Papers Exemption', 'CIMA Accelerated Route', 'CPA Australia Foundation'],
        entryRequirements: 'STPM / Cambridge A-Levels with credit in Mathematics. English: IELTS 5.5 or equivalent.',
        overview: 'Comprehensive professional accounting degree accredited by MQA and ACCA, offering exemptions and direct pathways to Chartered Accountant certification.',
        careerProspects: ['Financial Auditor', 'Tax Consultant', 'Corporate Accountant', 'Risk Analyst'],
        campusName: 'Petaling Jaya Main Campus'
      },
      {
        title: 'Bachelor of Information Technology (Hons)',
        level: 'undergraduate',
        department: 'Computer Science, IT & Engineering',
        durationYears: '3 Years',
        durationMonths: 36,
        studyMode: 'Full-Time',
        annualFeeUSD: 3600,
        tuitionFeeLocal: 'MYR 16,000 / year',
        tuitionPerYear: 'MYR 16,000',
        totalTuitionLocal: 'MYR 48,000',
        totalTuitionUSD: '$10,800 USD',
        intakes: ['March', 'July', 'October'],
        ieltsRequirement: 5.5,
        accreditations: ['MQA Accredited', 'Cisco Networking Academy', 'Oracle Academy Partner'],
        overview: 'Practical IT degree covering full-stack software development, cloud infrastructure, enterprise networks, and database administration.',
        careerProspects: ['Full Stack Developer', 'Cloud Systems Engineer', 'IT Consultant', 'Database Administrator'],
        campusName: 'Petaling Jaya Main Campus'
      },
      {
        title: 'Master of Business Administration (MBA)',
        level: 'postgraduate',
        department: 'Business, Management & Economics',
        durationYears: '1.5 Years',
        durationMonths: 18,
        studyMode: 'Full-Time / Hybrid',
        annualFeeUSD: 4100,
        tuitionFeeLocal: 'MYR 18,000 / year',
        tuitionPerYear: 'MYR 18,000',
        totalTuitionLocal: 'MYR 27,000',
        totalTuitionUSD: '$6,100 USD',
        intakes: ['January', 'April', 'July', 'October'],
        ieltsRequirement: 6.0,
        accreditations: ['MQA Accredited', 'CMI Dual Certificate Option'],
        overview: 'Executive MBA program tailored for working professionals and international graduates focusing on corporate leadership, strategic finance, and global market innovation.',
        careerProspects: ['Corporate Executive', 'Managing Director', 'Management Consultant', 'Chief Operations Officer'],
        campusName: 'Petaling Jaya Main Campus'
      },
      {
        title: 'Diploma in Business Administration',
        level: 'diploma',
        department: 'Business, Management & Economics',
        durationYears: '2 Years',
        durationMonths: 24,
        studyMode: 'Full-Time',
        annualFeeUSD: 2500,
        tuitionFeeLocal: 'MYR 11,000 / year',
        tuitionPerYear: 'MYR 11,000',
        totalTuitionLocal: 'MYR 22,000',
        totalTuitionUSD: '$5,000 USD',
        intakes: ['January', 'April', 'August'],
        ieltsRequirement: 5.0,
        accreditations: ['MQA Accredited', 'Direct Progression to Year 2 Degree'],
        overview: 'Direct gateway diploma providing fundamental knowledge in accounting, business ethics, marketing principles, and management communications.',
        careerProspects: ['Assistant Manager', 'Account Executive', 'Customer Relations Specialist'],
        campusName: 'Petaling Jaya Main Campus'
      }
    ]
  },
  { name: 'ALFA University College (AUC)', country: 'Malaysia', city: 'Subang Jaya', state: 'Selangor', established: 1998, type: 'Private', websiteUrl: 'https://alfa.edu.my' },
  { name: 'Universiti Malaya-Wales (IUMW)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2012, type: 'Private', websiteUrl: 'https://iumw.edu.my' },
  { name: 'Lincoln University College', country: 'Malaysia', city: 'Petaling Jaya', state: 'Selangor', established: 2002, type: 'Private', qsRank2027: '701-710', websiteUrl: 'https://lincoln.edu.my' },
  { name: 'HELP University', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 1986, type: 'Private', websiteUrl: 'https://help.edu.my' },
  { name: 'Reliance College', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 1987, type: 'Private College', websiteUrl: 'https://reliance.edu.my' },
  { name: 'Veritas University College (VUC)', country: 'Malaysia', city: 'Petaling Jaya', state: 'Selangor', established: 2000, type: 'Private', websiteUrl: 'https://veritas.edu.my' },
  { name: 'Brickfields Asia College (BAC)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 1991, type: 'Private College', websiteUrl: 'https://bac.edu.my' },
  { name: 'University Malaysia of Computer Science & Engineering (UNIMY)', country: 'Malaysia', city: 'Cyberjaya', state: 'Selangor', established: 2012, type: 'Private', websiteUrl: 'https://unimy.edu.my' },
  { name: 'IACT College', country: 'Malaysia', city: 'Petaling Jaya', state: 'Selangor', established: 1970, type: 'Private College', websiteUrl: 'https://iact.edu.my' },
  { name: 'Universiti Geomatika', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2000, type: 'Private', websiteUrl: 'https://geomatika.edu.my' },
  { name: 'MAHSA University', country: 'Malaysia', city: 'Bandar Saujana Putra', state: 'Selangor', established: 2004, type: 'Private', websiteUrl: 'https://mahsa.edu.my' },
  { name: 'London School of Business and Finance (LSBF) College', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2003, type: 'Private College', websiteUrl: 'https://www.lsbf.edu.my' },
  { name: 'ELMU University', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2019, type: 'Private', websiteUrl: 'https://elmu.edu.my' },
  { name: 'Netherlands Maritime University College (NMUC)', country: 'Malaysia', city: 'Johor Bahru', state: 'Johor', established: 2011, type: 'Private College', websiteUrl: 'https://nmuc.edu.my' },
  { name: 'INTERNATIONAL COLLEGE IMPERIA', country: 'Malaysia', city: 'Subang Jaya', state: 'Selangor', established: 1995, type: 'Private College', websiteUrl: 'https://imperia.edu.my' },
  { name: 'University College Bestari (UCB)', country: 'Malaysia', city: 'Setiu', state: 'Terengganu', established: 1998, type: 'Private', websiteUrl: 'https://ucb.edu.my' },
  { name: 'Universiti College TATI (UCTATI)', country: 'Malaysia', city: 'Kemaman', state: 'Terengganu', established: 1993, type: 'Private', websiteUrl: 'https://uctati.edu.my' },
  { name: 'Nilai University', country: 'Malaysia', city: 'Nilai', state: 'Negeri Sembilan', established: 1997, type: 'Private', websiteUrl: 'https://nilai.edu.my' },
  { name: 'Universiti Sultan Zainal Abidin (UniSZA)', country: 'Malaysia', city: 'Kuala Terengganu', state: 'Terengganu', established: 2006, type: 'Public', websiteUrl: 'https://unisza.edu.my' },
  { name: 'Kings University College', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2008, type: 'Private', websiteUrl: 'https://kings.edu.my' },
  { name: 'DSH Institute of Technology (DIT)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 1990, type: 'Private College', websiteUrl: 'https://dit.edu.my' },
  { name: 'Mantissa College', country: 'Malaysia', city: 'Taman Tun Dr Ismail', state: 'Kuala Lumpur', established: 1999, type: 'Private College', websiteUrl: 'https://mantissa.edu.my' },
  { 
    name: 'UCSI University', 
    country: 'Malaysia', 
    city: 'Cheras', 
    state: 'Kuala Lumpur', 
    established: 1986, 
    type: 'Private', 
    qsRank2027: 282, 
    websiteUrl: 'https://www.ucsiuniversity.edu.my', 
    featured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200&auto=format&fit=crop',
    popularPrograms: ['BSc (Hons) Biotechnology', 'Bachelor of Pharmacy', 'Bachelor of Music', 'Master of International Business'],
    avgTuitionAnnualUSD: 7200,
    intakes: ['January', 'May', 'September']
  },
  { name: 'University of Selangor (UNISEL)', country: 'Malaysia', city: 'Bestari Jaya', state: 'Selangor', established: 1999, type: 'State Public', websiteUrl: 'https://unisel.edu.my' },
  { name: 'International College of Creative Arts Technology (CATS College)', country: 'Malaysia', city: 'Kuching', state: 'Sarawak', established: 2001, type: 'Private College', websiteUrl: 'https://cats.edu.my' },
  { name: 'Asia Metropolitan University (AMU)', country: 'Malaysia', city: 'Johor Bahru', state: 'Johor', established: 2004, type: 'Private', websiteUrl: 'https://amu.edu.my' },
  
  // 38. MULTIMEDIA UNIVERSITY (MMU) (Enriched from en.your-uni.com)
  { 
    name: 'Multimedia University (MMU)', 
    country: 'Malaysia', 
    city: 'Cyberjaya', 
    state: 'Selangor', 
    established: 1996, 
    type: 'Premier Digital Tech University (GLC)', 
    qsRank2027: '1001-1200', 
    websiteUrl: 'https://www.mmu.edu.my',
    bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=200&auto=format&fit=crop',
    tagline: "Malaysia's pioneer digital tech university with premier faculties in Accounting, Computer Science, AI, and Creative Multimedia.",
    description: "Multimedia University (MMU), established in 1996 under Telekom Malaysia, is the pioneer private university in Malaysia and the nation's premier digital innovation powerhouse. Spanning state-of-the-art campuses in Cyberjaya and Melaka, MMU is celebrated globally for producing world-class software engineers, chartered accountants, and creative media visionaries.",
    featured: true,
    popularPrograms: [
      'Bachelor of Accounting (Hons)',
      'Bachelor of Business Administration (Hons)',
      'Bachelor of Computer Science (Hons) in Artificial Intelligence',
      'Bachelor of Multimedia (Hons) in Animation & Virtual Reality',
      'Bachelor of Information Technology (Hons)',
      'Master of Business Administration (MBA)',
      'Master of Computer Science (by Research)'
    ],
    intakes: ['March', 'July', 'October', 'November'],
    avgTuitionAnnualUSD: 4200,
    campuses: [
      { id: 'campus-mmu-1', name: 'Cyberjaya Flagship Smart Campus', city: 'Cyberjaya', stateOrProvince: 'Selangor', country: 'Malaysia', isMainCampus: true },
      { id: 'campus-mmu-2', name: 'Melaka Historic Heritage Campus', city: 'Ayer Keroh', stateOrProvince: 'Melaka', country: 'Malaysia', isMainCampus: false }
    ],
    accommodations: [
      {
        id: 'acc-mmu-1',
        name: 'MMU On-Campus Student Residence (Cyberjaya)',
        type: 'On-Campus Hostel',
        distanceToCampus: '0 km (Inside Campus Grounds)',
        monthlyRentMYR: 'MYR 350 - 550 / month',
        monthlyRentUSD: '$80 - $125 / month',
        roomTypes: ['Twin Sharing Room (Air-Conditioned)', 'Single Room with En-Suite', 'Economy Quad Sharing'],
        amenities: ['24/7 Security & Keycard Access', 'High-Speed Eduroam Wi-Fi', 'Cafeterias & Food Court', 'Olympic Swimming Pool & Gymnasium', 'Coin-Operated Laundry', 'Study Lounges'],
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop',
        description: 'Safe, affordable and vibrant campus hostels located footsteps away from lecture theatres, central library, and tech labs.'
      },
      {
        id: 'acc-mmu-2',
        name: 'The Arc Cyberjaya (Off-Campus Condominium)',
        type: 'Condominium',
        distanceToCampus: '500m (5-minute walk to MMU Gate)',
        monthlyRentMYR: 'MYR 450 - 850 / month',
        monthlyRentUSD: '$100 - $190 / month',
        roomTypes: ['Master Bedroom with Private Bath', 'Middle Bedroom', 'Single Bedroom'],
        amenities: ['Resort Swimming Pool', 'Fully Equipped Gym', '24/7 Security & CCTV', 'Air Conditioning & Water Heater', 'Mini-Marts & Cafes on Ground Floor', 'Campus Shuttle'],
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
        description: 'The premier student condo choice for international MMU students, featuring full resort facilities within walking distance to class.'
      },
      {
        id: 'acc-mmu-3',
        name: 'Cyberia SmartHomes Condominium',
        type: 'Off-Campus Apartment',
        distanceToCampus: '300m (Adjacent to MMU South Gate)',
        monthlyRentMYR: 'MYR 400 - 750 / month',
        monthlyRentUSD: '$90 - $170 / month',
        roomTypes: ['Single Room', 'Medium AC Room', 'Master Room with Balcony'],
        amenities: ['Swimming Pool & Badminton Court', 'On-site Grocery Store', 'High-Speed Fiber Internet', 'Full Kitchen & Washing Machine'],
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop',
        description: 'Budget-friendly condominium community directly adjacent to Multimedia University with a lively international student community.'
      }
    ],
    articles: [
      {
        id: 'art-mmu-1',
        title: 'Bachelor of Accounting (Hons) at MMU: ACCA 9-Paper Exemption & Career Pathways',
        summary: 'How MMU accounting graduates secure fast-track ACCA, CIMA, and MIA professional memberships with Big 4 hiring.',
        category: 'Academic Excellence',
        readTime: '4 min read',
        date: 'Oct 2026',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 'art-mmu-2',
        title: 'Student Life in Cyberjaya: Silicon Valley of Malaysia',
        summary: 'Discover smart city infrastructure, multicultural student community, dining, and weekend escapes in Cyberjaya and Putrajaya.',
        category: 'Campus Life',
        readTime: '5 min read',
        date: 'Oct 2026',
        imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3ab695d3f?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 'art-mmu-3',
        title: 'Step-by-Step EMGS Student Visa & VAL Approval Guide for Malaysia',
        summary: 'Everything you need to know about Visa Approval Letter (VAL), EMGS processing timelines, medical screening, and single entry visa.',
        category: 'Visa & EMGS',
        readTime: '6 min read',
        date: 'Oct 2026',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'
      }
    ],
    customCourses: [
      {
        title: 'Bachelor of Accounting (Hons)',
        level: 'undergraduate',
        department: 'Business, Management & Economics',
        durationYears: '3 Years',
        durationMonths: 36,
        studyMode: 'Full-Time',
        annualFeeUSD: 4200,
        tuitionFeeLocal: 'MYR 18,500 / year',
        tuitionPerYear: 'MYR 18,500',
        totalTuitionLocal: 'MYR 55,500',
        totalTuitionUSD: '$12,500 USD',
        intakes: ['March', 'July', 'October'],
        ieltsRequirement: 5.5,
        accreditations: ['MQA Accredited', 'ACCA Maximum 9-Paper Exemption', 'CIMA Accelerated Route', 'MIA Recognised', 'MICPA & CA ANZ'],
        entryRequirements: 'STPM / Cambridge A-Levels (min Grade C in 2 subjects with credit in Mathematics) or recognized Foundation in Business. IELTS 5.5 - 6.0 or MUET Band 3.',
        overview: 'Recognized by the Malaysian Institute of Accountants (MIA), ACCA, and CIMA, this honours degree produces premier chartered accountants equipped with forensic analytics, taxation expertise, and direct Big 4 corporate internships.',
        careerProspects: ['Chartered Accountant', 'Financial Auditor (Big 4)', 'Forensic Accountant', 'Investment Banker', 'Chief Financial Officer (CFO)'],
        campusName: 'Cyberjaya & Melaka Campuses'
      },
      {
        title: 'Bachelor of Business Administration (Hons) in Marketing & Digital Commerce',
        level: 'undergraduate',
        department: 'Business, Management & Economics',
        durationYears: '3 Years',
        durationMonths: 36,
        studyMode: 'Full-Time',
        annualFeeUSD: 3850,
        tuitionFeeLocal: 'MYR 17,000 / year',
        tuitionPerYear: 'MYR 17,000',
        totalTuitionLocal: 'MYR 51,000',
        totalTuitionUSD: '$11,500 USD',
        intakes: ['March', 'July', 'October'],
        ieltsRequirement: 5.5,
        accreditations: ['MQA Accredited', 'Digital Marketing Institute (DMI)'],
        overview: 'Combines traditional corporate management strategy with next-generation digital commerce, SEO/SEM analytics, omnichannel branding, and consumer data science.',
        careerProspects: ['Digital Growth Strategist', 'Brand Director', 'E-Commerce Manager', 'Marketing Intelligence Lead'],
        campusName: 'Cyberjaya Campus'
      },
      {
        title: 'Bachelor of Computer Science (Hons) in Artificial Intelligence',
        level: 'undergraduate',
        department: 'Computer Science, IT & Engineering',
        durationYears: '3 Years',
        durationMonths: 36,
        studyMode: 'Full-Time',
        annualFeeUSD: 4500,
        tuitionFeeLocal: 'MYR 20,000 / year',
        tuitionPerYear: 'MYR 20,000',
        totalTuitionLocal: 'MYR 60,000',
        totalTuitionUSD: '$13,500 USD',
        intakes: ['March', 'July', 'October'],
        ieltsRequirement: 6.0,
        accreditations: ['MQA Accredited', 'Premier Digital Tech University (MDEC)', 'AWS Cloud Academy Partner'],
        overview: 'Pioneered by MMU Cyberjaya, this flagship honours program covers deep learning, neural networks, computer vision, autonomous agents, and NLP in cutting-edge research labs.',
        careerProspects: ['Machine Learning Engineer', 'AI Research Scientist', 'Computer Vision Developer', 'Data Architect'],
        campusName: 'Cyberjaya Flagship Smart Campus'
      },
      {
        title: 'Bachelor of Multimedia (Hons) in Animation & Virtual Reality',
        level: 'undergraduate',
        department: 'Arts, Design & Media',
        durationYears: '3 Years',
        durationMonths: 36,
        studyMode: 'Full-Time',
        annualFeeUSD: 4300,
        tuitionFeeLocal: 'MYR 19,000 / year',
        tuitionPerYear: 'MYR 19,000',
        totalTuitionLocal: 'MYR 57,000',
        totalTuitionUSD: '$12,900 USD',
        intakes: ['March', 'July', 'October'],
        ieltsRequirement: 5.5,
        accreditations: ['MQA Accredited', 'Epic Games Unreal Engine Academic Partner', 'Unity Certified Training'],
        overview: 'MMU is celebrated as the birthplace of Southeast Asia’s CGI animation industry. Students master 3D character animation, spatial computing, VR/AR engines, and cinematic rendering.',
        careerProspects: ['3D Animator', 'VR/AR Experience Developer', 'VFX Technical Director', 'Game Designer'],
        campusName: 'Cyberjaya Flagship Smart Campus'
      },
      {
        title: 'Bachelor of Information Technology (Hons)',
        level: 'undergraduate',
        department: 'Computer Science, IT & Engineering',
        durationYears: '3 Years',
        durationMonths: 36,
        studyMode: 'Full-Time',
        annualFeeUSD: 4100,
        tuitionFeeLocal: 'MYR 18,000 / year',
        tuitionPerYear: 'MYR 18,000',
        totalTuitionLocal: 'MYR 54,000',
        totalTuitionUSD: '$12,200 USD',
        intakes: ['March', 'July', 'October'],
        ieltsRequirement: 5.5,
        accreditations: ['MQA Accredited', 'Cisco Academy Partner', 'CompTIA Academic Partner'],
        overview: 'Comprehensive IT qualification emphasizing cybersecurity defenses, cloud infrastructure, enterprise systems integration, and mobile development.',
        careerProspects: ['IT Solutions Architect', 'Cloud Security Specialist', 'Systems Administrator'],
        campusName: 'Cyberjaya & Melaka Campuses'
      },
      {
        title: 'Master of Business Administration (MBA)',
        level: 'postgraduate',
        department: 'Business, Management & Economics',
        durationYears: '1 Year',
        durationMonths: 12,
        studyMode: 'Full-Time / Hybrid',
        annualFeeUSD: 5400,
        tuitionFeeLocal: 'MYR 24,000 / year',
        tuitionPerYear: 'MYR 24,000',
        totalTuitionLocal: 'MYR 24,000',
        totalTuitionUSD: '$5,400 USD',
        intakes: ['March', 'July', 'November'],
        ieltsRequirement: 6.0,
        accreditations: ['MQA Accredited', 'Chartered Management Institute (CMI)'],
        overview: 'Accelerated 1-year MBA for executives and international leaders combining digital transformation, corporate strategy, agile governance, and global finance.',
        careerProspects: ['Chief Executive Officer', 'Corporate Strategy Director', 'Management Consultant', 'Entrepreneur'],
        campusName: 'Cyberjaya Flagship Smart Campus'
      },
      {
        title: 'Master of Computer Science (by Research / Coursework)',
        level: 'postgraduate',
        department: 'Computer Science, IT & Engineering',
        durationYears: '1.5 - 2 Years',
        durationMonths: 20,
        studyMode: 'Full-Time',
        annualFeeUSD: 3600,
        tuitionFeeLocal: 'MYR 16,000 / year',
        tuitionPerYear: 'MYR 16,000',
        totalTuitionLocal: 'MYR 24,000',
        totalTuitionUSD: '$5,400 USD',
        intakes: ['March', 'July', 'November'],
        ieltsRequirement: 6.0,
        accreditations: ['MQA Accredited', 'High Impact Research Group'],
        overview: 'Advanced postgraduate research program in high-performance computing, deep neural networks, IoT security, and distributed data systems.',
        careerProspects: ['Lead Data Scientist', 'AI Research Lead', 'University Lecturer', 'R&D Director'],
        campusName: 'Cyberjaya Flagship Smart Campus'
      }
    ]
  },
  { name: 'MERITUS UNIVERSITY', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2016, type: 'Private', websiteUrl: 'https://meritus.edu.my' },
  { name: 'International Institute of Management and Technology (IIMAT College)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2000, type: 'Private College', websiteUrl: 'https://iimat.edu.my' },
  { name: 'Kuala Lumpur University of Science and Technology (KLUST)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 2010, type: 'Private', websiteUrl: 'https://klust.edu.my' },
  { name: 'Tunku Abdul Rahman University of Management and Technology (TAR UMT)', country: 'Malaysia', city: 'Kuala Lumpur', state: 'Federal Territory', established: 1969, type: 'Private', websiteUrl: 'https://tarc.edu.my' },
  { name: 'First City University College', country: 'Malaysia', city: 'Petaling Jaya', state: 'Selangor', established: 1990, type: 'Private', websiteUrl: 'https://firstcity.edu.my' },

  // --------------------------------------------------------------------------
  // 7. USA (14 Universities & Higher Education Partners)
  // --------------------------------------------------------------------------
  {
    name: 'Wilkes University',
    country: 'USA',
    city: 'Wilkes-Barre',
    state: 'Pennsylvania',
    established: 1933,
    type: 'Private',
    websiteUrl: 'https://www.wilkes.edu',
    popularPrograms: ['Computer Science & Cybersecurity', 'Mechanical Engineering', 'Nursing & Health Sciences', 'Master of Business Administration (MBA)'],
    avgTuitionAnnualUSD: 39000,
    featured: true,
    tagline: 'Premier Pennsylvania institution offering specialized engineering, health sciences, and executive MBA programs.',
    description: 'Wilkes University is a private, independent institution in Wilkes-Barre, Pennsylvania. Renowned for small class sizes, world-class faculty mentoring, and high graduate placement rates across STEM, business, and health sciences.'
  },
  {
    name: 'University of Potomac',
    country: 'USA',
    city: 'Washington',
    state: 'District of Columbia',
    established: 1989,
    type: 'Private',
    websiteUrl: 'https://potomac.edu',
    popularPrograms: ['Information Technology & Cybersecurity', 'Business Administration', 'Data Analytics', 'Health Systems Management'],
    avgTuitionAnnualUSD: 15500,
    featured: true,
    tagline: 'Capital-based university delivering career-focused technology, healthcare administration, and business degrees.',
    description: 'University of Potomac provides career-oriented education at its Washington D.C. campus, offering accelerated bachelor and master degrees in cybersecurity, IT, and international business.'
  },
  {
    name: 'Trine University',
    country: 'USA',
    city: 'Angola',
    state: 'Indiana',
    established: 1884,
    type: 'Private',
    websiteUrl: 'https://www.trine.edu',
    popularPrograms: ['Biomedical Engineering', 'Civil Engineering', 'Information Studies', 'Master of Science in Information Studies'],
    avgTuitionAnnualUSD: 34000,
    featured: true,
    tagline: 'Distinguished private university known for ABET-accredited engineering, health professions, and tech programs.',
    description: 'Trine University in Angola, Indiana offers outstanding career-ready degree programs with a 99.7% job placement rate, featuring robust CPT/OPT support for international students.'
  },
  {
    name: 'Cascadia College',
    country: 'USA',
    city: 'Bothell',
    state: 'Washington',
    established: 1999,
    type: 'Public College',
    websiteUrl: 'https://www.cascadia.edu',
    popularPrograms: ['Computer Science Transfer', 'Business Administration', 'Sustainable Practices', 'Web Application Development'],
    avgTuitionAnnualUSD: 11000,
    tagline: 'Top-ranked community and technical college in greater Seattle offering direct 2+2 university transfer pathways.',
    description: 'Cascadia College, co-located with the University of Washington Bothell, is nationally recognized for its 2+2 university transfer degrees into top American computer science and business programs.'
  },
  {
    name: 'Stevens Institute of Technology',
    country: 'USA',
    city: 'Hoboken',
    state: 'New Jersey',
    established: 1870,
    type: 'Private Research',
    qsRank2027: '651-700',
    websiteUrl: 'https://www.stevens.edu',
    popularPrograms: ['Computer Science & AI', 'Financial Engineering', 'Mechanical Engineering', 'Business Intelligence & Analytics'],
    avgTuitionAnnualUSD: 58000,
    featured: true,
    tagline: 'Premier technological research university overlooking Manhattan, renowned for high-salary STEM careers.',
    description: 'Stevens Institute of Technology is an elite student-centric technological research institution in Hoboken, New Jersey, providing unmatched proximity to Wall Street and Silicon Alley tech employers.'
  },
  {
    name: 'University of Maryland Baltimore County (UMBC)',
    country: 'USA',
    city: 'Baltimore',
    state: 'Maryland',
    established: 1966,
    type: 'Public Research',
    qsRank2027: '701-750',
    websiteUrl: 'https://umbc.edu',
    popularPrograms: ['Computer Science & Cybersecurity', 'Biological Sciences', 'Information Systems', 'Data Science'],
    avgTuitionAnnualUSD: 29000,
    featured: true,
    tagline: 'R1 top-tier public research university renowned for graduate computing, biosciences, and cybersecurity innovation.',
    description: 'UMBC is a top-ranking public research university celebrated for producing tech innovators, cybersecurity leaders, and NSF-funded researchers across the Washington-Baltimore tech corridor.'
  },
  {
    name: 'Arkansas State University',
    country: 'USA',
    city: 'Jonesboro',
    state: 'Arkansas',
    established: 1909,
    type: 'Public Research',
    websiteUrl: 'https://www.astate.edu',
    popularPrograms: ['Computer Science & Engineering', 'Global Business Administration', 'Agriculture & Biotechnology', 'Nursing & Health'],
    avgTuitionAnnualUSD: 17500,
    tagline: 'Comprehensive public research university providing accessible, high-value degrees and vibrant campus life.',
    description: 'Arkansas State University (A-State) is a flagship public university in Jonesboro, serving international students from over 60 countries with affordable tuition and STEM designations.'
  },
  {
    name: 'Minnesota State University',
    country: 'USA',
    city: 'Mankato',
    state: 'Minnesota',
    established: 1868,
    type: 'Public',
    websiteUrl: 'https://www.mnsu.edu',
    popularPrograms: ['Automotive Engineering Technology', 'Aviation & Aerospace', 'Information Technology', 'Finance & Accounting'],
    avgTuitionAnnualUSD: 18500,
    tagline: 'Leading Midwestern university recognized for engineering, professional aviation flight training, and IT.',
    description: 'Minnesota State University, Mankato offers 130+ undergraduate and graduate programs with generous in-state cultural contribution scholarships for all qualifying international students.'
  },
  {
    name: 'Rowan University',
    country: 'USA',
    city: 'Glassboro',
    state: 'New Jersey',
    established: 1923,
    type: 'Public Research',
    websiteUrl: 'https://www.rowan.edu',
    popularPrograms: ['Chemical Engineering', 'Computer Science', 'Biomedical Engineering', 'Management Information Systems'],
    avgTuitionAnnualUSD: 24500,
    featured: true,
    tagline: 'Rapidly growing national research university with acclaimed medical, engineering, and tech faculties.',
    description: 'Rowan University is a top 100 national public research institution in New Jersey, acclaimed for its Henry M. Rowan College of Engineering and cutting-edge virtual reality center.'
  },
  {
    name: 'University of West Florida',
    country: 'USA',
    city: 'Pensacola',
    state: 'Florida',
    established: 1963,
    type: 'Public',
    websiteUrl: 'https://uwf.edu',
    popularPrograms: ['Cybersecurity & Network Engineering', 'Marine Biology & Ocean Sciences', 'Healthcare Administration', 'Accounting & Finance'],
    avgTuitionAnnualUSD: 19500,
    tagline: 'Dynamic Florida public university leading in national center for cybersecurity and coastal sciences.',
    description: 'University of West Florida (UWF) is a vibrant coastal campus leading the Southeast in cyber defense research, marine sciences, and undergraduate business education.'
  },
  {
    name: 'Duquesne University',
    country: 'USA',
    city: 'Pittsburgh',
    state: 'Pennsylvania',
    established: 1878,
    type: 'Private Research',
    websiteUrl: 'https://www.duq.edu',
    popularPrograms: ['Pharmacy & Health Sciences', 'Computer Science & Software', 'Business Leadership', 'Biotechnology'],
    avgTuitionAnnualUSD: 46000,
    featured: true,
    tagline: 'Top-tier Catholic research university in Pittsburgh with acclaimed health sciences, law, and business.',
    description: 'Duquesne University sits atop the Pittsburgh bluff overlooking the city center, offering prestigious programs in pharmacy, health sciences, law, and corporate finance.'
  },
  {
    name: 'Brandeis University – School of Business and Economics',
    country: 'USA',
    city: 'Waltham',
    state: 'Massachusetts',
    established: 1948,
    type: 'Private Research',
    qsRank2027: '501-550',
    websiteUrl: 'https://www.brandeis.edu',
    popularPrograms: ['Master of Science in Finance (MSF)', 'Master of Business Administration (MBA)', 'Business Analytics & Data Science', 'International Economics'],
    avgTuitionAnnualUSD: 56000,
    featured: true,
    tagline: 'Prestige AACSB-accredited business school outside Boston preparing global leaders in quantitative finance and management.',
    description: 'Brandeis International Business School prepares students for world-class careers in finance, asset management, data analytics, and consulting in the Greater Boston economic hub.'
  },
  {
    name: 'Marquette University',
    country: 'USA',
    city: 'Milwaukee',
    state: 'Wisconsin',
    established: 1881,
    type: 'Private Research',
    websiteUrl: 'https://www.marquette.edu',
    popularPrograms: ['Biomedical Sciences', 'Finance & Real Estate', 'Civil & Environmental Engineering', 'Computer Science'],
    avgTuitionAnnualUSD: 48000,
    tagline: 'Jesuit national research university with distinguished engineering, health science, and business faculties.',
    description: 'Marquette University in Milwaukee, Wisconsin provides transformative educational experiences grounded in academic excellence, ethics, and leadership across 80+ majors.'
  },
  {
    name: 'Central Michigan University',
    country: 'USA',
    city: 'Mount Pleasant',
    state: 'Michigan',
    established: 1892,
    type: 'Public Research',
    websiteUrl: 'https://www.cmich.edu',
    popularPrograms: ['Information Technology & Cybersecurity', 'Health Administration', 'Engineering Technology', 'Broadcast Media & Communications'],
    avgTuitionAnnualUSD: 22000,
    tagline: 'Major public research university fostering career-focused innovation in tech, health, and engineering.',
    description: 'Central Michigan University (CMU) is a prominent public research institution in Mount Pleasant, offering STEM-designated graduate degrees and high-impact internships.'
  },

  // --------------------------------------------------------------------------
  // 8. AUSTRALIA (10 Universities & Colleges)
  // --------------------------------------------------------------------------
  {
    name: 'University of Wollongong',
    country: 'Australia',
    city: 'Wollongong',
    state: 'New South Wales',
    established: 1951,
    type: 'Public Research',
    qsRank2027: 167,
    websiteUrl: 'https://www.uow.edu.au',
    featured: true,
    popularPrograms: ['Bachelor of Computer Science', 'Master of Information Technology', 'Civil & Mining Engineering', 'Master of Business (MBA)'],
    avgTuitionAnnualUSD: 24500,
    tagline: 'Top-tier Australian research university located along the scenic coast of New South Wales.',
    description: 'University of Wollongong (UOW) is globally recognized for high graduate employability, innovative STEM faculties, and coastal campus life just 80 minutes from Sydney.'
  },
  {
    name: 'La Trobe University Sydney',
    country: 'Australia',
    city: 'Sydney',
    state: 'New South Wales',
    established: 1967,
    type: 'Public University Campus',
    qsRank2027: 242,
    websiteUrl: 'https://www.latrobe.edu.au/sydney',
    featured: true,
    popularPrograms: ['Bachelor of Business', 'Master of Professional Accounting', 'Bachelor of Information Technology', 'Master of Cybersecurity'],
    avgTuitionAnnualUSD: 23500,
    tagline: 'La Trobe University’s vibrant Sydney campus located in the heart of the central business district.',
    description: 'La Trobe University Sydney provides undergraduate and postgraduate business, accounting, and IT programs situated right in Sydney’s CBD with strong corporate internship connections.'
  },
  {
    name: 'University of Tasmania',
    country: 'Australia',
    city: 'Hobart',
    state: 'Tasmania',
    established: 1890,
    type: 'Public Research',
    qsRank2027: 307,
    websiteUrl: 'https://www.utas.edu.au',
    featured: true,
    popularPrograms: ['Marine & Antarctic Science', 'Information & Communication Technology', 'Agricultural Science', 'Master of Business Administration'],
    avgTuitionAnnualUSD: 22000,
    tagline: 'Historic sandstone university in Tasmania with regional migration incentives and generous scholarships.',
    description: 'University of Tasmania (UTAS) offers exceptional research programs, marine sciences, and generous Tasmanian International Scholarships with extended post-study work visa eligibility.'
  },
  {
    name: 'James Cook University',
    country: 'Australia',
    city: 'Townsville & Cairns',
    state: 'Queensland',
    established: 1970,
    type: 'Public Research',
    qsRank2027: 415,
    websiteUrl: 'https://www.jcu.edu.au',
    featured: true,
    popularPrograms: ['Marine Biology', 'Tropical Health & Medicine', 'Data Science & IT', 'Tourism & Hospitality Management'],
    avgTuitionAnnualUSD: 23000,
    tagline: 'World-leading tropical research university located near the Great Barrier Reef in Queensland.',
    description: 'James Cook University (JCU) in Townsville, Cairns, and Brisbane is internationally acclaimed for tropical ecology, environmental science, marine biology, and healthcare.'
  },
  {
    name: 'Charles Sturt University',
    country: 'Australia',
    city: 'Bathurst & Wagga Wagga',
    state: 'New South Wales',
    established: 1989,
    type: 'Public',
    websiteUrl: 'https://www.csu.edu.au',
    featured: true,
    popularPrograms: ['Bachelor of Information Technology', 'Master of Professional Accounting', 'Agriculture & Wine Science', 'Nursing & Paramedicine'],
    avgTuitionAnnualUSD: 20000,
    tagline: 'Australia’s top university for graduate employment outcomes across regional NSW and Sydney.',
    description: 'Charles Sturt University (CSU) consistently ranks #1 in Australia for graduate employment rates, offering hands-on training and regional post-study work rights.'
  },
  {
    name: 'CQUniversity Australia',
    country: 'Australia',
    city: 'Rockhampton & Sydney',
    state: 'Queensland & NSW',
    established: 1967,
    type: 'Public Comprehensive',
    qsRank2027: 595,
    websiteUrl: 'https://www.cqu.edu.au',
    featured: true,
    popularPrograms: ['Master of Information Systems', 'Bachelor of Engineering (Co-op)', 'Master of Management for Engineers', 'Bachelor of Nursing'],
    avgTuitionAnnualUSD: 19500,
    tagline: 'Australia’s largest regional university with campuses in Sydney, Melbourne, Brisbane, and Rockhampton.',
    description: 'CQUniversity is renowned for practical courses with built-in internships, flexible multi-campus study in major capitals, and affordable tuition.'
  },
  {
    name: 'University of New South Wales',
    country: 'Australia',
    city: 'Sydney',
    state: 'New South Wales',
    established: 1949,
    type: 'Public Research (Go8)',
    qsRank2027: 19,
    websiteUrl: 'https://www.unsw.edu.au',
    featured: true,
    popularPrograms: ['Computer Science & Artificial Intelligence', 'Civil & Solar Engineering', 'AGSM Master of Business Administration', 'FinTech & Banking'],
    avgTuitionAnnualUSD: 33500,
    tagline: 'Global top 20 Group of Eight research university acclaimed for engineering, technology, and entrepreneurship.',
    description: 'UNSW Sydney is a powerhouse of innovation and research, consistently ranked among the world’s top 20 universities, producing Australia’s highest-earning graduates and top startup founders.'
  },
  {
    name: 'University of Newcastle',
    country: 'Australia',
    city: 'Newcastle',
    state: 'New South Wales',
    established: 1965,
    type: 'Public Research',
    qsRank2027: 179,
    websiteUrl: 'https://www.newcastle.edu.au',
    featured: true,
    popularPrograms: ['Bachelor of Software Engineering', 'Architecture & Built Environment', 'Biomedical Science', 'Master of Business Administration'],
    avgTuitionAnnualUSD: 24000,
    tagline: 'Top 200 global research university in coastal Newcastle with strong industry co-op and regional benefits.',
    description: 'The University of Newcastle in NSW offers world-class engineering, business, and health sciences, only 2 hours from Sydney with attractive regional post-study work benefits.'
  },
  {
    name: 'RMIT University, Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    state: 'Victoria',
    established: 1887,
    type: 'Public Dual-Sector (ATN)',
    qsRank2027: 123,
    websiteUrl: 'https://www.rmit.edu.au',
    featured: true,
    popularPrograms: ['Master of Information Technology', 'Bachelor of Design (Architecture)', 'Computer Science & AI', 'Master of Engineering'],
    avgTuitionAnnualUSD: 27500,
    tagline: 'Global university of technology, design, and enterprise based in the vibrant heart of Melbourne.',
    description: 'RMIT University in Melbourne is world-renowned for art, design, architecture, computer science, and engineering, deeply integrated with industry partners across the globe.'
  },
  {
    name: 'Swinburne University of Technology',
    country: 'Australia',
    city: 'Melbourne',
    state: 'Victoria',
    established: 1908,
    type: 'Public Research (ATN)',
    qsRank2027: 291,
    websiteUrl: 'https://www.swinburne.edu.au',
    featured: true,
    popularPrograms: ['Bachelor of Computer Science (Cybersecurity & Cloud)', 'Master of Data Science', 'Aviation & Aerospace', 'Civil Engineering'],
    avgTuitionAnnualUSD: 25000,
    tagline: 'Pioneering technology university in Melbourne with industry-engaged learning and aerospace/data science.',
    description: 'Swinburne University of Technology in Melbourne is celebrated for cutting-edge technology facilities, direct corporate co-ops, aerospace flight training, and high-impact digital innovation.'
  },

  // --------------------------------------------------------------------------
  // 9. FRANCE (4 Business Schools & Management Institutes)
  // --------------------------------------------------------------------------
  {
    name: 'ICN Business School',
    country: 'France',
    city: 'Nancy',
    state: 'Grand Est & Paris',
    established: 1905,
    type: 'Grandes Écoles (Triple Crown Accredited)',
    websiteUrl: 'https://www.icn-artem.com',
    featured: true,
    popularPrograms: ['Master in Management (PGE)', 'MSc Digital Business', 'MSc Luxury and Design Management', 'BBA in International Business'],
    avgTuitionAnnualUSD: 11000,
    tagline: 'Prestigious triple-accredited (EQUIS, AMBA, AACSB) French business school blending art, technology, and management.',
    description: 'ICN Business School, established in 1905 in Nancy with campuses in Paris and Berlin, is a leading French Grande École holding the prestigious Triple Crown accreditation.'
  },
  {
    name: 'ISTEC Business School',
    country: 'France',
    city: 'Paris',
    state: 'Île-de-France',
    established: 1961,
    type: 'Private Grande École',
    websiteUrl: 'https://www.istec.fr',
    featured: true,
    popularPrograms: ['Programme Grande École (Master in Management)', 'Bachelor in International Business', 'MBA International Marketing', 'MSc Finance & Fintech'],
    avgTuitionAnnualUSD: 9800,
    tagline: 'Historic Parisian business school specializing in international marketing, commerce, and digital entrepreneurship.',
    description: 'ISTEC Business School, located in the heart of Paris near Canal Saint-Martin, is a recognized French Grande École delivering accredited management, marketing, and business degrees.'
  },
  {
    name: 'Rennes School of Business',
    country: 'France',
    city: 'Rennes',
    state: 'Brittany',
    established: 1990,
    type: 'Grandes Écoles (Triple Crown Accredited)',
    websiteUrl: 'https://www.rennes-sb.com',
    featured: true,
    popularPrograms: ['Master in Management (MiM)', 'MSc International Finance', 'MSc Global Business Management', 'MSc Supply Chain Management'],
    avgTuitionAnnualUSD: 12500,
    tagline: 'Top-tier cosmopolitan French business school holding EQUIS, AACSB, and AMBA triple accreditation.',
    description: 'Rennes School of Business is among the top 1% of business schools worldwide with Triple Crown accreditation, renowned for having a 95% international faculty and multicultural student body.'
  },
  {
    name: 'Rennes Graduate School of Management',
    country: 'France',
    city: 'Rennes',
    state: 'Brittany',
    established: 1955,
    type: 'Public University Business School (IGR-IAE Rennes)',
    websiteUrl: 'https://igr.univ-rennes.fr',
    featured: true,
    popularPrograms: ['Master in International Human Resources', 'Master in Finance and Advanced Accounting', 'Master in Marketing and Innovation', 'Master in Business Administration'],
    avgTuitionAnnualUSD: 4500,
    tagline: 'Premier public university management institute (IAE) at the University of Rennes, offering affordable top-tier European business degrees.',
    description: 'Rennes Graduate School of Management (IGR-IAE Rennes), part of the University of Rennes and the national IAE network, combines university research excellence with corporate management practice.'
  },

  // --------------------------------------------------------------------------
  // 10. HUNGARY (3 Universities)
  // --------------------------------------------------------------------------
  {
    name: 'University of Debrecen',
    country: 'Hungary',
    city: 'Debrecen',
    state: 'Hajdú-Bihar',
    established: 1538,
    type: 'Public Research',
    qsRank2027: '651-700',
    websiteUrl: 'https://unideb.hu',
    featured: true,
    popularPrograms: ['General Medicine (MD)', 'Computer Science (BSc & MSc)', 'Dentistry', 'Business Administration'],
    avgTuitionAnnualUSD: 7500,
    tagline: 'Historic European medical and research university offering accredited English-taught degrees.',
    description: 'University of Debrecen is one of Hungary’s oldest and largest higher education institutions, acclaimed globally for medical, dental, pharmaceutical, and computer science degrees.'
  },
  {
    name: 'University of Sopron',
    country: 'Hungary',
    city: 'Sopron',
    state: 'Győr-Moson-Sopron',
    established: 1735,
    type: 'Public',
    websiteUrl: 'https://uni-sopron.hu',
    featured: true,
    popularPrograms: ['Forestry & Environmental Engineering', 'Economics & Social Sciences', 'Wood Sciences & Creative Design', 'Business Administration'],
    avgTuitionAnnualUSD: 5500,
    tagline: 'Historic green university located near the Austrian border, specializing in forestry, ecology, economics, and design.',
    description: 'University of Sopron (Soproni Egyetem), founded in 1735, is a prestigious green university near the Austrian border renowned for natural resources, economics, environmental engineering, and applied arts.'
  },
  {
    name: 'Corvinus University',
    country: 'Hungary',
    city: 'Budapest',
    state: 'Central Hungary',
    established: 1920,
    type: 'Public Research (Business & Economics)',
    qsRank2027: '801-850',
    websiteUrl: 'https://www.uni-corvinus.hu',
    featured: true,
    popularPrograms: ['International Business & Economics', 'Finance & Accounting', 'Business Administration & Management', 'Communication & Media Science'],
    avgTuitionAnnualUSD: 7200,
    tagline: 'Hungary’s leading business, management, and economics university holding triple accreditation (AMBA, AACSB, EFMD).',
    description: 'Corvinus University of Budapest is Central Europe’s elite business and social science university, situated on the banks of the Danube River with global corporate recruitment.'
  },

  // --------------------------------------------------------------------------
  // 11. MALTA (2 Universities & Colleges)
  // --------------------------------------------------------------------------
  {
    name: 'GBS Malta',
    country: 'Malta',
    city: 'St. Julian’s',
    state: 'Central Region',
    established: 2021,
    type: 'Private Higher Education Institution',
    websiteUrl: 'https://gbs.edu.mt',
    featured: true,
    popularPrograms: ['BA (Hons) Business and Management', 'MA Business and Management', 'MSc Information Technology', 'MSc Healthcare Management'],
    avgTuitionAnnualUSD: 6500,
    tagline: 'Modern higher education campus in St. Julian’s providing British and European-accredited undergraduate and master degrees.',
    description: 'GBS Malta provides high-quality British-accredited undergraduate and postgraduate programs in Malta, offering affordable tuition, full-time study, and streamlined visa assistance.'
  },
  {
    name: 'Malita International College',
    country: 'Malta',
    city: 'Valletta',
    state: 'South Eastern Region',
    established: 2018,
    type: 'Private College',
    websiteUrl: 'https://malita.edu.mt',
    featured: true,
    popularPrograms: ['Diploma in Business and Management', 'Certificate in Hospitality and Tourism', 'Advanced Diploma in Information Technology', 'Foundation Studies'],
    avgTuitionAnnualUSD: 5200,
    tagline: 'Career-focused international college in Malta offering recognized vocational and higher education diplomas.',
    description: 'Malita International College delivers accessible European qualifications in business, technology, and hospitality, preparing students for dynamic international careers.'
  },

  // --------------------------------------------------------------------------
  // 12. SWEDEN (10 Universities & Institutes)
  // --------------------------------------------------------------------------
  {
    name: 'Lund University',
    country: 'Sweden',
    city: 'Lund',
    state: 'Skåne',
    established: 1666,
    type: 'Public Research',
    qsRank2027: 75,
    websiteUrl: 'https://www.lunduniversity.lu.se',
    featured: true,
    popularPrograms: ['MSc Wireless Communication', 'International Business & Finance', 'Sustainable Energy Engineering', 'Biotechnology'],
    avgTuitionAnnualUSD: 14000,
    tagline: 'One of northern Europe’s oldest and most prestigious comprehensive research universities, consistently in global top 100.',
    description: 'Lund University, founded in 1666, is consistently ranked among the world’s top 100 universities, offering world-class research and education in southern Sweden.'
  },
  {
    name: 'Jönköping University',
    country: 'Sweden',
    city: 'Jönköping',
    state: 'Jönköping County',
    established: 1977,
    type: 'Private Non-Profit Foundation University',
    websiteUrl: 'https://ju.se',
    featured: true,
    popularPrograms: ['International Financial Analysis', 'Engineering Management', 'Computer Science & Software Development', 'Supply Chain Management'],
    avgTuitionAnnualUSD: 12500,
    tagline: 'Leading internationalized university in Sweden renowned for entrepreneurship, engineering innovation, and AACSB/EQUIS business degrees.',
    description: 'Jönköping University (JU) is celebrated globally for Jönköping International Business School (JIBS) and its School of Engineering, with high student employment rates.'
  },
  {
    name: 'Uppsala University',
    country: 'Sweden',
    city: 'Uppsala',
    state: 'Uppsala County',
    established: 1477,
    type: 'Public Research',
    qsRank2027: 105,
    websiteUrl: 'https://www.uu.se',
    featured: true,
    popularPrograms: ['Data Science & Machine Learning', 'Applied Biotechnology', 'Economics', 'Pharmaceutical Sciences'],
    avgTuitionAnnualUSD: 13500,
    tagline: 'The oldest university in the Nordic countries, offering world-class research faculties and vibrant student nations.',
    description: 'Uppsala University, founded in 1477, is the Nordic region’s first university, renowned for world-changing discoveries from Carl Linnaeus and Anders Celsius to modern life sciences.'
  },
  {
    name: 'Chalmers University of Technology',
    country: 'Sweden',
    city: 'Gothenburg',
    state: 'Västra Götaland',
    established: 1829,
    type: 'Private Research University',
    qsRank2027: 139,
    websiteUrl: 'https://www.chalmers.se',
    featured: true,
    popularPrograms: ['Automotive Engineering', 'Computer Science & Software Engineering', 'Sustainable Electric Power Engineering', 'Nanotechnology'],
    avgTuitionAnnualUSD: 15500,
    tagline: 'World-renowned technological university in Gothenburg with direct industry partnerships with Volvo, Ericsson, and AstraZeneca.',
    description: 'Chalmers University of Technology conducts world-leading research in engineering, architecture, maritime, and natural sciences, driving the green transition and industrial innovation.'
  },
  {
    name: 'Stockholm University',
    country: 'Sweden',
    city: 'Stockholm',
    state: 'Stockholm County',
    established: 1878,
    type: 'Public Research',
    qsRank2027: 118,
    websiteUrl: 'https://www.su.se',
    featured: true,
    popularPrograms: ['Information Systems Management', 'Banking & International Finance', 'Environmental Science', 'Law & Human Rights'],
    avgTuitionAnnualUSD: 13000,
    tagline: 'Leading European capital university situated in Sweden’s National City Park, celebrated for scientific and economic research.',
    description: 'Stockholm University is one of Europe’s leading centers for higher education and research in the humanities and science, located in the Swedish capital.'
  },
  {
    name: 'University of Gothenburg',
    country: 'Sweden',
    city: 'Gothenburg',
    state: 'Västra Götaland',
    established: 1891,
    type: 'Public Research',
    qsRank2027: 187,
    websiteUrl: 'https://www.gu.se',
    featured: true,
    popularPrograms: ['Software Engineering & Management', 'International Business and Trade', 'Global Studies', 'Biomedicine'],
    avgTuitionAnnualUSD: 13200,
    tagline: 'Comprehensive major research university with School of Business, Economics and Law (Triple Crown accredited).',
    description: 'University of Gothenburg meets societal challenges with diverse knowledge across 8 faculties, offering a vibrant urban student experience on the Swedish west coast.'
  },
  {
    name: 'Linköping University (LiU)',
    country: 'Sweden',
    city: 'Linköping',
    state: 'Östergötland',
    established: 1975,
    type: 'Public Research',
    qsRank2027: 304,
    websiteUrl: 'https://liu.se',
    featured: true,
    popularPrograms: ['MSc Computer Science', 'Intelligent Transport Systems', 'Biomedical Engineering', 'Applied Ethology and Animal Biology'],
    avgTuitionAnnualUSD: 13800,
    tagline: 'Pioneering Swedish university leading in IT, artificial intelligence, materials science, and interdisciplinary problem-based learning.',
    description: 'Linköping University is known for student-centered education, high graduate employability, and ground-breaking research in technology and medicine.'
  },
  {
    name: 'Luleå University of Technology',
    country: 'Sweden',
    city: 'Luleå',
    state: 'Norrbotten',
    established: 1971,
    type: 'Public Research',
    websiteUrl: 'https://www.ltu.se',
    featured: true,
    popularPrograms: ['Space Science and Technology', 'Mining and Geotechnical Engineering', 'Information Security', 'Renewable Energy'],
    avgTuitionAnnualUSD: 14200,
    tagline: 'Scandinavia’s northernmost technological university with Europe’s premier space campus and green industrial innovation.',
    description: 'Luleå University of Technology leads applied research in space technology, advanced mining, AI, and green steel transition in northern Sweden.'
  },
  {
    name: 'Umeå University',
    country: 'Sweden',
    city: 'Umeå',
    state: 'Västerbotten',
    established: 1965,
    type: 'Public Research',
    qsRank2027: 465,
    websiteUrl: 'https://www.umu.se',
    featured: true,
    popularPrograms: ['Computational Science and Engineering', 'Public Health', 'Interaction Design', 'Business Development'],
    avgTuitionAnnualUSD: 12800,
    tagline: 'Dynamic university celebrated for world-class Umeå Institute of Design and Nobel Prize-winning CRISPR gene editing research.',
    description: 'Umeå University offers a creative and inspiring environment for education and research, home to top-ranked design, public health, and molecular medicine faculties.'
  },
  {
    name: 'Malmö University',
    country: 'Sweden',
    city: 'Malmö',
    state: 'Skåne',
    established: 1998,
    type: 'Public Research',
    websiteUrl: 'https://mau.se',
    featured: true,
    popularPrograms: ['Computer Science: Innovation for Digital Sustainability', 'Media and Communication Studies', 'Leadership for Sustainability', 'Biomedical Surface Science'],
    avgTuitionAnnualUSD: 11800,
    tagline: 'Modern urban research university in the Öresund region, focused on innovation, sustainability, and multidisciplinary education.',
    description: 'Malmö University is an innovative, multidisciplinary university characterized by its global perspective, collaboration with society, and focus on sustainable development.'
  },

  // --------------------------------------------------------------------------
  // 13. CANADA (10 Universities & Colleges)
  // --------------------------------------------------------------------------
  {
    name: 'Dalhousie University',
    country: 'Canada',
    city: 'Halifax',
    state: 'Nova Scotia',
    established: 1818,
    type: 'Public Research (U15)',
    qsRank2027: 275,
    websiteUrl: 'https://www.dal.ca',
    featured: true,
    popularPrograms: ['Bachelor of Computer Science', 'Bachelor of Commerce', 'Master of Applied Computer Science', 'Engineering'],
    avgTuitionAnnualUSD: 19500,
    tagline: 'Historic U15 research university in Halifax, Nova Scotia, leading in oceans, engineering, and business.',
    description: 'Dalhousie University is one of Canada’s oldest universities, attracting more than 21,000 students from around the world to its oceanfront campuses in Halifax and Truro, Nova Scotia.'
  },
  {
    name: 'Toronto Metropolitan University',
    country: 'Canada',
    city: 'Toronto',
    state: 'Ontario',
    established: 1948,
    type: 'Public Research',
    qsRank2027: '801-850',
    websiteUrl: 'https://www.torontomu.ca',
    featured: true,
    popularPrograms: ['Ted Rogers School of Management (BCom)', 'Computer Science', 'Creative Industries', 'Mechanical Engineering'],
    avgTuitionAnnualUSD: 24000,
    tagline: 'Dynamic career-focused urban innovation university located in downtown Toronto, Ontario.',
    description: 'Toronto Metropolitan University (TMU) is at the intersection of mind and action, renowned for innovative zone learning and industry co-op placements in the heart of Canada’s financial capital.'
  },
  {
    name: 'University of New Brunswick',
    country: 'Canada',
    city: 'Fredericton',
    state: 'New Brunswick',
    established: 1785,
    type: 'Public Comprehensive',
    websiteUrl: 'https://www.unb.ca',
    featured: true,
    popularPrograms: ['Bachelor of Computer Science', 'Bachelor of Business Administration', 'Civil Engineering', 'Nursing'],
    avgTuitionAnnualUSD: 16500,
    tagline: 'Canada’s oldest English-language university with world-class cybersecurity and engineering excellence.',
    description: 'The University of New Brunswick (UNB) operates campuses in Fredericton and Saint John, offering hands-on learning, vibrant entrepreneurship hubs, and affordable Atlantic Canadian living.'
  },
  {
    name: 'Mount Saint Vincent University',
    country: 'Canada',
    city: 'Halifax',
    state: 'Nova Scotia',
    established: 1873,
    type: 'Public University',
    websiteUrl: 'https://www.msvu.ca',
    featured: true,
    popularPrograms: ['Bachelor of Business Administration', 'Applied Human Nutrition', 'Public Relations', 'Child & Youth Study'],
    avgTuitionAnnualUSD: 14500,
    tagline: 'Personalized Atlantic university in Halifax, renowned for public relations, business, and applied nutrition.',
    description: 'Mount Saint Vincent University (The Mount) in Halifax is recognized for small class sizes, dedicated mentorship, and strong cooperative education placements across Nova Scotia.'
  },
  {
    name: 'St. Thomas University',
    country: 'Canada',
    city: 'Fredericton',
    state: 'New Brunswick',
    established: 1910,
    type: 'Public Liberal Arts',
    websiteUrl: 'https://www.stu.ca',
    featured: true,
    popularPrograms: ['Bachelor of Arts in Criminology', 'Human Rights', 'Journalism & Communications', 'Social Work'],
    avgTuitionAnnualUSD: 13800,
    tagline: 'Premier Canadian undergraduate liberal arts university in Fredericton, New Brunswick.',
    description: 'St. Thomas University (STU) is an exclusively undergraduate university specializing in the liberal arts and humanities, offering intimate discussion-based seminars in Fredericton.'
  },
  {
    name: 'University of British Columbia (Okanagan)',
    country: 'Canada',
    city: 'Kelowna',
    state: 'British Columbia',
    established: 2005,
    type: 'Public Research (UBC Campus)',
    qsRank2027: 38,
    websiteUrl: 'https://ok.ubc.ca',
    featured: true,
    popularPrograms: ['Bachelor of Management', 'Computer Science', 'Mechanical Engineering', 'Sustainability & Environmental Science'],
    avgTuitionAnnualUSD: 31000,
    tagline: 'UBC’s dynamic Okanagan campus in Kelowna, offering world-class UBC degrees in a close-knit research community.',
    description: 'UBC Okanagan in Kelowna, British Columbia provides globally recognized University of British Columbia degrees, modern tech facilities, and outdoor lifestyle in the scenic Okanagan Valley.'
  },
  {
    name: 'North Island College',
    country: 'Canada',
    city: 'Courtenay',
    state: 'British Columbia',
    established: 1975,
    type: 'Public Community College',
    websiteUrl: 'https://www.nic.bc.ca',
    featured: true,
    popularPrograms: ['Post-Degree Diploma in Business Administration', 'Interactive Media & Web Design', 'Early Childhood Care', 'Tourism & Hospitality'],
    avgTuitionAnnualUSD: 11500,
    tagline: 'Comprehensive public community college on Vancouver Island offering university transfer and career diplomas.',
    description: 'North Island College (NIC) on beautiful Vancouver Island, British Columbia offers accessible tuition, direct transfer pathways to top Canadian universities, and post-graduation work opportunities.'
  },
  {
    name: 'Laurentian University',
    country: 'Canada',
    city: 'Sudbury',
    state: 'Ontario',
    established: 1960,
    type: 'Public Bilingual University',
    websiteUrl: 'https://laurentian.ca',
    featured: true,
    popularPrograms: ['Mining & Mineral Engineering', 'Forensic Science', 'Bachelor of Commerce', 'Computer Science'],
    avgTuitionAnnualUSD: 18000,
    tagline: 'Northern Ontario public university renowned for engineering, mining innovation, business, and health sciences.',
    description: 'Laurentian University in Sudbury, Ontario offers innovative undergraduate and graduate degrees with strong industry links to mining, environmental remediation, and northern healthcare.'
  },
  {
    name: 'Medicine Hat College',
    country: 'Canada',
    city: 'Medicine Hat',
    state: 'Alberta',
    established: 1965,
    type: 'Public College',
    websiteUrl: 'https://www.mhc.ab.ca',
    featured: true,
    popularPrograms: ['Business Administration Diploma', 'Information Technology', 'Environmental Science', 'Healthcare Aide'],
    avgTuitionAnnualUSD: 10800,
    tagline: 'Friendly Alberta college with affordable tuition, high graduate employment, and Alberta Immigrant Nominee pathways.',
    description: 'Medicine Hat College (MHC) in southern Alberta provides personal attention, practical career training, and affordable cost of living with straightforward pathway opportunities in Alberta.'
  },
  {
    name: 'Lambton College',
    country: 'Canada',
    city: 'Sarnia',
    state: 'Ontario',
    established: 1969,
    type: 'Public Applied Arts & Technology College',
    websiteUrl: 'https://www.lambtoncollege.ca',
    featured: true,
    popularPrograms: ['Postgraduate Certificate in Cloud Computing', 'Advanced Project Management', 'Chemical Production & Power Engineering', 'Cyber Infrastructure Specialist'],
    avgTuitionAnnualUSD: 12800,
    tagline: 'Leader in applied research, mobile and cloud computing, and postgraduate co-op certificates in Ontario.',
    description: 'Lambton College in Sarnia and Toronto/Mississauga provides industry-aligned postgraduate diplomas and certificates, high co-op employment rates, and cutting-edge tech labs.'
  },

  // --------------------------------------------------------------------------
  // 14. NEW ZEALAND (3 Universities)
  // --------------------------------------------------------------------------
  { name: 'University of Auckland', country: 'New Zealand', city: 'Auckland', state: 'Auckland Region', established: 1883, type: 'Public Research', qsRank2027: 65, websiteUrl: 'https://www.auckland.ac.nz', featured: true, popularPrograms: ['Bachelor of Advanced Science', 'Master of Management', 'Computer Systems Engineering', 'Data Science'], avgTuitionAnnualUSD: 24000 },
  { name: 'University of Otago', country: 'New Zealand', city: 'Dunedin', state: 'Otago', established: 1869, type: 'Public Research', qsRank2027: 214, websiteUrl: 'https://www.otago.ac.nz', popularPrograms: ['Medicine & Biomedical Sciences', 'Dentistry', 'Business Analytics', 'Finance'], avgTuitionAnnualUSD: 22000 },
  { name: 'Victoria University of Wellington', country: 'New Zealand', city: 'Wellington', state: 'Wellington Region', established: 1897, type: 'Public Research', qsRank2027: 244, websiteUrl: 'https://www.wgtn.ac.nz', popularPrograms: ['Software Engineering', 'Government & International Relations', 'Design Innovation', 'Commerce'], avgTuitionAnnualUSD: 21500 },

  // --------------------------------------------------------------------------
  // 15. SOUTH KOREA (3 Universities)
  // --------------------------------------------------------------------------
  { name: 'Seoul National University (SNU)', country: 'South Korea', city: 'Seoul', state: 'Gwanak-gu', established: 1946, type: 'National Public Research', qsRank2027: 31, websiteUrl: 'https://en.snu.ac.kr', featured: true, popularPrograms: ['Computer Science & AI', 'Global Business Administration', 'Electrical Engineering', 'Mechanical Engineering'], avgTuitionAnnualUSD: 8000 },
  { name: 'KAIST', country: 'South Korea', city: 'Daejeon', state: 'Yuseong-gu', established: 1971, type: 'National Public Research', qsRank2027: 53, websiteUrl: 'https://www.kaist.ac.kr', featured: true, popularPrograms: ['Artificial Intelligence', 'Robotics Engineering', 'Biotechnology', 'Industrial Design'], avgTuitionAnnualUSD: 7500 },
  { name: 'Yonsei University', country: 'South Korea', city: 'Seoul', state: 'Seodaemun-gu', established: 1885, type: 'Private Research', qsRank2027: 56, websiteUrl: 'https://www.yonsei.ac.kr', popularPrograms: ['Underwood International College (UIC)', 'Business Administration', 'Biotechnology', 'Data Science'], avgTuitionAnnualUSD: 9500 }
];

/**
 * Generates URL-safe unique slug
 */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Transforms a raw collaboration entry into a fully typed GEES University model.
 * Incorporates state, establishment year, university type, official 2027 QS ranking,
 * official website, and distinctive non-boilerplate descriptions.
 */
function buildUniversity(entry: CollaboratedUniversityEntry, index: number): University {
  const countryConfig = getApprovedCountryConfig(entry.country);
  const slug = toSlug(entry.name);
  const city = entry.city || 'Main Campus';
  const state = entry.state;
  const banner = entry.bannerUrl || (countryConfig ? countryConfig.bannerUrl : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop');

  const defaultPrograms = [
    'Computer Science & Artificial Intelligence',
    'Business Administration & Management',
    'Information Technology & Software Systems',
    'Accounting, Banking & Finance'
  ];

  const popularPrograms = entry.popularPrograms || defaultPrograms;

  // Authentic, distinct academic highlight instead of repeated boilerplate text
  const distinctFocus = popularPrograms.slice(0, 2).join(' and ');
  const tagline = entry.tagline || `${entry.type || 'Higher education'} institution in ${city}, offering programs in ${distinctFocus}.`;
  const description = entry.description || `${entry.name} is a recognized ${entry.type ? entry.type.toLowerCase() : 'higher education'} institution in ${city}${state ? `, ${state}` : ''}, ${entry.country}${entry.established ? ` (established ${entry.established})` : ''}. Features academic faculties in ${popularPrograms.join(', ')}.`;

  // Parse numeric world ranking if strictly available from 2027 QS ranking
  let numericRank: number | undefined = undefined;
  if (typeof entry.qsRank2027 === 'number') {
    numericRank = entry.qsRank2027;
  } else if (typeof entry.qsRank2027 === 'string' && !entry.qsRank2027.includes('+') && !entry.qsRank2027.includes('-')) {
    const parsed = parseInt(entry.qsRank2027, 10);
    if (!isNaN(parsed)) numericRank = parsed;
  }

  return {
    id: `uni-${index + 1}`,
    name: entry.name,
    slug,
    country: entry.country,
    countryCode: countryConfig ? countryConfig.code : 'INT',
    flagEmoji: countryConfig ? countryConfig.flagEmoji : '🌐',
    city,
    state,
    established: entry.established,
    type: entry.type || 'Public',
    qsRank2027: entry.qsRank2027,
    websiteUrl: entry.websiteUrl,
    rankingWorld: numericRank,
    rankingNational: entry.rankingNational,
    tagline,
    description,
    logoUrl: entry.logoUrl || `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&auto=format&fit=crop`,
    bannerUrl: banner,
    campuses: entry.campuses || [
      {
        id: `campus-${index + 1}`,
        name: `${entry.name} Campus`,
        city,
        stateOrProvince: state,
        country: entry.country,
        isMainCampus: true
      } as Campus
    ],
    intakes: entry.intakes || (countryConfig ? [countryConfig.intakeText] : ['September', 'January']),
    avgTuitionAnnualUSD: entry.avgTuitionAnnualUSD || 10000,
    currency: countryConfig ? countryConfig.currency : 'USD',
    minIeltsScore: (() => {
      if (numericRank && numericRank <= 150) return 7.0;
      if (numericRank && numericRank <= 500) return 6.5;
      if (entry.country === 'United Kingdom' || entry.country === 'Australia') return 6.0;
      if (entry.type?.toLowerCase().includes('college') || (entry.avgTuitionAnnualUSD && entry.avgTuitionAnnualUSD < 5000)) return 5.5;
      return 6.0;
    })(),
    acceptanceRatePct: 65,
    popularPrograms,
    scholarshipsAvailable: true,
    featured: entry.featured ?? false,
    topRanked: !!entry.qsRank2027,
    accommodations: entry.accommodations,
    articles: entry.articles
  };
}

/**
 * In-memory singleton cache
 */
let builtUniversitiesCache: University[] | null = null;
let builtCoursesCache: Course[] | null = null;

function ensureBuilt(): { universities: University[]; courses: Course[] } {
  if (builtUniversitiesCache && builtCoursesCache) {
    return { universities: builtUniversitiesCache, courses: builtCoursesCache };
  }

  const universities = COLLABORATED_UNIVERSITIES.map((entry, idx) => buildUniversity(entry, idx));
  
  // Generate relevant courses matching university's programs
  const courses: Course[] = [];
  universities.forEach((uni, idx) => {
    const rawEntry = COLLABORATED_UNIVERSITIES[idx];

    // Priority 1: High-fidelity custom courses if explicitly configured
    if (rawEntry && rawEntry.customCourses && rawEntry.customCourses.length > 0) {
      rawEntry.customCourses.forEach((cc, cIdx) => {
        courses.push({
          id: `crs-${uni.id}-${cIdx + 1}`,
          universityId: uni.id,
          universityName: uni.name,
          slug: `${uni.slug}-${toSlug(cc.title || 'program')}`,
          title: cc.title || 'Degree Program',
          level: (cc.level as any) || 'undergraduate',
          department: cc.department || 'Business, Management & Economics',
          durationYears: cc.durationYears || (uni.country === 'United Kingdom' || uni.country === 'Malaysia' ? '3 Years' : '3-4 Years'),
          durationMonths: cc.durationMonths || 36,
          studyMode: (cc.studyMode as any) || 'Full-Time',
          country: uni.country,
          countryCode: uni.countryCode,
          city: cc.city || uni.city,
          state: cc.state || uni.state,
          flagEmoji: uni.flagEmoji,
          universityWebsite: uni.websiteUrl,
          qsRank2027: uni.qsRank2027,
          universityType: uni.type,
          annualFeeUSD: cc.annualFeeUSD || uni.avgTuitionAnnualUSD,
          tuitionFeeLocal: cc.tuitionFeeLocal || `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 1.15).toLocaleString()} / year`,
          tuitionPerYear: cc.tuitionPerYear || `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 1.15).toLocaleString()}`,
          totalTuitionLocal: cc.totalTuitionLocal,
          totalTuitionUSD: cc.totalTuitionUSD,
          ieltsRequirement: cc.ieltsRequirement || 5.5,
          intakes: cc.intakes || uni.intakes,
          scholarshipCoveragePct: cc.scholarshipCoveragePct || 20.0,
          overview: cc.overview || `Accredited degree program at ${uni.name} with industry certification and career placement.`,
          careerProspects: cc.careerProspects || ['Corporate Specialist', 'Project Analyst', 'Industry Consultant'],
          accreditations: cc.accreditations || ['MQA Accredited'],
          entryRequirements: cc.entryRequirements,
          campusName: cc.campusName || `${uni.city} Campus`
        });
      });
      return;
    }

    const prog1 = uni.popularPrograms[0] || 'Computer Science & AI';
    const prog2 = uni.popularPrograms[1] || 'International Business & Finance';
    const prog3 = uni.popularPrograms[2] || 'Data Analytics & Digital Marketing';

    // 1. Undergraduate Program (Bachelor's - 3 or 4 Years, Full-Time)
    courses.push({
      id: `crs-${uni.id}-1`,
      universityId: uni.id,
      universityName: uni.name,
      slug: `${uni.slug}-undergraduate-${toSlug(prog1)}`,
      title: `BSc (Hons) ${prog1}`,
      level: 'undergraduate',
      department: prog1.toLowerCase().includes('business') || prog1.toLowerCase().includes('management') 
        ? 'Business, Management & Economics' 
        : prog1.toLowerCase().includes('health') || prog1.toLowerCase().includes('nurs') || prog1.toLowerCase().includes('pharm') 
        ? 'Medicine, Health & Nursing' 
        : prog1.toLowerCase().includes('law') 
        ? 'Law & Legal Studies' 
        : prog1.toLowerCase().includes('art') || prog1.toLowerCase().includes('design') 
        ? 'Arts, Design & Media'
        : 'Computer Science, IT & Engineering',
      durationYears: uni.country === 'United Kingdom' || uni.country === 'Malaysia' || uni.country === 'Cyprus' ? '3 Years' : '3-4 Years',
      durationMonths: 36,
      studyMode: 'Full-Time',
      country: uni.country,
      countryCode: uni.countryCode,
      city: uni.city,
      state: uni.state,
      flagEmoji: uni.flagEmoji,
      universityWebsite: uni.websiteUrl,
      qsRank2027: uni.qsRank2027,
      universityType: uni.type,
      annualFeeUSD: uni.avgTuitionAnnualUSD,
      tuitionFeeLocal: `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 1.15).toLocaleString()} / year`,
      tuitionPerYear: `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 1.15).toLocaleString()}`,
      ieltsRequirement: 6.0,
      intakes: uni.intakes,
      scholarshipCoveragePct: 20.0,
      overview: `Undergraduate degree in ${prog1} at ${uni.name} with industry accreditation, state-of-the-art facilities, and practical career training.`,
      careerProspects: ['Graduate Analyst', 'Software Engineer', 'Technical Specialist', 'Project Consultant']
    });

    // 2. Postgraduate Program (Master's - 1 or 2 Years, Full-Time / Part-Time)
    courses.push({
      id: `crs-${uni.id}-2`,
      universityId: uni.id,
      universityName: uni.name,
      slug: `${uni.slug}-postgraduate-${toSlug(prog2)}`,
      title: `MSc / MBA ${prog2}`,
      level: 'postgraduate',
      department: 'Business, Management & Economics',
      durationYears: uni.country === 'United Kingdom' ? '1 Year' : '1-2 Years',
      durationMonths: uni.country === 'United Kingdom' ? 12 : 18,
      studyMode: 'Full-Time & Part-Time' as any,
      country: uni.country,
      countryCode: uni.countryCode,
      city: uni.city,
      state: uni.state,
      flagEmoji: uni.flagEmoji,
      universityWebsite: uni.websiteUrl,
      qsRank2027: uni.qsRank2027,
      universityType: uni.type,
      annualFeeUSD: Math.round(uni.avgTuitionAnnualUSD * 1.1),
      tuitionFeeLocal: `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 1.25).toLocaleString()} / year`,
      tuitionPerYear: `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 1.25).toLocaleString()}`,
      ieltsRequirement: 6.5,
      intakes: uni.intakes,
      scholarshipCoveragePct: 25.0,
      overview: `Master's specialization in ${prog2} designed for international professionals seeking leadership advancement and global post-study work opportunities.`,
      careerProspects: ['Business Consultant', 'Operations Lead', 'Project Director', 'Strategic Planner']
    });

    // 3. Online or Pathway / Specialized Program (Online / Hybrid or 2 Years)
    courses.push({
      id: `crs-${uni.id}-3`,
      universityId: uni.id,
      universityName: uni.name,
      slug: `${uni.slug}-online-${toSlug(prog3)}`,
      title: `Executive Master / Diploma in ${prog3}`,
      level: 'postgraduate',
      department: prog3.toLowerCase().includes('data') || prog3.toLowerCase().includes('ai') || prog3.toLowerCase().includes('tech')
        ? 'Computer Science, IT & Engineering'
        : 'Business, Management & Economics',
      durationYears: '2 Years',
      durationMonths: 24,
      studyMode: 'Online',
      country: uni.country,
      countryCode: uni.countryCode,
      city: uni.city,
      state: uni.state,
      flagEmoji: uni.flagEmoji,
      universityWebsite: uni.websiteUrl,
      qsRank2027: uni.qsRank2027,
      universityType: uni.type,
      annualFeeUSD: Math.round(uni.avgTuitionAnnualUSD * 0.75),
      tuitionFeeLocal: `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 0.85).toLocaleString()} / year`,
      tuitionPerYear: `${uni.currency} ${Math.round(uni.avgTuitionAnnualUSD * 0.85).toLocaleString()}`,
      ieltsRequirement: 6.0,
      intakes: uni.intakes,
      scholarshipCoveragePct: 15.0,
      overview: `Flexible online and blended curriculum in ${prog3} allowing students worldwide to earn accredited qualifications while working.`,
      careerProspects: ['Digital Specialist', 'Consultant', 'Systems Strategist', 'Innovation Manager']
    });
  });

  builtUniversitiesCache = universities;
  builtCoursesCache = courses;
  return { universities, courses };
}

/**
 * ============================================================================
 * PUBLIC EXPORTED API FOR ENTIRE PLATFORM
 * ============================================================================
 */

export function getCollaboratedUniversities(): University[] {
  return ensureBuilt().universities;
}

export function getCollaboratedCourses(): Course[] {
  return ensureBuilt().courses;
}

export function getTotalPartnerCount(): number {
  return COLLABORATED_UNIVERSITIES.length;
}

export function getPartnerUniversitiesByCountry(countryName: string): University[] {
  const all = getCollaboratedUniversities();
  if (!countryName || countryName === 'all') return all;
  return all.filter((u) => u.country.toLowerCase() === countryName.toLowerCase());
}

/**
 * Dynamic Tab generator for UI filters (e.g. AnimatedTabs in UniversityExplorerView)
 * Strictly pulls only from approved countries and displays accurate partner counts.
 */
export function getPartnerCountryTabs(): { label: string; id: string }[] {
  const unis = getCollaboratedUniversities();
  const summaryMap = new Map<string, number>();

  unis.forEach((u) => {
    summaryMap.set(u.country, (summaryMap.get(u.country) || 0) + 1);
  });

  const tabs: { label: string; id: string }[] = [
    { label: `All Countries (${getTotalPartnerCount()})`, id: 'all' }
  ];

  // Show active countries first, in approved order
  APPROVED_COUNTRY_NAMES.forEach((countryName) => {
    const count = summaryMap.get(countryName) || 0;
    if (count > 0) {
      tabs.push({
        label: `${countryName} (${count})`,
        id: countryName
      });
    }
  });

  return tabs;
}

export function addCollaboratedUniversity(entry: CollaboratedUniversityEntry): University {
  COLLABORATED_UNIVERSITIES.push(entry);
  builtUniversitiesCache = null;
  builtCoursesCache = null;
  const built = ensureBuilt();
  return built.universities[built.universities.length - 1];
}

export default {
  COLLABORATED_UNIVERSITIES,
  getCollaboratedUniversities,
  getCollaboratedCourses,
  getTotalPartnerCount,
  getPartnerUniversitiesByCountry,
  getPartnerCountryTabs,
  addCollaboratedUniversity
};
