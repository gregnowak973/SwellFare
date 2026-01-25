/**
 * Destinations Mapping Data
 * The "Golden 20" iconic surf destinations
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

