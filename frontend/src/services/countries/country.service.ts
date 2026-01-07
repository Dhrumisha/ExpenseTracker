import axios from "axios";

export interface CountryOption {
  label: string;
  value: string;
  currencyCode?: string;
}

export const getAllCountries = async (): Promise<CountryOption[]> => {
  const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca2,currencies",{withCredentials: true, });

  return res.data.map((country: any) => {
    const currencyCode = country.currencies
      ? Object.keys(country.currencies)[0]
      : "";

    return {
      label: country.name.common,
      value: country.cca2,      // <-- use country code
      currencyCode,             // <-- AUD, INR, USD
    };
  });
};
