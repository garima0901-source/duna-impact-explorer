// ISO 3166-1 numeric -> alpha-2 code, for classifying countries drawn from
// world-atlas's countries-50m.json. Only EU-27 + UK need classification;
// everything else renders as neutral background geography.
export const EU_27_NUMERIC_TO_CODE = {
  40: 'AT', // Austria
  56: 'BE', // Belgium
  100: 'BG', // Bulgaria
  191: 'HR', // Croatia
  196: 'CY', // Cyprus
  203: 'CZ', // Czechia
  208: 'DK', // Denmark
  233: 'EE', // Estonia
  246: 'FI', // Finland
  250: 'FR', // France
  276: 'DE', // Germany
  300: 'GR', // Greece
  348: 'HU', // Hungary
  372: 'IE', // Ireland
  380: 'IT', // Italy
  428: 'LV', // Latvia
  440: 'LT', // Lithuania
  442: 'LU', // Luxembourg
  470: 'MT', // Malta
  528: 'NL', // Netherlands
  616: 'PL', // Poland
  620: 'PT', // Portugal
  642: 'RO', // Romania
  703: 'SK', // Slovakia
  705: 'SI', // Slovenia
  724: 'ES', // Spain
  752: 'SE', // Sweden
}

export const UK_NUMERIC = 826

export const SPOTLIGHT_CODES = new Set(['NL', 'DE', 'FR', 'AT', 'IT', 'PL'])
