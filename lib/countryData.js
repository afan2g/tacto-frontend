// countryData.js
import countryDialInfo from "./countryDialInfo.json";

// Ensure the array is sorted alphabetically by country name.
export const sortedCountries = countryDialInfo.sort((a, b) =>
  a.name.localeCompare(b.name)
);

// Create a lookup dictionary keyed by country code.
export const countryLookup = sortedCountries.reduce((acc, country) => {
  acc[country.code] = country;
  return acc;
}, {});
