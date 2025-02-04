// countryData.js
import countryDialInfo from "./countryDialInfo.json";

const enhancedCountries = countryDialInfo.map((country) => ({
  ...country,
  nameLower: country.name.toLowerCase(),
  // dial_code might already be numeric string; if needed, precompute another field
}));
// Ensure the array is sorted alphabetically by country name.
export const sortedCountries = enhancedCountries.sort((a, b) =>
  a.name.localeCompare(b.name)
);

// Create a lookup dictionary keyed by country code.
export const countryLookup = sortedCountries.reduce((acc, country) => {
  acc[country.code] = country;
  return acc;
}, {});
