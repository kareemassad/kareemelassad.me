import { getCoordinatesForBell, getUniqueCountries, separateCityAndCountryBells } from './bellsData';

// Process all bells data and add coordinates synchronously (no API calls needed)
export const processedBellsData = (rawBellsData) => {
    const results = rawBellsData.map(bell => getCoordinatesForBell(bell));
    return results.filter(bell => bell !== null);
};

// Re-export utility functions for backwards compatibility
export { getUniqueCountries, separateCityAndCountryBells };