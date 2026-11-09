/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official GEES Partner Universities Verified Coordinate Registry
 * Provides exact latitude/longitude coordinates for all partner universities
 * across the 11 approved study destinations.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface UniversityLocation extends LatLng {
  city: string;
  country: string;
}

/**
 * Fallback Country Center Coordinates
 */
export const COUNTRY_COORDINATES: Record<string, LatLng> = {
  'India': { lat: 20.5937, lng: 78.9629 },
  'United Kingdom': { lat: 54.0000, lng: -2.5000 },
  'Malaysia': { lat: 4.2105, lng: 101.9758 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'New Zealand': { lat: -40.9006, lng: 174.8860 },
  'Cyprus': { lat: 35.1264, lng: 33.4299 },
  'Belgium': { lat: 50.5039, lng: 4.4699 },
  'Finland': { lat: 64.9631, lng: 25.7482 },
  'Greece': { lat: 39.0742, lng: 21.8243 },
  'Mauritius': { lat: -20.3484, lng: 57.5522 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'USA': { lat: 37.0902, lng: -95.7129 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Hungary': { lat: 47.1625, lng: 19.5033 },
  'Malta': { lat: 35.9375, lng: 14.3754 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
};

/**
 * Fallback City Center Coordinates
 */
export const CITY_COORDINATES: Record<string, LatLng> = {
  // USA Cities
  'Wilkes-Barre': { lat: 41.2459, lng: -75.8813 },
  'Washington': { lat: 38.9072, lng: -77.0369 },
  'Angola': { lat: 41.6348, lng: -84.9994 },
  'Bothell': { lat: 47.7601, lng: -122.2054 },
  'Hoboken': { lat: 40.7440, lng: -74.0324 },
  'Baltimore': { lat: 39.2904, lng: -76.6122 },
  'Jonesboro': { lat: 35.8423, lng: -90.7043 },
  'Mankato': { lat: 44.1636, lng: -93.9994 },
  'Glassboro': { lat: 39.7029, lng: -75.1118 },
  'Pensacola': { lat: 30.4213, lng: -87.2169 },
  'Pittsburgh': { lat: 40.4406, lng: -79.9959 },
  'Waltham': { lat: 42.3765, lng: -71.2356 },
  'Milwaukee': { lat: 43.0389, lng: -87.9065 },
  'Mount Pleasant': { lat: 43.5978, lng: -84.7675 },

  // UK Cities
  'London': { lat: 51.5074, lng: -0.1278 },
  'Birmingham': { lat: 52.4862, lng: -1.8904 },
  'Manchester': { lat: 53.4808, lng: -2.2426 },
  'Edinburgh': { lat: 55.9533, lng: -3.1883 },
  'Glasgow': { lat: 55.8642, lng: -4.2518 },
  'Belfast': { lat: 54.5973, lng: -5.9301 },
  'Cardiff': { lat: 51.4816, lng: -3.1791 },
  'Aberystwyth': { lat: 52.4153, lng: -4.0642 },
  'Poole': { lat: 50.7151, lng: -1.9872 },
  'Bangor': { lat: 53.2285, lng: -4.1280 },
  'Uxbridge': { lat: 51.5447, lng: -0.4760 },
  'High Wycombe': { lat: 51.6288, lng: -0.7512 },
  'Canterbury': { lat: 51.2789, lng: 1.0886 },
  'Cambridge': { lat: 52.2053, lng: 0.1218 },
  'Coventry': { lat: 52.4081, lng: -1.5065 },
  'Cranfield': { lat: 52.0732, lng: -0.6272 },
  'Leicester': { lat: 52.6294, lng: -1.1384 },
  'Ormskirk': { lat: 53.5642, lng: -2.8710 },
  'Falmouth': { lat: 50.1517, lng: -5.0725 },
  'Brighton': { lat: 50.8225, lng: -0.1372 },
  'Keele': { lat: 52.9998, lng: -2.2682 },
  'Kingston upon Thames': { lat: 51.4036, lng: -0.3039 },
  'Lancaster': { lat: 54.0104, lng: -2.7858 },
  'Leeds': { lat: 53.8008, lng: -1.5491 },
  'Liverpool': { lat: 53.4084, lng: -2.9916 },
  'Loughborough': { lat: 52.7663, lng: -1.2294 },
  'Newcastle upon Tyne': { lat: 54.9783, lng: -1.6178 },
  'Norwich': { lat: 52.6309, lng: 1.2974 },
  'Nottingham': { lat: 52.9548, lng: -1.1581 },
  'Oxford': { lat: 51.7520, lng: -1.2577 },
  'Aberdeen': { lat: 57.1497, lng: -2.0943 },
  'Sheffield': { lat: 53.3811, lng: -1.4701 },
  'Southampton': { lat: 50.9097, lng: -1.4044 },
  'Stoke-on-Trent': { lat: 53.0027, lng: -2.1794 },
  'Swansea': { lat: 51.6214, lng: -3.9436 },
  'Middlesbrough': { lat: 54.5742, lng: -1.2350 },
  'Reading': { lat: 51.4543, lng: -0.9781 },
  'Luton': { lat: 51.8787, lng: -0.4200 },
  'Bolton': { lat: 53.5769, lng: -2.4282 },
  'Bradford': { lat: 53.7960, lng: -1.7594 },
  'Buckingham': { lat: 51.9961, lng: -0.9880 },
  'Preston': { lat: 53.7632, lng: -2.7072 },
  'Chester': { lat: 53.1930, lng: -2.8931 },
  'Derby': { lat: 52.9225, lng: -1.4746 },
  'Dundee': { lat: 56.4620, lng: -2.9707 },
  'Colchester': { lat: 51.8892, lng: 0.9042 },
  'Cheltenham': { lat: 51.8994, lng: -2.0783 },
  'Hatfield': { lat: 51.7629, lng: -0.2285 },
  'Huddersfield': { lat: 53.6458, lng: -1.7850 },
  'Hull': { lat: 53.7676, lng: -0.3274 },
  'Lincoln': { lat: 53.2307, lng: -0.5406 },
  'Northampton': { lat: 52.2405, lng: -0.9027 },
  'Plymouth': { lat: 50.3755, lng: -4.1427 },
  'Portsmouth': { lat: 50.8036, lng: -1.0750 },
  'Salford': { lat: 53.4875, lng: -2.2901 },
  'Pontypridd': { lat: 51.6022, lng: -3.3423 },
  'Stirling': { lat: 56.1165, lng: -3.9369 },
  'Ipswich': { lat: 52.0567, lng: 1.1482 },
  'Sunderland': { lat: 54.9069, lng: -1.3811 },
  'Guildford': { lat: 51.2362, lng: -0.5704 },
  'Inverness': { lat: 57.4778, lng: -4.2247 },
  'Bristol': { lat: 51.4545, lng: -2.5879 },
  'Paisley': { lat: 55.8456, lng: -4.4239 },
  'Carmarthen': { lat: 51.8582, lng: -4.3182 },
  'Wolverhampton': { lat: 52.5862, lng: -2.1288 },
  'Worcester': { lat: 52.1936, lng: -2.2216 },
  'York': { lat: 53.9599, lng: -1.0873 },
  'Wrexham': { lat: 53.0430, lng: -2.9925 },

  // Malaysia Cities
  'Kuala Lumpur': { lat: 3.1390, lng: 101.6869 },
  'Subang Jaya': { lat: 3.0567, lng: 101.5851 },
  'Bandar Sunway': { lat: 3.0678, lng: 101.6036 },
  'Cyberjaya': { lat: 2.9213, lng: 101.6559 },
  'Putrajaya': { lat: 2.9264, lng: 101.6964 },
  'Penang': { lat: 5.4164, lng: 100.3327 },
  'Johor Bahru': { lat: 1.4927, lng: 103.7414 },
  'Shah Alam': { lat: 3.0738, lng: 101.5183 },
  'Nilai': { lat: 2.8188, lng: 101.7808 },
  'Sepang': { lat: 2.8182, lng: 101.6917 },
  'Semenyih': { lat: 2.9438, lng: 101.8738 },
  'Kota Damansara': { lat: 3.1488, lng: 101.5778 },

  // Australia Cities
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Melbourne': { lat: -37.8136, lng: 144.9631 },
  'Brisbane': { lat: -27.4705, lng: 153.0260 },
  'Canberra': { lat: -35.2809, lng: 149.1300 },
  'Perth': { lat: -31.9505, lng: 115.8605 },
  'Adelaide': { lat: -34.9285, lng: 138.6007 },
  'Gold Coast': { lat: -28.0167, lng: 153.4000 },
  'Hobart': { lat: -42.8821, lng: 147.3272 },
  'Wollongong': { lat: -34.4278, lng: 150.8931 },
  'Townsville': { lat: -19.2590, lng: 146.8169 },
  'Cairns': { lat: -16.9186, lng: 145.7781 },
  'Bathurst': { lat: -33.4193, lng: 149.5775 },
  'Wagga Wagga': { lat: -35.1082, lng: 147.3598 },
  'Rockhampton': { lat: -23.3750, lng: 150.5118 },
  'Hawthorn': { lat: -37.8222, lng: 145.0344 },

  // Canada Cities
  'Toronto': { lat: 43.6532, lng: -79.3832 },
  'Vancouver': { lat: 49.2827, lng: -123.1207 },
  'Montreal': { lat: 45.5017, lng: -73.5673 },
  'Ottawa': { lat: 45.4215, lng: -75.6972 },
  'Halifax': { lat: 44.6488, lng: -63.5752 },
  'Fredericton': { lat: 45.9636, lng: -66.6431 },
  'Kelowna': { lat: 49.8880, lng: -119.4960 },
  'Courtenay': { lat: 49.6866, lng: -124.9936 },
  'Sudbury': { lat: 46.4917, lng: -80.9930 },
  'Medicine Hat': { lat: 50.0421, lng: -110.6775 },
  'Sarnia': { lat: 42.9745, lng: -82.4066 },

  // New Zealand Cities
  'Auckland': { lat: -36.8485, lng: 174.7633 },
  'Wellington': { lat: -41.2865, lng: 174.7762 },
  'Christchurch': { lat: -43.5321, lng: 172.6362 },
  'Dunedin': { lat: -45.8788, lng: 170.5028 },
  'Hamilton': { lat: -37.7870, lng: 175.2793 },
  'Palmerston North': { lat: -40.3523, lng: 175.6082 },
  'Lincoln, NZ': { lat: -43.6400, lng: 172.4860 },

  // Netherlands Cities
  'Amsterdam': { lat: 52.3676, lng: 4.9041 },
  'Delft': { lat: 52.0116, lng: 4.3571 },
  'Utrecht': { lat: 52.0907, lng: 5.1214 },
  'Leiden': { lat: 52.1601, lng: 4.4970 },
  'Rotterdam': { lat: 51.9244, lng: 4.4777 },
  'Eindhoven': { lat: 51.4416, lng: 5.4697 },
  'Groningen': { lat: 53.2194, lng: 6.5665 },
  'Wageningen': { lat: 51.9692, lng: 5.6654 },
  'Maastricht': { lat: 50.8514, lng: 5.6910 },

  // Finland Cities
  'Helsinki': { lat: 60.1699, lng: 24.9384 },
  'Espoo': { lat: 60.2055, lng: 24.6559 },
  'Tampere': { lat: 61.4978, lng: 23.7610 },
  'Turku': { lat: 60.4518, lng: 22.2666 },
  'Oulu': { lat: 65.0121, lng: 25.4651 },
  'Lappeenranta': { lat: 61.0587, lng: 28.1887 },
  'Vaasa': { lat: 63.0951, lng: 21.6165 },

  // Belgium Cities
  'Brussels': { lat: 50.8503, lng: 4.3517 },
  'Leuven': { lat: 50.8798, lng: 4.7005 },
  'Ghent': { lat: 51.0543, lng: 3.7174 },
  'Louvain-la-Neuve': { lat: 50.6681, lng: 4.6118 },
  'Antwerp': { lat: 51.2194, lng: 4.4025 },
  'Liège': { lat: 50.6326, lng: 5.5797 },

  // Cyprus Cities
  'Nicosia': { lat: 35.1856, lng: 33.3823 },
  'Limassol': { lat: 34.6786, lng: 33.0413 },
  'Famagusta': { lat: 35.1250, lng: 33.9500 },
  'Paphos': { lat: 34.7754, lng: 32.4245 },

  // Greece Cities
  'Athens': { lat: 37.9838, lng: 23.7275 },
  'Thessaloniki': { lat: 40.6401, lng: 22.9444 },
  'Heraklion': { lat: 35.3387, lng: 25.1442 },
  'Patras': { lat: 38.2466, lng: 21.7345 },
  'Volos': { lat: 39.3621, lng: 22.9422 },

  // Mauritius Cities
  'Moka': { lat: -20.2183, lng: 57.4958 },
  'Flic en Flac': { lat: -20.2782, lng: 57.3782 },
  'Ebène': { lat: -20.2412, lng: 57.4882 },
  'Rose Hill': { lat: -20.2382, lng: 57.4722 },
  'Port Louis': { lat: -20.1609, lng: 57.5012 },

  // India Cities
  'Guwahati': { lat: 26.1445, lng: 91.7362 },

  // Hungary Cities
  'Debrecen': { lat: 47.5316, lng: 21.6273 },
  'Sopron': { lat: 47.6865, lng: 16.5847 },
  'Budapest': { lat: 47.4979, lng: 19.0402 },

  // France Cities
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Nancy': { lat: 48.6921, lng: 6.1844 },
  'Rennes': { lat: 48.1173, lng: -1.6778 },

  // Malta Cities
  'St. Julian’s': { lat: 35.9186, lng: 14.4900 },
  "St. Julian's": { lat: 35.9186, lng: 14.4900 },
  'Valletta': { lat: 35.8989, lng: 14.5146 },
  'Sliema': { lat: 35.9122, lng: 14.5042 },
  'Msida': { lat: 35.8978, lng: 14.4842 },

  // Sweden Cities
  'Stockholm': { lat: 59.3293, lng: 18.0686 },
  'Lund': { lat: 55.7047, lng: 13.1910 },
  'Uppsala': { lat: 59.8586, lng: 17.6389 },
  'Gothenburg': { lat: 57.7089, lng: 11.9746 },
  'Linköping': { lat: 58.4108, lng: 15.6214 },
  'Jönköping': { lat: 57.7826, lng: 14.1618 },
  'Luleå': { lat: 65.5848, lng: 22.1567 },
  'Umeå': { lat: 63.8258, lng: 20.2630 },
  'Malmö': { lat: 55.6050, lng: 13.0038 },
};

/**
 * Verified Specific Partner University Coordinates
 */
export const VERIFIED_UNIVERSITY_COORDINATES: Record<string, LatLng> = {
  // Hungary Partner Universities
  'University of Debrecen': { lat: 47.5529, lng: 21.6234 },
  'University of Sopron': { lat: 47.6796, lng: 16.5786 },
  'Corvinus University': { lat: 47.4862, lng: 19.0578 },

  // France Partner Universities & Business Schools
  'ICN Business School': { lat: 48.6833, lng: 6.1614 },
  'ISTEC Business School': { lat: 48.8741, lng: 2.3683 },
  'Rennes School of Business': { lat: 48.1308, lng: -1.6961 },
  'Rennes Graduate School of Management': { lat: 48.1186, lng: -1.6739 },

  // Malta Partner Universities & Colleges
  'GBS Malta': { lat: 35.9186, lng: 14.4900 },
  'Malita International College': { lat: 35.8989, lng: 14.5146 },

  // Sweden Partner Universities & Institutes
  'Lund University': { lat: 55.7118, lng: 13.1970 },
  'Jönköping University': { lat: 57.7782, lng: 14.1610 },
  'Uppsala University': { lat: 59.8575, lng: 17.6291 },
  'Chalmers University of Technology': { lat: 57.6888, lng: 11.9782 },
  'Stockholm University': { lat: 59.3639, lng: 18.0587 },
  'University of Gothenburg': { lat: 57.6983, lng: 11.9714 },
  'Linköping University (LiU)': { lat: 58.3986, lng: 15.5786 },
  'Luleå University of Technology': { lat: 65.6180, lng: 22.1402 },
  'Umeå University': { lat: 63.8206, lng: 20.3075 },
  'Malmö University': { lat: 55.6108, lng: 12.9942 },

  // USA Partner Universities
  'Wilkes University': { lat: 41.2467, lng: -75.8872 },
  'University of Potomac': { lat: 38.9056, lng: -77.0378 },
  'Trine University': { lat: 41.6319, lng: -85.0177 },
  'Cascadia College': { lat: 47.7597, lng: -122.1916 },
  'Stevens Institute of Technology': { lat: 40.7448, lng: -74.0255 },
  'University of Maryland Baltimore County (UMBC)': { lat: 39.2556, lng: -76.7110 },
  'Arkansas State University': { lat: 35.8427, lng: -90.6782 },
  'Minnesota State University': { lat: 44.1450, lng: -93.9990 },
  'Rowan University': { lat: 39.7099, lng: -75.1197 },
  'University of West Florida': { lat: 30.5484, lng: -87.2180 },
  'Duquesne University': { lat: 40.4369, lng: -79.9904 },
  'Brandeis University – School of Business and Economics': { lat: 42.3657, lng: -71.2586 },
  'Marquette University': { lat: 43.0387, lng: -87.9304 },
  'Central Michigan University': { lat: 43.5898, lng: -84.7770 },

  // India
  'Assam Down Town University': { lat: 26.1445, lng: 91.7362 },

  // UK Featured & Premier
  "King's College London": { lat: 51.5115, lng: -0.1160 },
  'Lancaster University': { lat: 54.0104, lng: -2.7858 },
  'Loughborough University': { lat: 52.7663, lng: -1.2294 },
  'Queens University of Belfast': { lat: 54.5847, lng: -5.9348 },
  'Aston University': { lat: 52.4868, lng: -1.8887 },
  'Aston University London': { lat: 51.5165, lng: -0.0768 },
  'Ulster University': { lat: 54.6042, lng: -5.9287 },
  'Ravensbourne University': { lat: 51.5015, lng: 0.0075 },
  'Roehampton University': { lat: 51.4578, lng: -0.2443 },
  'Buckinghamshire New University': { lat: 51.6288, lng: -0.7512 },
  'Brunel University': { lat: 51.5323, lng: -0.4731 },
  'Coventry University': { lat: 52.4081, lng: -1.5065 },
  'Aberystwyth University': { lat: 52.4153, lng: -4.0642 },
  'Bangor University': { lat: 53.2285, lng: -4.1280 },
  'Birkbeck University, London': { lat: 51.5222, lng: -0.1302 },
  'Birmingham City University': { lat: 52.4831, lng: -1.8841 },
  'De Montfort University': { lat: 52.6294, lng: -1.1384 },
  'Edinburgh Napier University': { lat: 55.9181, lng: -3.2396 },
  'Glasgow Caledonian University': { lat: 55.8664, lng: -4.2503 },
  'Heriot-Watt University': { lat: 55.9113, lng: -3.3213 },
  'Keele University': { lat: 52.9998, lng: -2.2682 },
  'Kingston University': { lat: 51.4036, lng: -0.3039 },
  'Northumbria University': { lat: 54.9785, lng: -1.6062 },
  'Nottingham Trent University': { lat: 52.9582, lng: -1.1501 },
  'University of Reading': { lat: 51.4414, lng: -0.9418 },
  'University of Aberdeen': { lat: 57.1648, lng: -2.1023 },
  'University of Bradford': { lat: 53.7915, lng: -1.7618 },
  'University of Dundee': { lat: 56.4582, lng: -2.9822 },
  'University of East Anglia': { lat: 52.6219, lng: 1.2382 },
  'University of Essex': { lat: 51.8782, lng: 0.9452 },
  'University of Greenwich': { lat: 51.4828, lng: -0.0062 },
  'University of Hertfordshire': { lat: 51.7532, lng: -0.2422 },
  'University of Huddersfield': { lat: 53.6432, lng: -1.7782 },
  'University of Hull': { lat: 53.7712, lng: -0.3682 },
  'University of Kent': { lat: 51.2972, lng: 1.0682 },
  'University of Lincoln': { lat: 53.2282, lng: -0.5482 },
  'University of Plymouth': { lat: 50.3752, lng: -4.1382 },
  'University of Portsmouth': { lat: 50.7982, lng: -1.0982 },
  'University of Salford': { lat: 53.4852, lng: -2.2732 },

  // Malaysia
  'Universiti Malaya (UM)': { lat: 3.1209, lng: 101.6538 },
  'Universiti Teknologi Malaysia (UTM)': { lat: 1.5588, lng: 103.6377 },
  'Universiti Sains Malaysia (USM)': { lat: 5.3560, lng: 100.3023 },
  "Taylor's University": { lat: 3.0628, lng: 101.6169 },
  'Sunway University': { lat: 3.0678, lng: 101.6036 },
  'Asia Pacific University (APU)': { lat: 3.0558, lng: 101.6997 },
  'Heriot-Watt University Malaysia': { lat: 2.9038, lng: 101.6708 },
  'Monash University Malaysia': { lat: 3.0648, lng: 101.6006 },

  // Australia Partner Universities
  'University of Wollongong': { lat: -34.4054, lng: 150.8784 },
  'La Trobe University Sydney': { lat: -33.8732, lng: 151.2069 },
  'University of Tasmania': { lat: -42.9038, lng: 147.3248 },
  'James Cook University': { lat: -19.3283, lng: 146.7567 },
  'Charles Sturt University': { lat: -33.4272, lng: 149.5606 },
  'CQUniversity Australia': { lat: -23.3284, lng: 150.5186 },
  'University of New South Wales': { lat: -33.9173, lng: 151.2313 },
  'UNSW Sydney': { lat: -33.9173, lng: 151.2313 },
  'University of Newcastle': { lat: -32.8936, lng: 151.7039 },
  'RMIT University, Melbourne': { lat: -37.8078, lng: 144.9633 },
  'Swinburne University of Technology': { lat: -37.8222, lng: 145.0389 },

  // Canada Partner Universities & Colleges
  'Dalhousie University': { lat: 44.6366, lng: -63.5917 },
  'Toronto Metropolitan University': { lat: 43.6577, lng: -79.3788 },
  'University of New Brunswick': { lat: 45.9454, lng: -66.6416 },
  'Mount Saint Vincent University': { lat: 44.6931, lng: -63.6689 },
  'St. Thomas University': { lat: 45.9490, lng: -66.6433 },
  'University of British Columbia (Okanagan)': { lat: 49.9400, lng: -119.3958 },
  'North Island College': { lat: 49.7042, lng: -124.9786 },
  'Laurentian University': { lat: 46.4678, lng: -80.9739 },
  'Medicine Hat College': { lat: 50.0165, lng: -110.7067 },
  'Lambton College': { lat: 42.9772, lng: -82.3524 },

  // New Zealand
  'University of Auckland': { lat: -36.8522, lng: 174.7692 },
  'University of Otago': { lat: -45.8652, lng: 170.5142 },
  'Victoria University of Wellington': { lat: -41.2882, lng: 174.7682 },
  'University of Canterbury': { lat: -43.5232, lng: 172.5822 },

  // Netherlands
  'University of Amsterdam': { lat: 52.3682, lng: 4.8952 },
  'Delft University of Technology': { lat: 52.0012, lng: 4.3722 },
  'Utrecht University': { lat: 52.0882, lng: 5.1722 },
  'Leiden University': { lat: 52.1572, lng: 4.4822 },

  // Finland
  'University of Helsinki': { lat: 60.1702, lng: 24.9502 },
  'Aalto University': { lat: 60.1852, lng: 24.8322 },

  // Belgium
  'KU Leuven': { lat: 50.8782, lng: 4.7002 },
  'Ghent University': { lat: 51.0472, lng: 3.7282 },

  // Cyprus
  'University of Cyprus': { lat: 35.1452, lng: 33.4082 },

  // Greece
  'National and Kapodistrian University of Athens': { lat: 37.9782, lng: 23.7382 },

  // Mauritius
  'University of Mauritius': { lat: -20.2332, lng: 57.4982 },
};

/**
 * Deterministic hash to generate subtle jitter for overlapping coordinates
 */
function getHashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Helper to retrieve accurate verified LatLng for any partner university entry
 */
export function getUniversityLatLng(uni: {
  id?: string;
  name: string;
  city?: string;
  country?: string;
}): LatLng {
  // 1. Direct match by university name
  if (VERIFIED_UNIVERSITY_COORDINATES[uni.name]) {
    return VERIFIED_UNIVERSITY_COORDINATES[uni.name];
  }

  // 2. City match
  if (uni.city && CITY_COORDINATES[uni.city]) {
    const base = CITY_COORDINATES[uni.city];
    // Add deterministic micro-jitter based on name so overlapping city markers spread slightly
    const hash = Math.abs(getHashString(uni.name));
    const jitterLat = ((hash % 100) - 50) * 0.0003;
    const jitterLng = (((hash / 100) % 100) - 50) * 0.0003;
    return {
      lat: base.lat + jitterLat,
      lng: base.lng + jitterLng,
    };
  }

  // 3. Country match
  if (uni.country && COUNTRY_COORDINATES[uni.country]) {
    const base = COUNTRY_COORDINATES[uni.country];
    const hash = Math.abs(getHashString(uni.name));
    const jitterLat = ((hash % 100) - 50) * 0.015;
    const jitterLng = (((hash / 100) % 100) - 50) * 0.015;
    return {
      lat: base.lat + jitterLat,
      lng: base.lng + jitterLng,
    };
  }

  // Default global center (Europe/UK default)
  return { lat: 51.5074, lng: -0.1278 };
}
