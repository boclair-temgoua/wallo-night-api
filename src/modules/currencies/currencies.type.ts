import { Currency } from '../../models';

export type CurrencyCode =
  | 'ADP'
  | 'AED'
  | 'AFA'
  | 'AFN'
  | 'ALK'
  | 'ALL'
  | 'AMD'
  | 'ANG'
  | 'AOA'
  | 'AOK'
  | 'AON'
  | 'AOR'
  | 'ARA'
  | 'ARL'
  | 'ARM'
  | 'ARP'
  | 'ARS'
  | 'ATS'
  | 'AUD'
  | 'AWG'
  | 'AZM'
  | 'AZN'
  | 'BAD'
  | 'BAM'
  | 'BAN'
  | 'BBD'
  | 'BDT'
  | 'BEC'
  | 'BEF'
  | 'BEL'
  | 'BGL'
  | 'BGM'
  | 'BGN'
  | 'BGO'
  | 'BHD'
  | 'BIF'
  | 'BMD'
  | 'BND'
  | 'BOB'
  | 'BOL'
  | 'BOP'
  | 'BOV'
  | 'BRB'
  | 'BRC'
  | 'BRE'
  | 'BRL'
  | 'BRN'
  | 'BRR'
  | 'BRZ'
  | 'BSD'
  | 'BTN'
  | 'BUK'
  | 'BWP'
  | 'BYB'
  | 'BYR'
  | 'BZD'
  | 'CAD'
  | 'CDF'
  | 'CHE'
  | 'CHF'
  | 'CHW'
  | 'CLE'
  | 'CLF'
  | 'CLP'
  | 'CNX'
  | 'CNY'
  | 'COP'
  | 'COU'
  | 'CRC'
  | 'CSD'
  | 'CSK'
  | 'CUC'
  | 'CUP'
  | 'CVE'
  | 'CYP'
  | 'CZK'
  | 'DDM'
  | 'DEM'
  | 'DJF'
  | 'DKK'
  | 'DOP'
  | 'DZD'
  | 'ECS'
  | 'ECV'
  | 'EEK'
  | 'EGP'
  | 'ERN'
  | 'ESA'
  | 'ESB'
  | 'ESP'
  | 'ETB'
  | 'EUR'
  | 'FIM'
  | 'FJD'
  | 'FKP'
  | 'FRF'
  | 'GBP'
  | 'GEK'
  | 'GEL'
  | 'GHC'
  | 'GHS'
  | 'GIP'
  | 'GMD'
  | 'GNF'
  | 'GNS'
  | 'GQE'
  | 'GRD'
  | 'GTQ'
  | 'GWE'
  | 'GWP'
  | 'GYD'
  | 'HKD'
  | 'HNL'
  | 'HRD'
  | 'HRK'
  | 'HTG'
  | 'HUF'
  | 'IDR'
  | 'IEP'
  | 'ILP'
  | 'ILR'
  | 'ILS'
  | 'INR'
  | 'IQD'
  | 'IRR'
  | 'ISJ'
  | 'ISK'
  | 'ITL'
  | 'JMD'
  | 'JOD'
  | 'JPY'
  | 'KES'
  | 'KGS'
  | 'KHR'
  | 'KMF'
  | 'KPW'
  | 'KRH'
  | 'KRO'
  | 'KRW'
  | 'KWD'
  | 'KYD'
  | 'KZT'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'LRD'
  | 'LSL'
  | 'LTL'
  | 'LTT'
  | 'LUC'
  | 'LUF'
  | 'LUL'
  | 'LVL'
  | 'LVR'
  | 'LYD'
  | 'MAD'
  | 'MAF'
  | 'MCF'
  | 'MDC'
  | 'MDL'
  | 'MGA'
  | 'MGF'
  | 'MKD'
  | 'MKN'
  | 'MLF'
  | 'MMK'
  | 'MNT'
  | 'MOP'
  | 'MRO'
  | 'MTL'
  | 'MTP'
  | 'MUR'
  | 'MVP'
  | 'MVR'
  | 'MWK'
  | 'MXN'
  | 'MXP'
  | 'MXV'
  | 'MYR'
  | 'MZE'
  | 'MZM'
  | 'MZN'
  | 'NAD'
  | 'NGN'
  | 'NIC'
  | 'NIO'
  | 'NLG'
  | 'NOK'
  | 'NPR'
  | 'NZD'
  | 'OMR'
  | 'PAB'
  | 'PEI'
  | 'PEN'
  | 'PES'
  | 'PGK'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'PLZ'
  | 'PTE'
  | 'PYG'
  | 'QAR'
  | 'RHD'
  | 'ROL'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'RUR'
  | 'RWF'
  | 'SAR'
  | 'SBD'
  | 'SCR'
  | 'SDD'
  | 'SDG'
  | 'SDP'
  | 'SEK'
  | 'SGD'
  | 'SHP'
  | 'SIT'
  | 'SKK'
  | 'SLL'
  | 'SOS'
  | 'SRD'
  | 'SRG'
  | 'SSP'
  | 'STD'
  | 'SUR'
  | 'SVC'
  | 'SYP'
  | 'SZL'
  | 'THB'
  | 'TJR'
  | 'TJS'
  | 'TMM'
  | 'TMT'
  | 'TND'
  | 'TOP'
  | 'TPE'
  | 'TRL'
  | 'TRY'
  | 'TTD'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'UAK'
  | 'UGS'
  | 'UGX'
  | 'USD'
  | 'USN'
  | 'USS'
  | 'UYI'
  | 'UYP'
  | 'UYU'
  | 'UZS'
  | 'VEB'
  | 'VEF'
  | 'VND'
  | 'VNN'
  | 'VUV'
  | 'WST'
  | 'XAF'
  | 'XAG'
  | 'XAU'
  | 'XBA'
  | 'XBB'
  | 'XBC'
  | 'XBD'
  | 'XCD'
  | 'XDR'
  | 'XEU'
  | 'XFO'
  | 'XFU'
  | 'XOF'
  | 'XPD'
  | 'XPF'
  | 'XPT'
  | 'XRE'
  | 'XSU'
  | 'XTS'
  | 'XUA'
  | 'YDD'
  | 'YER'
  | 'YUD'
  | 'YUM'
  | 'YUN'
  | 'YUR'
  | 'ZAL'
  | 'ZAR'
  | 'ZMK'
  | 'ZMW'
  | 'ZRN'
  | 'ZRZ'
  | 'ZWD'
  | 'ZWL';
('ZWR');

export const currenciesCodeArrays = [
  // 'AED',
  // 'AFN',
  // 'ALL',
  // 'AMD',
  // 'ANG',
  // 'AOA',
  // 'ARS',
  // 'AUD',
  // 'AWG',
  // 'AZN',
  // 'BAM',
  // 'BBD',
  // 'BDT',
  // 'BGN',
  // 'BHD',
  // 'BIF',
  // 'BMD',
  // 'BND',
  // 'BOB',
  // 'BRL',
  // 'BSD',
  // 'BTC',
  // 'BTN',
  // 'BTS',
  // 'BWP',
  // 'BYN',
  // 'BZD',
  'CAD',
  // 'CDF',
  'CHF',
  // 'CLF',
  // 'CLP',
  // 'CNH',
  // 'CNY',
  // 'COP',
  // 'CRC',
  // 'CUC',
  // 'CUP',
  // 'CVE',
  // 'CZK',
  // 'DJF',
  // 'DKK',
  // 'DOP',
  // 'DZD',
  // 'EGP',
  // 'ERN',
  // 'ETB',
  // 'ETH',
  'EUR',
  // 'FJD',
  // 'FKP',
  'GBP',
  // 'GEL',
  // 'GGP',
  // 'GHS',
  // 'GIP',
  // 'GMD',
  // 'GNF',
  // 'GTQ',
  // 'GYD',
  // 'HKD',
  // 'HNL',
  // 'HRK',
  // 'HTG',
  // 'HUF',
  // 'IDR',
  // 'ILS',
  // 'IMP',
  // 'INR',
  // 'IQD',
  // 'IRR',
  // 'ISK',
  // 'JEP',
  // 'JMD',
  // 'JOD',
  // 'JPY',
  // 'KES',
  // 'KGS',
  // 'KHR',
  // 'KMF',
  // 'KPW',
  // 'KRW',
  // 'KWD',
  // 'KYD',
  // 'KZT',
  // 'LAK',
  // 'LBP',
  // 'LKR',
  // 'LRD',
  // 'LSL',
  // 'LTC',
  // 'LYD',
  // 'MAD',
  // 'MDL',
  // 'MGA',
  // 'MKD',
  // 'MMK',
  // 'MNT',
  // 'MOP',
  // 'MRO',
  // 'MRU',
  // 'MUR',
  // 'MVR',
  // 'MWK',
  // 'MXN',
  // 'MYR',
  // 'MZN',
  // 'NAD',
  // 'NGN',
  // 'NIO',
  // 'NOK',
  // 'NPR',
  // 'NXT',
  // 'NZD',
  // 'OMR',
  // 'PAB',
  // 'PEN',
  // 'PGK',
  // 'PHP',
  // 'PKR',
  // 'PLN',
  // 'PYG',
  // 'QAR',
  // 'RON',
  // 'RSD',
  // 'RUB',
  // 'RWF',
  // 'SAR',
  // 'SBD',
  // 'SCR',
  // 'SDG',
  // 'SEK',
  // 'SGD',
  // 'SHP',
  // 'SLL',
  // 'SOS',
  // 'SRD',
  // 'SSP',
  // 'STD',
  // 'STN',
  // 'STR',
  // 'SVC',
  // 'SYP',
  // 'SZL',
  // 'THB',
  // 'TJS',
  // 'TMT',
  // 'TND',
  // 'TOP',
  // 'TRY',
  // 'TTD',
  // 'TWD',
  // 'TZS',
  // 'UAH',
  // 'UGX',
  'USD',
  // 'UYU',
  // 'UZS',
  // 'VES',
  // 'VND',
  // 'VUV',
  // 'WST',
  'XAF',
  // 'XAG',
  // 'XAU',
  // 'XCD',
  // 'XDR',
  // 'XMR',
  'XOF',
  // 'XPD',
  // 'XPF',
  // 'XPT',
  // 'XRP',
  // 'YER',
  // 'ZAR',
  // 'ZMW',
  // 'ZWL',
  // 'NMC',
  // 'PPC',
  // 'NVC',
  // 'XPM',
  // 'EAC',
  // 'VTC',
  // 'EMC',
  // 'FCT',
  // 'LD',
  // 'DOGE',
  // 'DASH',
  // 'VEF_BLKMKT',
  // 'VEF_DICOM',
  // 'VEF_DIPRO',
];

export const CurrencySymbolMap = {
  ADP: { name: 'Andorran Peseta', symbol: 'ADP' },
  AED: { name: 'United Arab Emirates Dirham', symbol: 'AED' },
  AFA: { name: 'Afghan Afghani', symbol: 'AFA' },
  AFN: { name: 'Afghan Afghani', symbol: 'AFN' },
  ALK: { name: 'Albanian Lek', symbol: 'ALK' },
  ALL: { name: 'Albanian Lek', symbol: 'ALL' },
  AMD: { name: 'Armenian Dram', symbol: 'AMD' },
  ANG: { name: 'Netherlands Antillean Guilder', symbol: 'ANG' },
  AOA: { name: 'Angolan Kwanza', symbol: 'AOA' },
  AOK: { name: 'Angolan Kwanza', symbol: 'AOK' },
  AON: { name: 'Angolan New Kwanza)', symbol: 'AON' },
  AOR: { name: 'Angolan Readjusted Kwanza', symbol: 'AOR' },
  ARA: { name: 'Argentine Austral', symbol: 'ARA' },
  ARL: { name: 'Argentine Peso Ley', symbol: 'ARL' },
  ARM: { name: 'Argentine Peso', symbol: 'ARM' },
  ARP: { name: 'Argentine Peso', symbol: 'ARP' },
  ARS: { name: 'Argentine Peso', symbol: 'ARS' },
  ATS: { name: 'Austrian Schilling', symbol: 'ATS' },
  AUD: { name: 'Australian Dollar', symbol: 'A$' },
  AWG: { name: 'Aruban Florin', symbol: 'AWG' },
  AZM: { name: 'Azerbaijani Manat', symbol: 'AZM' },
  AZN: { name: 'Azerbaijani Manat', symbol: 'AZN' },
  BAD: { name: 'Bosnia-Herzegovina Dinar', symbol: 'BAD' },
  BAM: { name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'BAM' },
  BAN: { name: 'Bosnia-Herzegovina New Dinar', symbol: 'BAN' },
  BBD: { name: 'Barbadian Dollar', symbol: 'BBD' },
  BDT: { name: 'Bangladeshi Taka', symbol: 'BDT' },
  BEC: { name: 'Belgian Franc (convertible)', symbol: 'BEC' },
  BEF: { name: 'Belgian Franc', symbol: 'BEF' },
  BEL: { name: 'Belgian Franc (financial)', symbol: 'BEL' },
  BGL: { name: 'Bulgarian Hard Lev', symbol: 'BGL' },
  BGM: { name: 'Bulgarian Socialist Lev', symbol: 'BGM' },
  BGN: { name: 'Bulgarian Lev', symbol: 'BGN' },
  BGO: { name: 'Bulgarian Lev', symbol: 'BGO' },
  BHD: { name: 'Bahraini Dinar', symbol: 'BHD' },
  BIF: { name: 'Burundian Franc', symbol: 'BIF' },
  BMD: { name: 'Bermudan Dollar', symbol: 'BMD' },
  BND: { name: 'Brunei Dollar', symbol: 'BND' },
  BOB: { name: 'Bolivian Boliviano', symbol: 'BOB' },
  BOL: { name: 'Bolivian Boliviano', symbol: 'BOL' },
  BOP: { name: 'Bolivian Peso', symbol: 'BOP' },
  BOV: { name: 'Bolivian Mvdol', symbol: 'BOV' },
  BRB: { name: 'Brazilian New Cruzeiro', symbol: 'BRB' },
  BRC: { name: 'Brazilian Cruzado', symbol: 'BRC' },
  BRE: { name: 'Brazilian Cruzeiro', symbol: 'BRE' },
  BRL: { name: 'Brazilian Real', symbol: 'R$' },
  BRN: { name: 'Brazilian New Cruzado', symbol: 'BRN' },
  BRR: { name: 'Brazilian Cruzeiro', symbol: 'BRR' },
  BRZ: { name: 'Brazilian Cruzeiro', symbol: 'BRZ' },
  BSD: { name: 'Bahamian Dollar', symbol: 'BSD' },
  BTN: { name: 'Bhutanese Ngultrum', symbol: 'BTN' },
  BUK: { name: 'Burmese Kyat', symbol: 'BUK' },
  BWP: { name: 'Botswanan Pula', symbol: 'BWP' },
  BYB: { name: 'Belarusian New Ruble', symbol: 'BYB' },
  BYR: { name: 'Belarusian Ruble', symbol: 'BYR' },
  BZD: { name: 'Belize Dollar', symbol: 'BZD' },
  CAD: { name: 'Canadian Dollar', symbol: 'CA$' },
  CDF: { name: 'Congolese Franc', symbol: 'CDF' },
  CHE: { name: 'WIR Euro', symbol: 'CHE' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF' },
  CHW: { name: 'WIR Franc', symbol: 'CHW' },
  CLE: { name: 'Chilean Escudo', symbol: 'CLE' },
  CLF: { name: 'Chilean Unit of Account (UF)', symbol: 'CLF' },
  CLP: { name: 'Chilean Peso', symbol: 'CLP' },
  CNX: { name: 'Chinese People’s Bank Dollar', symbol: 'CNX' },
  CNY: { name: 'Chinese Yuan', symbol: 'CN¥' },
  COP: { name: 'Colombian Peso', symbol: 'COP' },
  COU: { name: 'Colombian Real Value Unit', symbol: 'COU' },
  CRC: { name: 'Costa Rican Colón', symbol: 'CRC' },
  CSD: { name: 'Serbian Dinar', symbol: 'CSD' },
  CSK: { name: 'Czechoslovak Hard Koruna', symbol: 'CSK' },
  CUC: { name: 'Cuban Convertible Peso', symbol: 'CUC' },
  CUP: { name: 'Cuban Peso', symbol: 'CUP' },
  CVE: { name: 'Cape Verdean Escudo', symbol: 'CVE' },
  CYP: { name: 'Cypriot Pound', symbol: 'CYP' },
  CZK: { name: 'Czech Republic Koruna', symbol: 'CZK' },
  DDM: { name: 'East German Mark', symbol: 'DDM' },
  DEM: { name: 'German Mark', symbol: 'DEM' },
  DJF: { name: 'Djiboutian Franc', symbol: 'DJF' },
  DKK: { name: 'Danish Krone', symbol: 'DKK' },
  DOP: { name: 'Dominican Peso', symbol: 'DOP' },
  DZD: { name: 'Algerian Dinar', symbol: 'DZD' },
  ECS: { name: 'Ecuadorian Sucre', symbol: 'ECS' },
  ECV: { name: 'Ecuadorian Unit of Constant Value', symbol: 'ECV' },
  EEK: { name: 'Estonian Kroon', symbol: 'EEK' },
  EGP: { name: 'Egyptian Pound', symbol: 'EGP' },
  ERN: { name: 'Eritrean Nakfa', symbol: 'ERN' },
  ESA: { name: 'Spanish Peseta (A account)', symbol: 'ESA' },
  ESB: { name: 'Spanish Peseta (convertible account)', symbol: 'ESB' },
  ESP: { name: 'Spanish Peseta', symbol: 'ESP' },
  ETB: { name: 'Ethiopian Birr', symbol: 'ETB' },
  EUR: { name: 'Euro', symbol: '€' },
  FIM: { name: 'Finnish Markka', symbol: 'FIM' },
  FJD: { name: 'Fijian Dollar', symbol: 'FJD' },
  FKP: { name: 'Falkland Islands Pound', symbol: 'FKP' },
  FRF: { name: 'French Franc', symbol: 'FRF' },
  GBP: { name: 'British Pound Sterling', symbol: '£' },
  GEK: { name: 'Georgian Kupon Larit', symbol: 'GEK' },
  GEL: { name: 'Georgian Lari', symbol: 'GEL' },
  GHC: { name: 'Ghanaian Cedi (1979–2007)', symbol: 'GHC' },
  GHS: { name: 'Ghanaian Cedi', symbol: 'GHS' },
  GIP: { name: 'Gibraltar Pound', symbol: 'GIP' },
  GMD: { name: 'Gambian Dalasi', symbol: 'GMD' },
  GNF: { name: 'Guinean Franc', symbol: 'GNF' },
  GNS: { name: 'Guinean Syli', symbol: 'GNS' },
  GQE: { name: 'Equatorial Guinean Ekwele', symbol: 'GQE' },
  GRD: { name: 'Greek Drachma', symbol: 'GRD' },
  GTQ: { name: 'Guatemalan Quetzal', symbol: 'GTQ' },
  GWE: { name: 'Portuguese Guinea Escudo', symbol: 'GWE' },
  GWP: { name: 'Guinea-Bissau Peso', symbol: 'GWP' },
  GYD: { name: 'Guyanaese Dollar', symbol: 'GYD' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$' },
  HNL: { name: 'Honduran Lempira', symbol: 'HNL' },
  HRD: { name: 'Croatian Dinar', symbol: 'HRD' },
  HRK: { name: 'Croatian Kuna', symbol: 'HRK' },
  HTG: { name: 'Haitian Gourde', symbol: 'HTG' },
  HUF: { name: 'Hungarian Forint', symbol: 'HUF' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'IDR' },
  IEP: { name: 'Irish Pound', symbol: 'IEP' },
  ILP: { name: 'Israeli Pound', symbol: 'ILP' },
  ILR: { name: 'Israeli Sheqel', symbol: 'ILR' },
  ILS: { name: 'Israeli New Sheqel', symbol: '₪' },
  INR: { name: 'Indian Rupee', symbol: '₹' },
  IQD: { name: 'Iraqi Dinar', symbol: 'IQD' },
  IRR: { name: 'Iranian Rial', symbol: 'IRR' },
  ISJ: { name: 'Icelandic Króna', symbol: 'ISJ' },
  ISK: { name: 'Icelandic Króna', symbol: 'ISK' },
  ITL: { name: 'Italian Lira', symbol: 'ITL' },
  JMD: { name: 'Jamaican Dollar', symbol: 'JMD' },
  JOD: { name: 'Jordanian Dinar', symbol: 'JOD' },
  JPY: { name: 'Japanese Yen', symbol: '¥' },
  KES: { name: 'Kenyan Shilling', symbol: 'KES' },
  KGS: { name: 'Kyrgystani Som', symbol: 'KGS' },
  KHR: { name: 'Cambodian Riel', symbol: 'KHR' },
  KMF: { name: 'Comorian Franc', symbol: 'KMF' },
  KPW: { name: 'North Korean Won', symbol: 'KPW' },
  KRH: { name: 'South Korean Hwan', symbol: 'KRH' },
  KRO: { name: 'South Korean Won', symbol: 'KRO' },
  KRW: { name: 'South Korean Won', symbol: '₩' },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'KWD' },
  KYD: { name: 'Cayman Islands Dollar', symbol: 'KYD' },
  KZT: { name: 'Kazakhstani Tenge', symbol: 'KZT' },
  LAK: { name: 'Laotian Kip', symbol: 'LAK' },
  LBP: { name: 'Lebanese Pound', symbol: 'LBP' },
  LKR: { name: 'Sri Lankan Rupee', symbol: 'LKR' },
  LRD: { name: 'Liberian Dollar', symbol: 'LRD' },
  LSL: { name: 'Lesotho Loti', symbol: 'LSL' },
  LTL: { name: 'Lithuanian Litas', symbol: 'LTL' },
  LTT: { name: 'Lithuanian Talonas', symbol: 'LTT' },
  LUC: { name: 'Luxembourgian Convertible Franc', symbol: 'LUC' },
  LUF: { name: 'Luxembourgian Franc', symbol: 'LUF' },
  LUL: { name: 'Luxembourg Financial Franc', symbol: 'LUL' },
  LVL: { name: 'Latvian Lats', symbol: 'LVL' },
  LVR: { name: 'Latvian Ruble', symbol: 'LVR' },
  LYD: { name: 'Libyan Dinar', symbol: 'LYD' },
  MAD: { name: 'Moroccan Dirham', symbol: 'MAD' },
  MAF: { name: 'Moroccan Franc', symbol: 'MAF' },
  MCF: { name: 'Monegasque Franc', symbol: 'MCF' },
  MDC: { name: 'Moldovan Cupon', symbol: 'MDC' },
  MDL: { name: 'Moldovan Leu', symbol: 'MDL' },
  MGA: { name: 'Malagasy Ariary', symbol: 'MGA' },
  MGF: { name: 'Malagasy Franc', symbol: 'MGF' },
  MKD: { name: 'Macedonian Denar', symbol: 'MKD' },
  MKN: { name: 'Macedonian Denar', symbol: 'MKN' },
  MLF: { name: 'Malian Franc', symbol: 'MLF' },
  MMK: { name: 'Myanmar Kyat', symbol: 'MMK' },
  MNT: { name: 'Mongolian Tugrik', symbol: 'MNT' },
  MOP: { name: 'Macanese Pataca', symbol: 'MOP' },
  MRO: { name: 'Mauritanian Ouguiya', symbol: 'MRO' },
  MTL: { name: 'Maltese Lira', symbol: 'MTL' },
  MTP: { name: 'Maltese Pound', symbol: 'MTP' },
  MUR: { name: 'Mauritian Rupee', symbol: 'MUR' },
  MVP: { name: 'Maldivian Rupee', symbol: 'MVP' },
  MVR: { name: 'Maldivian Rufiyaa', symbol: 'MVR' },
  MWK: { name: 'Malawian Kwacha', symbol: 'MWK' },
  MXN: { name: 'Mexican Peso', symbol: 'MX$' },
  MXP: { name: 'Mexican Silver Peso', symbol: 'MXP' },
  MXV: { name: 'Mexican Investment Unit', symbol: 'MXV' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'MYR' },
  MZE: { name: 'Mozambican Escudo', symbol: 'MZE' },
  MZM: { name: 'Mozambican Metical', symbol: 'MZM' },
  MZN: { name: 'Mozambican Metical', symbol: 'MZN' },
  NAD: { name: 'Namibian Dollar', symbol: 'NAD' },
  NGN: { name: 'Nigerian Naira', symbol: 'NGN' },
  NIC: { name: 'Nicaraguan Córdoba', symbol: 'NIC' },
  NIO: { name: 'Nicaraguan Córdoba', symbol: 'NIO' },
  NLG: { name: 'Dutch Guilder', symbol: 'NLG' },
  NOK: { name: 'Norwegian Krone', symbol: 'NOK' },
  NPR: { name: 'Nepalese Rupee', symbol: 'NPR' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$' },
  OMR: { name: 'Omani Rial', symbol: 'OMR' },
  PAB: { name: 'Panamanian Balboa', symbol: 'PAB' },
  PEI: { name: 'Peruvian Inti', symbol: 'PEI' },
  PEN: { name: 'Peruvian Nuevo Sol', symbol: 'PEN' },
  PES: { name: 'Peruvian Sol', symbol: 'PES' },
  PGK: { name: 'Papua New Guinean Kina', symbol: 'PGK' },
  PHP: { name: 'Philippine Peso', symbol: 'PHP' },
  PKR: { name: 'Pakistani Rupee', symbol: 'PKR' },
  PLN: { name: 'Polish Zloty', symbol: 'PLN' },
  PLZ: { name: 'Polish Zloty (1950–1995)', symbol: 'PLZ' },
  PTE: { name: 'Portuguese Escudo', symbol: 'PTE' },
  PYG: { name: 'Paraguayan Guarani', symbol: 'PYG' },
  QAR: { name: 'Qatari Rial', symbol: 'QAR' },
  RHD: { name: 'Rhodesian Dollar', symbol: 'RHD' },
  ROL: { name: 'Romanian Leu (1952–2006)', symbol: 'ROL' },
  RON: { name: 'Romanian Leu', symbol: 'RON' },
  RSD: { name: 'Serbian Dinar', symbol: 'RSD' },
  RUB: { name: 'Russian Ruble', symbol: 'RUB' },
  RUR: { name: 'Russian Ruble (1991–1998)', symbol: 'RUR' },
  RWF: { name: 'Rwandan Franc', symbol: 'RWF' },
  SAR: { name: 'Saudi Riyal', symbol: 'SAR' },
  SBD: { name: 'Solomon Islands Dollar', symbol: 'SBD' },
  SCR: { name: 'Seychellois Rupee', symbol: 'SCR' },
  SDD: { name: 'Sudanese Dinar (1992–2007)', symbol: 'SDD' },
  SDG: { name: 'Sudanese Pound', symbol: 'SDG' },
  SDP: { name: 'Sudanese Pound (1957–1998)', symbol: 'SDP' },
  SEK: { name: 'Swedish Krona', symbol: 'SEK' },
  SGD: { name: 'Singapore Dollar', symbol: 'SGD' },
  SHP: { name: 'St. Helena Pound', symbol: 'SHP' },
  SIT: { name: 'Slovenian Tolar', symbol: 'SIT' },
  SKK: { name: 'Slovak Koruna', symbol: 'SKK' },
  SLL: { name: 'Sierra Leonean Leone', symbol: 'SLL' },
  SOS: { name: 'Somali Shilling', symbol: 'SOS' },
  SRD: { name: 'Surinamese Dollar', symbol: 'SRD' },
  SRG: { name: 'Surinamese Guilder', symbol: 'SRG' },
  SSP: { name: 'South Sudanese Pound', symbol: 'SSP' },
  STD: { name: 'São Tomé & Príncipe Dobra', symbol: 'STD' },
  SUR: { name: 'Soviet Rouble', symbol: 'SUR' },
  SVC: { name: 'Salvadoran Colón', symbol: 'SVC' },
  SYP: { name: 'Syrian Pound', symbol: 'SYP' },
  SZL: { name: 'Swazi Lilangeni', symbol: 'SZL' },
  THB: { name: 'Thai Baht', symbol: 'THB' },
  TJR: { name: 'Tajikistani Ruble', symbol: 'TJR' },
  TJS: { name: 'Tajikistani Somoni', symbol: 'TJS' },
  TMM: { name: 'Turkmenistani Manat (1993–2009)', symbol: 'TMM' },
  TMT: { name: 'Turkmenistani Manat', symbol: 'TMT' },
  TND: { name: 'Tunisian Dinar', symbol: 'TND' },
  TOP: { name: 'Tongan Paʻanga', symbol: 'TOP' },
  TPE: { name: 'Timorese Escudo', symbol: 'TPE' },
  TRL: { name: 'Turkish Lira (1922–2005)', symbol: 'TRL' },
  TRY: { name: 'Turkish Lira', symbol: 'TRY' },
  TTD: { name: 'Trinidad & Tobago Dollar', symbol: 'TTD' },
  TWD: { name: 'New Taiwan Dollar', symbol: 'NT$' },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TZS' },
  UAH: { name: 'Ukrainian Hryvnia', symbol: 'UAH' },
  UAK: { name: 'Ukrainian Karbovanets', symbol: 'UAK' },
  UGS: { name: 'Ugandan Shilling', symbol: 'UGS' },
  UGX: { name: 'Ugandan Shilling', symbol: 'UGX' },
  USD: { name: 'US Dollar', symbol: '$' },
  USN: { name: 'US Dollar (Next day)', symbol: 'USN' },
  USS: { name: 'US Dollar (Same day)', symbol: 'USS' },
  UYI: { name: 'Uruguayan Peso (Indexed Units)', symbol: 'UYI' },
  UYP: { name: 'Uruguayan Peso', symbol: 'UYP' },
  UYU: { name: 'Uruguayan Peso', symbol: 'UYU' },
  UZS: { name: 'Uzbekistan Som', symbol: 'UZS' },
  VEB: { name: 'Venezuelan Bolívar', symbol: 'VEB' },
  VEF: { name: 'Venezuelan Bolívar', symbol: 'VEF' },
  VND: { name: 'Vietnamese Dong', symbol: '₫' },
  VNN: { name: 'Vietnamese Dong', symbol: 'VNN' },
  VUV: { name: 'Vanuatu Vatu', symbol: 'VUV' },
  WST: { name: 'Samoan Tala', symbol: 'WST' },
  XAF: { name: 'CFA Franc BEAC', symbol: 'FCFA' },
  XAG: { name: 'Silver', symbol: 'XAG' },
  XAU: { name: 'Gold', symbol: 'XAU' },
  XBA: { name: 'European Composite Unit', symbol: 'XBA' },
  XBB: { name: 'European Monetary Unit', symbol: 'XBB' },
  XBC: { name: 'European Unit of Account (XBC)', symbol: 'XBC' },
  XBD: { name: 'European Unit of Account (XBD)', symbol: 'XBD' },
  XCD: { name: 'East Caribbean Dollar', symbol: 'EC$' },
  XDR: { name: 'Special Drawing Rights', symbol: 'XDR' },
  XEU: { name: 'European Currency Unit', symbol: 'XEU' },
  XFO: { name: 'French Gold Franc', symbol: 'XFO' },
  XFU: { name: 'French UIC-Franc', symbol: 'XFU' },
  XOF: { name: 'CFA Franc BCEAO', symbol: 'CFA' },
  XPD: { name: 'Palladium', symbol: 'XPD' },
  XPF: { name: 'CFP Franc', symbol: 'CFPF' },
  XPT: { name: 'Platinum', symbol: 'XPT' },
  XRE: { name: 'RINET Funds', symbol: 'XRE' },
  XSU: { name: 'Sucre', symbol: 'XSU' },
  XTS: { name: 'Testing Currency Code', symbol: 'XTS' },
  XUA: { name: 'ADB Unit of Account', symbol: 'XUA' },
  YDD: { name: 'Yemeni Dinar', symbol: 'YDD' },
  YER: { name: 'Yemeni Rial', symbol: 'YER' },
  YUD: { name: 'Yugoslavian Hard Dinar', symbol: 'YUD' },
  YUM: { name: 'Yugoslavian New Dinar', symbol: 'YUM' },
  YUN: { name: 'Yugoslavian Convertible Dinar', symbol: 'YUN' },
  YUR: { name: 'Yugoslavian Reformed Dinar', symbol: 'YUR' },
  ZAL: { name: 'South African Rand (financial)', symbol: 'ZAL' },
  ZAR: { name: 'South African Rand', symbol: 'ZAR' },
  ZMK: { name: 'Zambian Kwacha', symbol: 'ZMK' },
  ZMW: { name: 'Zambian Kwacha', symbol: 'ZMW' },
  ZRN: { name: 'Zairean New Zaire', symbol: 'ZRN' },
  ZRZ: { name: 'Zairean Zaire', symbol: 'ZRZ' },
  ZWD: { name: 'Zimbabwean Dollar', symbol: 'ZWD' },
  ZWL: { name: 'Zimbabwean Dollar', symbol: 'ZWL' },
  ZWR: { name: 'Zimbabwean Dollar', symbol: 'ZWR' },
};

export type GetCurrenciesSelections = {
  search?: string;
};

export type GetOneCurrenciesSelections = {
  currencyId?: Currency['id'];
  code?: Currency['code'];
};

export type UpdateCurrenciesSelections = {
  currencyId: Currency['id'];
};

export type CreateCurrenciesOptions = Partial<Currency>;

export type UpdateCurrenciesOptions = Partial<Currency>;
