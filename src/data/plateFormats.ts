export type PlateFormat = {
  placeholder: string;
  hint: string;
  regex: RegExp;
};

export const PLATE_FORMATS: Record<string, PlateFormat> = {
  DK: { placeholder: "AB 12 345",   hint: "AB 12 345",    regex: /^[A-Z]{2}\s?\d{2}\s?\d{3}$/ },
  SE: { placeholder: "ABC 123",     hint: "ABC 123",      regex: /^[A-Z]{3}\s?\d{3}$/ },
  NO: { placeholder: "AB 12345",    hint: "AB 12345",     regex: /^[A-Z]{2}\s?\d{5}$/ },
  FI: { placeholder: "ABC-12",      hint: "ABC-12",       regex: /^[A-Z]{2,3}-?\d{2,3}$/ },
  DE: { placeholder: "AB CD 1234",  hint: "AB CD 1234",   regex: /^[A-Z]{1,3}\s?[A-Z]{1,2}\s?\d{1,4}$/ },
  NL: { placeholder: "AB-123-C",    hint: "AB-123-C",     regex: /^[A-Z]{2}-\d{3}-[A-Z]$/ },
  BE: { placeholder: "1-ABC-123",   hint: "1-ABC-123",    regex: /^\d-[A-Z]{3}-\d{3}$/ },
  FR: { placeholder: "AB-123-CD",   hint: "AB-123-CD",    regex: /^[A-Z]{2}-\d{3}-[A-Z]{2}$/ },
  ES: { placeholder: "1234 ABC",    hint: "1234 ABC",     regex: /^\d{4}\s?[A-Z]{3}$/ },
  PT: { placeholder: "AA-00-AA",    hint: "AA-00-AA",     regex: /^[A-Z]{2}-\d{2}-[A-Z]{2}$/ },
  IT: { placeholder: "AB 123 CD",   hint: "AB 123 CD",    regex: /^[A-Z]{2}\s?\d{3}\s?[A-Z]{2}$/ },
  AT: { placeholder: "W 12345A",    hint: "W 12345A",     regex: /^[A-Z]{1,2}\s?\d{4,5}[A-Z]?$/ },
  CH: { placeholder: "AG 123456",   hint: "AG 123456",    regex: /^[A-Z]{2}\s?\d{6}$/ },
  PL: { placeholder: "AB 12345",    hint: "AB 12345",     regex: /^[A-Z]{2}\s?\d{5}$/ },
  CZ: { placeholder: "1AB 2345",    hint: "1AB 2345",     regex: /^\d[A-Z]{2}\s?\d{4}$/ },
  SK: { placeholder: "BA 123AB",    hint: "BA 123AB",     regex: /^[A-Z]{2}\s?\d{3}[A-Z]{2}$/ },
  HU: { placeholder: "ABC-123",     hint: "ABC-123",      regex: /^[A-Z]{3}-?\d{3}$/ },
  RO: { placeholder: "AB 12 ABC",   hint: "AB 12 ABC",    regex: /^[A-Z]{2}\s?\d{2}\s?[A-Z]{3}$/ },
  BG: { placeholder: "AB 1234 CD",  hint: "AB 1234 CD",   regex: /^[A-Z]{2}\s?\d{4}\s?[A-Z]{2}$/ },
  HR: { placeholder: "ZG 123-AA",   hint: "ZG 123-AA",    regex: /^[A-Z]{2}\s?\d{3}-?[A-Z]{2}$/ },
  SI: { placeholder: "AB 12 EF",    hint: "AB 12 EF",     regex: /^[A-Z]{2}\s?\d{2}\s?[A-Z]{2}$/ },
  GR: { placeholder: "ABC-1234",    hint: "ABC-1234",     regex: /^[A-Z]{3}-?\d{4}$/ },
  IE: { placeholder: "12-D-12345",  hint: "12-D-12345",   regex: /^\d{2}-[A-Z]-\d{5}$/ },
  GB: { placeholder: "AB12 ABC",    hint: "AB12 ABC",     regex: /^[A-Z]{2}\d{2}\s?[A-Z]{3}$/ },
  LU: { placeholder: "AB 1234",     hint: "AB 1234",      regex: /^[A-Z]{2}\s?\d{4}$/ },
  EE: { placeholder: "ABC 123",     hint: "ABC 123",      regex: /^[A-Z]{3}\s?\d{3}$/ },
  LV: { placeholder: "AB-1234",     hint: "AB-1234",      regex: /^[A-Z]{2}-?\d{4}$/ },
  LT: { placeholder: "ABC 123",     hint: "ABC 123",      regex: /^[A-Z]{3}\s?\d{3}$/ },
  MT: { placeholder: "ABC 123",     hint: "ABC 123",      regex: /^[A-Z]{3}\s?\d{3}$/ },
  CY: { placeholder: "ABC 1234",    hint: "ABC 1234",     regex: /^[A-Z]{3}\s?\d{4}$/ },
};

export function getPlateFormat(countryCode: string): PlateFormat {
  return (
    PLATE_FORMATS[countryCode] ?? {
      placeholder: "Nummerplade",
      hint: "Nummerplade",
      regex: /^.{2,12}$/,
    }
  );
}
