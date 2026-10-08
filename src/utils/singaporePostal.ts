// Singapore Postal Sector to Planning Region, Town and SVG Coordinate mappings
// Singapore uses 6-digit postal codes: first 2 digits denote postal sector.

export interface PostalSectorInfo {
  region: 'Central' | 'East' | 'West' | 'North' | 'North-East';
  town: string;
  mapX: number;
  mapY: number;
}

export const POSTAL_SECTOR_MAP: Record<string, PostalSectorInfo> = {
  // 01 - 06: Raffles Place, Cecil, Marina, People's Park, Shenton Way
  '01': { region: 'Central', town: 'Marina Bay / Downtown Core', mapX: 52, mapY: 62 },
  '02': { region: 'Central', town: 'Tanjong Pagar / Shenton Way', mapX: 49, mapY: 64 },
  '03': { region: 'Central', town: 'Marina Bay / City Hall', mapX: 53, mapY: 59 },
  '04': { region: 'Central', town: 'Raffles Place / Downtown', mapX: 51, mapY: 61 },
  '05': { region: 'Central', town: 'Chinatown / People\'s Park', mapX: 48, mapY: 60 },
  '06': { region: 'Central', town: 'Shenton Way / Robinson Rd', mapX: 50, mapY: 63 },
  '07': { region: 'Central', town: 'Anson / Tanjong Pagar', mapX: 49, mapY: 63 },
  '08': { region: 'Central', town: 'Tanjong Pagar / Cantonment', mapX: 48, mapY: 62 },
  // 09 - 10: Telok Blangah, Harbourfront
  '09': { region: 'Central', town: 'Harbourfront / Telok Blangah', mapX: 45, mapY: 67 },
  '10': { region: 'Central', town: 'Bukit Merah / Telok Blangah', mapX: 44, mapY: 65 },
  // 11 - 13: Pasir Panjang, Hong Leong Garden, Clementi
  '11': { region: 'Central', town: 'Pasir Panjang', mapX: 38, mapY: 64 },
  '12': { region: 'West', town: 'West Coast / Clementi', mapX: 34, mapY: 59 },
  '13': { region: 'Central', town: 'Buona Vista / One-North', mapX: 38, mapY: 56 },
  // 14 - 16: Queenstown, Tiong Bahru, Redhill
  '14': { region: 'Central', town: 'Queenstown', mapX: 42, mapY: 58 },
  '15': { region: 'Central', town: 'Bukit Merah / Redhill', mapX: 43, mapY: 60 },
  '16': { region: 'Central', town: 'Tiong Bahru', mapX: 46, mapY: 59 },
  // 17 - 21: High Street, Beach Road, City Hall, Bugis, Little India
  '17': { region: 'Central', town: 'High Street / City Hall', mapX: 51, mapY: 56 },
  '18': { region: 'Central', town: 'Bugis / Rochor', mapX: 53, mapY: 54 },
  '19': { region: 'Central', town: 'Beach Road / Kampong Glam', mapX: 55, mapY: 53 },
  '20': { region: 'Central', town: 'Jalan Besar / Farrer Park', mapX: 53, mapY: 51 },
  '21': { region: 'Central', town: 'Little India / Farrer Park', mapX: 52, mapY: 50 },
  // 22 - 23: Orchard, Somerset, Cairnhill, River Valley
  '22': { region: 'Central', town: 'Orchard / Somerset / Cairnhill', mapX: 47, mapY: 54 },
  '23': { region: 'Central', town: 'River Valley / Orchard Boulevard', mapX: 46, mapY: 55 },
  // 24 - 27: Tanglin, Holland, Bukit Timah
  '24': { region: 'Central', town: 'Tanglin / Napier / Botanic Gardens', mapX: 44, mapY: 53 },
  '25': { region: 'Central', town: 'Bukit Timah / Stevens Rd', mapX: 43, mapY: 50 },
  '26': { region: 'Central', town: 'Holland Road / Coronation', mapX: 40, mapY: 52 },
  '27': { region: 'Central', town: 'Holland Village / Sixth Avenue', mapX: 39, mapY: 53 },
  // 28 - 30: Novena, Newton, Thomson, Balestier
  '28': { region: 'Central', town: 'Watten / Shelford / Dunearn', mapX: 42, mapY: 48 },
  '29': { region: 'Central', town: 'Novena / Thomson Road', mapX: 50, mapY: 46 },
  '30': { region: 'Central', town: 'Novena / Balestier / Moulmein', mapX: 52, mapY: 47 },
  // 31 - 33: Toa Payoh, Serangoon, Boon Keng
  '31': { region: 'Central', town: 'Toa Payoh', mapX: 53, mapY: 44 },
  '32': { region: 'Central', town: 'Balestier / Whampoa', mapX: 54, mapY: 46 },
  '33': { region: 'Central', town: 'Boon Keng / Kallang', mapX: 56, mapY: 48 },
  // 34 - 37: Macpherson, Braddell, Potong Pasir
  '34': { region: 'Central', town: 'MacPherson / Circuit Rd', mapX: 60, mapY: 46 },
  '35': { region: 'Central', town: 'Potong Pasir / Bidadari', mapX: 57, mapY: 43 },
  '36': { region: 'Central', town: 'Aljunied / MacPherson', mapX: 61, mapY: 48 },
  '37': { region: 'Central', town: 'Kallang Way', mapX: 58, mapY: 49 },
  // 38 - 41: Geylang, Eunos, Paya Lebar
  '38': { region: 'Central', town: 'Geylang East', mapX: 62, mapY: 50 },
  '39': { region: 'Central', town: 'Geylang / Guillemard', mapX: 60, mapY: 51 },
  '40': { region: 'East', town: 'Paya Lebar / Eunos', mapX: 64, mapY: 48 },
  '41': { region: 'East', town: 'Eunos / Kaki Bukit', mapX: 67, mapY: 47 },
  // 42 - 45: Katong, Joo Chiat, Marine Parade, Siglap
  '42': { region: 'East', town: 'Joo Chiat / Katong', mapX: 66, mapY: 53 },
  '43': { region: 'East', town: 'Tanjong Katong / Dunman', mapX: 64, mapY: 54 },
  '44': { region: 'East', town: 'Marine Parade', mapX: 68, mapY: 56 },
  '45': { region: 'East', town: 'Siglap / Frankel', mapX: 71, mapY: 54 },
  // 46 - 48: Bedok, Bayshore, Upper East Coast
  '46': { region: 'East', town: 'Bedok Central / Reservoir', mapX: 73, mapY: 49 },
  '47': { region: 'East', town: 'Bedok North / Chai Chee', mapX: 72, mapY: 47 },
  '48': { region: 'East', town: 'Upper East Coast / Bayshore', mapX: 75, mapY: 52 },
  // 49 - 50: Loyang, Changi
  '49': { region: 'East', town: 'Loyang / Flora', mapX: 84, mapY: 42 },
  '50': { region: 'East', town: 'Changi / Tanah Merah', mapX: 86, mapY: 46 },
  // 51 - 52: Pasir Ris, Tampines
  '51': { region: 'East', town: 'Pasir Ris', mapX: 80, mapY: 37 },
  '52': { region: 'East', town: 'Tampines', mapX: 78, mapY: 43 },
  // 53 - 55: Serangoon, Hougang, Punggol, Sengkang
  '53': { region: 'North-East', town: 'Hougang / Kovan', mapX: 63, mapY: 38 },
  '54': { region: 'North-East', town: 'Sengkang', mapX: 67, mapY: 32 },
  '55': { region: 'North-East', town: 'Serangoon Gardens', mapX: 58, mapY: 40 },
  // 56 - 57: Ang Mo Kio, Bishan
  '56': { region: 'North-East', town: 'Ang Mo Kio', mapX: 54, mapY: 37 },
  '57': { region: 'Central', town: 'Bishan', mapX: 51, mapY: 42 },
  // 58 - 59: Upper Bukit Timah, Clementi Park
  '58': { region: 'West', town: 'Upper Bukit Timah / Beauty World', mapX: 36, mapY: 46 },
  '59': { region: 'West', town: 'Hillview / Dairy Farm', mapX: 35, mapY: 43 },
  // 60 - 64: Jurong, Boon Lay, Tuas
  '60': { region: 'West', town: 'Jurong East', mapX: 28, mapY: 49 },
  '61': { region: 'West', town: 'Jurong Industrial / West Coast', mapX: 26, mapY: 54 },
  '62': { region: 'West', town: 'Tuas / Pioneer', mapX: 18, mapY: 53 },
  '63': { region: 'West', town: 'Pioneer / Jurong West', mapX: 21, mapY: 48 },
  '64': { region: 'West', town: 'Jurong West / Boon Lay', mapX: 24, mapY: 46 },
  // 65 - 68: Bukit Batok, Bukit Panjang, Choa Chu Kang
  '65': { region: 'West', town: 'Bukit Batok', mapX: 31, mapY: 43 },
  '66': { region: 'West', town: 'Bukit Batok West / Tengah', mapX: 29, mapY: 41 },
  '67': { region: 'West', town: 'Bukit Panjang', mapX: 34, mapY: 36 },
  '68': { region: 'West', town: 'Choa Chu Kang', mapX: 28, mapY: 35 },
  // 69 - 71: Tengah, Kranji, Sungei Kadut
  '69': { region: 'West', town: 'Tengah / Keat Hong', mapX: 26, mapY: 38 },
  '70': { region: 'North', town: 'Lim Chu Kang', mapX: 21, mapY: 30 },
  '71': { region: 'North', town: 'Kranji / Sungei Kadut', mapX: 32, mapY: 26 },
  // 72 - 73: Woodlands
  '72': { region: 'North', town: 'Woodlands South / Mandai', mapX: 37, mapY: 23 },
  '73': { region: 'North', town: 'Woodlands Central / Marsiling', mapX: 38, mapY: 20 },
  // 75 - 76: Sembawang, Yishun
  '75': { region: 'North', town: 'Sembawang / Canberra', mapX: 45, mapY: 19 },
  '76': { region: 'North', town: 'Yishun / Khatib', mapX: 50, mapY: 24 },
  // 77 - 78: Upper Thomson, Springleaf
  '77': { region: 'North', town: 'Upper Thomson / Springleaf', mapX: 47, mapY: 30 },
  '78': { region: 'North', town: 'Mandai / Seletar West', mapX: 52, mapY: 28 },
  // 79 - 82: Seletar, Punggol
  '79': { region: 'North-East', town: 'Seletar Aerospace', mapX: 62, mapY: 26 },
  '80': { region: 'North-East', town: 'Fernvale / Jalan Kayu', mapX: 63, mapY: 30 },
  '81': { region: 'East', town: 'Changi Airport', mapX: 89, mapY: 44 },
  '82': { region: 'North-East', town: 'Punggol', mapX: 71, mapY: 28 },
};

/**
 * Resolves postal sector data from a Singapore 6-digit postal code.
 */
export function lookupSingaporePostal(postalCode: string): PostalSectorInfo {
  const clean = postalCode.replace(/\D/g, '').padStart(6, '0');
  const sector = clean.substring(0, 2);
  if (POSTAL_SECTOR_MAP[sector]) {
    return POSTAL_SECTOR_MAP[sector];
  }
  // Default fallback if unknown sector
  return {
    region: 'Central',
    town: 'Singapore',
    mapX: 50,
    mapY: 50,
  };
}
