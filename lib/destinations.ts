/**
 * Destinations Mapping Data
 * The "Golden 40+" iconic surf destinations worldwide
 * Maps surf spots to nearest major airports
 */

export interface DestinationMapping {
  name: string;
  surfSpotName: string;
  airportCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  idealSwellDirection: number; // 0-360 degrees
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const GOLDEN_20_DESTINATIONS: DestinationMapping[] = [
  // North America
  {
    name: 'Malibu, California',
    surfSpotName: 'Malibu',
    airportCode: 'LAX',
    latitude: 34.0324,
    longitude: -118.6758,
    timezone: 'America/Los_Angeles',
    idealSwellDirection: 270,
    skillLevel: 'beginner',
  },
  {
    name: 'Pipeline, Oahu',
    surfSpotName: 'Pipeline',
    airportCode: 'HNL',
    latitude: 21.6569,
    longitude: -158.0500,
    timezone: 'Pacific/Honolulu',
    idealSwellDirection: 315,
    skillLevel: 'expert',
  },
  {
    name: 'Trestles, California',
    surfSpotName: 'Lower Trestles',
    airportCode: 'SNA',
    latitude: 33.3847,
    longitude: -117.5892,
    timezone: 'America/Los_Angeles',
    idealSwellDirection: 220,
    skillLevel: 'advanced',
  },
  
  // Central America
  {
    name: 'Nosara, Costa Rica',
    surfSpotName: 'Playa Guiones',
    airportCode: 'SJO',
    latitude: 9.9833,
    longitude: -85.6500,
    timezone: 'America/Costa_Rica',
    idealSwellDirection: 225,
    skillLevel: 'intermediate',
  },
  {
    name: 'Tamarindo, Costa Rica',
    surfSpotName: 'Tamarindo',
    airportCode: 'LIR',
    latitude: 10.3000,
    longitude: -85.8333,
    timezone: 'America/Costa_Rica',
    idealSwellDirection: 225,
    skillLevel: 'beginner',
  },
  {
    name: 'Playa Venao, Panama',
    surfSpotName: 'Playa Venao',
    airportCode: 'PTY',
    latitude: 7.4500,
    longitude: -80.0167,
    timezone: 'America/Panama',
    idealSwellDirection: 180,
    skillLevel: 'intermediate',
  },
  
  // South America
  {
    name: 'Arpoador, Rio de Janeiro',
    surfSpotName: 'Arpoador',
    airportCode: 'GIG',
    latitude: -22.9878,
    longitude: -43.1919,
    timezone: 'America/Sao_Paulo',
    idealSwellDirection: 135,
    skillLevel: 'intermediate',
  },
  {
    name: 'Chicama, Peru',
    surfSpotName: 'Chicama',
    airportCode: 'TRU',
    latitude: -7.8333,
    longitude: -79.1500,
    timezone: 'America/Lima',
    idealSwellDirection: 225,
    skillLevel: 'advanced',
  },
  {
    name: 'Mancora, Peru',
    surfSpotName: 'Mancora',
    airportCode: 'PIU',
    latitude: -4.1000,
    longitude: -81.0500,
    timezone: 'America/Lima',
    idealSwellDirection: 225,
    skillLevel: 'intermediate',
  },
  
  // Europe
  {
    name: 'Nazaré, Portugal',
    surfSpotName: 'Praia do Norte',
    airportCode: 'LIS',
    latitude: 39.6011,
    longitude: -9.0714,
    timezone: 'Europe/Lisbon',
    idealSwellDirection: 315,
    skillLevel: 'expert',
  },
  {
    name: 'Ericeira, Portugal',
    surfSpotName: "Ribeira d'Ilhas",
    airportCode: 'LIS',
    latitude: 39.0167,
    longitude: -9.4167,
    timezone: 'Europe/Lisbon',
    idealSwellDirection: 270,
    skillLevel: 'intermediate',
  },
  {
    name: 'Hossegor, France',
    surfSpotName: 'La Gravière',
    airportCode: 'BIQ',
    latitude: 43.6500,
    longitude: -1.4000,
    timezone: 'Europe/Paris',
    idealSwellDirection: 270,
    skillLevel: 'advanced',
  },
  
  // Asia Pacific
  {
    name: 'Uluwatu, Bali',
    surfSpotName: 'Uluwatu',
    airportCode: 'DPS',
    latitude: -8.8292,
    longitude: 115.0850,
    timezone: 'Asia/Makassar',
    idealSwellDirection: 225,
    skillLevel: 'advanced',
  },
  {
    name: 'Canggu, Bali',
    surfSpotName: 'Batu Bolong',
    airportCode: 'DPS',
    latitude: -8.6500,
    longitude: 115.1333,
    timezone: 'Asia/Makassar',
    idealSwellDirection: 225,
    skillLevel: 'beginner',
  },
  {
    name: 'Raglan, New Zealand',
    surfSpotName: 'Manu Bay',
    airportCode: 'AKL',
    latitude: -37.8000,
    longitude: 174.8833,
    timezone: 'Pacific/Auckland',
    idealSwellDirection: 225,
    skillLevel: 'intermediate',
  },
  {
    name: 'Byron Bay, Australia',
    surfSpotName: 'The Pass',
    airportCode: 'BNE',
    latitude: -28.6474,
    longitude: 153.6020,
    timezone: 'Australia/Sydney',
    idealSwellDirection: 135,
    skillLevel: 'beginner',
  },
  {
    name: 'Jeffreys Bay, South Africa',
    surfSpotName: 'Supertubes',
    airportCode: 'CPT',
    latitude: -34.0500,
    longitude: 24.9167,
    timezone: 'Africa/Johannesburg',
    idealSwellDirection: 180,
    skillLevel: 'advanced',
  },
  
  // Pacific Islands
  {
    name: 'Teahupo\u0027o, Tahiti',
    surfSpotName: 'Teahupo\u0027o',
    airportCode: 'PPT',
    latitude: -17.8667,
    longitude: -149.2667,
    timezone: 'Pacific/Tahiti',
    idealSwellDirection: 225,
    skillLevel: 'expert',
  },
  {
    name: 'Cloudbreak, Fiji',
    surfSpotName: 'Cloudbreak',
    airportCode: 'NAN',
    latitude: -18.1667,
    longitude: 177.4500,
    timezone: 'Pacific/Fiji',
    idealSwellDirection: 225,
    skillLevel: 'expert',
  },
  
  // Additional North America
  {
    name: 'Tofino, Canada',
    surfSpotName: 'Cox Bay',
    airportCode: 'YAZ',
    latitude: 49.0500,
    longitude: -125.7667,
    timezone: 'America/Vancouver',
    idealSwellDirection: 270,
    skillLevel: 'intermediate',
  },
  {
    name: 'Santa Cruz, California',
    surfSpotName: 'Steamer Lane',
    airportCode: 'SFO',
    latitude: 36.9500,
    longitude: -122.0333,
    timezone: 'America/Los_Angeles',
    idealSwellDirection: 270,
    skillLevel: 'advanced',
  },
  {
    name: 'Rincon, Puerto Rico',
    surfSpotName: 'Rincon',
    airportCode: 'SJU',
    latitude: 18.3333,
    longitude: -67.2500,
    timezone: 'America/Puerto_Rico',
    idealSwellDirection: 315,
    skillLevel: 'advanced',
  },
  {
    name: 'Sayulita, Mexico',
    surfSpotName: 'Sayulita',
    airportCode: 'PVR',
    latitude: 20.8667,
    longitude: -105.4333,
    timezone: 'America/Mexico_City',
    idealSwellDirection: 270,
    skillLevel: 'beginner',
  },
  {
    name: 'Puerto Escondido, Mexico',
    surfSpotName: 'Zicatela',
    airportCode: 'PXM',
    latitude: 15.8500,
    longitude: -97.0667,
    timezone: 'America/Mexico_City',
    idealSwellDirection: 225,
    skillLevel: 'expert',
  },
  
  // Additional Central America
  {
    name: 'El Salvador',
    surfSpotName: 'Punta Roca',
    airportCode: 'SAL',
    latitude: 13.4833,
    longitude: -89.3167,
    timezone: 'America/El_Salvador',
    idealSwellDirection: 225,
    skillLevel: 'advanced',
  },
  {
    name: 'Popoyo, Nicaragua',
    surfSpotName: 'Popoyo',
    airportCode: 'MGA',
    latitude: 11.4833,
    longitude: -86.4833,
    timezone: 'America/Managua',
    idealSwellDirection: 225,
    skillLevel: 'intermediate',
  },
  
  // Additional South America
  {
    name: 'Montañita, Ecuador',
    surfSpotName: 'Montañita',
    airportCode: 'GYE',
    latitude: -1.8333,
    longitude: -80.7500,
    timezone: 'America/Guayaquil',
    idealSwellDirection: 225,
    skillLevel: 'intermediate',
  },
  {
    name: 'Florianópolis, Brazil',
    surfSpotName: 'Joaquina',
    airportCode: 'FLN',
    latitude: -27.6000,
    longitude: -48.5500,
    timezone: 'America/Sao_Paulo',
    idealSwellDirection: 135,
    skillLevel: 'intermediate',
  },
  {
    name: 'Punta de Lobos, Chile',
    surfSpotName: 'Punta de Lobos',
    airportCode: 'SCL',
    latitude: -34.4167,
    longitude: -72.0000,
    timezone: 'America/Santiago',
    idealSwellDirection: 225,
    skillLevel: 'advanced',
  },
  
  // Additional Europe
  {
    name: 'Biarritz, France',
    surfSpotName: 'La Côte des Basques',
    airportCode: 'BIQ',
    latitude: 43.4833,
    longitude: -1.5667,
    timezone: 'Europe/Paris',
    idealSwellDirection: 270,
    skillLevel: 'intermediate',
  },
  {
    name: 'Mundaka, Spain',
    surfSpotName: 'Mundaka',
    airportCode: 'BIO',
    latitude: 43.4000,
    longitude: -2.7000,
    timezone: 'Europe/Madrid',
    idealSwellDirection: 270,
    skillLevel: 'advanced',
  },
  {
    name: 'Thurso, Scotland',
    surfSpotName: 'Thurso East',
    airportCode: 'EDI',
    latitude: 58.6000,
    longitude: -3.5167,
    timezone: 'Europe/London',
    idealSwellDirection: 315,
    skillLevel: 'advanced',
  },
  
  // Additional Asia Pacific
  {
    name: 'Siargao, Philippines',
    surfSpotName: 'Cloud 9',
    airportCode: 'IAO',
    latitude: 9.9167,
    longitude: 126.0667,
    timezone: 'Asia/Manila',
    idealSwellDirection: 135,
    skillLevel: 'advanced',
  },
  {
    name: 'Padang Padang, Bali',
    surfSpotName: 'Padang Padang',
    airportCode: 'DPS',
    latitude: -8.8167,
    longitude: 115.0833,
    timezone: 'Asia/Makassar',
    idealSwellDirection: 225,
    skillLevel: 'expert',
  },
  {
    name: 'G-Land, Java',
    surfSpotName: 'Grajagan',
    airportCode: 'JOG',
    latitude: -8.6333,
    longitude: 114.2167,
    timezone: 'Asia/Jakarta',
    idealSwellDirection: 225,
    skillLevel: 'expert',
  },
  {
    name: 'Gold Coast, Australia',
    surfSpotName: 'Snapper Rocks',
    airportCode: 'BNE',
    latitude: -28.1667,
    longitude: 153.5333,
    timezone: 'Australia/Brisbane',
    idealSwellDirection: 135,
    skillLevel: 'advanced',
  },
  {
    name: 'Margaret River, Australia',
    surfSpotName: 'Main Break',
    airportCode: 'PER',
    latitude: -33.9500,
    longitude: 115.0667,
    timezone: 'Australia/Perth',
    idealSwellDirection: 225,
    skillLevel: 'expert',
  },
  {
    name: 'Piha, New Zealand',
    surfSpotName: 'Piha',
    airportCode: 'AKL',
    latitude: -36.9667,
    longitude: 174.4667,
    timezone: 'Pacific/Auckland',
    idealSwellDirection: 225,
    skillLevel: 'intermediate',
  },
  
  // Additional Pacific Islands
  {
    name: 'Tavarua, Fiji',
    surfSpotName: 'Restaurants',
    airportCode: 'NAN',
    latitude: -17.8333,
    longitude: 177.2000,
    timezone: 'Pacific/Fiji',
    idealSwellDirection: 225,
    skillLevel: 'advanced',
  },
  {
    name: 'Mentawai Islands, Indonesia',
    surfSpotName: 'Lance\'s Right',
    airportCode: 'PDG',
    latitude: -2.5000,
    longitude: 99.7500,
    timezone: 'Asia/Jakarta',
    idealSwellDirection: 225,
    skillLevel: 'expert',
  },
  
  // Additional Africa
  {
    name: 'Taghazout, Morocco',
    surfSpotName: 'Anchor Point',
    airportCode: 'AGA',
    latitude: 30.5333,
    longitude: -9.7000,
    timezone: 'Africa/Casablanca',
    idealSwellDirection: 270,
    skillLevel: 'intermediate',
  },
  {
    name: 'Durban, South Africa',
    surfSpotName: 'New Pier',
    airportCode: 'DUR',
    latitude: -29.8500,
    longitude: 31.0167,
    timezone: 'Africa/Johannesburg',
    idealSwellDirection: 135,
    skillLevel: 'intermediate',
  },
];

/**
 * Get destinations by skill level
 */
export function getDestinationsBySkillLevel(
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): DestinationMapping[] {
  return GOLDEN_20_DESTINATIONS.filter(dest => dest.skillLevel === skillLevel);
}

/**
 * Get destination by airport code
 */
export function getDestinationByAirport(airportCode: string): DestinationMapping | undefined {
  return GOLDEN_20_DESTINATIONS.find(dest => dest.airportCode === airportCode);
}

