import countryData from '~/assets/country-codes.json';

export function getCountryLengthRequirement (countryCode: string): number {
  const country: any = countryData.find((item: any) => item.dial_code === countryCode);
  return country?.phoneLength || 10; // Default to 10 if phoneLength is not available
}
