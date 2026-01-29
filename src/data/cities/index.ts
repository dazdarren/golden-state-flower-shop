import { CityConfig } from '@/types/city';
import { sanFranciscoConfig } from './ca/san-francisco';
import { losAngeles } from './los-angeles';
import { sanDiego } from './san-diego';
import { sanJose } from './san-jose';
import { sacramento } from './sacramento';
import { oakland } from './oakland';
import { fresno } from './fresno';
import { longBeach } from './long-beach';
import { irvine } from './irvine';
import { santaBarbara } from './santa-barbara';
import { palmSprings } from './palm-springs';

/**
 * City configurations registry
 * All California cities for Golden State Flower Shop
 */
export const cities: Record<string, CityConfig> = {
  // Bay Area
  'ca/san-francisco': sanFranciscoConfig,
  'ca/oakland': oakland,
  'ca/san-jose': sanJose,

  // Southern California
  'ca/los-angeles': losAngeles,
  'ca/san-diego': sanDiego,
  'ca/long-beach': longBeach,
  'ca/irvine': irvine,

  // Central California
  'ca/fresno': fresno,
  'ca/sacramento': sacramento,

  // Coastal / Resort
  'ca/santa-barbara': santaBarbara,
  'ca/palm-springs': palmSprings,
};

/**
 * Get city configuration by state and city slugs
 */
export function getCityConfig(stateSlug: string, citySlug: string): CityConfig | undefined {
  return cities[`${stateSlug}/${citySlug}`];
}

/**
 * Get all city configurations
 */
export function getAllCities(): CityConfig[] {
  return Object.values(cities);
}

/**
 * Get city path prefix (e.g., '/ca/san-francisco')
 */
export function getCityPath(config: CityConfig): string {
  return `/${config.stateSlug}/${config.citySlug}`;
}

/**
 * Get all city paths for static generation
 * Returns params matching the [state]/[city] route segments
 */
export function getAllCityPaths(): { state: string; city: string }[] {
  return getAllCities().map((city) => ({
    state: city.stateSlug,
    city: city.citySlug,
  }));
}

/**
 * Check if a city exists
 */
export function cityExists(stateSlug: string, citySlug: string): boolean {
  return `${stateSlug}/${citySlug}` in cities;
}

/**
 * Get cities grouped by region (for navigation/sitemap)
 */
export function getCitiesByRegion(): Record<string, CityConfig[]> {
  return {
    'Bay Area': [sanFranciscoConfig, oakland, sanJose],
    'Southern California': [losAngeles, sanDiego, longBeach, irvine],
    'Central California': [fresno, sacramento],
    'Coastal & Resort': [santaBarbara, palmSprings],
  };
}

export { sanFranciscoConfig };
